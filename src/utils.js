var utils = {
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
    }
}
module.exports = utils
