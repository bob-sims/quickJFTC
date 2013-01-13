XHR = require('xhr');
var videoURL = "https://gdata.youtube.com/feeds/api/users/NATOJFTC/uploads?alt=json&v=2&max-results=10";

$.transparentView.show();
$.activityIndicator.show();

var videoXHR = new XHR();
//Ti.API.info(videoURL);
//videoXHR.get(videoURL, videoSuccessCallback, require('utilities').onErrorCallback, {"ttl":1000*60*60*24});
videoXHR.get(videoURL, videoSuccessCallback, require('utilities').onErrorCallback, {"ttl":1000*60});

function videoSuccessCallback(e) {
	var data = JSON.parse(e.data), rowData=[];
	for (var i in data.feed.entry) {
		var idArray = data.feed.entry[i].id.$t.split('video:');
		//var movieId = idArray[1];
		//Ti.API.info('title: '+data.feed.entry[i].title.$t);
		//Ti.API.info('desc: '+ data.feed.entry[i].media$group.media$description.$t);
		//Ti.API.info('link: http://www.youtube.com/embed/'+idArray[1]+'?av=1&autoplay=1');
		//Ti.API.info('thumb: '+ data.feed.entry[i].media$group.media$thumbnail[0].url);
		//Ti.API.info('thumb_height: '+ data.feed.entry[i].media$group.media$thumbnail[0].height);
		//Ti.API.info('thumb_width: '+ data.feed.entry[i].media$group.media$thumbnail[0].width);
		//Ti.API.info('obj: '+JSON.stringify(data.feed.entry[i]));
		var payload={
			rowId:i,
			title:data.feed.entry[i].title.$t,
			image:{
				"url":data.feed.entry[i].media$group.media$thumbnail[1].url,
				"width":data.feed.entry[i].media$group.media$thumbnail[1].width,
				"height":data.feed.entry[i].media$group.media$thumbnail[1].height,
				"thumbnail":data.feed.entry[i].media$group.media$thumbnail[0].url,
				"thumbwidth":90,
				"thumbheight":(data.feed.entry[i].media$group.media$thumbnail[0].height*90)/data.feed.entry[i].media$group.media$thumbnail[0].width,
				},
			intro:data.feed.entry[i].media$group.media$description.$t,
			link:'http://www.youtube.com/embed/'+idArray[1]+'?av=1&autoplay=1'
		};
		//Ti.API.info('payload: '+JSON.stringify(payload));
		var row=Alloy.createController('row',payload).getView();
		rowData.push(row);
	}
	$.videoTable.setData(rowData);
	$.activityIndicator.hide();
	$.transparentView.hide();
}

function showItem(e) {
	require('utilities').miniBrowser({"link":e.row.rowLink});
}
