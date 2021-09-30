var utils = require('./utils')
var File = require('./file')
var event = require('./event')
var isServer = typeof window === 'undefined'
var ie10plus = isServer ? false : window.navigator.msPointerEnabled

function Uploader (opts) {
    this.opts = utils.extend({}, Uploader.defaults, opts || {})
    console.log(opts)
    File.call(this, this)
}

Uploader.defaults = {
    generateUniqueIdentifier: null,
    allowDuplicateUploads: false
}

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
    addFiles: function (files, evt) {
        console.log('gsdaddFiles', files, evt)
        utils.each(files, function (file) {
            if ((!ie10plus || ie10plus && file.size > 0) && !(file.size % 4096 === 0 && (file.name === '.' || file.fileName === '.'))) {
                var uniqueIdentifier = this.generateUniqueIdentifier(file)
                if (this.opts.allowDuplicateUploads || !this.getFromUniqueIdentifier(uniqueIdentifier)) {
                    var _file = new File(this, file, this)
                    _file.uniqueIdentifier = uniqueIdentifier
                    if (this._trigger('fileAdded', _file, evt)) {

                    }
                }
            }
        }, this)
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
    }
})

module.exports = Uploader
