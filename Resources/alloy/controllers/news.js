function Controller() {
    function newsSuccessCallback(e) {
        console.info("news callback success!");
        var xml = Ti.XML.parseString(utils.xmlNormalize(e.data)), nodes = xml.documentElement.getElementsByTagName("item");
        console.info("rss length: " + nodes.length);
        var rowData = [];
        for (var i = 0; i < nodes.length; i++) {
            var imageURL = utils.parseImageProperties(nodes.item(i).getElementsByTagName("description").item(0).textContent), timeStamp = (new Date(utils.cleanString(nodes.item(i).getElementsByTagName("pubDate").item(0).textContent))).getTime(), payload = {
                title: utils.cleanString(nodes.item(i).getElementsByTagName("title").item(0).textContent),
                link: utils.cleanString(nodes.item(i).getElementsByTagName("link").item(0).textContent),
                intro: utils.cleanString(nodes.item(i).getElementsByTagName("description").item(0).textContent),
                image: {
                    url: utils.parseImageProperties(nodes.item(i).getElementsByTagName("description").item(0).textContent).url,
                    width: utils.parseImageProperties(nodes.item(i).getElementsByTagName("description").item(0).textContent).width,
                    height: utils.parseImageProperties(nodes.item(i).getElementsByTagName("description").item(0).textContent).height,
                    thumbnail: parseImageUrl(imageURL.url),
                    thumbwidth: 90,
                    thumbheight: 60
                },
                author: parseAuthor(nodes.item(i).getElementsByTagName("author").item(0).textContent),
                time: utils.toDateRelative(timeStamp)
            }, row = Alloy.createController("row", payload).getView();
            rowData.push(row);
        }
        $.newsList.setData(rowData);
        $.activityIndicator.hide();
        $.transparentView.hide();
    }
    function parseAuthor(_string) {
        var _string = _string.split(" (");
        return _string[1].replace(")", "");
    }
    function parseImageUrl(url) {
        var urlParts = url.split("/"), fileName = urlParts[urlParts.length - 1], fileNameParts = fileName.split(".");
        return "http://www.jftc.nato.int/images/news_pictures/" + urlParts[urlParts.length - 2] + "/" + fileNameParts[0] + "_thumb." + fileNameParts[1];
    }
    function showItem(e) {
        require("utilities").miniBrowser({
            link: e.row.rowLink
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.newsList = A$(Ti.UI.createTableView({
        id: "newsList"
    }), "TableView", null);
    $.addTopLevelView($.__views.newsList);
    showItem ? $.__views.newsList.on("click", showItem) : __defers["$.__views.newsList!click!showItem"] = !0;
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
    var XHR = require("xhr"), utils = require("utilities"), newsURL = "http://www.jftc.nato.int/news/rss";
    $.transparentView.show();
    $.activityIndicator.show();
    var newsXHR = new XHR;
    newsXHR.get(newsURL, newsSuccessCallback, utils.onErrorCallback);
    __defers["$.__views.newsList!click!showItem"] && $.__views.newsList.on("click", showItem);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A, $model;

module.exports = Controller;