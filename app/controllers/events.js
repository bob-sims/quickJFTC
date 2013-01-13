//var rowData = [{"title":"Row 1"},{"title":"Row 2"},{"title":"Row 3"},{"title":"Row 4"}];
var rowData = [];

var eventsRSS = "http://events.jftc.nato.int/rss.xml";

var utils = require('utilities');
var XHR = require("xhr");

var eventsXHR = new XHR();

eventsXHR.get(eventsRSS, eventsCallback, onErrorCallback);

var onErrorCallback = utils.onErrorCallback;

function handleData(nodes) {
	var payload = [];
	for(var i = 0, x = nodes.length; i < x; i++) {
		//Ti.API.info('raw desc: '+utils.htmlDecode(desc));
		var link = utils.cleanString(nodes.item(i).getElementsByTagName("link").item(0).textContent);
		
		// remove line breaks from ugly RSS
		var desc = nodes.item(i).getElementsByTagName("description").item(0).textContent.replace(/\n[^\S\n]*/g,"");
		// decode HTML entities
		desc = utils.htmlDecode(desc);
		// get image properties, if available
		var image = utils.parseImageProperties(desc);
		var intro = utils.cleanString(nodes.item(i).getElementsByTagName("description").item(0).textContent);
		intro = intro.replace('read more', '');
		intro = require('alloy/string').trim(intro);
		
		var node = {
			"title":utils.cleanString(nodes.item(i).getElementsByTagName("title").item(0).textContent),
			"link":utils.cleanString(nodes.item(i).getElementsByTagName("link").item(0).textContent),
			"intro":intro,
			"rowId": i,
		};
		

		if (image) {
			node.image = {
				"url": image.url || '',
				"width": image.width || '',
				"height": image.height || '',
				"thumbnail": "http://events.jftc.nato.int/sites/default/files/imagecache/thumbnail/"+parseImageName(image.url),
				"thumbwidth": 60,
				"thumbheight": 60,
			} 
		}; 
		
		//Ti.API.info('desc: '+utils.cleanString(nodes.item(i).getElementsByTagName("description").item(0).text));
		//Ti.API.info('link: '+utils.cleanString(nodes.item(i).getElementsByTagName("link").item(0).text));

		//Ti.API.info('img: '+utils.htmlDecode(desc).match(/src=(.+?")/)[1]);
		//Ti.API.info('height: '+utils.htmlDecode(desc).match(/height=(.+?")/)[1]);
		//Ti.API.info('width: '+utils.htmlDecode(desc).match(/width=(.+?")/)[1]);
		//Ti.API.info(JSON.stringify(node));
		payload.push(node);
	}
	return payload;
}

/**
 * extract image filename from URL, specific to Drupal 6 URLs
 */
function parseImageName(url) {
	var urlParts = url.split("?");
	urlParts = urlParts[0].split("/");
	return urlParts[urlParts.length-1];
}

function eventsCallback(e) {
	Ti.API.info('events success!');
	//Ti.API.info(JSON.stringify(e));
	
	var xml		= Ti.XML.parseString(utils.xmlNormalize(e.data));
	//var xml		= Ti.XML.parseString(e.data);
	// see also: strip_tags.js  http://pastie.org/837981
	// http://developer.appcelerator.com/question/141864/how-to-parse-description-element-from-an-rss-feed
	var nodes	= xml.documentElement.getElementsByTagName("item");
	var cleanNodes = handleData(nodes);
	//Ti.API.info('cleanNodes: '+JSON.stringify(cleanNodes));
	var payload = {}; rowData = [];
	for(var i in cleanNodes) {
		var row=Alloy.createController('row',cleanNodes[i]).getView();
		rowData.push(row);
	}

	$.table.setData(rowData);
	$.activityIndicator.hide();
	$.transparentView.hide();

};

function showItem(e) {
	//alert(e.row.rowLink);
	console.info('link: '+e.row.rowLink);
	require('utilities').miniBrowser({"link":e.row.rowLink});
}

$.transparentView.show();
$.activityIndicator.show();
