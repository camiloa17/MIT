(function () {
  const listaMateria = $("#listaMateria");
  const listaTipo = $("#listaTipo");
  const listaNivel = $("#listaNivel");

  const inputAgregarMateria = $("#agregarMateria");
  const botonesMateria = $("#botonesMateria");
  const botonAgregarMateria = $('#botonAgregarMateria')
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


  // Inicializacion
  inicializacionAcordeon();

  // Modal confirmación mensaje eliminar
  $(document).ready(function () {
    $(".modal").modal();
  });


  // Inicializacion acordeon. Que pasa cuando abro o cierro las solapas
  function inicializacionAcordeon() {
    $("#collapsibleExamenes").collapsible({

      onOpenEnd: function () {
        let acordeonSeleccionado = $("#collapsibleExamenes").find("li.active").attr("id");

        // Cuando termino de abrir una solapa del acordeon, cargo la lista o chips de materias.
        switch (acordeonSeleccionado) {
          case ("collapsibleMateria"):
            appendProgressIndeterminate(listaMateria);
            mostrarListaMateria(huboUnError, estadoMateria, renderListaMateriaOTipo, listaMateria);
            break;
          case ("collapsibleTipo"):
            appendProgressIndeterminate(chipsMateriaEnTipo);
            mostrarChipMateria(huboUnError, estadoTipo, visualizarChipMateriaTipo, chipsMateriaEnTipo);
            break;
          case ("collapsibleNivel"):
            areaListaNivel.addClass("hidden");
            appendProgressIndeterminate(chipsMateriaEnNivel);
            mostrarChipMateria(huboUnError, chipsMateriaEnNivel, visualizarChipMateriaTipo, chipsMateriaEnNivel);
            break;
        }
      },

      onCloseStart: function () {
        let acordeonSeleccionado = $("#collapsibleExamenes").find("li.active").attr("id");

        // Cada vez que cierro una solapa del acordeon, limpio las areas
        switch (acordeonSeleccionado) {
          case ("collapsibleMateria"):
            listaMateria.empty();
            break;
          case ("collapsibleTipo"):
            listaTipo.empty();
            chipsMateriaEnTipo.empty();
            listaTipo.addClass("hidden");
            botonesTipo.addClass("hidden");
            agregarTipo.addClass("hidden");
            break;
          case ("collapsibleNivel"):
            chipsMateriaEnNivel.empty();
            chipsTipoEnNivel.empty();
            areaTipoEnNivel.addClass("hidden");
            areaNivelEnNivel.addClass("hidden");
            areaListaNivel.addClass("hidden");
            botonesNivel.addClass("hidden");
            break;
        }
      },
    });
  }

  //  Cuando hay cambios pendientes se deshabilita la posibilidad de navegar por el acordeon
  function habilitarAcordeon() {
    $("#collapsibleExamenes").addClass("collapsible");
  }

  function deshabilitarAcordeon() {
    $("#collapsibleExamenes").removeClass("collapsible");
  }

  function aceptarSoloNumerosEnInput(uuidInput) {
    $(`#${uuidInput}_modalidad_precio`).on("keydown", function (e) {
      if (e.which == 69 || e.which == 107 || e.which == 109) {
        e.preventDefault();
      }
    });
  }

  // Tostadas
  function habilitarTostadaGuardarResetear() {
    $(".collapsible-header, .noSelectable, #agregarNivel").on(
      "click",
      function () {
        M.toast({ html: "Debe Guardar o Resetear cambios para proceder" });
      }
    );
  }

  function deshabilitarTostadaGuardarResetear() {
    $(".collapsible-header, .noSelectable, #agregarNivel").off("click");
  }

  // Renderiza elementos en la lista Materia o Tipo a partir del preset li HTML
  function renderListaMateriaOTipo(data, lista) {
    let dataOrdenada = JSON.parse(JSON.stringify(data));

    dataOrdenada.sort((a, b) => (a.orden > b.orden ? 1 : -1));
    lista.empty();

    dataOrdenada.forEach(elemento => {
      // Muestro solo las materias activos
      elemento.activo ? lista.append(liMateriaTipoTemplate(elemento)) : null;

      asignarFuncionalidadBotonesLista(elemento, lista);
    });
  }

  function renderNivel(data, lista) {
    // Si previamente habia un chip nivel seleccionado, se vuelve a seleccionar
    
    let nivel = data[0];
    let newTemplate = liNivelTemplate(nivel);
    lista.empty().append(newTemplate);

    $('#chipsNivelEnNivel li').removeClass('ui-selected');
    $(`#${nivel.uuid}`).addClass("ui-selected");

    areaListaNivel.removeClass("hidden");

    // Inicializo dropDowns
    $("select").formSelect();


    asignarFuncionalidadBotonesNivel(nivel, lista);

    appendProgressIndeterminate($("#modalidadNivel"));
    mostrarModalidad(nivel.uuid, huboUnError);
    asignarFuncionalidadBotoneAgregarModalidad(nivel.uuid);

    aceptarSoloNumerosEnInput(nivel.uuid);



    let descriptionTextArea = $(`#${nivel.uuid}_descripcion`);

    M.textareaAutoResize(descriptionTextArea);
    autoResizeTextAreaOnWindowWidthChange(descriptionTextArea);

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
        nombre: "Titulo",
        descripcion: "",
        activo: 1,
        mostrar_cliente: 0,
        edita_user_secundario: 0,
        tipo_uuid: $("#chipsMateriaEnTipo")
          .find(".ui-selected")
          .attr("id")
      }
    ];
  }


  function autoResizeTextAreaOnWindowWidthChange(textArea) {
    let $window = $(window);
    let lastWindowWidth = $window.width();

    $window.resize(function () {
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



  function renderModalidad(data, lista) {
    let dataOrdenada = JSON.parse(JSON.stringify(data));

    dataOrdenada.sort((a, b) => (a.orden > b.orden ? 1 : -1));
    lista.empty();

    dataOrdenada.forEach(elemento => {
      // Muestro solo las materias activos
      elemento.activo ? lista.append(liModalidadTemplate(elemento)) : null;
      asignarFuncionalidadBotonesModalidad(elemento, listaNivel);
    });

    habilitaSortableModalidad(lista);
  }

  function nuevaModalidad(nivel) {
    return {
      uuid: uuidv4(),
      nombre: $(`#${nivel}_modalidad`).val(),
      precio: $(`#${nivel}_modalidad_precio`).val(),
      mostrar_cliente: true,
      examen_RW: $(`#${nivel}_examen_RW`).prop("checked"),
      examen_LS: $(`#${nivel}_examen_LS`).prop("checked"),
    };
  }

  function asignarFuncionalidadBotoneAgregarModalidad(nivel) {
    $(`#${nivel}_agregarModalidad`).on("click", function () {
      if (
        $(`#${nivel}_modalidad`).val() &&
        $(`#${nivel}_modalidad_precio`).val() &&
        ($(`#${nivel}_examen_RW`).prop("checked") || $(`#${nivel}_examen_LS`).prop("checked"))
      ) {
        let modalidadDatos = nuevaModalidad(nivel);
        let modalidadGenerada = liModalidadTemplate(modalidadDatos);
        let nombreLista = $("#modalidadNivel");
        nombreLista.append(modalidadGenerada);

        // Reinicio formulario
        $(`#${nivel}_modalidad`).val("");
        $(`#${nivel}_modalidad_precio`).val("");
        $(`#${nivel}_examen_RW`).prop("checked", false);
        $(`#${nivel}_examen_LS`).prop("checked", false);

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
      elemento.activo ? chipLista.append(chipSortableTemplate(elemento)) : null;
    });
    habilitaSortableChip(chipLista);
  }


  //////////////////// Agregar nuevo elemento a la lista de Materia o Tipo

  inicializarNuevoInputEnLi(listaMateria, inputAgregarMateria);
  inicializarNuevoInputEnLi(listaTipo, agregarTipo);

  function inicializarNuevoInputEnLi(lista, input) {
    input.on("keypress", function (e) {
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
          let idEstadoMateria = $('#estadoMateria');
          idEstadoMateria.append(preloader());
          updateMateria(cambiosAGuardarMateria, accionExitosa, huboUnError, idEstadoMateria, mostrarListaMateria, seGuardaOResetea, lista);
          break;

        case listaTipo:
          let elementosTipo = generarEstoadoLista(lista);
          let cambiosAGuardarTipo = generarObjetoConCambiosMateriaTipo(
            elementosTipo,
            lista
          );

          let idEstadoTipo = $('#estadoTipo');
          idEstadoTipo.append(preloader());
          updateTipo(cambiosAGuardarTipo, accionExitosa, huboUnError, idEstadoTipo, mostrarListaTipo, seGuardaOResetea, lista);
          break;

        case listaNivel:
          let nivelSeleccionado = chipsNivelEnNivel.find(".ui-selected").attr("id");
          let tipoSeleccionado = chipsTipoEnNivel.find(".ui-selected").attr("id")
          let cambiosAGuardarNivel = generarEstadoNivel(nivelSeleccionado);

          let idEstadoNivel = $('#estadoNivel');


          updateNivelModalidad(cambiosAGuardarNivel, accionExitosa, huboUnError, idEstadoNivel, mostrarNivel, seGuardaOResetea, lista, tipoSeleccionado, nivelSeleccionado);



          break;
      }
    });
  }

  inicializarBotonResetMateriaTipo(botonResetMateria, listaMateria);
  inicializarBotonResetMateriaTipo(botonResetTipo, listaTipo);
  inicializarBotonResetMateriaTipo(botonResetNivel, listaNivel);

  function inicializarBotonResetMateriaTipo(boton, lista) {
    boton.on("click", () => {
      switch (lista) {
        case listaMateria:
          mostrarListaMateria(huboUnError, estadoMateria, renderListaMateriaOTipo, listaMateria, seGuardaOResetea);
          break;

        case listaTipo:
          let materiaSeleccionada = chipsMateriaEnTipo.find(".ui-selected").attr("id");
          mostrarListaTipo(materiaSeleccionada, huboUnError, estadoTipo, renderListaMateriaOTipo, listaTipo, seGuardaOResetea);
          break;

        case listaNivel:
          let tipoSeleccionado = chipsTipoEnNivel.find(".ui-selected").attr("id")
          let nivelSeleccionado = chipsNivelEnNivel.find(".ui-selected").attr("id");

          if (nivelSeleccionado) {
            // Cuando ya tengo otros niveles
            seGuardaOResetea(lista);
            mostrarChipNivel(tipoSeleccionado, huboUnError, chipsNivelEnNivel, visualizarChipNivel);
            mostrarNivel(nivelSeleccionado, huboUnError, listaNivel, renderNivel)
          } else {
            // Cuando es el primer nivel que creo
            areaListaNivel.addClass("hidden");
            deshabilitarBotonera(listaNivel);
            seGuardaOResetea(lista);
            mostrarChipNivel(tipoSeleccionado, huboUnError, chipsNivelEnNivel, visualizarChipNivel);
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
      areaListaNivel.removeClass("hidden");
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
    ulChips.find("li").each(function () {
      $(this).addClass("noSelectable");
    });
  }

  function removerClaseNoSelectableChips(ulChips) {
    ulChips.find("li").each(function () {
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

  eliminarExamenLista = function (uuid, lista) {
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
        areaListaNivel.addClass("hidden");

        // Indico que este elemento debe ser removido
        removeNivel.push(uuid);
        cambioOrdenChipNiveles = true;
        seGeneroUnCambioEnLista(lista);
        break;
    }
  }

  examenAEliminar = { uuid: "", lista: "" };

  //////////////////// Configuracion de botones de cada elemento LI de la lista
  function asignarFuncionalidadBotonesLista(elemento, lista) {
    $(`#${elemento.uuid}_delete`).on("click", () => {
      examenAEliminar.uuid = elemento.uuid;
      examenAEliminar.lista = lista;
    });

    $(`#${elemento.uuid} input`).on("input", function () {
      $(`#${elemento.uuid}`).attr("dirty_input", (index, attr) => 1);
      seGeneroUnCambioEnLista(lista);
    });

    $(`#${elemento.uuid}_visibility`).on("click", function () {
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
      examenAEliminar.uuid = elemento.uuid;
      examenAEliminar.lista = lista;
    });

    $(`#${elemento.uuid}_nombre`).on("input", function () {
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

    $(`#${elemento.uuid}_descripcion`).on("input", function () {
      $(`#${elemento.uuid}_nivel`).attr("dirty_input_descripcion", 1);
      cambioDataNivel = true;
      seGeneroUnCambioEnLista(lista);
    });

    $(`#${elemento.uuid}_visibility`).on("click", function () {
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

    $(`#${elemento.uuid}_imagen`).on("change", function () {
      $(`#${elemento.uuid}_nivel`).attr("dirty_imagen", 1);
      cambioDataNivel = true;
      seGeneroUnCambioEnLista(lista);
    });

    $(`#${elemento.uuid}_pdf`).on("change", function () {
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

    $(`#${elemento.uuid}_nombre`).on("input", function () {
      cambioModalidades = true;
      seGeneroUnCambioEnLista(lista);
    });

    $(`#${elemento.uuid}_txt_img`).on("input", function () {
      cambioModalidades = true;
      seGeneroUnCambioEnLista(lista);
    });

    $(`#${elemento.uuid}_precio`).on("input", function () {
      cambioModalidades = true;
      seGeneroUnCambioEnLista(lista);
    });

    $(`#${elemento.uuid}_visibility`).on("click", function () {
      cambioModalidades = true;
      seGeneroUnCambioEnLista(lista);

      // Si esta la visibilidad en false, el input se ve inactivo
      $(`#${elemento.uuid}_nombre`).toggleClass("inputInactivo");
      $(`#${elemento.uuid}_txt_img`).toggleClass("inputInactivo");

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

      start: function (e, ui) {
        // creates a temporary attribute on the element with the old index
        $(this).attr("data-previndex", ui.item.index());

        ui.placeholder.height(ui.helper[0].scrollHeight * 1.15); // 1.15 para tener en cuenta el lugar del borde del li al moverse y no se generen saltos visuales
      },

      update: function (e, ui) {
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

      start: function (e, ui) {
        // creates a temporary attribute on the element with the old index
        $(this).attr("data-previndex", ui.item.index());

        ui.placeholder.height(ui.helper[0].scrollHeight * 1.15); // 1.15 para tener en cuenta el lugar del borde del li al moverse y no se generen saltos visuales
      },

      update: function (e, ui) {
        // gets the new and old index then removes the temporary attribute
        var newIndex = ui.item.index();
        var oldIndex = $(this).attr("data-previndex");
        $(this).removeAttr("data-previndex");

        //Si no se movio de lugar, no se genera ningun cambio

        !(newIndex === oldIndex)
          ? (function () {
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

      start: function (e, ui) {
        ui.placeholder.height(ui.helper[0].scrollHeight * -0.6); // 1.15 para tener en cuenta el lugar del borde del li al moverse y no se generen saltos visuales

        // creates a temporary attribute on the element with the old index
        $(this).attr("data-previndex", ui.item.index());
      },

      update: function (e, ui) {
        // gets the new and old index then removes the temporary attribute
        var newIndex = ui.item.index();
        var oldIndex = $(this).attr("data-previndex");
        $(this).removeAttr("data-previndex");

        //Si no se movio de lugar, no se genera ningun cambio       
        !(newIndex === oldIndex)
          ? (function () {
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
        $(event.target).children(".ui-selected").not(":first").removeClass("ui-selected");

        // Obtengo el uuid del elemento seleccionado
        let idSelected = $(event.target).children(".ui-selected").attr("id");

        // Si selecciono un chip vólido, obtengo el id y mando a buscar info a la DB, 
        // Si no selecciono ningun chip escondo la lista y la botonera de guardar/reset
        if (idSelected && ulChips === chipsMateriaEnTipo) {

          //Selecciono una Materia en Acordeon Tipo
          listaTipo.removeClass("hidden");
          botonesTipo.removeClass("hidden");
          agregarTipo.removeClass("hidden");
          appendProgressIndeterminate(listaTipo);
          mostrarListaTipo(idSelected, huboUnError, estadoTipo, renderListaMateriaOTipo, listaTipo, seGuardaOResetea)

        } else if (idSelected && ulChips === chipsMateriaEnNivel) {
          //Selecciono una Materia en Acordeon Nivel y me muestra los Tipos
          areaTipoEnNivel.removeClass("hidden");
          areaNivelEnNivel.addClass("hidden");
          botonesNivel.addClass("hidden");
          areaListaNivel.addClass("hidden");
          chipsTipoEnNivel.empty();

          appendProgressIndeterminate(chipsTipoEnNivel);
          mostrarChipTipo(idSelected, huboUnError, chipsTipoEnNivel, visualizarChipMateriaTipo);

        } else if (idSelected && ulChips === chipsTipoEnNivel) {
          //Selecciono un Tipo en solapa Nivel
          areaNivelEnNivel.removeClass("hidden");
          botonesNivel.removeClass("hidden");
          areaListaNivel.addClass("hidden");
          chipsNivelEnNivel.empty();
          appendProgressIndeterminate(chipsNivelEnNivel);

          lugarBotonAgregarNivel.empty();
          lugarBotonAgregarNivel.append(botonAgregarNivel());
          asignarFuncionalidadBotonAgregarNivel();

          mostrarChipNivel(idSelected, huboUnError, chipsNivelEnNivel, visualizarChipNivel);

        } else if (idSelected && ulChips === chipsNivelEnNivel) {
          //Selecciono un Nivel en la solapa nivel
          appendProgressIndeterminate(listaNivel);
          $('#areaListaNivel').removeClass("hidden");
          mostrarNivel(idSelected, huboUnError, listaNivel, renderNivel);
        }

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
    <div id="${nivel.uuid}_nivel" activo="${nivel.activo}" mostrar_cliente="${nivel.mostrar_cliente}" dirty_input_nombre="0" dirty_input_descripcion="0" dirty_pdf="0" dirty_imagen="0" dirty_mostrar_cliente="0" class="col s10 m10 l10 xl10 offset-s1 offset-m1 offset-l1 offset-xl1">

      <div class="container right clear-top-1">
        <a href="#modalEliminar" class="secondary-content delete modal-trigger">
          <i id="${nivel.uuid}_delete" class="material-icons-outlined azul-texto right button-opacity ">delete</i>
        </a>
        
        <a class="secondary-content check">
          <i id="${nivel.uuid}_visibility" class="material-icons-outlined azul-texto right button-opacity">${nivel.mostrar_cliente ? "visibility" : "visibility_off"}</i>
        </a>
      </div>

      <div class="row padding0 margin0">
          <div class="input-field col s12 padding0 margin0  ">
            <input class="weight500 ${!nivel.mostrar_cliente ? "inputInactivo" : ""}" autocomplete="off" placeholder="Tíulo" id="${nivel.uuid}_nombre" type="text" value="${nivel.nombre}">
          </div>
      </div>


      <div class="row input-field padding0 margin0">
          <textarea id="${nivel.uuid}_descripcion" class="materialize-textarea" autocomplete="off" placeholder="Descripción del examen">${nivel.descripcion}</textarea>
      </div>

      <div class="row">
        <div class="col s12 m12 l12 xl12">
        <div class="col s1 l1 m1 xl1 clear-top-1-5">
                <a id="${nivel.uuid}_agregarModalidad" class="btn-floating btn-small waves-effect waves-light background-darkGrey ">
                    <i class="material-icons">add</i>
                </a>
            </div>

            <div class="input-field col s5 m5 l5 xl5" >
                <input id="${nivel.uuid}_modalidad" type="text" autocomplete="off" >
                <label for="${nivel.uuid}_modalidad">Modalidad</label>
            </div>

            <div class="input-field col s3 m3 l3 xl3">
                <input id="${nivel.uuid}_modalidad_precio" type="number" autocomplete="off" >
                <label for="${nivel.uuid}_modalidad_precio">Precio €</label>                
            </div>

            <div class="col s3 m3 l3 xl3 clear-top-1">
              <label>
                <input id="${nivel.uuid}_examen_RW" type="checkbox" class="filled-in"  />
                <span>Escrito</span>
              </label>                       
    
              <label>
                <input id="${nivel.uuid}_examen_LS" type="checkbox" class="filled-in"   />
                <span>Oral</span>
              </label>
            </div>
            
        </div>

        <div class="row">
            <div class="col s12 m12 l12 xl12">
                <ul id="modalidadNivel" class="collection collectionSinBorde ">                     
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
  <li id="${modalidad.uuid}" class="collection-item grey lighten-4 padding03rem margin-bottom-0-4"  RW="${modalidad.examen_RW ? 1 : 0}" LS="${modalidad.examen_LS ? 1 : 0}"   >
    <div class="row margin0">
      <div class="col s1 m1 l1 xl1">
        <a class="secondary-content left">
          <i class="relative10pxtop material-icons-outlined azul-texto left button-opacity cursorPointer move-button">import_export</i>
        </a>
      </div>
      
      <div class="col s5 m5 l5 xl5 ">

        <input id="${modalidad.uuid}_nombre" class="browser-default ${!modalidad.mostrar_cliente ? "inputInactivo" : ""}" type="text" value="${modalidad.nombre}"/>
      </div>
      <div class="col s4 m4 l4 xl4 ">  
        <span class="azul-texto">€</span>
        <input id="${modalidad.uuid}_precio" class="browser-default precio width4rem" type="number" value="${modalidad.precio}"/>
        
      </div>

      <div class="col s1 m1 l1 xl1 ">
       
          ${modalidad.examen_LS ?
        `<span class="new badge margin-left-0-15 margin-right-1 right orange" data-badge-caption="">ORAL</span>` : `<span class="new badge margin-left-0-15 margin-right-1 right background-grey" data-badge-caption=""></span>`}
              

      </div>
      <div class="col s1 m1 l1 xl1 ">
      <a class="secondary-content check">
          <i id="${modalidad.uuid}_visibility" class="material-icons-outlined azul-texto right button-opacity cursorPointer">${modalidad.mostrar_cliente ? "visibility" : "visibility_off"}</i>
        </a> 
      </div>
    </div>




    <div class="row margin0">

      <div class="col s9 m9 l9 xl9 offset-s1 offset-m1 offset-l1 offset-xl1">
      <i class="material-icons-outlined azul-texto left">photo</i>
        <input id="${modalidad.uuid}_txt_img" placeholder="Texto sobre imagen" class="relative2pxtop browser-default ${!modalidad.mostrar_cliente ? "inputInactivo" : ""}" type="text" value="${modalidad.txt_img ? modalidad.txt_img : ""}"/>
      </div>

      <div class="col s1 m1 l1 xl1 ">
        ${modalidad.examen_RW ?
        `<span class="new badge margin-left-0-15 margin-right-1 right light-blue" data-badge-caption="">ESCR</span>` : `<span class="new badge margin-left-0-15 margin-right-1 right background-grey" data-badge-caption=""></span>`}
      </div>

      <div class="col s1 m1 l1 xl1 ">
        <a class="secondary-content delete">
          <i id="${modalidad.uuid}_delete" class="material-icons-outlined azul-texto right button-opacity cursorPointer">delete</i>
        </a>
      </div>

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
        </li>
        `;
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

    lista.find(`li`).each(function () {
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
      chipsNivelEnNivel.find(`li`).each(function () {
        let nivelId = $(this).attr("id");

        chipNiveles.push({
          uuid: nivelId,
          orden: ordenNivel++
        });
      });

      let ordenModalidad = 1;
      $("#modalidadNivel")
        .find(`li`)
        .each(function () {
          let modalidadId = $(this).attr("id");

          modalidades.push({
            uuid: modalidadId,
            orden: ordenModalidad++,
            nombre: $(`#${modalidadId}_nombre`).val(),
            precio: $(`#${modalidadId}_precio`).val(),
            mostrar_cliente: $(`#${modalidadId}_visibility`).text() === "visibility" ? 1 : 0,
            examen_RW: $(`#${modalidadId}`).attr("rw"),
            examen_LS: $(`#${modalidadId}`).attr("ls"),
            edita_user_secundario: 0,
            txt_img: $(`#${modalidadId}_txt_img`).val(),
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

      chipsNivelEnNivel.find(`li`).each(function () {
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









  async function updateTipo(cambios, exito, error, idEstado, accionExitosa, seGuardaOResetea, lista) {
    try {
      const response = await fetch(`/dashboard/examenes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(cambios)
      });
      const rta = await response.json();

      if (rta.error) {
        error(idEstado)
      } else {
        exito(idEstado);
        accionExitosa(cambios.materia, error, lista, renderListaMateriaOTipo, listaTipo, seGuardaOResetea);
        seGuardaOResetea(lista);
      }

    } catch (err) {
      console.log(err);
      err ? error(idEstado) : null;
    }
  }



  async function updateNivelModalidad(cambios, accionExitosa, huboUnError, idEstadoNivel, mostrarNivel, seGuardaOResetea, lista, tipoSeleccionado, nivelSeleccionado) {
    try {
      const response = await fetch(`/dashboard/examenesUpdateNivelModalidad/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(cambios)
      });
      const rta = await response.json();
      // Luego de guardar las cosas en la base de datos, me trae esa info      

      if (rta.error) {
        huboUnError(idEstadoNivel)
      } else {
        await mostrarChipNivel(tipoSeleccionado, huboUnError, chipsNivelEnNivel, visualizarChipNivel);
        await mostrarNivel(cambios.uuid, huboUnError, listaNivel, renderNivel);
        accionExitosa(idEstadoNivel);
        seGuardaOResetea(lista);
      }

    } catch (err) {
      console.log(err);
      err ? huboUnError(idEstadoNivel) : null;
    }
  }


  function accionExitosa(id) {
    id.empty();
    id.append('<span class="azul-texto">Se realizaron los cambios</span>');
    setTimeout(() => id.empty(), 4000)
  }

  function huboUnError(id) {
    id.empty();
    id.append('<span class="rojo-texto">Hubo un error. Contactate con personal técnico.</span>');
    setTimeout(() => id.empty(), 6000)
  }

  function appendProgressIndeterminate(lista) {
    lista.empty();
    lista.append(`<div class="progress "><div class="indeterminate"></div></div>
      `);
  }


  function preloader() {
    return `
    <div class="preloader-wrapper xsmall active ">
      <div class="spinner-layer spinner-yellow-only ">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div>
        <div class="gap-patch">
          <div class="circle"></div>
        </div>
        <div class="circle-clipper right">
          <div class="circle"></div>
         </div>
      </div>
    </div>    
    `
  }


  /////////////////////////////////////////////////////////////  SERVICIO  /////////////////////////////////////////////////////////////
  // Busca las materias en la DB y renderiza la lista
  async function mostrarListaMateria(huboUnError, estadoMateria, renderListaMateriaOTipo, listaMateria, seGuardaOResetea) {
    try {
      const response = await fetch("/dashboard/materia");
      const rta = await response.json();

      if (rta.error) {
        huboUnError(estadoMateria)
        console.log(rta.error);
      } else {
        renderListaMateriaOTipo(rta, listaMateria);
        seGuardaOResetea ? seGuardaOResetea(listaMateria) : null;
      }

    } catch (err) {
      err ? huboUnError(estadoMateria) : null;
      console.log(err);
    }
  }

  // Busca las materias en la DB y renderiza los chips. listaChips: aqui se colgaran los chips // listaLis: se limpia esta lista
  async function mostrarChipMateria(huboUnError, listaEstado, accion, lista) {
    try {
      const response = await fetch("/dashboard/materia");
      const rta = await response.json();

      if (rta.error) {
        huboUnError(listaEstado)
        console.log(rta.error);
      } else {
        accion(rta, lista);
      }

    } catch (err) {
      err ? huboUnError(listaEstado) : null;
      console.log(err);
    }
  }

  //Update Materia
  async function updateMateria(cambios, exito, error, idEstado, accionExitosa, seGuardaOResetea, lista) {
    try {
      const response = await fetch(`/dashboard/examenes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(cambios)
      });
      const rta = await response.json();

      if (rta.error) {
        error(idEstado)
        console.log(rta.error)
      } else {
        exito(idEstado);
        accionExitosa(error, idEstado, renderListaMateriaOTipo, listaMateria, seGuardaOResetea);
        seGuardaOResetea(lista);
      }

    } catch (err) {
      console.log(err);
      err ? error(idEstado) : null;
    }
  }

  // Busca las tipos en la DB de cada materiaID ingresada y renderiza la lista
  async function mostrarListaTipo(tipoId, huboUnError, listaEstado, renderListaMateriaOTipo, listaTipo, seGuardaOResetea) {
    try {
      const response = await fetch(`/dashboard/tipo/${tipoId}`);
      const rta = await response.json();


      if (rta.error) {
        huboUnError(listaEstado)
        console.log(rta.error);
      } else {
        renderListaMateriaOTipo(rta, listaTipo);
        seGuardaOResetea ? seGuardaOResetea(listaTipo) : null;
      }

    } catch (err) {
      err ? huboUnError(listaEstado) : null;
      console.log(err);
    }
  }


  // Busca el nivel seleccionado en la DB y lo renderiza
  async function mostrarNivel(nivelId, huboUnError, listaNivel, renderNivel) {
    try {
      const response = await fetch(`/dashboard/nivel/${nivelId}`);
      const rta = await response.json();

      if (rta.error) {
        huboUnError(listaNivel)
        console.log(rta.error);
      } else {
        renderNivel(rta, listaNivel);
      }

    } catch (err) {
      err ? huboUnError(listaNivel) : null;
      console.log(err);
    }
  }

  // Busca las modalidades del nivel seleccionado en la DB y las renderiza
  async function mostrarModalidad(nivelId, huboUnError) {
    try {
      const response = await fetch(`/dashboard/modalidad/${nivelId}`);
      const rta = await response.json();

      if (rta.error) {
        huboUnError($("#modalidadNivel"))
        console.log(rta.error);
      } else {
        renderModalidad(rta, $("#modalidadNivel")); // modalidadNivel no la ingreso en las const de arriba porque no existe al inicio
      }

    } catch (err) {
      err ? huboUnError($("#modalidadNivel")) : null;
      console.log(err);
    }
  }


  // Busca los tipos en la DB y renderiza los chips
  async function mostrarChipTipo(idSelected, huboUnError, chipsTipoEnNivel, visualizarChipMateriaTipo) {
    try {
      const response = await fetch(`/dashboard/tipo/${idSelected}`);
      const rta = await response.json();


      if (rta.error) {
        huboUnError(chipsTipoEnNivel)
        console.log(rta.error);
      } else {
        rta.length ? visualizarChipMateriaTipo(rta, chipsTipoEnNivel) : chipsTipoEnNivel.empty().append("Este elemento está vacío");
      }

    } catch (err) {
      err ? huboUnError(chipsTipoEnNivel) : null;
      console.log(err);
    }
  }

  // Busca los niveles en la DB y renderiza los chips
  async function mostrarChipNivel(idSelected, huboUnError, chipsNivelEnNivel, visualizarChipNivel) {
    try {
      const response = await fetch(`/dashboard/nivelChip/${idSelected}`);
      const rta = await response.json();

      if (rta.error) {
        huboUnError(chipsNivelEnNivel)
        console.log(rta.error);
      } else {
        visualizarChipNivel(rta, chipsNivelEnNivel);
      }

    } catch (err) {
      err ? huboUnError(chipsNivelEnNivel) : null;
      console.log(err);
    }
  }

}());



