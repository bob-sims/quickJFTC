var magazineURL = "http://www.jftc.nato.int/media/jftc-magazine";

var select = require('soupselect').select,
	XHR = require('xhr'),
	htmlparser = require('node-htmlparser'),
	utils = require('utilities');

$.transparentView.show();
$.activityIndicator.show();

var magazineXHR = new XHR();
magazineXHR.get(magazineURL, magazineSuccessCallback, utils.onErrorCallback);

function magazineSuccessCallback(e) {
	Ti.API.info('magazine success!');
	
	var handler = new htmlparser.DefaultHandler(parseHandler);
	//var handler = new htmlparser.DefaultHander(function(e){console.info('hey there!')});
	var parser = new htmlparser.Parser(handler);
	parser.parseComplete(e.data);
}

function parseHandler(err, dom) {
	rowData = [];
	if (err) {
		Ti.API.info('Error: ' + err);
	} else {
		console.info('parsing results...');
		var titleRows = select(dom, 'h3.dm_title');
		var titleArray = [];
		titleRows.forEach(function(row){
			//Ti.API.info('=====');
			//Ti.API.info('Magazine title: '+row.children[1].attribs.alt);
			//Ti.API.info('Thumbnail link: http://www.jftc.nato.int'+row.children[1].attribs.src);
			//Ti.API.info('d/l link: '+row.children[3].attribs.href)
			//Ti.API.info('row: '+JSON.stringify(row));
			titleArray.push({
				"title":row.children[1].attribs.alt,
				"image":'http://www.jftc.nato.int'+row.children[1].attribs.src,
				"link":'http://www.jftc.nato.int'+row.children[3].attribs.href
				});
			});  

		var rows = select(dom, 'div.dm_description ul');
		var q=0;
		rows.forEach(function(row) {
			//Ti.API.info('=====');
			//Ti.API.info('magazine #: '+q);
			var intro = '';
			for (var i = 0; i<row.children.length; i++) {
					//Ti.API.info(row.children[i].children[0].data);
					if (row.children[i].children && JSON.stringify(row.children[i].children)) {
						//Ti.API.info(row.children[i].children[0].data);
						intro += "◦ "+require('alloy/string').trim(row.children[i].children[0].data)+'\n';
					}
			}
			var rowObj = {
				"title":titleArray[q].title,
				"image":{url:titleArray[q].image,
					"height":141,
					"width":100,
					"thumbnail":titleArray[q].image,
					"thumbwidth": 90,
					"thumbheight": (141*90)/100
					},
				"intro":intro,
				"rowId":q,
				"link":titleArray[q].link
				};
			//Ti.API.info('rowObj '+JSON.stringify(rowObj))
			var rowView=Alloy.createController('row',rowObj).getView();
			rowData.push(rowView);
			//console.info('height: '+$.image.height);
			//$.image.setHeight((rowObj.image.width*$.image.getWidth)/$image.getHeight);
			q++;
			//Ti.API.info('Magazine title: '+row.children[1].attribs.alt);
			//Ti.API.info('Thumbnail link: http://www.jftc.nato.int'+row.children[1].attribs.src);
		//Ti.API.info("magazine row: "+JSON.stringify(payload));
		//var rowView=Alloy.createController('row',payload).getView();
		//rowData.push(rowView);
		});
		
		//var row=Alloy.createController('row',payload).getView();
		//rowData.push(payload);
		$.magazineList.setData(rowData)
		$.activityIndicator.hide();
		$.transparentView.hide();
	}
	//Ti.API.info('rowData: '+ JSON.stringify(rowData));
}

function showItem(e) {
	//alert(e.row.rowLink);
	console.info('link: '+e.row.rowLink);
	require('utilities').miniBrowser({"link":e.row.rowLink});
	//console.info('obj: '+JSON.stringify(e.rowData));
}
