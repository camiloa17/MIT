const ulCollapsibleExamenes = $("#collapsibleExamenes");
const listaMateria = $("#listaMateria");
const listaTipo = $("#listaTipo");

const agregarMateria = $("#agregarMateria");
const botonesMateria = $("#botonesMateria");
const botonGuardarMateria = $("#guardarMateria");
const botonResetMateria = $("#resetMateria");

const agregarTipo = $("#agregarTipo");
const botonesTipo = $("#botonesTipo");
const botonGuardarTipo = $("#guardarTipo");
const botonResetTipo = $("#resetTipo");
const chipsMateriaEnTipo = $("#chipsMateriaEnTipo");

//////////////////// INICIALIZACION ACORDEON
ulCollapsibleExamenes.collapsible({
  onOpenStart: function() {
    /* Hasta que no selecciono un chip en tipo, no muestro ni lista ni botones */
    ulCollapsibleExamenes.find("li.active").attr("id") == "collapsibleTipo"
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
    asignarFuncionalidadBotones(elemento, lista);

    input.val("");
  }
}

////////////////////  BOTONES guardar y reset
inicializarBotonGuardar(botonGuardarMateria, listaMateria);
inicializarBotonGuardar(botonGuardarTipo, listaTipo);

function inicializarBotonGuardar(boton, lista) {
  boton.on("click", () => {
    let elementos = generarEstoadoLista(lista);

    let cambiosAGuardar = generarObjetoConCambios(elementos);

    console.log("Cambios a Guardar", cambiosAGuardar);

    updateMateria(cambiosAGuardar);
    seGuardaOResetea(lista);
    getMateria();
  });
}


inicializarBotonReset(botonResetMateria, listaMateria);
inicializarBotonReset(botonResetTipo, listaTipo);

function inicializarBotonReset(boton, lista) {
  boton.on("click", () => {
    getMateria();
    seGuardaOResetea(lista);
  });
}

////////////////////  Acciones visuales al generar cambios en listas
function seGeneroUnCambioEnLista(lista) {
  habilitarBotonera(lista);
  deshabilitarAcordeon();
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

function deshabilitarAcordeon() {
  ulCollapsibleExamenes.removeClass("collapsible");
}

////////////////////  Acciones visuales al guardar o resetear cambios en listas
function seGuardaOResetea(lista) {
  habilitarAcordeon();
  deshabilitarBotonera(lista);
  reiniciarColasDeCambio(); // ESTO DEBE OCURRIR SI RECIBO UN OK DE GUARDADO DESDE EL SERVER
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

function habilitarAcordeon() {
  ulCollapsibleExamenes.addClass("collapsible");
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

function habilitarSelectable(ulChips) {
  ulChips.selectable({
    filter: ":not(ul)",

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
      idSelected ? getTipo(idSelected) : removeAreaEdicionTipo(); ////////////////////////////////////// ESTO LO DEBO HACER GENERAL
    }
  });
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
function asignarFuncionalidadBotones(elemento, lista) {
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
    /* CAMBIOS VISUALES */
    $(`#${elemento.uuid} input`).toggleClass("inputInactivo");

    $(`#${elemento.uuid}_visibility`).text(
      $(this)
        .text()
        .trim() == "visibility"
        ? "visibility_off"
        : "visibility"
    );

    /* CAMBIO BOOLEANO EN ATRIBUTO DEL LI */
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

  console.log("Data from DB",dataOrdenada);

  dataOrdenada.forEach(elemento => {
    // Muestro solo las materias activos
    elemento.activo ? lista.append(liMateriaTipoTemplate(elemento)) : null;

    asignarFuncionalidadBotones(elemento, lista);
  });
}

//////////////////// Renderiza elementos chip a partir del preset chip HTML 
function visualizarChipMateria(data, chipLista) {
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

////////////////////  Se genera un objeto con los cambios realizados por el usuario
function generarObjetoConCambios(elementos) {
  return {
    agregar: colaAgregar,
    remover: colaRemover,
    cambioOrden: colaOrden,
    visibilidad_cambiar: colaVisible,
    inputValue_cambiar: colaInputValue,
    listaEstado: elementos
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

async function getChipMateria() {
  listaTipo.empty();
  try {
    const response = await fetch("./materia");
    const data = await response.json();

    visualizarChipMateria(data, chipsMateriaEnTipo);
  } catch (err) {
    console.log(err);
  }
}

async function getTipo(materiaId) {
  try {
    const response = await fetch(`./tipo/${materiaId}`);
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


async function updateMateria(cambios) {
  try {
    const response = await fetch("./examenes", {
      method: "POST",
      headers: {
        // 'Accept': 'application/json',
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cambios)
    });
    const rta = await response.json();
    console.log("Respuesta de update",rta);
  } catch (err) {
    console.log(err);
  }
}