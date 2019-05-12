$(function() {
	var peticion_fotos_contactos = 'https://api.flickr.com/services/rest/?&method=flickr.photos.getContactsPublicPhotos&api_key=' 
	+ api_key + '&user_id=' +user_id + '&extras=date_upload%2C+date_taken%2C+owner_name%2C+icon_server%2C+original_format%2C+last_update&format=json&nojsoncallback=1';
	$.getJSON(peticion_fotos_contactos, mostrar_fotos);
})

function mostrar_fotos(info) {
	var principal = document.getElementById('contenido');
	for (var i=0;i<info.photos.photo.length;i++) {
		if(i % 4 == 0) {
			var fila = document.createElement('div');
			fila.setAttribute('id', Math.floor(i/4));
			fila.setAttribute('class', 'fila');
			principal.appendChild(fila);
		}
		var columna = document.createElement('div');
		columna.setAttribute('id', 'foto' + i);
		columna.setAttribute('class', 'columna');
		var item = info.photos.photo[i];
		var url = 'https://farm'+item.farm+".staticflickr.com/"+item.server +'/'+item.id+'_'+item.secret+'_m.jpg';

		columna.innerHTML += 
		"<img id='photourl' class='foto' src=" + url + " onclick='zoom(this.parentElement)'>"+
		"<h4 id='username'>" + item.username + "</h4>"+
		"<h4 id='nombre_real'>" + "Cargando Nombre Real" + "</h4>"+
		"<h6 id='datetaken'>" + item.datetaken + "</h6>"+
		"<h1 id='userid' class='userid'>" + item.owner + "</h1>";
			
		fila.appendChild(columna);
		addNombre(columna);
	}
}

function zoom(element) {
	var img = element.childNodes[0];
	console.log(img);
}

function addNombre(columna) {
	var nick = columna.lastChild.innerHTML;
	var username = columna.childNodes[2];
	peticion_nombre = 'https://api.flickr.com/services/rest/?method=flickr.people.getInfo&api_key='
				+ api_key + '&user_id=' + nick + '&format=json&nojsoncallback=1';

	$.getJSON(peticion_nombre, function (data) {
		username.innerHTML = data.person.realname._content;
	})
}
