const ulCollapsibleExamenes = $("#collapsibleExamenes");
const listaMateria = $("#listaMateria");
const listaTipo = $("#listaTipo");
const listaNivel = $("#listaNivel");

const agregarMateria = $("#agregarMateria");
const botonesMateria = $("#botonesMateria");
const botonGuardarMateria = $("#guardarMateria");
const botonResetMateria = $("#resetMateria");
const estadoMateria = $("#estadoMateria");

const chipsMateriaEnTipo = $("#chipsMateriaEnTipo");
const agregarTipo = $("#agregarTipo");
const botonesTipo = $("#botonesTipo");
const botonGuardarTipo = $("#guardarTipo");
const botonResetTipo = $("#resetTipo");
const estadoTipo = $("#estadoTipo");

const chipsMateriaEnNivel = $("#chipsMateriaEnNivel");
const chipsTipoEnNivel = $("#chipsTipoEnNivel");
const chipsNivelEnNivel = $("#chipsNivelEnNivel");
const areaTipoEnNivel = $("#areaTipoEnNivel");
const areaNivelEnNivel = $("#areaNivelEnNivel");
const areaListaNivel = $("#areaListaNivel");
const botonesNivel = $("#botonesNivel");
const botonGuardarNivel = $("#guardarNivel");
const botonResetNivel = $("#resetNivel");
const estadoNivel = $("#estadoNivel");
const lugarBotonAgregarNivel = $("#lugarBotonAgregarNivel");

//////////////////// INICIALIZACION ACORDEON
ulCollapsibleExamenes.collapsible({
  onOpenStart: function() {
    // Hasta que no selecciono un chip en tipo, no muestro ni lista ni botones (se usa cuando entraste a tipo, fuiste a materia o nivel y volves a tipo)
    ulCollapsibleExamenes.find("li.active").attr("id") == "collapsibleTipo"
      ? removeAreaEdicionTipo()
      : null;
    ulCollapsibleExamenes.find("li.active").attr("id") == "collapsibleNivel"
      ? (function() {
          removeAreaTipoEnNivel();
          removeAreaNivelEnNivel();
          removeAreaEdicionNivel();
        })()
      : null;
  },

  // Cada vez que se abre una solapa del acordeon, se trae la información de la base de datos
  onOpenEnd: function() {
    ulCollapsibleExamenes.find("li.active").attr("id") == "collapsibleMateria"
      ? mostrarListaMateria()
      : null;
    ulCollapsibleExamenes.find("li.active").attr("id") == "collapsibleTipo"
      ? mostrarChipMateria(chipsMateriaEnTipo, listaTipo)
      : null;
    ulCollapsibleExamenes.find("li.active").attr("id") == "collapsibleNivel"
      ? (function() {
          mostrarChipMateria(chipsMateriaEnNivel, chipsTipoEnNivel);
          removeAreaEdicionNivel();
        })()
      : null;
  }
});

//////////////////// Modal confirmación mensaje eliminar
$(document).ready(function() {
  $(".modal").modal();
});

function inicializarSelectDropdown() {
  $("select").formSelect();
}

////////////////////  Cuando hay cambios pendientes se deshabilita la posibilidad de navegar por el acordeon
function habilitarAcordeon() {
  ulCollapsibleExamenes.addClass("collapsible");
}

function deshabilitarAcordeon() {
  ulCollapsibleExamenes.removeClass("collapsible");
}

// Busca las materias en la DB y renderiza la lista
async function mostrarListaMateria() {
  try {
    //progressIndeterminate(listaMateria)
    let data = await getMateria();
    renderListaMateriaOTipo(data, listaMateria);
  } catch (err) {
    console.log(err);
  }
}

// Busca las tipos en la DB de cada materiaID ingresada y renderiza la lista
async function mostrarListaTipo(tipoId) {
  try {
    let data = await getTipo(tipoId);
    showAreaEdicionTipo();
    renderListaMateriaOTipo(data, listaTipo);
  } catch (err) {
    console.log(err);
  }
}

function progressIndeterminate(lista) {
  lista.empty();
  lista.append(`<div class="progress "><div class="indeterminate"></div></div>
  `);
}

// Busca el nivel seleccionado en la DB y lo renderiza
async function mostrarNivel(nivelId) {
  try {
    let data = await getNivel(nivelId);
    console.log(data)
    renderNivel(data, listaNivel);
  } catch (err) {
    console.log(err);
  }
}

function mostrarNivelNuevo() {
  const nivelNuevo = nuevoNivelTemplate();
  renderNivel(nivelNuevo, listaNivel);
  let chipNuevoNivel = chipSortableTemplate(nivelNuevo[0]);
  $(`#chipsNivelEnNivel`).append(chipNuevoNivel);
}

function nuevoNivelTemplate() {
  return [
    {
      uuid: uuidv4(),
      nombre: "Nuevo Nivel",
      descripcion: "Descripcion del Nivel",
      activo: 1,
      mostrar_cliente: 0,
      edita_user_secundario: 0,
      tipo_uuid: $("#chipsMateriaEnTipo")
        .find(".ui-selected")
        .attr("id")
    }
  ];
}

