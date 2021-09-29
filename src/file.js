var utils = require('./utils')
function File (uploader, file, parent) {
    this.id = utils.uid()
    console.log('gsdFile', this)
    utils.defineNonEnumerable(this, 'files', [])
}

module.exports = File
