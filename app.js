$(function() {
	var peticion_fotos_contactos = 'https://api.flickr.com/services/rest/?&method=flickr.photos.getContactsPublicPhotos&api_key=' 
	+ api_key + '&user_id=' +user_id + '&extras=date_upload%2C+date_taken%2C+owner_name%2C+icon_server%2C+original_format%2C+last_update&format=json&nojsoncallback=1';
	$.getJSON(peticion_fotos_contactos, mostrar_fotos);

	mostrar_cabecera();
})

function mostrar_fotos(info) {
	var principal = document.getElementById('contenido');
	for (var i=0;i<info.photos.photo.length;i++) {
		if(i % 5 == 0) {
			var fila = document.createElement('div');
			fila.setAttribute('id', Math.floor(i/4));
			fila.setAttribute('class', 'fila');
			principal.appendChild(fila);
		}
		var columna = document.createElement('div');
		columna.setAttribute('id', 'foto' + i);
		columna.setAttribute('class', 'columna');
		var item = info.photos.photo[i];
		var url = 'https://farm'+item.farm+".staticflickr.com/"+item.server +'/'+item.id+'_'+item.secret+'_t.jpg';

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
	var img = element.childNodes[0].src;
	img = img.substring(0,img.length-5) + 'b.jpg';
	var modal = document.getElementById('modal');
	var modalImg = document.getElementById("imagen_ampliada");
	modal.style.display = "block";
	modalImg.src = img;
	
	var span = document.getElementsByClassName("close")[0];
	
	span.onclick = function() {
		modal.style.display = "none";
	} 
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

function mostrar_cabecera(){
	var peticion = 'https://api.flickr.com/services/rest/?method=flickr.people.getInfo&api_key='
		+api_key+'&user_id='+user_id+'&format=json&nojsoncallback=1';
	var nombre;
	var iconserver;
	var iconfarm;
   $.getJSON(peticion, function pedir_nombre(info) {
	   nombre = info.person.realname._content;
	   iconserver = info.person.iconserver;
	   iconfarm = info.person.iconfarm;
	   var url = 'https://www.flickr.com/images/buddyicon.gif';
	   if (iconfarm > 0 && iconserver > 0) {
		   var url = 'http://farm'+iconfarm+'.staticflickr.com/'+iconserver+'/buddyicons/'+user_id+'.jpg';
	   }
	   var cabecera = document.getElementById('cabecera');
	   cabecera.innerHTML = "   <img id='avatar' src="+ url + " >     " + nombre + "</div>   <input type='checkbox' onchange='refrescar()' id ='check'  value='Familia'>Sólo Familia</p>";
   });
}

function refrescar() {
	console.log("refrescar");
}
