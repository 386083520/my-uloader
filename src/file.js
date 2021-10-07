var utils = require('./utils')
function File (uploader, file, parent) {
    this.id = utils.uid()
    console.log('gsdFile', this)
    utils.defineNonEnumerable(this, 'files', [])
    utils.defineNonEnumerable(this, 'fileList', [])
}

utils.extend(File.prototype, {
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
    }
})

module.exports = File
