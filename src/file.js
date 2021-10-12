var utils = require('./utils')
var Chunk = require('./chunk')

function File (uploader, file, parent) {
    utils.defineNonEnumerable(this, 'uploader', uploader)
    this.isRoot = this.isFolder = uploader === this
    utils.defineNonEnumerable(this, 'parent', parent || null)
    console.log('gsdFile', this.isRoot, this.isFolder, uploader, this)
    this.id = utils.uid()
    console.log('gsdFile', this)
    utils.defineNonEnumerable(this, 'files', [])
    utils.defineNonEnumerable(this, 'fileList', [])
    utils.defineNonEnumerable(this, 'chunks', [])

    if (this.isRoot || !file) {
        this.file = null
    }else {
        console.log('gsdfile2', file)
        if (utils.isString(file)) {
            // TODO
        } else {
            this.file = file
            this.fileType = this.file.type
            this.name = file.fileName || file.name
            this.size = file.size
            this.relativePath = file.relativePath || file.webkitRelativePath || this.name
            this._parseFile()
        }
    }

    this.aborted = false
    this.averageSpeed = 0
    this.currentSpeed = 0
    this.paused = uploader.opts.initialPaused
    this._prevProgress = 0
    this._prevUploadedSize = 0
    this._lastProgressCallback = Date.now()

    this.bootstrap()
}