// Busca las modalidades del nivel seleccionado en la DB y las renderiza
async function mostrarModalidad(nivelId) {
  try {
    let data = await getModalidad(nivelId);
    renderModalidad(data, $("#modalidadNivel")); // modalidadNivel no la ingreso en las const de arriba porque no existe al inicio
  } catch (err) {
    console.log(err);
  }
}

// Busca las materias en la DB y renderiza los chips. listaChips: aqui se colgaran los chips // listaLis: se limpia esta lista
async function mostrarChipMateria(listaChips, listaLis) {
  listaLis.empty(); //Limpio los chips antiguos de la lista
  try {
    let data = await getMateria();
    visualizarChipMateriaTipo(data, listaChips);
  } catch (err) {
    console.log(err);
  }
}

// Busca los tipos en la DB y renderiza los chips
async function mostrarChipTipo(listaChips, listaLis, idSelected) {
  listaLis.empty(); //Limpio los chips antiguos de la lista
  try {
    let data = await getTipo(idSelected);
    showAreaTipoEnNivel();
    removeAreaNivelEnNivel();
    removeAreaEdicionNivel();
    data.length
      ? visualizarChipMateriaTipo(data, listaChips)
      : listaChips.append("Este elemento está vacío");
  } catch (err) {
    console.log(err);
  }
}

// Busca los niveles en la DB y renderiza los chips
async function mostrarChipNivel(listaChips, listaLis, idSelected) {
  listaLis.empty(); //Limpio los chips antiguos de la lista
  try {
    let data = await getChipNivel(idSelected);
    showAreaNivelEnNivel();
    removeAreaEdicionNivel();
    visualizarChipNivel(data, listaChips);
    lugarBotonAgregarNivel.empty();
    lugarBotonAgregarNivel.append(botonAgregarNivel());
    asignarFuncionalidadBotonAgregarNivel();
  } catch (err) {
    console.log(err);
  }
}

//////////////////// Tostadas
function habilitarTostadaGuardarResetear() {
  $(".collapsible-header, .noSelectable, #agregarNivel").on(
    "click",
    function() {
      M.toast({ html: "Debe Guardar o Resetear cambios para proceder" });
    }
  );
}

function deshabilitarTostadaGuardarResetear() {
  $(".collapsible-header, .noSelectable, #agregarNivel").off("click");
}

