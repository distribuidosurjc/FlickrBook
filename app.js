$(function() {
$.getJSON('https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=' 
	 + api_key + '&user_id=' +user_id + 
	'&format=json&nojsoncallback=1',
	mostrar_fotos
)

function mostrar_fotos(info){
	var i;
	for (i=0;i<info.photos.photo.length;i++) {
	   var item = info.photos.photo[i];
	   var url = 'https://farm'+item.farm+".staticflickr.com/"+item.server
		          +'/'+item.id+'_'+item.secret+'_m.jpg';
	   console.debug(url);
	   $("#imagenes").append($("<img/>").attr("src",url));
    }
}

}
)												
                