utils.extend(File.prototype, {
    _eachAccess: function (eachFn, fileFn) {
        console.log('gsd_eachAccess', this)
        if (this.isFolder) {
            utils.each(this.files, function (f, i) {
                return eachFn.call(this, f, i)
            }, this)
            return
        }
        fileFn.call(this, this)
    },
    _parseFile: function () {
        var ppaths = parsePaths(this.relativePath)
        if (ppaths.length) {
            // TODO
        } else {
            this._updateParentFileList()
        }
    },
    _updateParentFileList: function (file) {
        if (!file) {
            file = this
        }
        var p = this.parent
        console.log('gsd_updateParentFileList', file, p)
        if (p) {
            p.fileList.push(file)
        }
    },
    removeFile: function (file) {
        console.log('gsdremoveFile', file)
        if (file.isFolder) {

        }
        console.log('gsdremoveFilethis', this)
        this._removeFile(file)
    },
    _removeFile: function (file) {
        if (!file.isFolder) {
            console.log('gsd_removeFile', this.files)
            utils.each(this.files, function (f, i) {
                if (f === file) {
                    this.files.splice(i, 1)
                    return false
                }
            }, this)
        }
    },
    bootstrap: function () {
        if (this.isFolder) return
        var opts = this.uploader.opts
        // TODO
        this.abort(true)
        this._resetError()
        this._prevProgress = 0
        // TODO
        var round = opts.forceChunkSize ? Math.ceil : Math.floor
        var chunks = Math.max(round(this.size / opts.chunkSize), 1)
        console.log('gsdchunks', chunks)
        for (var offset = 0; offset < chunks; offset++) {
            this.chunks.push(new Chunk(this.uploader, this, offset))
        }
        console.log('gsdthis.chunks', this.chunks)
    },
    abort: function (reset) {
        if (this.aborted) {
            return
        }
        this.currentSpeed = 0
        this.averageSpeed = 0
        this.aborted = !reset
        var chunks = this.chunks
        if (reset) {
            this.chunks = []
        }
        var uploadingStatus = Chunk.STATUS.UPLOADING
        utils.each(chunks, function (c) {
            if (c.status() === uploadingStatus) {
                c.abort()
                this.uploader.uploadNextChunk()
            }
        }, this)
    },
    _resetError: function () {

    },
    resume: function () {
        this._eachAccess(function (f) {
            f.resume()
        }, function () {
            this.paused = false
            this.uploader.upload()
        })
        this.paused = false
    },
    isComplete: function () {
        return true
    },
    getRoot: function () {
        if (this.isRoot) {
            return this
        }
        return this // TODO
    },
    sizeUploaded: function () {
        var size = 0
        this._eachAccess(function (file) {

        }, function () {
            utils.each(this.chunks, function (chunk) {
                size += chunk.sizeUploaded()
            })
        })
        return size
    },
    _measureSpeed: function () {
        var smoothingFactor = this.uploader.opts.speedSmoothingFactor
        var timeSpan = Date.now() - this._lastProgressCallback
        if (!timeSpan) {
            return
        }
        var uploaded = this.sizeUploaded()
        this.currentSpeed = Math.max((uploaded - this._prevUploadedSize) / timeSpan * 1000, 0)
        this.averageSpeed = smoothingFactor * this.currentSpeed + (1 - smoothingFactor) * this.averageSpeed
        this._prevUploadedSize = uploaded
    },
    _checkProgress: function (file) {
        return Date.now() - this._lastProgressCallback >= this.uploader.opts.progressCallbacksInterval
    },
    _chunkEvent: function (chunk, evt, message) {
        console.log('gsd_chunkEvent', chunk, evt, message)
        var uploader = this.uploader
        var STATUS = Chunk.STATUS
        var rootFile = this.getRoot()
        var that = this
        var triggerProgress = function () {
            that._measureSpeed()
            uploader._trigger('fileProgress', rootFile, that, chunk)
            that._lastProgressCallback = Date.now()
        }
        switch (evt) {
            case STATUS.PROGRESS:
                if (this._checkProgress()) {
                    triggerProgress()
                }
                break
            case STATUS.ERROR:
                break
            case STATUS.SUCCESS:
                this._updateUploadedChunks(message, chunk)
                if (this.isComplete()) {

                }
                break
        }
    },
    _updateUploadedChunks: function (message, chunk) {
        var checkChunkUploaded = this.uploader.opts.checkChunkUploadedByResponse
        if (checkChunkUploaded) {

        }else {
            this.uploader.uploadNextChunk()
        }

    },
    cancel: function () {
        console.log('gsdcancel')
    },
    pause: function () {
        console.log('gsdpause')
    },
    getFormatSize: function () {
        return '20'
    },
    progress: function () {
        var totalDone = 0
        var totalSize = 0
        var ret = 0
        console.log('gsdprogressthis', this)
        this._eachAccess(function (file, index) {
            totalDone += file.progress() * file.size
            totalSize += file.size
            console.log('gsdtotalDone', totalDone, totalSize)
            if (index === this.files.length - 1) {
                ret = totalDone / totalSize // TODO
            }
        }, function () {
            if (this.chunks.length === 1) {
                this._prevProgress = Math.max(this._prevProgress, this.chunks[0].progress())
                ret = this._prevProgress
                return
            }
            var bytesLoaded = 0
            utils.each(this.chunks, function (c) {
                bytesLoaded += c.progress() * (c.endByte - c.startByte)
            })
            var percent = bytesLoaded / this.size
            this._prevProgress = Math.max(this._prevProgress, percent > 0.9999 ? 1 : percent)
            ret = this._prevProgress
        })
        console.log('gsdprogress', ret)
        return ret
    },
    timeRemaining: function () {
        var ret = 0
        this._eachAccess(function (file, i) {

        }, function () {
            if (this.paused || this.error) {
                ret = 0
                return
            }
            var delta = this.size - this.sizeUploaded()
            ret = calRet(delta, this.averageSpeed)
        })
        return ret
        function calRet (delta, averageSpeed) {
            console.log('gsdcalRet', delta, averageSpeed)
            if (delta && !averageSpeed) {
                return Number.POSITIVE_INFINITY
            }
            if (!delta && !averageSpeed) {
                return 0
            }
            return Math.floor(delta / averageSpeed)
        }
    }
})

function parsePaths (path) {
    var ret = []
    return ret
}

module.exports = File