//////////////////// Renderiza elementos en la lista Materia o Tipo a partir del preset li HTML
function renderListaMateriaOTipo(data, lista) {
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

function renderNivel(data, lista) {
  let nivel = data[0];
  let newTemplate = liNivelTemplate(nivel);
  lista.empty().append(newTemplate);

  console.log(nivel.uuid);

  console.log($(`#${nivel.uuid}_descripcion`));

  showAreaEdicionNivel();
  inicializarSelectDropdown();
  asignarFuncionalidadBotonesNivel(nivel, lista);
  mostrarModalidad(nivel.uuid);
  asignarFuncionalidadBotoneAgregarModalidad(nivel.uuid);

  aceptarSoloNumerosEnInput(nivel.uuid);
  // Si previamente habia un chip nivel seleccionado, se vuelve a seleccionar
  $(`#${nivel.uuid}`).addClass("ui-selected");

  let descriptionTextArea = $(`#${nivel.uuid}_descripcion`);

  M.textareaAutoResize(descriptionTextArea);
  autoResizeTextAreaOnWindowWidthChange(descriptionTextArea);

}

function autoResizeTextAreaOnWindowWidthChange(textArea) {
  let $window = $(window);
  let lastWindowWidth = $window.width();

  $window.resize(function() {
    /* Do not calculate the new window width twice.
     * Do it just once and store it in a variable. */
    var windowWidth = $window.width();

    /* Use !== operator instead of !=. */
    if (lastWindowWidth !== windowWidth) {
      M.textareaAutoResize(textArea);
      lastWindowWidth = windowWidth;
    }
  });
}

function aceptarSoloNumerosEnInput(uuidInput) {
  $(`#${uuidInput}_modalidad_precio`).on("keydown", function(e) {
    if (e.which == 69 || e.which == 107 || e.which == 109) {
      e.preventDefault();
    }
  });
}

function renderModalidad(data, lista) {
  let dataOrdenada = JSON.parse(JSON.stringify(data));

  dataOrdenada.sort((a, b) => (a.orden > b.orden ? 1 : -1));
  lista.empty();

  dataOrdenada.forEach(elemento => {
    // Muestro solo las materias activos
    elemento.activo ? lista.append(liModalidadTemplate(elemento)) : null;
    asignarFuncionalidadBotonesModalidad(elemento, listaNivel);
  });

  let nivelSeleccionado = chipsNivelEnNivel.find(".ui-selected").attr("id");

  habilitaSortableModalidad(lista);
}

function nuevaModalidad(nivel) {
  console.log(nivel);

  return {
    uuid: uuidv4(),
    nombre: $(`#${nivel}_modalidad`).val(),
    precio: $(`#${nivel}_modalidad_precio`).val(),
    mostrar_cliente: true,
    examen_RW: false,
    examen_LS: false
  };
}

function asignarFuncionalidadBotoneAgregarModalidad(nivel) {
  $(`#${nivel}_agregarModalidad`).on("click", function() {
    if (
      $(`#${nivel}_modalidad`).val() &&
      $(`#${nivel}_modalidad_precio`).val()
    ) {
      let modalidadDatos = nuevaModalidad(nivel);
      let modalidadGenerada = liModalidadTemplate(modalidadDatos);
      let nombreLista = $("#modalidadNivel");
      nombreLista.append(modalidadGenerada);

      $(`#${nivel}_modalidad`).val("");
      $(`#${nivel}_modalidad_precio`).val("");

      asignarFuncionalidadBotonesModalidad(modalidadDatos, nombreLista);
      addModalidades.push(modalidadDatos.uuid);
      cambioModalidades = true;
      seGeneroUnCambioEnLista(listaNivel);
    }
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

function visualizarChipNivel(data, chipLista) {
  let dataOrdenada = JSON.parse(JSON.stringify(data));

  dataOrdenada.sort((a, b) => (a.orden > b.orden ? 1 : -1));
  chipLista.empty();

  dataOrdenada.forEach(elemento => {
    elemento.activo ? chipLista.append(chipSortableTemplate(elemento)) : null; ///////debe ser sortable este
  });
  habilitaSortableChip(chipLista);
}

//////////////////// Muestra o Esconde la lista y la botonera de Tipo dependiendo de si está seleccionado un chip Materia o no.
// EN LA SOLAPA TIPO
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

// EN LA SOLAPA NIVEL
function showBotoneraNivel() {
  botonesNivel.removeClass("hidden");
}

function removeBotoneraNivel() {
  botonesNivel.addClass("hidden");
}

function showAreaTipoEnNivel() {
  areaTipoEnNivel.removeClass("hidden");
}

function removeAreaTipoEnNivel() {
  areaTipoEnNivel.addClass("hidden");
}

function showAreaNivelEnNivel() {
  areaNivelEnNivel.removeClass("hidden");
  showBotoneraNivel();
}

function removeAreaNivelEnNivel() {
  areaNivelEnNivel.addClass("hidden");
  removeBotoneraNivel();
}

function showAreaEdicionNivel() {
  areaListaNivel.removeClass("hidden");
}

function removeAreaEdicionNivel() {
  areaListaNivel.addClass("hidden");
}

//////////////////// Agregar nuevo elemento a la lista de Materia o Tipo

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
      uuid: uuidv4(),
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
inicializarBotonGuardarMateriaTipo(botonGuardarMateria, listaMateria);
inicializarBotonGuardarMateriaTipo(botonGuardarTipo, listaTipo);
inicializarBotonGuardarMateriaTipo(botonGuardarNivel, listaNivel);

function inicializarBotonGuardarMateriaTipo(boton, lista) {
  boton.on("click", () => {
    switch (lista) {
      case listaMateria:
        let elementosMateria = generarEstoadoLista(lista);
        let cambiosAGuardarMateria = generarObjetoConCambiosMateriaTipo(
          elementosMateria,
          lista
        );
        console.log("Cambios a Guardar", cambiosAGuardarMateria);
        updateMateria(cambiosAGuardarMateria);
        break;
      case listaTipo:
        let elementosTipo = generarEstoadoLista(lista);
        let cambiosAGuardarTipo = generarObjetoConCambiosMateriaTipo(
          elementosTipo,
          lista
        );
        console.log("Cambios a Guardar", cambiosAGuardarTipo);
        updateTipo(cambiosAGuardarTipo);
        break;
      case listaNivel:
        let nivelSeleccionado = chipsNivelEnNivel
          .find(".ui-selected")
          .attr("id");
        let cambiosAGuardarNivel = generarEstadoNivel(nivelSeleccionado);
        console.log("Cambios a Guardar", cambiosAGuardarNivel);
        updateNivelModalidad(cambiosAGuardarNivel);
        mostrarChipNivel(
          chipsNivelEnNivel,
          chipsNivelEnNivel,
          $("#chipsTipoEnNivel")
            .find(".ui-selected")
            .attr("id")
        );
        mostrarNivel(nivelSeleccionado);

        break;
    }
    seGuardaOResetea(lista);
    // (retornarPertenenciaTablaDb(lista) === 'tipo') ? habilitarSelectable(chipsMateriaEnTipo) : null;    borrar
  });
}

inicializarBotonResetMateriaTipo(botonResetMateria, listaMateria);
inicializarBotonResetMateriaTipo(botonResetTipo, listaTipo);
inicializarBotonResetMateriaTipo(botonResetNivel, listaNivel);

function inicializarBotonResetMateriaTipo(boton, lista) {
  boton.on("click", () => {
    switch (lista) {
      case listaMateria:
        mostrarListaMateria();
        seGuardaOResetea(lista);
        break;
      case listaTipo:
        mostrarListaTipo(chipsMateriaEnTipo.find(".ui-selected").attr("id"));
        seGuardaOResetea(lista);
        break;
      case listaNivel:
        let nivelSeleccionado = chipsNivelEnNivel
          .find(".ui-selected")
          .attr("id");

        if (nivelSeleccionado) {
          seGuardaOResetea(lista);
          mostrarChipNivel(
            chipsNivelEnNivel,
            chipsNivelEnNivel,
            $("#chipsTipoEnNivel")
              .find(".ui-selected")
              .attr("id")
          );
          mostrarNivel(nivelSeleccionado);
        } else {
          removeAreaEdicionNivel();
          deshabilitarBotonera(listaNivel);
          seGuardaOResetea(lista);
          mostrarChipNivel(
            chipsNivelEnNivel,
            chipsNivelEnNivel,
            $("#chipsTipoEnNivel")
              .find(".ui-selected")
              .attr("id")
          );
        }
        break;
    }
  });
}

////////////////////  Asignar funcionalidad al boton de agregar nivel
function asignarFuncionalidadBotonAgregarNivel() {
  $("#agregarNivel").on("click", () => {
    chipsNivelEnNivel.find(".ui-selected").removeClass("ui-selected");
    mostrarNivelNuevo();
    showAreaEdicionNivel();
    addNivel = true;
    cambioOrdenChipNiveles = true;
    seGeneroUnCambioEnLista(listaNivel);
  });
}

////////////////////  Acciones visuales al generar cambios en listas Materia o Tipo
// si ya se hizo un cambio, es true y no acumulo tostadas al hacer click
let yaSeHizoUnCambio = false;

function seGeneroUnCambioEnLista(lista) {
  switch (lista) {
    case listaMateria:
      if (!yaSeHizoUnCambio) {
        habilitarBotonera(lista);
        deshabilitarAcordeon();
        habilitarTostadaGuardarResetear();
        yaSeHizoUnCambio = true;
      }
      break;
    case listaTipo:
      if (!yaSeHizoUnCambio) {
        habilitarBotonera(lista);
        deshabilitarAcordeon();
        disableSelectable(chipsMateriaEnTipo);
        aplicarClaseNoSelectableChips(chipsMateriaEnTipo);
        habilitarTostadaGuardarResetear();
        yaSeHizoUnCambio = true;
      }
      break;
    case listaNivel:
      if (!yaSeHizoUnCambio) {
        $("#agregarNivel").off("click");
        disableSelectable(chipsMateriaEnNivel);
        deshabilitarAcordeon();
        aplicarClaseNoSelectableChips(chipsMateriaEnNivel);
        disableSelectable(chipsTipoEnNivel);
        aplicarClaseNoSelectableChips(chipsTipoEnNivel);
        disableSelectable(chipsNivelEnNivel);
        habilitarBotonera(lista);
        aplicarClaseNoSelectableChips(chipsNivelEnNivel);
        habilitarTostadaGuardarResetear();
        yaSeHizoUnCambio = true;
      }
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
    case listaNivel:
      botonGuardarNivel.removeClass("disabled");
      botonResetNivel.removeClass("disabled");
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
      deshabilitarTostadaGuardarResetear();
      habilitarAcordeon();
      deshabilitarBotonera(lista);
      reiniciarColasDeCambio(); // ESTO DEBE OCURRIR SI RECIBO UN OK DE GUARDADO DESDE EL SERVER
      break;
    case listaTipo:
      deshabilitarTostadaGuardarResetear();
      habilitarAcordeon();
      deshabilitarBotonera(lista);
      reiniciarColasDeCambio(); // ESTO DEBE OCURRIR SI RECIBO UN OK DE GUARDADO DESDE EL SERVER
      removerClaseNoSelectableChips(chipsMateriaEnTipo);
      enableSelectable(chipsMateriaEnTipo);
      break;
    case listaNivel:
      deshabilitarTostadaGuardarResetear();
      enableSelectable(chipsMateriaEnNivel);
      enableSelectable(chipsTipoEnNivel);
      enableSelectable(chipsNivelEnNivel);
      habilitarAcordeon();
      deshabilitarBotonera(lista);
      removerClaseNoSelectableChips(chipsMateriaEnNivel);
      removerClaseNoSelectableChips(chipsTipoEnNivel);
      removerClaseNoSelectableChips(chipsNivelEnNivel);
      asignarFuncionalidadBotonAgregarNivel();
      reiniciarColasDeCambioNivel();
      break;
    default:
      return null;
  }
  yaSeHizoUnCambio = false;
}

// Deshabilita la botonera Guardar y Reset
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
    case listaNivel:
      botonGuardarNivel.addClass("disabled");
      botonResetNivel.addClass("disabled");
      break;
  }
}

function eliminarElementoLista(uuid, lista) {
  switch (lista) {
    case listaMateria:
      $(`#${uuid}`).remove();
      ingresarColaRemover(uuid);
      seGeneroUnCambioEnLista(lista);
      seGeneroCambioOrden();
      break;
    case listaTipo:
      $(`#${uuid}`).remove();
      ingresarColaRemover(uuid);
      seGeneroUnCambioEnLista(lista);
      seGeneroCambioOrden();
      break;
    case listaNivel:
      $(`#${uuid}_nivel`).remove(); // Remueve el nivel de la visualizacion del nivel
      $(`#${uuid}`).remove(); // Remueve el chip con el nombre del nivel
      removeAreaEdicionNivel();

      // Indico que este elemento debe ser removido
      removeNivel.push(uuid);
      cambioOrdenChipNiveles = true;
      seGeneroUnCambioEnLista(lista);
      break;
  }
}

let elementoAEliminar = { uuid: "", lista: "" };

//////////////////// Configuracion de botones de cada elemento LI de la lista
function asignarFuncionalidadBotonesLista(elemento, lista) {
  $(`#${elemento.uuid}_delete`).on("click", () => {
    elementoAEliminar.uuid = elemento.uuid;
    elementoAEliminar.lista = lista;
  });

  $(`#${elemento.uuid} input`).on("input", function() {
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

//////////////////// Configuracion de botones de cada nivel
function asignarFuncionalidadBotonesNivel(elemento, lista) {
  $(`#${elemento.uuid}_delete`).on("click", () => {
    elementoAEliminar.uuid = elemento.uuid;
    elementoAEliminar.lista = lista;
  });

  $(`#${elemento.uuid}_nombre`).on("input", function() {
    $(`#${elemento.uuid}_nivel`).attr("dirty_input_nombre", 1);

    // Actualiza el nombre del chip cuando se cambia el nombre en input del nombre del nivel
    let iconoSortable = $(`#${elemento.uuid}`)
      .clone()
      .children();
    let nuevoTextChip = $(`#${elemento.uuid}_nombre`).val();
    $(`#${elemento.uuid}`)
      .empty()
      .prepend(nuevoTextChip)
      .prepend(iconoSortable);
    cambioDataNivel = true;
    seGeneroUnCambioEnLista(lista);
  });

  $(`#${elemento.uuid}_descripcion`).on("input", function() {
    $(`#${elemento.uuid}_nivel`).attr("dirty_input_descripcion", 1);
    cambioDataNivel = true;
    seGeneroUnCambioEnLista(lista);
  });

  $(`#${elemento.uuid}_visibility`).on("click", function() {
    cambioDataNivel = true;
    seGeneroUnCambioEnLista(lista);

    // Si esta la visibilidad en false, el input se ve inactivo
    $(`#${elemento.uuid}_nombre`).toggleClass("inputInactivo");

    // Cuando presiono boton visibilidad, cambia su icono
    $(`#${elemento.uuid}_visibility`).text(
      $(this)
        .text()
        .trim() == "visibility"
        ? "visibility_off"
        : "visibility"
    );

    // Si presioné el icono de visibilidad, cambio el atributo html mostrar_cliente y pongo en true el aviso que ocurrio un cambio
    $(`#${elemento.uuid}_nivel`).attr("mostrar_cliente", (index, attr) =>
      attr == 1 ? 0 : 1
    );
    $(`#${elemento.uuid}_nivel`).attr(
      "dirty_mostrar_cliente",
      (index, attr) => 1
    );
  });

  $(`#${elemento.uuid}_imagen`).on("change", function() {
    $(`#${elemento.uuid}_nivel`).attr("dirty_imagen", 1);
    cambioDataNivel = true;
    seGeneroUnCambioEnLista(lista);
  });

  $(`#${elemento.uuid}_pdf`).on("change", function() {
    $(`#${elemento.uuid}_nivel`).attr("dirty_pdf", 1);
    cambioDataNivel = true;
    seGeneroUnCambioEnLista(lista);
  });
}

function asignarFuncionalidadBotonesModalidad(elemento, lista) {
  $(`#${elemento.uuid}_delete`).on("click", () => {
    $(`#${elemento.uuid}`).remove();
    cambioModalidades = true;
    removeModalidades.push(elemento.uuid);
    seGeneroUnCambioEnLista(listaNivel);
  });

  $(`#${elemento.uuid}_nombre`).on("input", function() {
    cambioModalidades = true;
    seGeneroUnCambioEnLista(lista);
  });

  $(`#${elemento.uuid}_precio`).on("input", function() {
    cambioModalidades = true;
    seGeneroUnCambioEnLista(lista);
  });

  $(`#${elemento.uuid}_examen_RW`).on("click", function() {
    cambioModalidades = true;
    seGeneroUnCambioEnLista(lista);
  });

  $(`#${elemento.uuid}_examen_LS`).on("click", function() {
    cambioModalidades = true;
    seGeneroUnCambioEnLista(lista);
  });

  $(`#${elemento.uuid}_visibility`).on("click", function() {
    cambioModalidades = true;
    seGeneroUnCambioEnLista(lista);

    // Si esta la visibilidad en false, el input se ve inactivo
    $(`#${elemento.uuid}_nombre`).toggleClass("inputInactivo");

    // Cuando presiono boton visibilidad, cambia su icono
    $(`#${elemento.uuid}_visibility`).text(
      $(this)
        .text()
        .trim() == "visibility"
        ? "visibility_off"
        : "visibility"
    );
  });
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

function habilitaSortableModalidad(lista) {
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

      //Si no se movio de lugar, no se genera ningun cambio

      !(newIndex === oldIndex)
        ? (function() {
            seGeneroUnCambioEnLista(listaNivel), (cambioModalidades = true);
          })()
        : null;
    }
  });
}

// Esta Sortabilidad es para los chips de niveles
function habilitaSortableChip(lista) {
  lista.sortable({
    handle: ".move-button",
    tolerance: "pointer",
    connectWith: lista,

    start: function(e, ui) {
      ui.placeholder.height(ui.helper[0].scrollHeight * -0.6); // 1.15 para tener en cuenta el lugar del borde del li al moverse y no se generen saltos visuales

      // creates a temporary attribute on the element with the old index
      $(this).attr("data-previndex", ui.item.index());
    },

    update: function(e, ui) {
      // gets the new and old index then removes the temporary attribute
      var newIndex = ui.item.index();
      var oldIndex = $(this).attr("data-previndex");
      $(this).removeAttr("data-previndex");
      //seGeneroCambioOrden();

      //Si no se movio de lugar, no se genera ningun cambio
      console.log(newIndex, oldIndex, lista);
      !(newIndex === oldIndex)
        ? (function() {
            seGeneroUnCambioEnLista(listaNivel);
            cambioOrdenChipNiveles = true;
          })()
        : null;
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
      //Selecciono una Materia en solapa Tipo
      idSelected && ulChips === chipsMateriaEnTipo
        ? mostrarListaTipo(idSelected)
        : null;

      //Selecciono una Materia en solapa Nivel
      idSelected && ulChips === chipsMateriaEnNivel
        ? mostrarChipTipo(chipsTipoEnNivel, chipsTipoEnNivel, idSelected)
        : null;

      //Selecciono un Tipo en solapa Nivel
      idSelected && ulChips === chipsTipoEnNivel
        ? mostrarChipNivel(chipsNivelEnNivel, chipsNivelEnNivel, idSelected)
        : null;

      //Selecciono un Nivel en la solapa nivel
      idSelected && ulChips === chipsNivelEnNivel
        ? (function() {
            mostrarNivel(idSelected);
          })()
        : null;
    }
  });
}

////////////////////  Habilita o deshabilita la posibilidad de presionar un chip (se deshabilita cuando hay camibos pendientes)

function enableSelectable(ulChips) {
  ulChips.selectable("enable");
}

function disableSelectable(ulChips) {
  ulChips.selectable("disable");
}

//////////////////// PRESETS HTML elemento de la lista Materia o Tipo
const liMateriaTipoTemplate = materia => {
  return `
    <li id="${materia.uuid}" activo="${materia.activo}" mostrar_cliente="${
    materia.mostrar_cliente
  }" dirty_input="0" dirty_mostrar_cliente="0" class="collection-item grey lighten-4 margin-bottom-0-4">
        
      <a href="#!" class="secondary-content left">
        <i class="material-icons-outlined azul-texto left button-opacity move-button ">import_export</i>
      </a>

      <input class="browser-default weight500 ${
        !materia.mostrar_cliente ? "inputInactivo" : ""
      }" type="text" value="${materia.nombre}">

      <a  href="#modalEliminar" class="secondary-content modal-trigger delete">
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
    </li>
  `;
};

let imagenes = ["spanish.png", "english.png", "italian.png", "french.png"];
let pdf = ["spanish.pdf", "english.pdf", "italian.pdf", "french.pdf"];

function generarNombreImagenes(nivel) {
  let textHTML = "";
  imagenes.forEach(element => {
    textHTML += `
      <option value="" ${
        element === nivel.imagen ? "selected" : ""
      } data-icon="../../files/images/${element}" class="left">${element}</option>
    `;
  });
  return textHTML;
}

function generarNombrePdfs(nivel) {
  let textHTML = "";
  pdf.forEach(element => {
    textHTML += `
      <option value="" ${
        element === nivel.pdf ? "selected" : ""
      } class="left">${element}</option>
    `;
  });
  return textHTML;
}

//////////////////// PRESETS HTML elemento nivel
const liNivelTemplate = nivel => {
  return `
    <div id="${nivel.uuid}_nivel" activo="${nivel.activo}" mostrar_cliente="${nivel.mostrar_cliente}" dirty_input_nombre="0" dirty_input_descripcion="0" 
    dirty_pdf="0" dirty_imagen="0" dirty_mostrar_cliente="0" class="col s10 m10 l10 xl10 offset-s1 offset-m1 offset-l1 offset-xl1 ">

      <div class="container right clear-top-1 ">
        <a href="#modalEliminar" class="secondary-content delete modal-trigger">
          <i id="${nivel.uuid}_delete" class="material-icons-outlined azul-texto right button-opacity ">delete</i>
        </a>
        
        <a href="#!" class="secondary-content check">
          <i id="${nivel.uuid}_visibility" class="material-icons-outlined azul-texto right button-opacity">${nivel.mostrar_cliente ? "visibility" : "visibility_off"}</i>
        </a>
      </div>

      <div class="row padding0 margin0">
          <div class="input-field col s12 padding0 margin0  ">
              <input class="weight500 ${
                !nivel.mostrar_cliente ? "inputInactivo" : ""
              }" autocomplete="off" placeholder="Tíulo" id="${
    nivel.uuid
  }_nombre"
                  type="text" value="${nivel.nombre}">
          </div>
      </div>


      <div class="row input-field padding0 margin0">
          <textarea id="${
            nivel.uuid
          }_descripcion" class="materialize-textarea" autocomplete="off"
              placeholder="Descripción del examen">${
                nivel.descripcion
              }</textarea>
      </div>

      <div class="row">
        <form class="col s12 m12 l12 xl12">
            <div
                class="input-field col s4 m4 l5 xl5 offset-s1 offset-m1 offset-l1 offset-xl1">
                <input id="${
                  nivel.uuid
                }_modalidad" type="text" autocomplete="off" class="">
                <label for="${nivel.uuid}_modalidad">Modalidad</label>
            </div>
            <div class="input-field col s3 m3 l4 xl4 ">
                <input id="${
                  nivel.uuid
                }_modalidad_precio" type="number" autocomplete="off" >
                <label for="${
                  nivel.uuid
                }_modalidad_precio ">Precio Euros</label>
                
            </div>
            <div class="col s1 l1 m1 xl1 clear-top-2 ">
                <a id="${nivel.uuid}_agregarModalidad"
                    class="btn-floating btn-small waves-effect waves-light background-azul ">
                    <i class="material-icons">add</i>
                </a>
            </div>
        </form>

        <div class="row">
            <div class="col s12 m12 l12 xl12">
                <ul id="modalidadNivel" class="collection collectionSinBorde">                     
                </ul>
            </div>
        </div>

        <div id="${nivel.uuid}_imagen" class="input-field col s6 m6 l6 xl6  ">
          <select  class="icons ">
            <option value="" selected>Seleccionar</option>
            ${generarNombreImagenes(nivel)}
          </select>
          <label>Imagen</label>
        </div>

        <div id="${nivel.uuid}_pdf" class="input-field col s6 m6 l6 xl6  ">
        <select  class="icons ">
          <option value="" selected>Seleccionar</option>
          ${generarNombrePdfs(nivel)}
        </select>
        <label>PDF</label>
      </div>

        

      </div>
    </div>

  `;
};

//////////////////// PRESETS HTML elemento modalidad que pertenece a cada nivel
const liModalidadTemplate = modalidad => {
  return `
  <li id="${
    modalidad.uuid
  }" class="collection-item grey lighten-4 margin-bottom-0-4">
  <a href="#!" class="secondary-content left">
      <i
          class="material-icons-outlined azul-texto left button-opacity move-button">import_export</i>
  </a>

  <input id="${modalidad.uuid}_nombre" class="browser-default ${
    !modalidad.mostrar_cliente ? "inputInactivo" : ""
  } " type="text" value="${modalidad.nombre}">
  <input id="${
    modalidad.uuid
  }_precio" class="browser-default precio width4rem" type="number" value="${
    modalidad.precio
  }">

  <div class="secondary-content">
      <a href="#!" class="secondary-content delete ">
          <i id="${
            modalidad.uuid
          }_delete" class="material-icons-outlined azul-texto right button-opacity ">delete</i>
      </a>

      <a href="#!" class="secondary-content check">
          <i id="${modalidad.uuid}_visibility"
              class="material-icons-outlined azul-texto right button-opacity">${
                modalidad.mostrar_cliente ? "visibility" : "visibility_off"
              }</i>
      </a>

      <label>
          <input id="${
            modalidad.uuid
          }_examen_RW" type="checkbox" class="filled-in" ${
    modalidad.examen_RW ? "checked" : ""
  }  />
          <span>Escrito</span>
      </label>

      <label>
          <input id="${
            modalidad.uuid
          }_examen_LS" type="checkbox" class="filled-in" ${
    modalidad.examen_LS ? "checked" : ""
  }  />
          <span>Oral</span>
      </label>
  </div>
</li>`;
};

//////////////////// PRESETS HTML chip sin ser sortable (chips de materia o tipo)
const chipTemplate = elemento => {
  return `
  <li id="${elemento.uuid}" class="chip enableSelectLi">${elemento.nombre}</li>`;
};

//////////////////// PRESETS HTML chip sortable (chips de niveles)
const chipSortableTemplate = elemento => {
  return `
  <li id="${elemento.uuid}" class="chip enableSelectLi">
  ${elemento.nombre}
  <i class="material-icons-outlined right button-opacity move-button noSelectable move-button-nivel-margin-top">import_export</i>  
</li>`;
};

//////////////////// PRESETS HTML del boton agregar nivel (aparece junto con los chips de niveles)
function botonAgregarNivel() {
  return `
    <a id="agregarNivel" class="btn-floating btn-small waves-effect waves-light background-azul ">
      <i class="material-icons">add</i>
    </a>
  
  `;
}

////////////////////  Se hace una lectura del estado actual de los elementos de la lista Materia o Tipo
function generarEstoadoLista(lista) {
  let elementos = [];
  let orden = 1;

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

////////////////////  Se hace una lectura del estado actual del nivel mostrado

let addNivel = false;
let removeNivel = [];
let cambioOrdenChipNiveles = false;
let cambioDataNivel = false;

let cambioModalidades = false;
let addModalidades = [];
let removeModalidades = [];

function reiniciarColasDeCambioNivel() {
  addNivel = false;
  removeNivel = [];
  cambioOrdenChipNiveles = false;
  cambioDataNivel = false;

  cambioModalidades = false;
  addModalidades = [];
  removeModalidades = [];
}

function generarEstadoNivel(nivelSeleccionado) {
  // Si estoy mostrando un nivel, obtengo el id limpio sin "_nivel"

  if (listaNivel.children().length > 0) {
    let nivelId = listaNivel
      .find("div")
      .attr("id")
      .replace("_nivel", "");

    let modalidades = [];
    let chipNiveles = [];
    let ordenNivel = 1; //Desde donde comienza a sumar el orden de los niveles

    // Obtengo el estado de orden de los niveles
    chipsNivelEnNivel.find(`li`).each(function() {
      let nivelId = $(this).attr("id");

      chipNiveles.push({
        uuid: nivelId,
        orden: ordenNivel++
      });
    });

    let ordenModalidad = 1;
    $("#modalidadNivel")
      .find(`li`)
      .each(function() {
        let modalidadId = $(this).attr("id");

        modalidades.push({
          uuid: modalidadId,
          orden: ordenModalidad++,
          nombre: $(`#${modalidadId}_nombre`).val(),
          precio: $(`#${modalidadId}_precio`).val(),
          mostrar_cliente:
            $(`#${modalidadId}_visibility`).text() === "visibility" ? 1 : 0,
          examen_RW: $(`#${modalidadId}_examen_RW`).prop("checked"),
          examen_LS: $(`#${modalidadId}_examen_LS`).prop("checked"),
          edita_user_secundario: 0
        });
      });

    return {
      uuid: nivelId,
      tipo_uuid: $(`#chipsTipoEnNivel`)
        .find(".ui-selected")
        .attr("id"),
      nombre: $(`#${nivelId}_nombre`).val(),
      descripcion: $(`#${nivelId}_descripcion`).val(),
      mostrar_cliente: listaNivel.find("div").attr("mostrar_cliente"),
      pdf: $(`#${nivelId}_pdf input`).val(),
      imagen: $(`#${nivelId}_imagen input`).val(),
      cambioDataNivel: cambioDataNivel,
      modalidades: modalidades,
      cambioModalidades: cambioModalidades,
      addNivel: addNivel,
      removeNivel: removeNivel,
      cambioOrdenChipNiveles: cambioOrdenChipNiveles,
      niveles: chipNiveles,
      addModalidades: addModalidades,
      removeModalidades: removeModalidades
    };
  } else {
    let ordenNivel = 1;
    let chipNiveles = [];

    chipsNivelEnNivel.find(`li`).each(function() {
      let nivelId = $(this).attr("id");

      chipNiveles.push({
        uuid: nivelId,
        orden: ordenNivel++
      });
    });

    return {
      niveles: chipNiveles,
      removeNivel: removeNivel,
      cambioOrdenChipNiveles: cambioOrdenChipNiveles,
      cambioDataNivel: false,
      cambioModalidades: false
    };
  }
}

////////////////////  Se genera un objeto al presionar el boton guardar con los cambios realizados por el usuario desde el ultimo fetch de la DB
////////////////////  Este objeto se envia al servidor con los cambios realizados para que impacten en la DB.
function generarObjetoConCambiosMateriaTipo(elementos, lista) {
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


//////////////////// CONSULTAS GET AL SERVIDOR
async function getMateria() {
  try {
    const response = await fetch("./materia");
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

async function getTipo(materiaId) {
  try {
    const response = await fetch(`./tipo/${materiaId}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

// Me trae todos los nombres de los niveles de un tipo
async function getChipNivel(tipoId) {
  try {
    const response = await fetch(`./nivelChip/${tipoId}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

// Me trae toda la informacion de un nivel seleccionado
async function getNivel(nivelId) {
  try {
    const response = await fetch(`./nivel/${nivelId}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

// Me trae toda las modalidades de un nivel seleccionado
async function getModalidad(nivelId) {
  try {
    const response = await fetch(`./modalidad/${nivelId}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

//////////////////// UPDATES POST AL SERVIDOR
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
    // Luego de guardar las cosas en la base de datos, me trae esa info
    console.log(rta);
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
    // Luego de guardar las cosas en la base de datos, me trae esa info
    mostrarListaTipo(cambios.materia);
  } catch (err) {
    console.log(err);
  }
}

async function updateNivelModalidad(cambios) {
  try {
    const response = await fetch(`./examenesUpdateNivelModalidad/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cambios)
    });
    const rta = await response.json();
    // Luego de guardar las cosas en la base de datos, me trae esa info
    mostrarNivel(cambios.uuid);
  } catch (err) {
    console.log(err);
  }
}
