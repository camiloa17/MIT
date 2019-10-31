const ulCollapsibleExamenes = $("#collapsibleExamenes");
const listaMateria = $("#listaMateria");
const listaTipo = $("#listaTipo");

const agregarTipo = $("#agregarTipo");
const botonesTipo = $("#botonesTipo");

/* INICIALIZACION: */
ulCollapsibleExamenes.collapsible({
  onOpenStart: function() {
    ulCollapsibleExamenes.find('li.active').attr("id") == "collapsibleTipo"
      ? removeAreaEdicionTipo()
      : null;
  },
  /* Cada vez que se abre una solapa del acordeon, se trae la información de la base de datos */
  onOpenEnd: function() {
    ulCollapsibleExamenes.find("li.active").attr("id") == "collapsibleMateria"
      ? getMateria()
      : null;
    ulCollapsibleExamenes.find("li.active").attr("id") == "collapsibleTipo"
      ? getChipMateria()
      : null;
    ulCollapsibleExamenes.find("li.active").attr("id") == "collapsibleNivel"
      ? getMateria()
      : null;
  }
});


//////////////////////////////////////////////////////////////////////  MATERIA  //////////////////////////////////////////////////////////////////////
$("#agregarMateria").on("keypress", function(e) {
  agregarNuevoElemento(e, listaMateria);
});
$("#agregarTipo").on("keypress", function(e) {
  agregarNuevoElemento(e, listaTipo);
});

function agregarNuevoElemento(e, lista) {
  if (e.which == 13) {
    const elemento = {
      uuid: uuid(),
      nombre: e.target.value,
      activo: 1,
      mostrar_cliente: 0,
      edita_user_secundario: 0
    };

    cambiosPendientesEnDb.push({ add: elemento });
    seGeneroUnCambio();

    lista.append(liMateriaTipoTemplate(elemento));
    asignarFuncionalidadBotones(elemento);
    $(this).val("");
  }
}

/* EVENTOS: botones guardar y reset en materias */
$("#guardarMateria").on("click", () => {
  generarEstoadoLista(listaMateria);
  seGuardaOReseteaCambio();
});

$("#resetMateria").on("click", () => {
  getMateria();
  seGuardaOReseteaCambio();
});


function seGeneroUnCambio() {
  ulCollapsibleExamenes.removeClass("collapsible");
  $("#guardarMateria").removeClass("disabled");
  $("#resetMateria").removeClass("disabled");
}

function seGuardaOReseteaCambio() {
  ulCollapsibleExamenes.addClass("collapsible");
  $("#guardarMateria").addClass("disabled");
  $("#resetMateria").addClass("disabled");
}

/* Habilitar Sortabilidad en listas */
function habilitaSortable(lista) {
  lista.sortable({
    handle: ".move-button",
    tolerance: "pointer",
    placeholder: "white",
    connectWith: lista,

    start: function(e, ui) {
      // creates a temporary attribute on the element with the old index
      $(this).attr("data-previndex", ui.item.index());

      ui.placeholder.height(
        ui.helper[0].scrollHeight * 1.15
      ); /* 1.15 para tener en cuenta el lugar del borde del li al moverse y no se generen saltos visuales*/
    },

    update: function(e, ui) {
      // gets the new and old index then removes the temporary attribute
      var newIndex = ui.item.index();
      var oldIndex = $(this).attr("data-previndex");
      var element_id = ui.item.attr("id");
      // console.log(
      //   "id of Item moved = " +
      //     element_id +
      //     " old position = " +
      //     oldIndex +
      //     " new position = " +
      //     newIndex
      // );
      $(this).removeAttr("data-previndex");
      //Si no se movio de lugar, no se genera cambio
      !(newIndex === oldIndex) ? seGeneroUnCambio() : null;
    }

    // stop: function(e,ui) {}
  });
  lista.disableSelection();
}
habilitaSortable(listaMateria);
habilitaSortable(listaTipo);

/* LI preset de las materias*/
const liMateriaTipoTemplate = materia => {
  return `
    <li uuid="${materia.uuid}" activo="${materia.activo}" mostrar_cliente="${
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
              materia.uuid
            }_delete" class="material-icons-outlined azul-texto right button-opacity ">delete</i>
        </a>

        <a  href="#!" class="secondary-content check">
            <i id="${
              materia.uuid
            }_visibility" class="material-icons-outlined azul-texto right button-opacity">${
    materia.mostrar_cliente ? "visibility" : "visibility_off"
  }</i>
        </a>
    </li>`;
};

