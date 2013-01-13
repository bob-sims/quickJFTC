var rowData =[];

for (var i=0;i<=10;i++) {
	// simulated scraping
	var row=Alloy.createController('row',{"image":'KS_nav_views.png',"title":'Title '+i,"intro":'Intro '+i,"link":'http://#'}).getView();
	rowData.push(row);
}

function scraper(table) {
	Ti.API.info('scraping!');	
	table.setData(rowData);
}

exports.scraper = scraper;