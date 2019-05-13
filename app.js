/** Variables Globales **/
var checked = false;
var cambio = false;
var fecha_min = "2019-01-01";
var fecha_max = "2019-12-31";

/** Carga de la página **/
$(function() {
    mostrar_cabecera();
    main();
})

/**
 * Función Principal.
 * Se recarga al cambiar el estado de "sólo familia y amigos".
 */
function main() {

    var contenedor = document.getElementById('contenido');
    if (contenedor.childElementCount > 0) { // Si se ha llamado a refrescar
        /**
         * Nuestra intención inicial era marcar cada foto con un atributo oculto sobre si era familia o amigo
         * y al cambiar el estado de "sólo familia y amigos", recorrer todas las celdas y ocultar las que tocaran,
         * pero en la información que nos retorna la petición no hay forma de saber la relación entre los usuarios, 
         * por lo que recargaremos los elementos de la tabla cada vez que sea requerido por el usuario.
         */
        contenedor.removeChild(document.getElementById('tabla'));
    }

    var tabla = document.createElement('div');
    tabla.setAttribute('id', 'tabla');
    contenedor.appendChild(tabla);

    friends = checked ? '1' : '0'; // Selector activo o no de sólo amigos y familia.

    var peticion_fotos_contactos = 'https://api.flickr.com/services/rest/?&method=flickr.photos.getContactsPublicPhotos&api_key=' +
        api_key + '&user_id=' + user_id + '&count=50&just_friends=' + friends +
        '&extras=date_upload%2C+date_taken%2C+owner_name&format=json&nojsoncallback=1';
    $.getJSON(peticion_fotos_contactos, mostrar_fotos);
}

/**
 * Coloca la información de la petición getContactsPublicPhotos en la tabla de la página.
 * @param {JSON} info JSON con los datos que devuelve la petición getContactsPublicPhotos.
 */
function mostrar_fotos(info) {
    var principal = document.getElementById('tabla');
    for (var i = 0; i < info.photos.photo.length; i++) {
        if (i % 8 == 0) { // Ocho columnas por fila.
            var fila = document.createElement('div');
            fila.setAttribute('id', Math.floor(i / 4));
            fila.setAttribute('class', 'fila');
            principal.appendChild(fila);
        }

        var celda = document.createElement('div');
        celda.setAttribute('class', 'celda');

        var item = info.photos.photo[i];

        // Cogemos la imagen en formato miniatura.
        var url = 'https://farm' + item.farm + ".staticflickr.com/" + item.server + '/' + item.id + '_' + item.secret + '_t.jpg';

        var dt = new Date(item.datetaken);
        var dia = dt.getDate();
        var mes = dt.getMonth();
        var anno = dt.getFullYear();
        var fecha = dia + "/" + mes + "/" + anno;

        celda.innerHTML +=
            "<div class='contenedor_imagen' class='contenedor_imagen'>" +
            "<img class='foto' src=" + url + " onclick='zoom(this.src)'>" +
            "</div>" +
            "<div class='contenedor_datos'>" +
            "<h4 class='nombre_real'>" + "Cargando Nombre Real" + "</h4>" +
            "<h4 class='username' onclick='timeline(this.parentElement.lastChild.innerHTML)'>" + item.username + "</h4>" +
            "<h4 class='datetaken'>" + fecha + "</h4>" +
            "<h1 class='userid'>" + item.owner + "</h1>" +
            "</div>";

        fila.appendChild(celda);
        contenedor_datos = celda.lastChild;
        addNombre(contenedor_datos); // Llamada para cargar el nombre real del usuario
    }
}

/**
 * Función que crea un modal con la imagen en tamaño grande cuando se hace click en su miniatura.
 * @param {String} img Url de la imagen a ampliar. 
 */
