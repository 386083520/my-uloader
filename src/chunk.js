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
}
var STATUS = Chunk.STATUS = {
    READING: 'reading',
    PENDING: 'pending',
    UPLOADING: 'uploading'
}

utils.extend(Chunk.prototype, {
    computeEndByte: function () {
        var endByte = Math.min(this.file.size, (this.offset + 1) * this.chunkSize)
        if (this.file.size - endByte < this.chunkSize && !this.uploader.opts.forceChunkSize) {
            endByte = this.file.size
        }
        return endByte
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
    }
})

module.exports = Chunk
