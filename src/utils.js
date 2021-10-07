var oproto = Object.prototype
var serialize = oproto.toString
var aproto = Array.prototype
var isFunction = function (fn) {
    return serialize.call(fn) === '[object Function]'
}

var i = 0
var utils = {
    uid: function () {
        return ++i
    },
    extend: function () {
        var options
        var name
        var src
        var copy
        var target = arguments[0] || {}
        var i = 1
        var length = arguments.length
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name]
                    copy = options[name]
                    if (false) {

                    }else {
                        target[name] = copy
                    }
                }
            }
        }
        return target
    },
    isDefined: function (a) {
        return typeof a !== 'undefined'
    },
    each: function (ary, func, context) {
        if (utils.isDefined(ary.length)) {
            for (var i = 0, len = ary.length; i < len; i++) {
                if (func.call(context, ary[i], i, ary) === false) {
                    break
                }
            }
        }
    },
    isFunction: isFunction,
    defineNonEnumerable: function (target, key, value) {
        Object.defineProperty(target, key, {
            enumerable: false,
            configurable: true,
            writable: true,
            value: value
        })
    },
    toArray: function (ary, start, end) {
        if (start === undefined) start = 0
        if (end === undefined) end = ary.length
        return aproto.slice.call(ary, start, end)
    },
    isString: function (s) {
        return typeof s === 'string'
    }
}
module.exports = utils
