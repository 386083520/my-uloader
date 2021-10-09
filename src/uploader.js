var utils = require('./utils')
var File = require('./file')
var event = require('./event')
var Chunk = require('./chunk')
var isServer = typeof window === 'undefined'
var ie10plus = isServer ? false : window.navigator.msPointerEnabled

function Uploader (opts) {
    this.opts = utils.extend({}, Uploader.defaults, opts || {})
    console.log(opts)
    File.call(this, this)
}

Uploader.defaults = {
    simultaneousUploads: 3,
    chunkSize: 1024 * 1024,
    forceChunkSize: false,
    generateUniqueIdentifier: null,
    allowDuplicateUploads: false,
    singleFile: false,
}


Uploader.prototype = utils.extend({}, File.prototype)
utils.extend(Uploader.prototype, event)
utils.extend(Uploader.prototype, {
    _trigger: function (name) {
        var args = utils.toArray(arguments)
        var preventDefault = !this.trigger.apply(this, arguments)
        if (name !== 'catchAll') {
            args.unshift('catchAll')
            preventDefault = !this.trigger.apply(this, args) || preventDefault
        }
        console.log('gsdargs', name, preventDefault)
        return !preventDefault
    },
    _triggerAsync: function () {
        var args = arguments
        console.log('gsd_triggerAsync')
    },
    addFiles: function (files, evt) {
        var _files = []
        console.log('gsdaddFiles', files, evt)
        var oldFileListLen = this.fileList.length
        utils.each(files, function (file) {
            if ((!ie10plus || ie10plus && file.size > 0) && !(file.size % 4096 === 0 && (file.name === '.' || file.fileName === '.'))) {
                var uniqueIdentifier = this.generateUniqueIdentifier(file)
                if (this.opts.allowDuplicateUploads || !this.getFromUniqueIdentifier(uniqueIdentifier)) {
                    var _file = new File(this, file, this)
                    _file.uniqueIdentifier = uniqueIdentifier
                    if (this._trigger('fileAdded', _file, evt)) {
                        _files.push(_file)
                    }else {
                        // TODO
                    }
                }
            }
        }, this)
        var newFileList = this.fileList.slice(oldFileListLen)
        if (this._trigger('filesAdded', _files, newFileList, evt)) {
            utils.each(_files, function (file) {
                if (this.opts.singleFile && this.files.length > 0) {
                    this.removeFile(this.files[0])
                }
                this.files.push(file)
                console.log('gsdfiles', this.files)
            }, this)
            this._trigger('filesSubmitted', _files, newFileList, evt)
        } else {
            // TODO
        }
        console.log('addFiles', this.files, this.fileList)
    },
    removeFile: function (file) {
        File.prototype.removeFile.call(this, file)
        this._trigger('fileRemoved', file)
    },
    assignBrowse: function (domNodes, isDirectory, singleFile, attributes) {
        console.log('gsdassignBrowse')
        if (typeof domNodes.length === 'undefined') {
            domNodes = [domNodes]
        }
        console.log('gsdthis', this)
        utils.each(domNodes, function (domNode) {
            if (domNode.tagName === 'INPUT' && domNode.type === 'file') {

            } else {
                input = document.createElement('input')
                input.setAttribute('type', 'file')
                utils.extend(input.style, {
                    visibility: 'hidden',
                    position: 'absolute',
                    width: '1px',
                    height: '1px'
                })
                domNode.appendChild(input)
                domNode.addEventListener('click', function (e) {
                    if (domNode.tagName.toLowerCase() === 'label') {
                        return
                    }
                    input.click()
                }, false)
            }
            var that = this
            input.addEventListener('change', function (e) {
                console.log('gsd', e, e.type, e.target.value, e.target.files)
                that._trigger(e.type, e)
                if (e.target.value) {
                    that.addFiles(e.target.files, e)
                    e.target.value = ''
                }
            })
        }, this)
    },
    generateUniqueIdentifier: function (file) {
        var custom = this.opts.generateUniqueIdentifier
        if (utils.isFunction(custom)) {
            return custom(file)
        }
        var relativePath = file.relativePath || file.webkitRelativePath || file.fileName || file.name
        return file.size + '-' + relativePath.replace(/[^0-9a-zA-Z_-]/img, '')
    },
    getFromUniqueIdentifier: function (uniqueIdentifier) {
        var ret = false
        console.log('gsdgetFromUniqueIdentifier', this.files)
        utils.each(this.files, function (file) {
            if (file.uniqueIdentifier === uniqueIdentifier) {
                ret = file
                return false
            }
        })
        return ret
    },
    uploadNextChunk: function (preventEvents) {
        console.log('gsduploadNextChunk')
    },
    upload: function (preventEvents) {
        var ret = this._shouldUploadNext()
        if (ret === false) {
            return
        }
        !preventEvents && this._trigger('uploadStart')
        var started = false
        for (var num = 1; num <= this.opts.simultaneousUploads - ret; num++) {
            started = this.uploadNextChunk(!preventEvents) || started
            // TODO
        }
        if (!started && !preventEvents) {
            this._triggerAsync('complete')
        }
    },
    _shouldUploadNext: function () {
        var num = 0
        var should = true
        var simultaneousUploads = this.opts.simultaneousUploads
        var uploadingStatus = Chunk.STATUS.UPLOADING
        utils.each(this.files, function (file) {
            utils.each(file.chunks, function (chunk) {
                if (chunk.status() === uploadingStatus) {
                    num++
                    if (num >= simultaneousUploads) {
                        should = false
                        return false
                    }
                }
            })
        })
        return should && num
    }
})

module.exports = Uploader
