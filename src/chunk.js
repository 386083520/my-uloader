var utils = require('./utils')
function Chunk (uploader, file, offset) {
    utils.defineNonEnumerable(this, 'uploader', uploader)
    utils.defineNonEnumerable(this, 'file', file)
    utils.defineNonEnumerable(this, 'bytes', null)
    this.offset = offset
    this.readState = 0
    this.pendingRetry = false
    this.preprocessState = 0
    this.xhr = null
    this.retries = 0
    this.chunkSize = this.uploader.opts.chunkSize
    this.startByte = this.offset * this.chunkSize
    this.endByte = this.computeEndByte()
    this.tested = false
}
var STATUS = Chunk.STATUS = {
    READING: 'reading',
    PENDING: 'pending',
    UPLOADING: 'uploading',
    SUCCESS: 'success',
    ERROR: 'error',
    PROGRESS: 'progress',
}

utils.extend(Chunk.prototype, {
    _event: function (evt, args) {
        args = utils.toArray(arguments)
        console.log('gsdargs', args)
        args.unshift(this)
        this.file._chunkEvent.apply(this.file, args)
    },
    computeEndByte: function () {
        var endByte = Math.min(this.file.size, (this.offset + 1) * this.chunkSize)
        if (this.file.size - endByte < this.chunkSize && !this.uploader.opts.forceChunkSize) {
            endByte = this.file.size
        }
        return endByte
    },
    test: function () {

    },
    abort: function () {
        console.log('gsdabort')
    },
    status: function (isTest) {
        if (this.readState === 1) {
            return STATUS.READING
        } else if (this.pendingRetry || this.preprocessState === 1) {
            return STATUS.UPLOADING
        } else if (!this.xhr) {
            return STATUS.PENDING
        } else if (this.xhr.readyState < 4) { // TODO
            return STATUS.UPLOADING
        } else {
            var _status
            if (this.uploader.opts.successStatuses.indexOf(this.xhr.status) > -1) {
                _status = STATUS.SUCCESS
            } else if (this.uploader.opts.permanentErrors.indexOf(this.xhr.status) > -1 && this.retries >= this.uploader.opts.maxChunkRetries) {
                _status = STATUS.ERROR
            } else {
                // TODO
            }
            // TODO
            return _status
        }
    },
    readFinished: function (bytes) {
        console.log('gsdbytes', bytes)
        this.readState = 2
        this.bytes = bytes
        this.send()
    },
    send: function () {
        var preprocess = this.uploader.opts.preprocess
        var read = this.uploader.opts.readFileFn
        if (utils.isFunction(preprocess)) {
            // TODO
        }
        switch (this.readState) {
            case 0:
                this.readState = 1
                read(this.file, this.file.fileType, this.startByte, this.endByte, this)
                return
            case 1:
                return
        }
        if (this.uploader.opts.testChunks && !this.tested) {
            this.test()
            return
        }
        this.xhr = new XMLHttpRequest()
        this.xhr.upload.addEventListener('progress', progressHandler, false)
        this.xhr.addEventListener('load', doneHandler, false)
        this.xhr.addEventListener('error', doneHandler, false)
        var uploadMethod = utils.evalOpts(this.uploader.opts.uploadMethod, this.file, this)
        var data = this.prepareXhrRequest(uploadMethod, false, this.uploader.opts.method, this.bytes)
        this.xhr.send(data)
        var $ = this
        function progressHandler (event) {
            $._event(STATUS.PROGRESS, event)
        }
        function doneHandler (event) {
            var msg = $.message()
            $.uploader.opts.processResponse(msg, function (err, res) {
                if (!$.xhr) {
                    return
                }
                var status = $.status()
                console.log('gsddoneHandler', status, res)
                if (status === STATUS.SUCCESS || status === STATUS.ERROR) {
                    $._event(status, res)
                    status === STATUS.ERROR && $.uploader.uploadNextChunk()
                } else {

                }
            })
        }
    },
    message: function () {
        return this.xhr ? this.xhr.responseText : ''
    },
    getParams: function () {
        return {
            chunkNumber: this.offset + 1,
            chunkSize: this.uploader.opts.chunkSize,
            currentChunkSize: this.endByte - this.startByte,
            totalSize: this.file.size,
            identifier: this.file.uniqueIdentifier,
            filename: this.file.name,
            relativePath: this.file.relativePath,
            totalChunks: this.file.chunks.length
        }
    },
    prepareXhrRequest: function (method, isTest, paramsMethod, blob) {
        var query = utils.evalOpts(this.uploader.opts.query, this.file, this, isTest)
        query = utils.extend(this.getParams(), query)
        console.log('gsdquery', query)
        var target = utils.evalOpts(this.uploader.opts.target, this.file, this, isTest)
        var data = null
        if (method === 'GET' || paramsMethod === 'octet') {
            // TODO
        } else {
            data = new FormData()
            utils.each(query, function (v, k) {
                data.append(k, v)
            })
            if (typeof blob !== 'undefined') {
                data.append(this.uploader.opts.fileParameterName, blob, this.file.name)
            }
            console.log('gsddata', data)
        }
        this.xhr.open(method, target, true)
        this.xhr.withCredentials = this.uploader.opts.withCredentials
        utils.each(utils.evalOpts(this.uploader.opts.headers, this.file, this, isTest), function (v, k) {
            this.xhr.setRequestHeader(k, v)
        }, this)

        return data
    }
})

module.exports = Chunk
