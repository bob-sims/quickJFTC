var XHR = require('xhr'), utils = require('utilities');
//var newsURL = "http://query.yahooapis.com/v1/public/yql?q=select%20h2%2C%20p%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.jftc.nato.int%2Fnews%2Fblog%22%20and%20xpath%3D'%2F%2F*%5B%40id%3D%22maincontent-block%22%5D%2Fdiv%5B2%5D%2Fdiv%2Fdiv%2Fdiv%2Fdiv%7C%2F%2F*%5B%40id%3D%22maincontent-block%22%5D%2Fdiv%5B2%5D%2Fdiv%2Fdiv%2Fdiv%2Fdiv%2Fdiv'&format=json";
var newsURL = "http://www.jftc.nato.int/news/rss";

$.transparentView.show();
$.activityIndicator.show();

var newsXHR = new XHR();
//newsXHR.clearCache();
//newsXHR.get(newsURL, newsSuccessCallback, utils.onErrorCallback, {"ttl":1000*30,"contentType":"application/rss+xml; charset=ISO-8859-1"});
newsXHR.get(newsURL, newsSuccessCallback, utils.onErrorCallback);

function newsSuccessCallback(e) {
	console.info('news callback success!');
	var xml	= Ti.XML.parseString(utils.xmlNormalize(e.data));
	var nodes	= xml.documentElement.getElementsByTagName("item");
	console.info('rss length: '+nodes.length);
	var rowData = [];
  
	for (var i=0; i<nodes.length; i++) {
		//console.info(i);
		//console.info('title '+i+': '+ nodes.item(i).getElementsByTagName("title").item(0).text);
		//console.info('link '+i+': '+ nodes.item(i).getElementsByTagName("link").item(0).text);
		//console.info('intro '+i+': '+ nodes.item(i).getElementsByTagName("description").item(0).text);
		var imageURL = utils.parseImageProperties(nodes.item(i).getElementsByTagName("description").item(0).textContent);
		//console.info('image obj '+i+': '+ JSON.stringify(imageURL));
		//console.info('90x60 thumb: '+parseImageUrl(imageURL.url));
		var timeStamp = new Date(utils.cleanString(nodes.item(i).getElementsByTagName("pubDate").item(0).textContent)).getTime();
		//console.info('date : '+utils.toDateRelative(timeStamp));
		//console.info(parseAuthor(nodes.item(i).getElementsByTagName("author").item(0).text));
		var payload = {
			"title":utils.cleanString(nodes.item(i).getElementsByTagName("title").item(0).textContent),
			"link":utils.cleanString(nodes.item(i).getElementsByTagName("link").item(0).textContent),
			"intro":utils.cleanString(nodes.item(i).getElementsByTagName("description").item(0).textContent),
			"image":{
				"url":utils.parseImageProperties(nodes.item(i).getElementsByTagName("description").item(0).textContent).url,
				"width":utils.parseImageProperties(nodes.item(i).getElementsByTagName("description").item(0).textContent).width,
				"height":utils.parseImageProperties(nodes.item(i).getElementsByTagName("description").item(0).textContent).height,
				"thumbnail":parseImageUrl(imageURL.url),
				"thumbwidth":90,
				"thumbheight":60
				},
			"author":parseAuthor(nodes.item(i).getElementsByTagName("author").item(0).textContent),
			"time":utils.toDateRelative(timeStamp),
			};
		var row=Alloy.createController('row',payload).getView();
		rowData.push(row);
	};
	$.newsList.setData(rowData);
	$.activityIndicator.hide();
	$.transparentView.hide();
}

/**
 * extract author's real name
 */

function parseAuthor(_string) {
	var _string = _string.split(" (");
	return _string[1].replace(")", "")
}

/**
 * extract image filename from URL, re-format to smallest thumb URL, specific to Joomla 1.5 image URLs
 */
function parseImageUrl(url) {
	var urlParts = url.split("/");
	var fileName = urlParts[urlParts.length-1];
	var fileNameParts = fileName.split(".");
	return "http://www.jftc.nato.int/images/news_pictures/"+urlParts[urlParts.length-2]+"/"+fileNameParts[0]+"_thumb."+fileNameParts[1];
}

function showItem(e) {
	//console.info('link: '+e.row.rowLink);
	require('utilities').miniBrowser({"link":e.row.rowLink});
}