function zoom(img) {
    img = img.substring(0, img.length - 5) + 'b.jpg'; // Cambiamos el t.jpg por b.jpg

    // Creamos el modal
    var modal = document.getElementById('modalZoom');
    var modalImg = document.getElementById("imagen_ampliada");
    modal.style.display = "block";
    modalImg.src = img;

    // Se cierra apretando a la X de la esquina superior derecha
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }
}

/**
 * Consigue el nombre real del usuario a partir del nombre de usuario de Flickr.
 * @param {div} celda div con los datos obtenidos en la anterior petición.
 */
function addNombre(celda) {
    var nick = celda.lastChild.innerHTML; // Nombre del usuario
    var nombre_real = celda.childNodes[0];

    peticion_nombre = 'https://api.flickr.com/services/rest/?method=flickr.people.getInfo&api_key=' +
        api_key + '&user_id=' + nick + '&format=json&nojsoncallback=1';

    $.getJSON(peticion_nombre, function(data) {
        nombre_real.innerHTML = data.person.realname._content;
    })
}

/**
 * Rellena la cabecera de la página, con el nombre del usuario, su avatar y la checkbox.
 */
function mostrar_cabecera() {
    var peticion = 'https://api.flickr.com/services/rest/?method=flickr.people.getInfo&api_key=' +
        api_key + '&user_id=' + user_id + '&format=json&nojsoncallback=1';
    var nombre;
    var iconserver;
    var iconfarm;

    $.getJSON(peticion, function(info) {
        nombre = info.person.realname._content;
        iconserver = info.person.iconserver;
        iconfarm = info.person.iconfarm;

        // No siempre obtenemos el avatar en la petición, así que por si sale mal cogemos la imagen por defecto de Flickr
        // Sacado de la especificación de la API https://www.flickr.com/services/api/misc.buddyicons.html
        var url = 'https://www.flickr.com/images/buddyicon.gif';
        if (iconfarm > 0 && iconserver > 0) { // Si no sale mal
            var url = 'http://farm' + iconfarm + '.staticflickr.com/' + iconserver + '/buddyicons/' + user_id + '.jpg';
        }

        var cabecera = document.getElementById('cabecera');
        cabecera.innerHTML = "<div class='avatar'><img id='avatar' src=" + url + " ></div><div class='subcabecera'><h3 class='texto'>" +
            nombre + "</h3><input type='checkbox' onchange='refrescar()' id ='check' value='Familia'>Sólo Familiares o Amigos</div>";
    });
}

/**
 * Recarga las celdas de la tabla principal cada vez que se cambia el estado de la checkbox de "sólo amigos y familia".
 */
function refrescar() {
    checked = document.getElementById("check").checked;
    main();
}

/**
 * Muestra las fotos de este año (por defecto) o del anterior (si se selecciona en el timeline) de un usuario
 * (seleccionado haciendo click en su nombre de usuario en la tabla de la página) colocadas en una estructura
 * tipo timeline (con el plugin Albe Timeline), colocado en un modal sobre la página.
 * @param {String} element id del usuario del que queremos su timeline.
 */
function timeline(element) {
    var data = []; // Estructura de datos para el plugin.

    var peticion = "https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=" + api_key +
        "&user_id=" + element + "&min_taken_date=" + fecha_min + "&max_taken_date=" + fecha_max +
        "&extras=date_taken&format=json&nojsoncallback=1";

    // Guardamos el id del usuario por si queremos cambiar de año en el timeline.
    document.getElementById('user_tl').innerHTML = element;

    $.getJSON(peticion, function(info) {

        for (var i = 0; i < info.photos.photo.length; i++) {
            var elemento = info.photos.photo[i];
            var url = 'https://farm' + elemento.farm + ".staticflickr.com/" + elemento.server +
                '/' + elemento.id + '_' + elemento.secret + '_m.jpg'; // Las fotos las mostramos en tamaño medio.
            var fecha = elemento.datetaken.substring(0, 10); // Obtenemos la fecha en el formato requerido.

            // Colocamos la información en un item con el formato especificado en el plugin. En el comentario guardamos el id de la foto, de forma temporal.
            var item = { time: fecha, body: [{ tag: "img", attr: { src: url, cssclass: "img-responsive" } }, { tag: "p", content: elemento.id }] };

            // Añadimos cada item en la estructura de datos para el plugin.
            data.push(item);
        }

        // Llamamos al plugin.
        $(document).ready(function() {
            $('#myTimeline').albeTimeline(data, {
                sortDesc: false // Ordenamos en formato ascendente (01 de enero a 31 de diciembre)
            });
            $.when(mostrar_modal_timeline()).then(actualizar_comentarios());
            // Actualizamos los campos de los comentarios cuando se muestre el timeline.
        });
    });
}

