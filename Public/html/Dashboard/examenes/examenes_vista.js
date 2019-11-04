const ulCollapsibleExamenes = $('#collapsibleExamenes');
const listaMateria = $('#listaMateria');
const listaTipo = $('#listaTipo');
const listaNivel = $('#listaNivel');

const agregarMateria = $('#agregarMateria');
const botonesMateria = $('#botonesMateria');
const botonGuardarMateria = $('#guardarMateria');
const botonResetMateria = $('#resetMateria');
const estadoMateria = $('#estadoMateria') 

const chipsMateriaEnTipo = $('#chipsMateriaEnTipo');
const agregarTipo = $('#agregarTipo');
const botonesTipo = $('#botonesTipo');
const botonGuardarTipo = $('#guardarTipo');
const botonResetTipo = $('#resetTipo');
const estadoTipo = $('#estadoTipo')

const chipsMateriaEnNivel = $('#chipsMateriaEnNivel');
const chipsTipoEnNivel = $('#chipsTipoEnNivel');
const chipsNivelEnNivel = $('#chipsNivelEnNivel');

const botonesNivel = $('#botonesNivel');
const guardarNivel = $('#guardarNivel');
const resetNivel = $('#resetNivel');
const estadoNivel = $('#estadoNivel');


//////////////////// INICIALIZACION ACORDEON
ulCollapsibleExamenes.collapsible({
  onOpenStart: function() {
    // Hasta que no selecciono un chip en tipo, no muestro ni lista ni botones (se usa cuando entrate a tipo, fuiste a materia o nivel y volves a tipo)
    ulCollapsibleExamenes.find("li.active").attr("id") == "collapsibleTipo"
      ? removeAreaEdicionTipo()
      : null;
  },

  // Cada vez que se abre una solapa del acordeon, se trae la información de la base de datos
  onOpenEnd: function() {
    ulCollapsibleExamenes.find("li.active").attr("id") == "collapsibleMateria"
      ? getMateria()
      : null;
    ulCollapsibleExamenes.find("li.active").attr("id") == "collapsibleTipo"
      ? getChipMateria(chipsMateriaEnTipo, listaTipo)
      : null;
    ulCollapsibleExamenes.find("li.active").attr("id") == "collapsibleNivel"
      ? getChipMateria(chipsMateriaEnNivel, chipsTipoEnNivel)
      : null;
  }
});

//////////////////// AGREGAR NUEVO ELEMENTO A LA LISTA

inicializarNuevoInputEnLi(listaMateria, agregarMateria);
inicializarNuevoInputEnLi(listaTipo, agregarTipo);

function inicializarNuevoInputEnLi(lista, input) {
  input.on("keypress", function(e) {
    agregarNuevoElemento(e, lista, input);
  });
}

function agregarNuevoElemento(e, lista, input) {
  if (e.which == 13 && e.target.value.length > 0) {
    const elemento = {
      uuid: uuid(),
      nombre: e.target.value,
      activo: 1,
      mostrar_cliente: 0,
      edita_user_secundario: 0
    };
    colaAgregar.push(elemento.uuid);
    seGeneroUnCambioEnLista(lista);
    seGeneroCambioOrden();

    lista.append(liMateriaTipoTemplate(elemento));
    asignarFuncionalidadBotonesLista(elemento, lista);

    input.val("");
  }
}

////////////////////  BOTONES guardar y reset
inicializarBotonGuardar(botonGuardarMateria, listaMateria);
inicializarBotonGuardar(botonGuardarTipo, listaTipo);

function inicializarBotonGuardar(boton, lista) {
  boton.on("click", () => {
    let elementos = generarEstoadoLista(lista);

    let cambiosAGuardar = generarObjetoConCambios(elementos, lista);

    console.log("Cambios a Guardar", cambiosAGuardar);

    switch (lista) {
      case listaMateria:
        updateMateria(cambiosAGuardar);
        break;
      case listaTipo:
        updateTipo(cambiosAGuardar);
        break;
    }

    seGuardaOResetea(lista);
    // (retornarPertenenciaTablaDb(lista) === 'tipo') ? habilitarSelectable(chipsMateriaEnTipo) : null;    borrar
  });
}

inicializarBotonReset(botonResetMateria, listaMateria);
inicializarBotonReset(botonResetTipo, listaTipo);

