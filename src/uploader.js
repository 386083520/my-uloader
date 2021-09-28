var utils = require('./utils')

function Uploader (opts) {
    this.opts = opts
    console.log(opts)
}
utils.extend(Uploader.prototype, {
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
        }, this)
    }
})

module.exports = Uploader
