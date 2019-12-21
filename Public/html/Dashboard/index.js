/*      ESTA FUNCION SE REEMPLAZA POR UN FETCH LUEGO        */
function appendNav() {
  $.get("./html/dashboard/sidenav/sidenav.html", function(data) {
    $("#sidenav").append(data);
  });
}

appendNav();

let eliminarExamenLista;
let examenAEliminar;

// function appendExamenes() {
//   $.get("./html/dashboard/examenes/examenes.html", function(data) {
//     $("#contenido").append(data);
//   });  
//   $.get("./html/dashboard/fechas/fechas.html", function(data) {
//     $("#contenido").append(data);
//   });  
// }

// appendExamenes();