/*       MATERIALIZE  INICIALIZACION    */
$(".sidenav").sidenav(); 

$('#tabExamenes').on('click', () => {
    $("#contenido").empty();
    $.get("./html/dashboard/examenes/examenes.html", function(data) {
        $("#contenido").append(data);
      });  
})

$('#tabFechas').on('click', () => {
    $("#contenido").empty();
    $.get("./html/dashboard/fechas/fechas.html", function(data) {
        $("#contenido").append(data);
      }); 
})


