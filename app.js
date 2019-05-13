var checked = false;
var cambio = false;
var fecha_min = "2018-01-01";
var fecha_max = "2020-12-31";

$(function() {
    mostrar_cabecera();
    main();
})

function main() {
    var contenedor = document.getElementById('contenido');

    if (contenedor.childElementCount > 0) { // Si se ha llamado a refrescar
        contenedor.removeChild(document.getElementById('tabla'));
    }

    var tabla = document.createElement('div');
    tabla.setAttribute('id', 'tabla');
    contenedor.appendChild(tabla);

    friends = checked ? '1' : '0';

    var peticion_fotos_contactos = 'https://api.flickr.com/services/rest/?&method=flickr.photos.getContactsPublicPhotos&api_key=' +
        api_key + '&user_id=' + user_id + '&count=50&just_friends=' + friends + '&extras=date_upload%2C+date_taken%2C+owner_name&format=json&nojsoncallback=1';
    $.getJSON(peticion_fotos_contactos, mostrar_fotos);
}

function mostrar_fotos(info) {
    var principal = document.getElementById('tabla');
    for (var i = 0; i < info.photos.photo.length; i++) {
        if (i % 8 == 0) {
            var fila = document.createElement('div');
            fila.setAttribute('id', Math.floor(i / 4));
            fila.setAttribute('class', 'fila');
            principal.appendChild(fila);
        }
        var columna = document.createElement('div');
        columna.setAttribute('id', 'foto' + i);
        columna.setAttribute('class', 'columna');
        var item = info.photos.photo[i];
        var url = 'https://farm' + item.farm + ".staticflickr.com/" + item.server + '/' + item.id + '_' + item.secret + '_t.jpg';

        columna.innerHTML +=
            "<div id='contenedor_imagen' class='contenedor_imagen'>" +
            "<img id='photourl' class='foto' src=" + url + " onclick='zoom(this.src)'>" +
            "</div>" +
            "<div id='contenedor_datos' class='contenedor_datos'>" +
            "<h4 id='nombre_real'>" + "Cargando Nombre Real" + "</h4>" +
            "<h4 id='username' onclick='timeline(this.parentElement.lastChild.innerHTML)'>" + item.username + "</h4>" +
            "<h6 id='datetaken'>" + item.datetaken + "</h6>" +
            "<h1 id='userid' class='userid'>" + item.owner + "</h1>" +
            "</div>";

        fila.appendChild(columna);
        contenedor_datos = columna.lastChild;
        addNombre(contenedor_datos);
    }
}

function zoom(img) {
    img = img.substring(0, img.length - 5) + 'b.jpg';
    var modal = document.getElementById('modalZoom');
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
    var username = columna.childNodes[0];

    peticion_nombre = 'https://api.flickr.com/services/rest/?method=flickr.people.getInfo&api_key=' +
        api_key + '&user_id=' + nick + '&format=json&nojsoncallback=1';

    $.getJSON(peticion_nombre, function(data) {
        username.innerHTML = data.person.realname._content;
    })
}

function mostrar_cabecera() {
    var peticion = 'https://api.flickr.com/services/rest/?method=flickr.people.getInfo&api_key=' +
        api_key + '&user_id=' + user_id + '&format=json&nojsoncallback=1';
    var nombre;
    var iconserver;
    var iconfarm;
    $.getJSON(peticion, function pedir_nombre(info) {
        nombre = info.person.realname._content;
        iconserver = info.person.iconserver;
        iconfarm = info.person.iconfarm;
        var url = 'https://www.flickr.com/images/buddyicon.gif';
        if (iconfarm > 0 && iconserver > 0) {
            var url = 'http://farm' + iconfarm + '.staticflickr.com/' + iconserver + '/buddyicons/' + user_id + '.jpg';
        }
        var cabecera = document.getElementById('cabecera');
        cabecera.innerHTML = "   <img id='avatar' src=" + url + " >     " +
            nombre + "</div>   <input type='checkbox' onchange='refrescar()' id ='check' value='Familia'>Sólo Familia</p>";
    });
}

function refrescar() {
    checked = document.getElementById("check").checked;
    main();
}

function timeline(element) {
    var data = [];
    var peticion = "https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=" + api_key + "&user_id=" + element + "&min_taken_date=" + fecha_min + "&max_taken_date=" + fecha_max + "&extras=date_taken&format=json&nojsoncallback=1";

    $.getJSON(peticion, function timelineCompleto(info) {
        var principal = document.getElementById('MyTimeLine');
        for (var i = 0; i < info.photos.photo.length; i++) {
            var elemento = info.photos.photo[i];
            var url = 'https://farm' + elemento.farm + ".staticflickr.com/" + elemento.server + '/' + elemento.id + '_' + elemento.secret + '_m.jpg';
            var fecha = elemento.datetaken.substring(0, 10);
            var item = { time: fecha, body: [{ tag: "img", attr: { src: url, width: "320px", cssclass: "img-responsive" } }, { tag: "p", content: elemento.id }] };
            data.push(item);
        }

        $(document).ready(function() {
            $('#myTimeline').albeTimeline(data, {
                language: 'es-ES',
            });
            $.when(mostrar_modal_timeline()).then(actualizar_comentarios());
        });
    });
}

function actualizar_comentarios() {
    var list = document.getElementsByClassName('comentario');
    for (var i = 1; i < list.length; i += 2) {
        addComentario(list[i]);
    }
}

function addComentario(comentario) {
    var id = comentario.innerHTML;
    peticion_comentarios = 'https://api.flickr.com/services/rest/?method=flickr.photos.comments.getList&api_key=' +
        api_key + '&photo_id=' + id + '&format=json&nojsoncallback=1';

    $.getJSON(peticion_comentarios, function(data) {
        lista_comentarios = data.comments;
        if (Object.keys(lista_comentarios).length > 1) { // Tiene comentarios
            comentario.innerHTML = "";
            for (var i = 0; i < data.comments.comment.length; i++) {
                comentario.innerHTML += '<b>' + data.comments.comment[i].realname + ': </b>'
                comentario.innerHTML += data.comments.comment[i]._content + '<br><br>';
            }
        } else {
            comentario.innerHTML = "Foto sin comentarios";
        }
    })
}

function mostrar_modal_timeline() {
    var modal = document.getElementById('modalTimeline');
    modal.style.display = "block";

    var span = document.getElementsByClassName("close")[1];

    span.onclick = function() {
        modal.style.display = "none";
    }
}

function cambiar_fecha() {
    if (cambio) {
        fecha_min = "2018-01-01";
        fecha_max = "2018-12-31";
    } else {
        fecha_min = "2019-01-01";
        fecha_max = "2019-12-31";
    }
    cambio = !cambio;
}
