//////////////////////////////////////////////////////////////////////  MATERIA  //////////////////////////////////////////////////////////////////////
let listaMateria = $("#lista-materia");

/* INICIALIZACION: Cada vez que se abre una solapa del acordeon, se trae la información de la base de datos */
$("#collapsibleExamenes").collapsible({
  onOpenEnd: function() {
    $("#collapsibleExamenes li.active").attr("id") == "collapsibleMateria"
      ? getMateria()
      : null;
    $("#collapsibleExamenes li.active").attr("id") == "collapsibleTipo"
      ? getTipo()
      : null;
    $("#collapsibleExamenes li.active").attr("id") == "collapsibleNivel"
      ? getNivel()
      : null;
  }
});

/* EVENTOS: enter en input de Agregar Materia */
$("#agregarMateria").on("keypress", function(e) {
  if (e.which == 13) {
    const materia = {
      id: 56 /* Aqui generaremos uuid */,
      orden: 0 /* Dejar en 0. Se genera automaticamente a la hora de guardar */,
      nombre: e.target.value,
      imagen: "",
      activo: 1,
      mostrar_cliente: 0,
      edita_user_secundario: 0
    };

    listaMateria.append(liMateria(materia));
    asignarFuncionalidadBotones(materia);
    $(this).val("");
  }
});


/* EVENTOS: botones guardar y reset en materias */
$("#guardarMateria").on("click", () => generarMateria());
$("#resetMateria").on("click", () => getMateria());

/* Habilita sort en la lista de materias*/
listaMateria.sortable({
  handle: ".move-button",
  tolerance: "pointer",
  placeholder: "white",
  connectWith: "#lista-materia",

  start: function(e, ui) {
    ui.placeholder.height(
      ui.helper[0].scrollHeight * 1.02
    ); /* 1.02 para tener en cuenta el lugar del borde del li al moverse */
  }
});

listaMateria.disableSelection();


/* LI preset de las materias*/
const liMateria = materia => {
  return `
    <li id="${materia.id}" activo="${materia.activo}" mostrar_cliente="${
    materia.mostrar_cliente
  }" class="collection-item grey lighten-4 margin-bottom-0-4">
        <a href="#!" class="secondary-content left">
            <i class="material-icons-outlined azul-texto left button-opacity move-button ">import_export</i>
        </a>

        <input class="browser-default weight500 ${
          !materia.mostrar_cliente ? "inputInactivo" : null
        }" type="text" value="${materia.nombre}">

        <a  href="#!" class="secondary-content delete red-hover">
            <i id="${
              materia.id
            }_delete" class="material-icons-outlined azul-texto right button-opacity ">delete</i>
        </a>

        <a  href="#!" class="secondary-content check">
            <i id="${
              materia.id
            }_visibility" class="material-icons-outlined azul-texto right button-opacity">${
    materia.mostrar_cliente ? "visibility" : "visibility_off"
  }</i>
        </a>
    </li>`;
};


/* Configuracion de botones de cada elemento LI de la lista de materias */
function asignarFuncionalidadBotones(materia) {
    /* Chequear si esta bien borrar el li, o si debo poner activo=false*/
    $(`#${materia.id}_delete`).on("click", () =>
      $(`#lista-materia #${materia.id}`).remove()
    );
  
    $(`#${materia.id}_visibility`).on("click", function() {
      /* CAMBIOS VISUALES */
      $(`#${materia.id} input`).toggleClass("inputInactivo");
  
      $(`#${materia.id}_visibility`).text(
        ($(this).text().trim() == "visibility") ? "visibility_off" : "visibility"
      );
  
      /* CAMBIO BOOLEANO EN ATRIBUTO DEL LI */
      $(`#${materia.id}`).attr("mostrar_cliente", (index, attr) =>
        attr == 1 ? 0 : 1
      );
    });
}


/* Renderizar Materias en la lista a partir del preset */
function visualizarMaterias(data) {
  console.log(data);
  let dataOrdenada = JSON.parse(JSON.stringify(data));

  dataOrdenada.sort((a, b) => (a.orden > b.orden ? 1 : -1));

  listaMateria.empty();

  dataOrdenada.forEach(materia => {
    /*Muestra solo las materias activos*/
    materia.activo ? listaMateria.append(liMateria(materia)) : null;

    asignarFuncionalidadBotones(materia);
  });
}



///////////////////////////////////////////////////////////////////////////////////////////////////
const servidor = ".";

/* Consulta al servidor la lista de materias en la base de datos */
async function getMateria() {
  try {
    const response = await fetch(servidor + "/materia");
    const data = await response.json();
    visualizarMaterias(data);
  } catch (err) {
    console.log(err);
  }
}

/* Hace una lectura del estado actual de los elementos de la lista */
function generarMateria() {
  let materia = [];
  var orden = 1;

  $("#lista-materia li").each(function() {
    materia.push({
      id: parseInt($(this).attr("id")),
      orden: orden++,
      nombre: $(this)
        .find("input")
        .val(),
      imagen: "",
      activo: parseInt($(this).attr("activo")),
      mostrar_cliente: parseInt($(this).attr("mostrar_cliente")),
      edita_user_secundario: 0
    });
  });
  materia.sort((a, b) => (a.id > b.id ? 1 : -1));
  console.log(materia);
  return materia;
}

async function getTipo() {
  console.log("geting tipo");
}

async function getNivel() {
  console.log("geting nivel");
}


//////////////////////////////////////////////////////////////////////  TIPO  //////////////////////////////////////////////////////////////////////

