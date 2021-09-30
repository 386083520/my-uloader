var each = require('./utils').each
var event = {
    _eventData: null,
    on: function (name, func) {
        if (!this._eventData) this._eventData = {}
        if (!this._eventData[name]) this._eventData[name] = []
        var listened = false
        // TODO
        if (!listened) {
            this._eventData[name].push(func)
        }
    },
    trigger: function (name) {
        if (!this._eventData) this._eventData = {}
        if (!this._eventData[name]) return true
        var args = this._eventData[name].slice.call(arguments, 1)
        console.log('gsdtrigger', arguments, args)
        var preventDefault = false
        each(this._eventData[name], function (fuc) {
            preventDefault = fuc.apply(this, args) === false || preventDefault
        })
        return !preventDefault
    }
}

module.exports = event
