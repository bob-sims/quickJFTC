function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.index = A$(Ti.UI.createTabGroup({
        backgroundColor: "transparent",
        id: "index"
    }), "TabGroup", null);
    $.__views.eventsWindow = A$(Ti.UI.createWindow({
        backgroundImage: "/img/ipad-BG.png",
        barImage: "/img/menubar.png",
        backgroundColor: "transparent",
        id: "eventsWindow",
        title: "Events"
    }), "Window", null);
    $.__views.events = Alloy.createController("events", {
        id: "events"
    });
    $.__views.events.setParent($.__views.eventsWindow);
    $.__views.__alloyId1 = A$(Ti.UI.createTab({
        backgroundColor: "transparent",
        window: $.__views.eventsWindow,
        title: "Events",
        icon: "/img/light_shield.png",
        id: "__alloyId1"
    }), "Tab", null);
    $.__views.index.addTab($.__views.__alloyId1);
    $.__views.__alloyId3 = A$(Ti.UI.createWindow({
        backgroundImage: "/img/ipad-BG.png",
        barImage: "/img/menubar.png",
        backgroundColor: "transparent",
        title: "News",
        id: "__alloyId3"
    }), "Window", null);
    $.__views.__alloyId4 = Alloy.createController("news", {
        id: "__alloyId4"
    });
    $.__views.__alloyId4.setParent($.__views.__alloyId3);
    $.__views.__alloyId2 = A$(Ti.UI.createTab({
        backgroundColor: "transparent",
        window: $.__views.__alloyId3,
        title: "News",
        icon: "/img/light_signal_trans.png",
        id: "__alloyId2"
    }), "Tab", null);
    $.__views.index.addTab($.__views.__alloyId2);
    $.__views.__alloyId6 = A$(Ti.UI.createWindow({
        backgroundImage: "/img/ipad-BG.png",
        barImage: "/img/menubar.png",
        backgroundColor: "transparent",
        title: "Magazine",
        id: "__alloyId6"
    }), "Window", null);
    $.__views.__alloyId7 = Alloy.createController("magazines", {
        id: "__alloyId7"
    });
    $.__views.__alloyId7.setParent($.__views.__alloyId6);
    $.__views.__alloyId5 = A$(Ti.UI.createTab({
        backgroundColor: "transparent",
        window: $.__views.__alloyId6,
        title: "Magazine",
        icon: "/img/light_book.png",
        id: "__alloyId5"
    }), "Tab", null);
    $.__views.index.addTab($.__views.__alloyId5);
    $.__views.__alloyId9 = A$(Ti.UI.createWindow({
        backgroundImage: "/img/ipad-BG.png",
        barImage: "/img/menubar.png",
        backgroundColor: "transparent",
        title: "Videos",
        id: "__alloyId9"
    }), "Window", null);
    $.__views.__alloyId10 = Alloy.createController("videos", {
        id: "__alloyId10"
    });
    $.__views.__alloyId10.setParent($.__views.__alloyId9);
    $.__views.__alloyId8 = A$(Ti.UI.createTab({
        backgroundColor: "transparent",
        window: $.__views.__alloyId9,
        title: "Videos",
        icon: "/img/light_TV.png",
        id: "__alloyId8"
    }), "Tab", null);
    $.__views.index.addTab($.__views.__alloyId8);
    $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Ti.UI.setBackgroundColor("black");
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A, $model;

module.exports = Controller;