function inicializarBotonReset(boton, lista) {
  boton.on("click", () => {
    getMateria();
    seGuardaOResetea(lista);
    // (retornarPertenenciaTablaDb(lista) === 'tipo') ? habilitarSelectable(chipsMateriaEnTipo) : null;    borrar
  });
}

////////////////////  Acciones visuales al generar cambios en listas
function seGeneroUnCambioEnLista(lista) {
  switch (lista) {
    case listaMateria:
      habilitarBotonera(lista);
      deshabilitarAcordeon();
      break;
    case listaTipo:
      habilitarBotonera(lista);
      deshabilitarAcordeon();
      disableSelectable(chipsMateriaEnTipo);
      aplicarClaseNoSelectableChips(chipsMateriaEnTipo);
      break;
  }
}

function aplicarClaseNoSelectableChips(ulChips) {
  ulChips.find("li").each(function() {
    $(this).addClass("noSelectable");
  });
}

function removerClaseNoSelectableChips(ulChips) {
  ulChips.find("li").each(function() {
    $(this).removeClass("noSelectable");
  });
}

function habilitarBotonera(lista) {
  switch (lista) {
    case listaMateria:
      botonGuardarMateria.removeClass("disabled");
      botonResetMateria.removeClass("disabled");
      break;
    case listaTipo:
      botonGuardarTipo.removeClass("disabled");
      botonResetTipo.removeClass("disabled");
      break;
  }
}

//////////////////// Funcion que me indica la tabla de la base de datos a la cual pertenece una lista que está pendiente de guardaado de cambios
function retornarPertenenciaTablaDb(lista) {
  switch (lista) {
    case listaMateria:
      return "materia";
    case listaTipo:
      return "tipo";
    case listaNivel:
      return "nivel";
    default:
      return null;
  }
}



////////////////////  Acciones visuales al guardar o resetear cambios en listas
function seGuardaOResetea(lista) {
  switch (lista) {
    case listaMateria:
      habilitarAcordeon();
      deshabilitarBotonera(lista);
      reiniciarColasDeCambio(); // ESTO DEBE OCURRIR SI RECIBO UN OK DE GUARDADO DESDE EL SERVER
      break;
    case listaTipo:
      habilitarAcordeon();
      deshabilitarBotonera(lista);
      reiniciarColasDeCambio(); // ESTO DEBE OCURRIR SI RECIBO UN OK DE GUARDADO DESDE EL SERVER
      removerClaseNoSelectableChips(chipsMateriaEnTipo);
      enableSelectable(chipsMateriaEnTipo);
      break;
    case listaNivel:
      break;
    default:
      return null;
  }
}

function deshabilitarBotonera(lista) {
  switch (lista) {
    case listaMateria:
      botonGuardarMateria.addClass("disabled");
      botonResetMateria.addClass("disabled");
      break;
    case listaTipo:
      botonGuardarTipo.addClass("disabled");
      botonResetTipo.addClass("disabled");
      break;
  }
}

////////////////////  Cuando hay cambios pendientes se deshabilita la posibilidad de navegar por el acordeon
function habilitarAcordeon() {
  ulCollapsibleExamenes.addClass("collapsible");
}

function deshabilitarAcordeon() {
  ulCollapsibleExamenes.removeClass("collapsible");
}

////////////////////  SORTABLE en las listas
habilitaSortable(listaMateria);
habilitaSortable(listaTipo);

function habilitaSortable(lista) {
  lista.sortable({
    handle: ".move-button",
    tolerance: "pointer",
    placeholder: "white",
    connectWith: lista,

    start: function(e, ui) {
      // creates a temporary attribute on the element with the old index
      $(this).attr("data-previndex", ui.item.index());

      ui.placeholder.height(ui.helper[0].scrollHeight * 1.15); // 1.15 para tener en cuenta el lugar del borde del li al moverse y no se generen saltos visuales
    },

    update: function(e, ui) {
      // gets the new and old index then removes the temporary attribute
      var newIndex = ui.item.index();
      var oldIndex = $(this).attr("data-previndex");
      $(this).removeAttr("data-previndex");
      seGeneroCambioOrden();

      //Si no se movio de lugar, no se genera ningun cambio
      !(newIndex === oldIndex) ? seGeneroUnCambioEnLista(lista) : null;
    }
  });
}

