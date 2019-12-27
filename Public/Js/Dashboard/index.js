/*      ESTA FUNCION SE REEMPLAZA POR UN FETCH LUEGO        */
function appendNav() {
  $.get("/html/Dashboard/sidenav/sidenav.html", function(data) {
    $("#sidenav").append(data);
  });
}
appendNav();

function appendExamenes() {
  $.get("/html/Dashboard/examenes/examenes.html", function(data) {
    $("#contenido").append(data);
  });  
  $.get("/html/dashboard/fechas/fechas.html", function(data) {
    $("#contenido").append(data);
  });  
}

appendExamenes();