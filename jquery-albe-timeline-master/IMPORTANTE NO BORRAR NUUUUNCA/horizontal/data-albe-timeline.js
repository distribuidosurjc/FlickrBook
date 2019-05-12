//Json Object
var data = [
	{
		time: '2015-03-29',
		header: 'Sample of header',
		body: [{
			tag: 'h1',
			content: "Lorem ipsum"
		},
		{
			tag: 'p',
			content: 'Lorem ipsum dolor sit amet, nisl lorem, wisi egestas orci tempus class massa, suscipit eu elit urna in urna, gravida wisi aenean eros massa, cursus quisque leo quisque dui.'
		}],
		footer: 'Sample of footer. See <a href=\"https://github.com/Albejr/jquery-albe-timeline\" target=\"_blank\">more details</a>'
	},
	{
		time: '2015-04-15',
		body: [{
			tag: 'h1',
			content: "Basic content"
		},
		{
			tag: 'p',
			content: 'Lorem ipsum dolor sit amet, nisl lorem, wisi egestas orci tempus class massa, suscipit eu elit urna in urna, gravida wisi aenean eros massa, cursus quisque leo quisque dui.  See <a href=\"https://github.com/Albejr/jquery-albe-timeline\" target=\"_blank\">more details</a>'
		}],
	},
	{
		time: '2016-01-20',
		body: [{
			tag: 'img',
			attr: {
				src: '../img/Foto1.jpg',
				width: '320px',
				cssclass: 'img-responsive'
			}
		},
		{
			tag: 'h2',
			content: 'FotoPokachu'
		},
		{
			tag: 'p',
			content: 'Lorem ipsum dolor sit amet, nisl lorem, wisi egestas orci tempus class massa, suscipit eu elit urna in urna, gravida wisi aenean eros massa, cursus quisque leo quisque dui.'
		}]
	},
	{
		time: '2013-01-20',
		body: [{
            tag: 'img',
			attr: {
				src: 'https://live.staticflickr.com/65535/32887198037_5e11d9d87f_m.jpg ',
				width: '320px',
				cssclass: 'img-responsive'
			}
		},
		{
			tag: 'h2',
			content: 'Sample with image rigth'
		},
		{
			tag: 'p',
			content: "Lorem ipsum dolor sit amet, nisl lorem, wisi egestas orci <br> tempus class massa, suscipit eu elit urna in urna, gravida wisi aenean eros massa, cursus quisque leo quisque dui."
			
			
			
			
		
		}
			
		]
	}
];

$(document).ready(function () {

	$('#myTimeline').albeTimeline(data, {
		effect: "zoomIn",
		showMenu: false
	});

});