////////////////////  SELECTABLE en los chips
habilitarSelectable(chipsMateriaEnTipo);
habilitarSelectable(chipsMateriaEnNivel);
habilitarSelectable(chipsTipoEnNivel);
habilitarSelectable(chipsNivelEnNivel);

function habilitarSelectable(ulChips) {
  ulChips.selectable({
    // Cuando selecciono un chip y tengo cambios pendientes, asigno una clase noSelectable a los chips y debo ejecutar listaX.selectable("disable")
    cancel: ".noSelectable",

    stop: (event, ui) => {
      // Evito que se seleccionen multiples chips. Quedará solo seleccionado el primero si hay una selección de más de un chip
      $(event.target)
        .children(".ui-selected")
        .not(":first")
        .removeClass("ui-selected");

      // Obtengo el uuid del elemento seleccionado
      let idSelected = $(event.target)
        .children(".ui-selected")
        .attr("id");

      // Si selecciono un chip vólido, obtengo el id y mando a buscar info a la DB, si no selecciono ningun chip escondo la lista y la botonera de guardar/reset
      (idSelected && ulChips === chipsMateriaEnTipo) ? getTipoEnTipo(idSelected) : null;
      (idSelected && ulChips === chipsMateriaEnNivel) ? getTipoEnNivel(idSelected) : null;
      (idSelected && ulChips === chipsTipoEnNivel) ? getNivelEnNivel(idSelected) : null;

    }
  });
}

/*
function chipPresionado(ulChips, idSelected) {
  (idSelected && ulChips === chipsMateriaEnTipo) ? getTipo(idSelected) : removeAreaEdicionTipo();
  (idSelected && ulChips === chipsMateriaEnNivel) ? getTipo(idSelected) : removeAreaEdicionTipo(); 
}
*/

////////////////////  Habilita o deshabilita la posibilidad de presionar un chip (se deshabilita cuando hay camibos pendientes)

function enableSelectable(ulChips) {
  ulChips.selectable("enable");
}

function disableSelectable(ulChips) {
  ulChips.selectable("disable");
}



//////////////////// PRESETS HTML lista
const liMateriaTipoTemplate = materia => {
  return `
    <li id="${materia.uuid}" activo="${materia.activo}" mostrar_cliente="${
    materia.mostrar_cliente
  }" dirty_input="0" dirty_mostrar_cliente="0" class="collection-item grey lighten-4 margin-bottom-0-4">
        
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

//////////////////// Configuracion de botones de cada elemento LI de la lista
function asignarFuncionalidadBotonesLista(elemento, lista) {
  $(`#${elemento.uuid}_delete`).on("click", () => {
    $(`#${elemento.uuid}`).remove();

    ingresarColaRemover(elemento.uuid);
    seGeneroUnCambioEnLista(lista);
    seGeneroCambioOrden();
  });

  $(`#${elemento.uuid} input`).on("change", function() {
    $(`#${elemento.uuid}`).attr("dirty_input", (index, attr) => 1);
    seGeneroUnCambioEnLista(lista);
  });

  $(`#${elemento.uuid}_visibility`).on("click", function() {
    seGeneroUnCambioEnLista(lista);

    // Si esta la visibilidad en false, el input se ve inactivo
    $(`#${elemento.uuid} input`).toggleClass("inputInactivo");

    // Cuando presiono boton visibilidad, cambia su icono
    $(`#${elemento.uuid}_visibility`).text(
      $(this)
        .text()
        .trim() == "visibility"
        ? "visibility_off"
        : "visibility"
    );

    // Si presioné el icono de visibilidad, cambio el atributo html mostrar_cliente y pongo en true el aviso que ocurrio un cambio
    $(`#${elemento.uuid}`).attr("mostrar_cliente", (index, attr) =>
      attr == 1 ? 0 : 1
    );
    $(`#${elemento.uuid}`).attr("dirty_mostrar_cliente", (index, attr) => 1);
  });
}

//////////////////// PRESETS HTML chip
const chipTemplate = elemento => {
  return `
  <li id="${elemento.uuid}" class="chip">${elemento.nombre}</li>`;
};

