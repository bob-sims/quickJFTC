function Controller() {
    function magazineSuccessCallback(e) {
        Ti.API.info("magazine success!");
        var handler = new htmlparser.DefaultHandler(parseHandler), parser = new htmlparser.Parser(handler);
        parser.parseComplete(e.data);
    }
    function parseHandler(err, dom) {
        rowData = [];
        if (err) Ti.API.info("Error: " + err); else {
            console.info("parsing results...");
            var titleRows = select(dom, "h3.dm_title"), titleArray = [];
            titleRows.forEach(function(row) {
                titleArray.push({
                    title: row.children[1].attribs.alt,
                    image: "http://www.jftc.nato.int" + row.children[1].attribs.src,
                    link: "http://www.jftc.nato.int" + row.children[3].attribs.href
                });
            });
            var rows = select(dom, "div.dm_description ul"), q = 0;
            rows.forEach(function(row) {
                var intro = "";
                for (var i = 0; i < row.children.length; i++) row.children[i].children && JSON.stringify(row.children[i].children) && (intro += "◦ " + require("alloy/string").trim(row.children[i].children[0].data) + "\n");
                var rowObj = {
                    title: titleArray[q].title,
                    image: {
                        url: titleArray[q].image,
                        height: 141,
                        width: 100,
                        thumbnail: titleArray[q].image,
                        thumbwidth: 90,
                        thumbheight: 126.9
                    },
                    intro: intro,
                    rowId: q,
                    link: titleArray[q].link
                }, rowView = Alloy.createController("row", rowObj).getView();
                rowData.push(rowView);
                q++;
            });
            $.magazineList.setData(rowData);
            $.activityIndicator.hide();
            $.transparentView.hide();
        }
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
    $.__views.magazineList = A$(Ti.UI.createTableView({
        id: "magazineList"
    }), "TableView", null);
    $.addTopLevelView($.__views.magazineList);
    showItem ? $.__views.magazineList.on("click", showItem) : __defers["$.__views.magazineList!click!showItem"] = !0;
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
    var magazineURL = "http://www.jftc.nato.int/media/jftc-magazine", select = require("soupselect").select, XHR = require("xhr"), htmlparser = require("node-htmlparser"), utils = require("utilities");
    $.transparentView.show();
    $.activityIndicator.show();
    var magazineXHR = new XHR;
    magazineXHR.get(magazineURL, magazineSuccessCallback, utils.onErrorCallback);
    __defers["$.__views.magazineList!click!showItem"] && $.__views.magazineList.on("click", showItem);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A, $model;

module.exports = Controller;