var event = {
    _eventData: null,
    trigger: function (name) {
        if (!this._eventData) this._eventData = {}
        if (!this._eventData[name]) return true
    }
}

module.exports = event
