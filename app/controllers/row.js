var args = arguments[0] || {};

//console.info('link: '+args.link);
//console.info('args: '+JSON.stringify(args));

$.row.rowId=args.rowId;
$.row.rowLink=args.link;

if (args.image.thumbheight){
	$.image.setHeight(Math.floor(args.image.thumbheight));
	$.image_frame.setHeight(Math.floor(args.image.thumbheight+15));
}

if (args.image.thumbwidth){
	$.image.setWidth(Math.floor(args.image.thumbwidth));
	$.container.setLeft(args.image.thumbwidth+17);
	$.image_frame.setWidth(Math.floor(args.image.thumbwidth+15));
}

$.title.text=args.title;
$.image.image=args.image.thumbnail;
$.intro.text=args.intro;
//$.itemName.text=args.title;