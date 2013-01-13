var args = arguments[0] || {};
console.info(JSON.stringify(args));
var TiMiniBrowser = require("MiniBrowser/TiMiniBrowser");

var browser = new TiMiniBrowser({
    url: args.link,
    barColor: "#1684c9"
});

browser.open();
//Ti.API.info(JSON.stringify(browser));
//$.miniBrowser.add(browser);

//$.miniBrowser.setHtml(args.html);
