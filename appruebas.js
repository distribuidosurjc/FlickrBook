$(function () {
	// Petición para obtener fotos públicas de los contactos
	var peticion = 'https://api.flickr.com/services/rest/?&method=flickr.photos.getContactsPublicPhotos&api_key=' 
		+ api_key + '&user_id=' +user_id + '&extras=date_upload%2C+date_taken&format=json&nojsoncallback=1';
	var items = [];

	$.when($.getJSON(peticion, mostrar_fotos, function obtener_fotos(info) { // Obtenemos las fotos públicas de los contactos
		var i;
		for (i=0;i<info.photos.photo.length;i++) {
			var item = {url: "", owner: "", name: "", date_taken: "", date_upload: ""}; // Estructura de datos
			var aux = info.photos.photo[i]; // Obtenemos una a una
			item.url = 'https://farm'+aux.farm+".staticflickr.com/"+aux.server +'/'+aux.id+'_'+aux.secret+'_t.jpg'; // URL
			item.owner = aux.owner; // Identificador de usuario
			item.date_taken = aux.datetaken; // Fecha de la foto
			item.date_upload = aux.dateupload; // Fecha de subida
			items.push(item); // Guardamos en lista de ítems
		}
	})).then(function obtener_nombres() { // Obtenemos nombres reales de cada usuario
		for (i=0;i<items.length;i++) { // Para cada item
			var item = items[i];
			peticion = 'https://api.flickr.com/services/rest/?method=flickr.people.getInfo&api_key='
				+ api_key + '&user_id=' + item.owner + '&format=json&nojsoncallback=1';
			peticion_nombre(peticion, item); // Una petición para información de usuario
		}
	});
	console.log(items); // Mostramos por consola
})

function mostrar_fotos(info){
	$("#imagenes #img").remove(); 
	var i;
	for (i=0;i<info.photos.photo.length;i++) {
		var item = info.photos.photo[i];
		var url = 'https://farm'+item.farm+".staticflickr.com/"+item.server
		+'/'+item.id+'_'+item.secret+'_t.jpg';
		console.debug(url);       
		$("#imagenes").append($("<img id=\"img\" />").attr("src",url));                         
	}
	//$("#imagenes #img").click(zoom);
}


function peticion_nombre(peticion, item) { // Función para obtener nombre real a partir de nombre usuario
	$.getJSON(peticion, function obtener_nombre(datos) { // JSON con información del usuario
		real  = datos.person.realname._content; // Obtenemos nombre real
		item.name = real; // Añadimos al ítem
	});
}	