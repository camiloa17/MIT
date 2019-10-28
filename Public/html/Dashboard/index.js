/*      ESTA FUNCION SE REEMPLAZA POR UN FETCH LUEGO        */
function appendNav() {
  $.get("./sidenav/sidenav.html", function(data) {
    $("#sidenav").append(data);
  });
}

appendNav();

function appendExamenes() {
  $.get("./examenes/examenes.html", function(data) {
    $("#contenido").append(data);
  });  
}

appendExamenes();




