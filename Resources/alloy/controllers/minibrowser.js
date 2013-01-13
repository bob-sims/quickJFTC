function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.miniBrowser = A$(Ti.UI.createWindow({
        id: "miniBrowser"
    }), "Window", null);
    $.addTopLevelView($.__views.miniBrowser);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    console.info(JSON.stringify(args));
    var TiMiniBrowser = require("MiniBrowser/TiMiniBrowser"), browser = new TiMiniBrowser({
        url: args.link,
        barColor: "#1684c9"
    });
    browser.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A, $model;

module.exports = Controller;