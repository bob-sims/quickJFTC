function scraper(table) {
    Ti.API.info("scraping!");
    table.setData(rowData);
}

var rowData = [];

for (var i = 0; i <= 10; i++) {
    var row = Alloy.createController("row", {
        image: "KS_nav_views.png",
        title: "Title " + i,
        intro: "Intro " + i,
        link: "http://#"
    }).getView();
    rowData.push(row);
}

exports.scraper = scraper;