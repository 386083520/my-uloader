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

    this.bootstrap()
}

utils.extend(File.prototype, {
    _eachAccess: function (eachFn, fileFn) {
        console.log('gsd_eachAccess', this)
        if (this.isFolder) {
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
        }, function () {
            this.paused = false
            this.uploader.upload()
        })
        this.paused = false
    },
    isComplete: function () {
        return true
    },
    _chunkEvent: function (chunk, evt, message) {
        console.log('gsd_chunkEvent', chunk, evt, message)
    }
})

function parsePaths (path) {
    var ret = []
    return ret
}

module.exports = File
