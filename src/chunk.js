var utils = require('./utils')
function Chunk (uploader, file, offset) {
    utils.defineNonEnumerable(this, 'uploader', uploader)
    utils.defineNonEnumerable(this, 'file', file)
    this.offset = offset
}
var STATUS = Chunk.STATUS = {
    UPLOADING: 'uploading'
}

utils.extend(Chunk.prototype, {
    abort: function () {
        console.log('gsdabort')
    }
})

module.exports = Chunk
