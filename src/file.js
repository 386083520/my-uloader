var utils = require('./utils')
function File (uploader, file, parent) {
    utils.defineNonEnumerable(this, 'uploader', uploader)
    this.isRoot = this.isFolder = uploader === this
    console.log('gsdFile', this.isRoot, this.isFolder, uploader, this)
    this.id = utils.uid()
    console.log('gsdFile', this)
    utils.defineNonEnumerable(this, 'files', [])
    utils.defineNonEnumerable(this, 'fileList', [])

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

    this.bootstrap()
}

utils.extend(File.prototype, {
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
    }
})

function parsePaths (path) {
    var ret = []
    return ret
}

module.exports = File
