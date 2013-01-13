function Controller() {
    function videoSuccessCallback(e) {
        var data = JSON.parse(e.data), rowData = [];
        for (var i in data.feed.entry) {
            var idArray = data.feed.entry[i].id.$t.split("video:"), payload = {
                rowId: i,
                title: data.feed.entry[i].title.$t,
                image: {
                    url: data.feed.entry[i].media$group.media$thumbnail[1].url,
                    width: data.feed.entry[i].media$group.media$thumbnail[1].width,
                    height: data.feed.entry[i].media$group.media$thumbnail[1].height,
                    thumbnail: data.feed.entry[i].media$group.media$thumbnail[0].url,
                    thumbwidth: 90,
                    thumbheight: data.feed.entry[i].media$group.media$thumbnail[0].height * 90 / data.feed.entry[i].media$group.media$thumbnail[0].width
                },
                intro: data.feed.entry[i].media$group.media$description.$t,
                link: "http://www.youtube.com/embed/" + idArray[1] + "?av=1&autoplay=1"
            }, row = Alloy.createController("row", payload).getView();
            rowData.push(row);
        }
        $.videoTable.setData(rowData);
        $.activityIndicator.hide();
        $.transparentView.hide();
    }
    function showItem(e) {
        require("utilities").miniBrowser({
            link: e.row.rowLink
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.videoTable = A$(Ti.UI.createTableView({
        id: "videoTable"
    }), "TableView", null);
    $.addTopLevelView($.__views.videoTable);
    showItem ? $.__views.videoTable.on("click", showItem) : __defers["$.__views.videoTable!click!showItem"] = !0;
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
    XHR = require("xhr");
    var videoURL = "https://gdata.youtube.com/feeds/api/users/NATOJFTC/uploads?alt=json&v=2&max-results=10";
    $.transparentView.show();
    $.activityIndicator.show();
    var videoXHR = new XHR;
    videoXHR.get(videoURL, videoSuccessCallback, require("utilities").onErrorCallback, {
        ttl: 60000
    });
    __defers["$.__views.videoTable!click!showItem"] && $.__views.videoTable.on("click", showItem);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A, $model;

module.exports = Controller;