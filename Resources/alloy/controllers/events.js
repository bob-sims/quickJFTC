function Controller() {
    function handleData(nodes) {
        var payload = [];
        for (var i = 0, x = nodes.length; i < x; i++) {
            var link = utils.cleanString(nodes.item(i).getElementsByTagName("link").item(0).textContent), desc = nodes.item(i).getElementsByTagName("description").item(0).textContent.replace(/\n[^\S\n]*/g, "");
            desc = utils.htmlDecode(desc);
            var image = utils.parseImageProperties(desc), intro = utils.cleanString(nodes.item(i).getElementsByTagName("description").item(0).textContent);
            intro = intro.replace("read more", "");
            intro = require("alloy/string").trim(intro);
            var node = {
                title: utils.cleanString(nodes.item(i).getElementsByTagName("title").item(0).textContent),
                link: utils.cleanString(nodes.item(i).getElementsByTagName("link").item(0).textContent),
                intro: intro,
                rowId: i
            };
            image && (node.image = {
                url: image.url || "",
                width: image.width || "",
                height: image.height || "",
                thumbnail: "http://events.jftc.nato.int/sites/default/files/imagecache/thumbnail/" + parseImageName(image.url),
                thumbwidth: 60,
                thumbheight: 60
            });
            payload.push(node);
        }
        return payload;
    }
    function parseImageName(url) {
        var urlParts = url.split("?");
        urlParts = urlParts[0].split("/");
        return urlParts[urlParts.length - 1];
    }
    function eventsCallback(e) {
        Ti.API.info("events success!");
        var xml = Ti.XML.parseString(utils.xmlNormalize(e.data)), nodes = xml.documentElement.getElementsByTagName("item"), cleanNodes = handleData(nodes), payload = {};
        rowData = [];
        for (var i in cleanNodes) {
            var row = Alloy.createController("row", cleanNodes[i]).getView();
            rowData.push(row);
        }
        $.table.setData(rowData);
        $.activityIndicator.hide();
        $.transparentView.hide();
    }
    function showItem(e) {
        console.info("link: " + e.row.rowLink);
        require("utilities").miniBrowser({
            link: e.row.rowLink
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.table = A$(Ti.UI.createTableView({
        id: "table"
    }), "TableView", null);
    $.addTopLevelView($.__views.table);
    showItem ? $.__views.table.on("click", showItem) : __defers["$.__views.table!click!showItem"] = !0;
    $.__views.transparentView = A$(Ti.UI.createView({
        height: 60,
        width: 180,
        backgroundColor: "#000",
        borderRadius: 10,
        opacity: 0.5,
        touchEnabled: !1,
        id: "transparentView"
    }), "View", null);
    $.addTopLevelView($.__views.transparentView);
    $.__views.activityIndicator = A$(Ti.UI.createActivityIndicator({
        message: "Loading...",
        color: "white",
        height: 60,
        width: 180,
        font: {
            fontSize: 18,
            fontWeight: "bold"
        },
        touchEnabled: !1,
        indicatorColor: "white",
        style: Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN,
        borderWidth: 0,
        borderRadius: 10,
        id: "activityIndicator"
    }), "ActivityIndicator", null);
    $.addTopLevelView($.__views.activityIndicator);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var rowData = [], eventsRSS = "http://events.jftc.nato.int/rss.xml", utils = require("utilities"), XHR = require("xhr"), eventsXHR = new XHR;
    eventsXHR.get(eventsRSS, eventsCallback, onErrorCallback);
    var onErrorCallback = utils.onErrorCallback;
    $.transparentView.show();
    $.activityIndicator.show();
    __defers["$.__views.table!click!showItem"] && $.__views.table.on("click", showItem);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A, $model;

module.exports = Controller;