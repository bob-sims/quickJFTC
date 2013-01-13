function makeValueChecker(operator, value) {
    value = typeof value == "string" ? value : "";
    return operator ? {
        "=": function(test_value) {
            return test_value === value;
        },
        "~": function(test_value) {
            return test_value ? test_value.split(/\s+/).indexOf(value) !== -1 : !1;
        },
        "^": function(test_value) {
            return test_value ? test_value.substr(0, value.length) === value : !1;
        },
        $: function(test_value) {
            return test_value ? test_value.substr(-value.length) === value : !1;
        },
        "*": function(test_value) {
            return test_value ? test_value.indexOf(value) !== -1 : !1;
        },
        "|": function(test_value) {
            return test_value ? test_value === value || test_value.substr(0, value.length + 1) === value + "-" : !1;
        }
    }[operator] : function(test_value) {
        return test_value ? !0 : !1;
    };
}

exports = {};

var domUtils = require("htmlparser").DomUtils, tagRe = /^[a-z0-9]+$/, attrSelectRe = /^(\w+)?\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/;

exports.select = function(dom, selector) {
    var currentContext = [ dom ], found, tag, options, tokens = selector.split(/\s+/);
    for (var i = 0; i < tokens.length; i++) {
        var match = attrSelectRe.exec(tokens[i]);
        if (match) {
            var attribute = match[2], operator = match[3], value = match[4];
            tag = match[1];
            options = {};
            options[attribute] = makeValueChecker(operator, value);
            found = [];
            for (var j = 0; j < currentContext.length; j++) found = found.concat(domUtils.getElements(options, currentContext[j]));
            tag && (found = domUtils.getElements({
                tag_name: tag
            }, found, !1));
            currentContext = found;
        } else if (tokens[i].indexOf("#") !== -1) {
            found = [];
            var id_selector = tokens[i].split("#", 2)[1], el = null;
            for (var k = 0; k < currentContext.length; k++) {
                typeof currentContext[k].children != "undefined" ? el = domUtils.getElementById(id_selector, currentContext[k].children) : el = domUtils.getElementById(id_selector, currentContext[k]);
                if (el) {
                    found.push(el);
                    break;
                }
            }
            if (!found[0]) {
                currentContext = [];
                break;
            }
            currentContext = found;
        } else if (tokens[i].indexOf(".") !== -1) {
            var parts = tokens[i].split(".");
            tag = parts[0];
            options = {};
            options["class"] = function(value) {
                if (!value) return !1;
                var classes = value.split(/\s+/);
                for (var i = 1, len = parts.length; i < len; i++) if (!~classes.indexOf(parts[i])) return !1;
                return !0;
            };
            found = [];
            for (var l = 0; l < currentContext.length; l++) {
                var context = currentContext[l];
                if (tag.length > 0) {
                    context = domUtils.getElementsByTagName(tag, context);
                    found = found.concat(domUtils.getElements(options, context, !1));
                } else found = found.concat(domUtils.getElements(options, context));
            }
            currentContext = found;
        } else if (tokens[i] !== "*") {
            if (!tagRe.test(tokens[i])) {
                currentContext = [];
                break;
            }
            found = [];
            for (var m = 0; m < currentContext.length; m++) typeof currentContext[m].children != "undefined" ? found = found.concat(domUtils.getElementsByTagName(tokens[i], currentContext[m].children)) : i === 0 && (found = found.concat(domUtils.getElementsByTagName(tokens[i], currentContext[m])));
            currentContext = found;
        }
    }
    return currentContext;
};

soupselect = exports;

module.exports = soupselect;