//////////////////// Renderiza elementos en la lista a partir del preset li HTML
function visualizarLista(data, lista) {
  let dataOrdenada = JSON.parse(JSON.stringify(data));

  dataOrdenada.sort((a, b) => (a.orden > b.orden ? 1 : -1));
  lista.empty();

  console.log("Data from DB", dataOrdenada);

  dataOrdenada.forEach(elemento => {
    // Muestro solo las materias activos
    elemento.activo ? lista.append(liMateriaTipoTemplate(elemento)) : null;

    asignarFuncionalidadBotonesLista(elemento, lista);
  });
}

//////////////////// Renderiza elementos chip a partir del preset chip HTML
function visualizarChipMateriaTipo(data, chipLista) {
  let dataOrdenada = JSON.parse(JSON.stringify(data));

  dataOrdenada.sort((a, b) => (a.orden > b.orden ? 1 : -1));
  chipLista.empty();

  dataOrdenada.forEach(elemento => {
    elemento.activo ? chipLista.append(chipTemplate(elemento)) : null;
  });
}

function visualizarNivel(data, chipLista) {
  let dataOrdenada = JSON.parse(JSON.stringify(data));

  dataOrdenada.sort((a, b) => (a.orden > b.orden ? 1 : -1));
  chipLista.empty();

  dataOrdenada.forEach(elemento => {
    elemento.activo ? chipLista.append(chipTemplate(elemento)) : null;
  });
}
//////////////////// Muestra o Esconde la lista y la botonera de Tipo dependiendo de si está seleccionado un chip Materia o no.
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

////////////////////  Se hace una lectura del estado actual de los elementos de la lista
function generarEstoadoLista(lista) {
  let elementos = [];
  var orden = 1;

  lista.find(`li`).each(function() {
    elementos.push({
      uuid: $(this).attr("id"),
      orden: orden++,
      nombre: $(this)
        .find("input")
        .val(),
      activo: parseInt($(this).attr("activo")),
      mostrar_cliente: parseInt($(this).attr("mostrar_cliente")),
      edita_user_secundario: 0
    });

    // Si hubo un cambio en mostrar_cliente, se agrega al array de cambios
    $(this).attr("dirty_mostrar_cliente") === "1"
      ? ingresarColaVisible($(this).attr("id"))
      : null;

    // Si se genera un cambio en el input, se agrega al array de cambios
    $(this).attr("dirty_input") === "1"
      ? ingresarNuevoInputValue($(this).attr("id"))
      : null;
  });
  elementos.sort((a, b) => (a.orden > b.orden ? 1 : -1));

  return elementos;
}

////////////////////  Se genera un objeto al presionar el boton guardar con los cambios realizados por el usuario desde el ultimo fetch de la DB
////////////////////  Este objeto se envia al servidor con los cambios realizados para que impacten en la DB.
function generarObjetoConCambios(elementos, lista) {
  return {
    agregar: colaAgregar,
    remover: colaRemover,
    cambioOrden: colaOrden,
    visibilidad_cambiar: colaVisible,
    inputValue_cambiar: colaInputValue,
    listaEstado: elementos,
    tabla: retornarPertenenciaTablaDb(lista),
    materia: retornarPertenenciaTablaDb(lista)
      ? chipsMateriaEnTipo.find(".ui-selected").attr("id")
      : null
  };
}

let colaAgregar = [];
let colaRemover = [];
let colaVisible = [];
let colaInputValue = [];
let colaOrden = false;

function reiniciarColasDeCambio() {
  colaAgregar = [];
  colaRemover = [];
  colaVisible = [];
  colaInputValue = [];
  colaOrden = false;
}

function ingresarColaRemover(uuid) {
  // Primero chequeo si el elemento que quiero eliminar esta agregado y no guardado . Si es asi, lo saco del array de elementos a agregar. Si ya esta en la DB, ahi si lo debo borrar.
  if (colaAgregar.includes(uuid)) {
    let temp = colaAgregar.filter(elemento => {
      return elemento !== uuid;
    });
    colaAgregar = temp;
  } else {
    colaRemover.push(uuid);
  }
}

function seGeneroCambioOrden() {
  // Si se generó un cambio en el orden de los elementos de la lista con sortable, agregado o borrado, se dispara este estado
  colaOrden = true;
}