/**
 * Obtenemos todos los tags de la clase comentario y los añadimos en sus espacios correspondientes.
 */
function actualizar_comentarios() {
    // Hemos tenido que modificar el código del plugin para obtener los campos de comentarios (añadiéndoles una clase),
    // ya que no era posible acceder a ellos de otra forma que hayamos encontrado. A estas alturas sólo contienen el id de la foto.
    var list = document.getElementsByClassName('comentario');
    for (var i = 1; i < list.length; i += 2) {
        addComentario(list[i]);
    }
}

/**
 * Obtenemos los comentarios de una foto y los colocamos en su ubicación correspondiente dentro del timeline.
 * @param {HTMLParagraphElement} comentario Párrafo con la id de la foto donde pondremos sus comentarios en el timeline.
 */
function addComentario(comentario) {
    var id = comentario.innerHTML; // Obtenemos el id de la foto para la petición de sus comentarios.
    peticion_comentarios = 'https://api.flickr.com/services/rest/?method=flickr.photos.comments.getList&api_key=' +
        api_key + '&photo_id=' + id + '&format=json&nojsoncallback=1';

    $.getJSON(peticion_comentarios, function(data) {
        lista_comentarios = data.comments; // Conseguimos la lista de comentarios.
        if (Object.keys(lista_comentarios).length > 1) { // Tiene comentarios
            comentario.innerHTML = "";
            for (var i = 0; i < data.comments.comment.length; i++) { // Para cada comentario
                // Añadimos el nombre del usuario que ha hecho el comentario.
                comentario.innerHTML += '<b>' + data.comments.comment[i].realname + ': </b>';
                comentario.innerHTML += data.comments.comment[i]._content + '<br><br>'; // Añadimos el comentario.
            }
        } else { // Si no tiene comentarios
            comentario.innerHTML = "Foto sin comentarios";
        }
    })
}

/**
 * Activa el modal en el que se muestra el timeline generado.
 */
function mostrar_modal_timeline() {
    var modal = document.getElementById('modalTimeline');
    modal.style.display = "block";

    // Para cerrar hacemos click en la X de la esquina superior derecha.
    var span = document.getElementsByClassName("close")[1];
    span.onclick = function() {
        modal.style.display = "none";
    }
}

/**
 * Función que se activa al cambiar el año del que queremos el timeline.
 */
function cambiar_Fecha() {
    if (cambio) {
        fecha_min = "2019-01-01";
        fecha_max = "2019-12-31";
        document.getElementById('cambiar_fecha').innerHTML = "Cambiar a Año Anterior";
    } else {
        document.getElementById('cambiar_fecha').innerHTML = "Cambiar a Año Actual";
        fecha_min = "2018-01-01";
        fecha_max = "2018-12-31";
    }
    cambio = !cambio;

    // Cerramos el modal y eliminamos el timeline.
    var contenedor = document.getElementById('modalTimeline');
    contenedor.style.display = "none";
    contenedor.removeChild(document.getElementById('myTimeline'));

    // Generamos nueva timeline.
    var nueva_tl = document.createElement('div');
    nueva_tl.setAttribute('id', 'myTimeline');
    contenedor.appendChild(nueva_tl);

    // Rellenamos la nueva timeline.
    timeline(document.getElementById('user_tl').innerHTML);
}