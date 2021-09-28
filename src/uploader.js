var utils = require('./utils')

function Uploader (opts) {
    this.opts = opts
    console.log(opts)
}
utils.extend(Uploader.prototype, {
    _trigger: function (name) {
    },
    addFiles: function (files, evt) {
        console.log('gsdaddFiles', files, evt)
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
    }
})

module.exports = Uploader