function ingresarColaVisible(uuid) {
  // Primero chequeo si el elemento que quiero cambiar su estado visible esta agregado y no guardado . Si es asi, cuando se guarde, se guardará con el estado de visibilidad  ultimo al momento de guardar y no debo guardarlo en array de cola visible
  if (colaAgregar.includes(uuid)) {
    return;
  } else {
    colaVisible.push(uuid);
  }
}

function ingresarNuevoInputValue(uuid) {
  // Primero chequeo si el elemento que quiero cambiar su valor de input esta agregado y no guardado . Si es asi, cuando se guarde, se guardará con el input value ultimo al momento de guardar
  if (colaAgregar.includes(uuid)) {
    return;
  } else {
    colaInputValue.push(uuid);
  }
}

//////////////////// Obtiene un UUID (!!!!!!!! Con webpack debemos incluir un generador de uuid final.)
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

///////////////////////////////////////////////////////////////////////////////////////////////////

/* Consulta al servidor la lista de materias en la base de datos */
async function getMateria() {
  try {
    const response = await fetch("./materia");
    const data = await response.json();

    visualizarLista(data, listaMateria);
  } catch (err) {
    console.log(err);
  }
}

// Obtiene de DB los nombres de cada materia. Ingreso listaChips(en que # donde se ubicaran) y lislaLis (que # contiene la info que selecciono)
async function getChipMateria(listaChips, listaLis) {
  listaLis.empty(); //Limpio los lis antiguos
  try {
    const response = await fetch("./materia");
    const data = await response.json();

    visualizarChipMateriaTipo(data, listaChips);
  } catch (err) {
    console.log(err);
  }
}

async function getChipTipo(listaChips, listaLis) {
  listaLis.empty();
  try {
    const response = await fetch("./tipo");
    const data = await response.json();

    visualizarChipMateriaTipo(data, listaChips);
  } catch (err) {
    console.log(err);
  }
}

async function getTipoEnTipo(materiaId) {
  console.log(materiaId);
  try {
    const response = await fetch(`./tipo/${materiaId}`);
    const data = await response.json();

    showAreaEdicionTipo();
    visualizarLista(data, listaTipo);
  } catch (err) {
    console.log(err);
  }
}

async function getTipoEnNivel(materiaId) {
  console.log(materiaId);
  try {
    const response = await fetch(`./tipo/${materiaId}`);
    const data = await response.json();

    /*showAreaEdicionTipo();
    visualizarLista(data, listaTipo);*/

    visualizarChipMateriaTipo(data, chipsTipoEnNivel);
    

  } catch (err) {
    console.log(err);
  }
}

async function getNivelEnNivel(tipoId) {
  console.log(tipoId);
  try {
    const response = await fetch(`./nivel/${tipoId}`);
    const data = await response.json();

    /*showAreaEdicionTipo();
    visualizarLista(data, listaTipo);*/

    visualizarNivel(data, chipsNivelEnNivel);
    

  } catch (err) {
    console.log(err);
  }
}

async function getNivel() {
  console.log("getting nivel");
}

async function updateMateria(cambios) {
  try {
    const response = await fetch(`./examenes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cambios)
    });
    const rta = await response.json();
    console.log("Respuesta de update", rta);
     // Luego de guardar las cosas en la base de datos, me trae esa info
     getMateria();
  } catch (err) {
    console.log(err);
  }
}

async function updateTipo(cambios) {
  try {
    const response = await fetch(`./examenes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cambios)
    });
    const rta = await response.json();
    console.log("Respuesta de update", rta); 
    // Luego de guardar las cosas en la base de datos, me trae esa info
    getTipoEnTipo(cambios.materia);
  } catch (err) {
    console.log(err);
  }
}




// //////////////////// ESTO LO VI CON ANGEL EN CLASE, PARA DESACOPLAR LA VISTA DEL SERVICIO
// async function getMateria( callback ) {
//   try {
//     const response = await fetch("./materia");
//     const data = {};
//     data.respone = await response.json();
//     data.listaMateria = 0;
//     callback(null, data);
//   } catch (err) {
//     callback(err);
//   }
// }

// getMateria( visualizarLista );

// function visualizarLista (error, data) {
//   if (error) {
//     //muestro el span
//     return
//   }

//   // aca se desarrolla la funcion de la vista. de esta manera se desacopla la vista del servicio.

// }