/* Configuracion de botones de cada elemento LI de la lista de materias */
function asignarFuncionalidadBotones(elemento) {
  /* Chequear si esta bien borrar el li, o si debo poner activo=false*/
  $(`#${elemento.id}_delete`).on("click", () => {
    $(`#${elemento.id}`).remove();
    cambiosPendientesEnDb.push({ remove: elemento.id });
    seGeneroUnCambio();
  });

  $(`#${elemento.id}_visibility`).on("click", function() {
    seGeneroUnCambio();
    /* CAMBIOS VISUALES */
    $(`#${elemento.id} input`).toggleClass("inputInactivo");

    $(`#${elemento.id}_visibility`).text(
      $(this)
        .text()
        .trim() == "visibility"
        ? "visibility_off"
        : "visibility"
    );

    /* CAMBIO BOOLEANO EN ATRIBUTO DEL LI */
    $(`#${elemento.id}`).attr("mostrar_cliente", (index, attr) =>
      attr == 1 ? 0 : 1
    );
  });
}

/* Renderizar Materias en la lista a partir del preset */
function visualizarLista(data, lista) {
  let dataOrdenada = JSON.parse(JSON.stringify(data));

  dataOrdenada.sort((a, b) => (a.orden > b.orden ? 1 : -1));
  lista.empty();

  dataOrdenada.forEach(elemento => {
    /*Muestra solo las materias activos*/
    elemento.activo ? lista.append(liMateriaTipoTemplate(elemento)) : null;

    asignarFuncionalidadBotones(elemento);
  });
}

function showAreaEdicionTipo() {
  listaTipo.removeClass("hidden");
  botonesTipo.removeClass("hidden");
  agregarTipo.removeClass("hidden");
}

function removeAreaEdicionTipo() {
  listaTipo.addClass("hidden");
  botonesTipo.addClass("hidden");
  agregarTipo.addClass("hidden");
}

///////////////////////////////////////////////////////////////////////////////////////////////////
const servidor = ".";

/* Consulta al servidor la lista de materias en la base de datos */
async function getMateria() {
  try {
    const response = await fetch(servidor + "/materia");
    const data = await response.json();
    visualizarLista(data, listaMateria);
  } catch (err) {
    console.log(err);
  }
}

async function getChipMateria() {
  listaTipo.empty();
  try {
    const response = await fetch(servidor + "/materia");
    const data = await response.json();
    visualizarChipMateria(data);
  } catch (err) {
    console.log(err);
  }
}

async function getTipo(materiaUuid) {
  try {
    const response = await fetch(servidor + `/tipo/${materiaUuid}`);
    const data = await response.json();
    showAreaEdicionTipo();
    visualizarLista(data, listaTipo);
  } catch (err) {
    console.log(err);
  }
}

async function getNivel() {
  console.log("getting nivel");
}

//////////////////////////////////////////////////////////////////////  TIPO  //////////////////////////////////////////////////////////////////////

$("#seleccioneMateriaEnTipo").selectable({
  filter: ":not(ul)",

  stop: (event, ui) => {
    /* Evita que se seleccionen multiples chips. Quedara solo seleccionado el primero */
    $(event.target)
      .children(".ui-selected")
      .not(":first")
      .removeClass("ui-selected");

    /*Obtengo el uuid del elemento seleeccionado */
    let idSelected = $(event.target)
      .children(".ui-selected")
      .attr("uuid");

    /*Si selecciono un chip valido, obtengo el id y mando a buscar info a la DB */
    idSelected ? getTipo(idSelected) : removeAreaEdicionTipo();
  }
});

const chipTemplate = elemento => {
  return `
  <li uuid="${elemento.uuid}" class="chip">${elemento.nombre}</li>`;
};

function visualizarChipMateria(data) {
  let dataOrdenada = JSON.parse(JSON.stringify(data));

  dataOrdenada.sort((a, b) => (a.orden > b.orden ? 1 : -1));

  $("#seleccioneMateriaEnTipo").empty();

  dataOrdenada.forEach(materia => {
    $("#seleccioneMateriaEnTipo").append(chipTemplate(materia));
  });
}

function uuid() {
  var uuid = "",
    i,
    random;
  for (i = 0; i < 32; i++) {
    random = (Math.random() * 16) | 0;

    if (i == 8 || i == 12 || i == 16 || i == 20) {
      uuid += "-";
    }

    uuid += (i == 12 ? 4 : i == 16 ? (random & 3) | 8 : random).toString(16);
  }
  return uuid;
}

// function mostrarProgressBar(elemento) {
//   elemento.append(`<div class="progress ">
//                      <div class="indeterminate"></div>
//                                 </div>`);
// }

/* Hace una lectura del estado actual de los elementos de la lista */
function generarEstoadoLista(lista) {
  let elemento = [];
  var orden = 1;

  lista.find(`li`).each(function() {
    elemento.push({
      uuid: $(this).attr("uuid"),
      orden: orden++,
      nombre: $(this)
        .find("input")
        .val(),
      activo: parseInt($(this).attr("activo")),
      mostrar_cliente: parseInt($(this).attr("mostrar_cliente")),
      edita_user_secundario: 0
    });
  });
  elemento.sort((a, b) => (a.uuid > b.uuid ? 1 : -1));

  return elemento;
}

let cambiosPendientesEnDb = [];
let add = [];
let remove = [];
