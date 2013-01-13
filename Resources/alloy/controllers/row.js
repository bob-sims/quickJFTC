function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.row = A$(Ti.UI.createTableViewRow({
        hasChild: !0,
        rightImage: "/img/ipad-arrow.png",
        backgroundImage: "/img/list-item-bg.png",
        id: "row"
    }), "TableViewRow", null);
    $.addTopLevelView($.__views.row);
    $.__views.image_frame = A$(Ti.UI.createImageView({
        height: 70,
        width: 70,
        left: 3,
        top: 3,
        bottom: 5,
        image: "/img/list-frame.png",
        id: "image_frame"
    }), "ImageView", $.__views.row);
    $.__views.row.add($.__views.image_frame);
    $.__views.image = A$(Ti.UI.createImageView({
        height: 60,
        width: 60,
        left: 10,
        top: 10,
        bottom: 10,
        id: "image"
    }), "ImageView", $.__views.row);
    $.__views.row.add($.__views.image);
    $.__views.container = A$(Ti.UI.createView({
        top: 5,
        bottom: 5,
        left: 80,
        right: 5,
        layout: "vertical",
        height: Ti.UI.SIZE,
        id: "container"
    }), "View", $.__views.row);
    $.__views.row.add($.__views.container);
    $.__views.title = A$(Ti.UI.createLabel({
        left: 0,
        font: {
            fontFamily: "Monda",
            fontWeight: "bold",
            fontSize: "16dp"
        },
        color: "#094B7B",
        height: Ti.UI.SIZE,
        shadowColor: "white",
        shadowOffset: {
            x: 0,
            y: 1
        },
        text: "Test 1",
        id: "title"
    }), "Label", $.__views.container);
    $.__views.container.add($.__views.title);
    $.__views.intro = A$(Ti.UI.createLabel({
        top: 5,
        left: 0,
        font: {
            fontFamily: "Monda"
        },
        color: "#303030",
        height: Ti.UI.SIZE,
        shadowColor: "white",
        shadowOffset: {
            x: 0,
            y: 1
        },
        text: "Intro",
        id: "intro"
    }), "Label", $.__views.container);
    $.__views.container.add($.__views.intro);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    $.row.rowId = args.rowId;
    $.row.rowLink = args.link;
    if (args.image.thumbheight) {
        $.image.setHeight(Math.floor(args.image.thumbheight));
        $.image_frame.setHeight(Math.floor(args.image.thumbheight + 15));
    }
    if (args.image.thumbwidth) {
        $.image.setWidth(Math.floor(args.image.thumbwidth));
        $.container.setLeft(args.image.thumbwidth + 17);
        $.image_frame.setWidth(Math.floor(args.image.thumbwidth + 15));
    }
    $.title.text = args.title;
    $.image.image = args.image.thumbnail;
    $.intro.text = args.intro;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A, $model;

module.exports = Controller;