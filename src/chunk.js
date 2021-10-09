var utils = require('./utils')
function Chunk (uploader, file, offset) {
    utils.defineNonEnumerable(this, 'uploader', uploader)
    utils.defineNonEnumerable(this, 'file', file)
    this.offset = offset
    this.readState = 0
    this.pendingRetry = false
    this.preprocessState = 0
    this.xhr = null
    this.retries = 0
}
var STATUS = Chunk.STATUS = {
    READING: 'reading',
    PENDING: 'pending',
    UPLOADING: 'uploading'
}

utils.extend(Chunk.prototype, {
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
    send: function () {
        console.log('gsdsend')
    }
})

module.exports = Chunk
