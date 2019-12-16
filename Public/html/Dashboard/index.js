/*      ESTA FUNCION SE REEMPLAZA POR UN FETCH LUEGO        */
function appendNav() {
  $.get("./html/dashboard/sidenav/sidenav.html", function(data) {
    $("#sidenav").append(data);
  });
}

appendNav();

// SI SE CAE UUIDV4 DE BROWSERIFY, HABILTO ESTE DE BACKUP
// function uuidv4() {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//     var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//     return v.toString(16);
//   });
// }


// function appendExamenes() {
//   $.get("./html/dashboard/examenes/examenes.html", function(data) {
//     $("#contenido").append(data);
//   });  
//   $.get("./html/dashboard/fechas/fechas.html", function(data) {
//     $("#contenido").append(data);
//   });  
// }

// appendExamenes();