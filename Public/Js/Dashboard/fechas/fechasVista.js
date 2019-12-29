class FechasVista {
  constructor() {
    this.fechasServicio = new FechasServicio();

    this.traerListaDeExamenesDb();
    this.examenesFromDB = [];

    this.habilitarSelectableChipDiaSemanaAgregar($("#chipsSeleccionDiaSemanaAgregar"));
    this.habilitarSelectableChipDiaSemanaEditar($("#chipsSeleccionDiaSemanaEditar"));


    /// Agregar Examenes a Fecha día:
    this.addExamenesFechaDia = [];
    this.removeExamenesFechaDia = [];
    this.cambioInputFecha = false; // para cambios de input fecha (hora,dia,finalizacion, cupo o pausado de la fecha)
    this.cambioPausadoFecha = false;
    this.cambioPausadoExamenes = false;

    this.lastExamSelected = [];
    this.fechaAEliminar = { uuid: "", lista: "" };
    this.yaSeHizoUnCambio = false;

    //se usa para chequear cupos suficientes de reservas al asignar a dia ls en la seccion de semanaLS
    this.cupoExamenSeleccionado = [];

    this.reservasEnCurso = [];

    this.inicializarModalEliminar();
    this.inicializarCollapsible();

  }

  inicializarModalEliminar() {
    $(document).ready(function () {
      $('.modal').modal();
    });
  }

  inicializarCollapsible() {
    $('.collapsible').collapsible();
  }

  async traerListaDeExamenesDb() {
    this.examenesFromDB = await this.fechasServicio.getListaExamenes();
    this.establecerOrdenListaExamenes(this.examenesFromDB);
  }

  establecerOrdenListaExamenes(listaExamenes) {
    //Ordeno la lista de examenes primero por Materia, luego Tipo, luego Nivel, luego Modalidad.
    listaExamenes.sort(function (objA, objB) {
      let ordenMateriaA = objA.orden_materia;
      let ordenMateriaB = objB.orden_materia;

      // Se ordenan primero por orden materia
      if (ordenMateriaA > ordenMateriaB) {
        return 1;
      } else if (ordenMateriaA < ordenMateriaB) {
        return -1;
      } else {
        // Dentro de las mismas materias, ordenamos por tipo
        let ordenTipoA = objA.orden_tipo;
        let ordenTipoB = objB.orden_tipo;

        if (ordenTipoA > ordenTipoB) {
          return 1;
        } else if (ordenTipoA < ordenTipoB) {
          return -1;
        } else {
          // Dentro de las mismos tipos, ordenamos por nivel
          let ordenNivalA = objA.orden_nivel;
          let ordenNivalB = objB.orden_nivel;

          if (ordenNivalA > ordenNivalB) {
            return 1;
          } else if (ordenNivalA < ordenNivalB) {
            return -1;
          } else {
            // Dentro de las mismos niveles, ordenamos por modalidad
            let ordenModalidadA = objA.orden_modalidad;
            let ordenModalidadB = objB.orden_modalidad;

            if (ordenModalidadA > ordenModalidadB) {
              return 1;
            } else if (ordenModalidadA < ordenModalidadB) {
              return -1;
            } else {
              return 0;
            }
          }
        }
      }
    });
  }

  habilitarTostadaGuardarResetear() {
    $('.noSelectable, .collapsible-header').on(
      'click',
      function () {
        M.toast({ html: "Debe Guardar o Resetear cambios para proceder" });
      }
    );
  }

  deshabilitarTostadaGuardarResetear() {
    $('.noSelectable, .collapsible-header').off('click');
  }

   // Tostadas que avisan que debe seleccionar una fecha
   habilitarTostadaSeleccioneUnaFecha() {
    $(".collapsible-header").on("click",    
      function () {
        M.toast({ html: "Debe seleccionar una fecha" });
      }
    );
  }

  deshabilitarTostadaSeleccioneUnaFecha() {
    $(".collapsible-header").off("click");
  }

  aplicarClaseNoSelectableChips(ulChips) {
    ulChips.find("li").each(function () {
      $(this).addClass("noSelectable");
      $('#listaHorarios .ui-selected').removeClass("noSelectable");
    });
  }

  removerClaseNoSelectableChips(ulChips) {
    ulChips.find("li").each(function () {
      $(this).removeClass("noSelectable");
    });
  }

  habilitarSelectableChipDiaSemanaAgregar(ulChips) {
    ulChips.selectable({
      // Cuando selecciono un chip y tengo cambios pendientes, asigno una clase noSelectable a los chips y debo ejecutar listaX.selectable("disable")
      cancel: ".noSelectable",

      stop: (event, ui) => {
        // Evito que se seleccionen multiples chips. Quedará solo seleccionado el primero si hay una selección de más de un chip
        $(event.target)
          .children(".ui-selected")
          .not(":first")
          .removeClass("ui-selected");

        // Obtengo chip seleccionado
        let idSelected = $(event.target)
          .children(".ui-selected")
          .attr("id");

        if (idSelected === "agregarChipDiaHora" || idSelected === "agregarChipSemana") {
          $('#areaEditarFecha').empty();
        }

        // Selecciono una Chip y me muestra lo solicitado
        idSelected === "agregarChipDiaHora" ? this.mostrarAgregarDiaHora() : null;

        idSelected === "agregarChipSemana" ? this.mostrarAgregarSemana() : null;
      }
    });
  }

  habilitarSelectableChipDiaSemanaEditar(ulChips) {
    ulChips.selectable({
      // Cuando selecciono un chip y tengo cambios pendientes, asigno una clase noSelectable a los chips y debo ejecutar listaX.selectable("disable")
      cancel: ".noSelectable",

      stop: (event, ui) => {
        // Evito que se seleccionen multiples chips. Quedará solo seleccionado el primero si hay una selección de más de un chip
        // $(event.target)
        //   .children(".ui-selected")
        //   .not(":first")
        //   .removeClass("ui-selected");

        

        // Obtengo chip seleccionado
        let idSelected = $(event.target)
          .children(".ui-selected")
          .attr("id");

        if (idSelected === "editarChipDiaHora" || idSelected === "editarChipSemana") {
          $('#areaAgregarFecha').empty();
          $('#areaEditarFecha').empty().append(this.mostrarAreaEdicionFechas())
          this.appendProgressIndeterminate($("#listaHorarios"))

          this.habilitarSelectableFechas($("#listaHorarios"));
          this.botonAgregarExamenesAFecha();
        }

        let fechasAntiguas = ($('#fechasAntiguas').filter(":checked").val()) ? true : false;

        // Selecciono una Chip y me muestra lo solicitado
        idSelected === "editarChipDiaHora" ? this.mostrarListaDeHorarios(null, fechasAntiguas) : null;

        idSelected === "editarChipSemana" ? this.mostrarListaDeSemanas(null, fechasAntiguas) : null;

        this.habilitarTostadaSeleccioneUnaFecha();
      }
    });
  }

  // AL SELECCIONAR UN ELEMENTO DE LA TABLA DE LA IZQUIERDA (SELECCIONA FECHAS DIA o SEMANA)
  habilitarSelectableFechas(lista) {
    lista.selectable({
      cancel: ".noSelectable, .noClickable",

      stop: (event, ui) => {
        // Evito que se seleccionen multiples elementos. Quedará solo seleccionado el de mas arriba de la lista si arrastro la selección
        $(event.target)
          .children(".ui-selected")
          .not(":first")
          .removeClass("ui-selected");

        // Obtengo ID del elemento seleccionado
        let idSelected = $(event.target)
          .children(".ui-selected")
          .attr("id");

        // Si apreto en el scrollbar (no tengo ningun ID seleccionado). Como me deselecciona el elemento, le vuelvo a aplicar la clase ui-selected.
        if (!idSelected) {
          $(event.target)
            .find(`[id='${this.lastExamSelected}']`)
            .addClass("ui-selected");
          return;
        }

        // Si selecciono la fecha que esta seleccionada, no hago nada
        if (idSelected === this.lastExamSelected) {
          return;
        }

        if (idSelected) {
          // Deshabilito las tostadas que indican que debe seleccionar una fecha
          this.deshabilitarTostadaSeleccioneUnaFecha();

          // Obtengo el tipo de dia si es una fecha (RW o LS) o un numero de 6 cifras si es una semana YYYYSS
          let tipoSelected = $(event.target)
            .children(".ui-selected")
            .attr("tipo");

          // Asigno a una variable temporal el ultimo id seleccionado (porque si apreto el scrollbar me deselecciona el elemento)
          this.lastExamSelected = idSelected;

          // Habilito la posibilidad de Ingresar al acordeon para editar fechas o ver reservas
          $('.collapsible').collapsible();

          // SE SELECCIONA UN DIA RW ///////////////////////////////////////
          if (tipoSelected === "RW") {
            // limpio la lista de examenes del lado derecho y el area de cambios debajo de la lista
            $("#listaExamenes").empty();
            $('#areaCambios').empty();

            // Muestro progress bar mientras obtengo de la DB la lista de examenes
            this.appendProgressIndeterminate($("#listaExamenes"))

            // reseteo el estado de cambios de la tabla de examenes (tabla de la derecha)
            this.cleanEstadoListaExamen();

            //obtengo la fecha seleccionada y chequeo si es editable o no (true o false) segun si es una fecha anterior a la actual o posterior
            let fechaExamen = $(`#${idSelected}`).attr("fechaexamen")
            let fechaEditable = this.chequearSiEsFechaEditable(fechaExamen);

            //Genero la lista de opciones para el dropdown de examenes teniendo en cuenta si la fecha de examen corresponde a LS o a RW
            this.generarListaDeExamenes(tipoSelected);

            //Muestro la lista de examenes asignados a esta fecha (id de la fecha, RW LS o semana, true o false si es editable o no)
            this.mostrarExamenesEnListaFromDB(idSelected, tipoSelected, fechaEditable);

            // Al elemento que esta seleccionado (que tiene clase ui-selected), le aplico a su icono remover la clase modal-trigger para que pueda aparecer el modal que pregunta si quiero eliminar el examen
            $('.noClickable').removeClass("modal-trigger");
            if ($(`#${idSelected}`).hasClass("ui-selected")) {
              $(`#${idSelected}_remover`).addClass("modal-trigger")
            }

            // Si es posible editar la fecha
            if (fechaEditable) {
              // muestro el panel de input debajo de la tabla de examenes (tabla de la derecha)
              this.areaCambiosFechaDia();

              // muestro el dropdown de todos examenes que se pueden agregar a la tabla de examenes
              $('#inputSelectarExamenes').removeClass("notVisible");

              // ingreso los valores actuales a los campos de input de la fecha asignada
              this.mostrarInputsCambioDia(idSelected);

              // Inicializo datepicker del framework materialize
              this.inicializarDateTimePickerDiaCambios();

              // Limpio el espacio para mensajes de error al lado del boton guardar
              $("#estadoCambiosFechaExamenes").empty();

              // si hay un cambio en algun campo de input habilito el boton de guardado
              this.escucharCambioEnInputs();

              // habilito el listener al boton guardar cambios y resetear
              this.habilitarBotonGuardarExamenesEnFecha();
              this.habilitarBotonResetExamenesEnFecha();

              // si no es posible editar la fecha
            } else {
              // escondo el dropdown de examenes disponibles a agregar
              $('#inputSelectarExamenes').addClass("notVisible");

              // muestro un mensajes diciendo que la fecha fue rendida
              this.areaCambiosFechaRendida()
            }

            // genero la lista de reservas a esa fecha seleccionada
            this.generarListaReservaDiaRw(idSelected, fechaEditable)

            // SE SELECCIONA UN DIA LS ///////////////////////////////////////
          } else if (tipoSelected === "LS") {
            // limpio la lista de examenes del lado derecho y el area de cambios debajo de la lista
            $("#listaExamenes").empty();
            $('#areaCambios').empty();

            this.appendProgressIndeterminate($("#listaExamenes"))

            // reseteo el estado de cambios de la tabla de examenes (tabla de la derecha)
            this.cleanEstadoListaExamen();

            //obtengo la fecha seleccionada y chequeo si es editable o no (true o false) segun si es una fecha anterior a la actual o posterior
            let fechaExamen = $(`#${idSelected}`).attr("fechaexamen")
            // Es editable si la fecha no es anterior a la actual
            let fechaEditable = this.chequearSiEsFechaEditable(fechaExamen);

            // escondo el dropdown de los examenes que se pueden agregar a la tabla de examenes. Se agregan a una semana, no a un dia.
            $('#inputSelectarExamenes').addClass("notVisible");

            //Muestro la lista de examenes asignados a esta fecha (id de la fecha, RW LS o semana, true o false si es editable o no)
            this.mostrarExamenesEnListaFromDB(idSelected, tipoSelected, fechaEditable);

            //NO MUESTRO EXAMENES EN DIA LS. ESO SE VE EN EXAMENES EN SEMANA LS
            //$("#listaExamenes").append(`<div class="azul-texto weight700 padding0-7rem">Los exámenes de Listening se deben asignar a una Semana.</div>`)

            // Al elemento que esta seleccionado (que tiene clase ui-selected), le aplico a su icono remover la clase modal-trigger para que pueda aparecer el modal que pregunta si quiero eliminar el examen
            $('.noClickable').removeClass("modal-trigger");
            if ($(`#${idSelected}`).hasClass("ui-selected")) {
              $(`#${idSelected}_remover`).addClass("modal-trigger")
            }

            // Si es posible editar la fecha
            if (fechaEditable) {
              // muestro el panel de input debajo de la tabla de examenes (tabla de la derecha)
              this.areaCambiosFechaDia();

              // ingreso los valores actuales a los campos de input de la fecha asignada
              this.mostrarInputsCambioDia(idSelected);

              // Inicializo datepicker del framework materialize
              this.inicializarDateTimePickerDiaCambios();

              // Limpio el espacio para mensajes de error al lado del boton guardar
              $("#estadoCambiosFechaExamenes").empty()

              // si hay un cambio en algun campo de input habilito el boton de guardado
              this.escucharCambioEnInputs();

              // habilito el listener al boton guardar cambios
              this.habilitarBotonGuardarExamenesEnFecha();
              this.habilitarBotonResetExamenesEnFecha();

            } else {
              // escondo el dropdown de examenes disponibles a agregar
              $('#inputSelectarExamenes').addClass("notVisible");

              // muestro un mensajes diciendo que la fecha fue rendida
              this.areaCambiosFechaRendida()
            }

            // genero la lista de reservas a esa fecha seleccionada
            this.generarListaReservaDiaLs(idSelected, fechaEditable)


            // SE SELECCIONA UNA SEMANA LS ///////////////////////////////////////
          } else if (tipoSelected.length === 6) {

            // limpio la lista de examenes del lado derecho y el area de cambios debajo de la lista
            $("#listaExamenes").empty();
            $('#areaCambios').empty();

            // Muestro progress bar mientras obtengo de la DB la lista de examenes
            this.appendProgressIndeterminate($("#listaExamenes"))

            // reseteo el estado de cambios de la tabla de examenes (tabla de la derecha)
            this.cleanEstadoListaExamen();

            //obtengo la fecha seleccionada y chequeo si es editable o no (true o false) segun si es una fecha anterior a la actual o posterior
            let semanaSelected = $(`#${idSelected}`).attr("tipo")
            let fechaEditable = this.chequearSiEsFechaEditable(semanaSelected);

            //Genero la lista de opciones para el dropdown de examenes teniendo en cuenta si la fecha de examen corresponde a LS o a RW
            this.generarListaDeExamenes("LS");

            //Muestro la lista de examenes asignados a esta fecha (id de la fecha, true o false si es editable o no)
            this.mostrarExamenesDeSemanaEnListaFromDB(idSelected, fechaEditable);

            // Al elemento que esta seleccionado (que tiene clase ui-selected), le aplico a su icono remover la clase modal-trigger para que pueda aparecer el modal que pregunta si quiero eliminar el examen
            $('.noClickable').removeClass("modal-trigger");
            if ($(`#${idSelected}`).hasClass("ui-selected")) {
              $(`#${idSelected}_remover`).addClass("modal-trigger")
            }

            // Si es posible editar la fecha
            if (fechaEditable) {
              // muestro el panel de input debajo de la tabla de examenes (tabla de la derecha)
              this.areaCambiosFechaSemana();

              // muestro el dropdown de todos examenes que se pueden agregar a la tabla de examenes
              $('#inputSelectarExamenes').removeClass("notVisible");

              // ingreso los valores actuales a los campos de input de la fecha asignada
              this.mostrarInputsCambioSemana(idSelected);

              // genero para input change semanas los valores de semana, teniendo en cuenta el valor de semana de la fecha seleccionada
              this.semanasProximoAno(semanaSelected);
              this.habilitarFormSelect();

              // Inicializo datepicker del framework materialize para la fecha de finalizacion
              this.inicializarDateTimePickerSemanaCambios();  //// chequear esta funcion

              // Limpio el espacio para mensajes de error al lado del boton guardar
              $("#estadoCambiosFechaExamenes").empty();

              // si hay un cambio en algun campo de input habilito el boton de guardado
              this.escucharCambioEnInputs();

              // habilito el listener al boton guardar cambios
              this.habilitarBotonGuardarExamenesEnFecha();
              this.habilitarBotonResetExamenesEnFecha();

              

            } else {
              // escondo el dropdown de examenes disponibles a agregar
              $('#inputSelectarExamenes').addClass("notVisible");

              // muestro un mensajes diciendo que la fecha fue rendida
              this.areaCambiosFechaRendida()
            }
            this.generarListaReservaSemanaLs(idSelected, fechaEditable);

          }
        }
      }
    });
  }



  cleanEstadoListaExamen() {
    this.addExamenesFechaDia = [];
    this.removeExamenesFechaDia = [];
    this.cambioInputFecha = false;
    this.cambioPausadoExamenes = false;
    this.cambioPausadoFecha = false;
  }

  habilitarFormSelect() {
    $("select").formSelect();
  }

  ddmmyyyyToYyyymmdd(date) {
    return date.split("-").reverse().join("-");
  }

  //////////////////////////////////  AGREGAR DIA RW O DIA LS
  mostrarAgregarDiaHora() {
    $("#areaAgregarFecha").empty();
    $("#areaAgregarFecha").append(this.selectorDiaEscritoUOral());
    $("#areaAgregarFecha").append(this.seleccionarDiaYHora());
    this.inicializarDateTimePickerDia();
    this.aceptarSoloNumerosEnInput("inputCupoAgregarDia");
    this.inicializarListenerBotonAgregarDia();
  }

  selectorDiaEscritoUOral() {
    return `
    <div class="row clear-top-1">    
        <div class="col s12 m12 l12 xl12">
            <label>
                <input id="inputLSAgregarDia" name="selectorDiaEscritoUOral" type="radio" />
                <span class="gris-texto">Examen ORAL</span>
            </label>
        </div>
        <div class="col">
        <label>
            <input id="inputRWAgregarDia" name="selectorDiaEscritoUOral" type="radio" />
            <span class="gris-texto">Examen ESCRITO</span>
        </label>
        </div>        
    </div>
    `;
  }

  seleccionarDiaYHora() {
    return `
    <div class="row margin0">
        <div class="input-field col s5 m4 l3 xl2">
            <input id="inputCupoAgregarDia" type="number" autocomplete="off" >
            <label for="inputCupoAgregarDia">Cupo</label>
        </div>
    </div>

    <div class="row margin0">
        <div class="col s5 m4 l3 xl2">
            <input id="inputFechaAgregarDia" type="text" class="datepicker">
            <label class="gris-texto">DIA</label>
        </div>
        <div class="col s5 m4 l3 xl2">
            <input id="inputHoraAgregarDia" type="text" class="timepicker">
            <label class="gris-texto">HORA</label>
        </div>
        <div class="col s5 m4 l3 xl2">
            <input id="finalizaAgregarDia" type="text" class="datepicker" disabled>
            <label class="gris-texto">FINALIZA inscripción</label>
        </div>
    </div>

      
    <div class="row margin0">
        <div class="col clear-top-2 s12 m12 l12 xl12 valign-wrapper">
            <a id="botonAgregaDia"  class="col disabled waves-effect waves-light btn btn-medium weight400 background-azul">Agregar</a>
            <span id="estadoAgregarDia" class="padding-left2-4" ></span>
        </div>
        
    </div>
    `;
  }

  inicializarListenerBotonAgregarDia() {
    this.chequearInformacionInputDia();

    $("#botonAgregaDia").on("click", () => {
      let fechaExamen = this.ddmmyyyyToYyyymmdd($("#inputFechaAgregarDia").val());
      let fechaFinaliza = this.ddmmyyyyToYyyymmdd($("#finalizaAgregarDia").val());

      // DateTime pongo primero el dia luego la hora
      let fechaDateTime = `${fechaExamen} ${$("#inputHoraAgregarDia").val()}`;

      let agregarDia = {
        uuid: uuidv4(),
        cupo: $("#inputCupoAgregarDia").val(),
        fecha: fechaDateTime,
        finaliza: fechaFinaliza,
        tipo:
          $("#inputRWAgregarDia")
            .filter(":checked")
            .val() == "on"
            ? "RW"
            : "LS"
      };


      let id = $('#estadoAgregarDia')

      // Se envia la informacion
      this.fechasServicio.agregarFechaDia(agregarDia, this.accionExitosa, this.huboUnError, this.cleanAgregarDiaValues, id);
      id.append(this.preloader());

    });
  }

  cleanAgregarDiaValues() {
    $('#inputFechaAgregarDia').val('');
    $('#inputHoraAgregarDia').val('');
    $('#inputCupoAgregarDia').val('');
    $("#inputRWAgregarDia").prop("checked", false)
    $("#inputLSAgregarDia").prop("checked", false);
    $('#finalizaAgregarDia').val('');
    $('#botonAgregaDia').addClass('disabled');
  }

  chequearInformacionInputDia() {
    $('#inputCupoAgregarDia').on('input', () => {
      if (!$('#inputCupoAgregarDia').val()) {
        $("#botonAgregaDia").addClass("disabled");
      }

      if ($("#inputCupoAgregarDia").val() > 0 && $('#inputFechaAgregarDia').val() && $('#inputHoraAgregarDia').val() && ($('#inputRWAgregarDia').filter(":checked").val() || $('#inputLSAgregarDia').filter(":checked").val())) {
        this.chequearSiFechaFinalizacionEsPosterior() ? $("#botonAgregaDia").removeClass("disabled") : $("#botonAgregaDia").addClass("disabled");
      }
    });


    $('#inputFechaAgregarDia').on("change", () => {
      if (this.chequearSiFechaFinalizacionEsPosterior()) {
        if ($('#inputCupoAgregarDia').val() && $('#inputFechaAgregarDia').val() && $('#inputHoraAgregarDia').val() && $("#finalizaAgregarDia").val() && ($('#inputRWAgregarDia').filter(":checked").val() || $('#inputLSAgregarDia').filter(":checked").val())) {
          $("#botonAgregaDia").removeClass("disabled");
        } else {
          $("#botonAgregaDia").addClass("disabled");
        }
      }
    });


    $('#inputHoraAgregarDia').on("change", () => {
      if ($('#inputCupoAgregarDia').val() && $('#inputFechaAgregarDia').val() && $('#inputHoraAgregarDia').val() && $("#finalizaAgregarDia").val() && ($('#inputRWAgregarDia').filter(":checked").val() || $('#inputLSAgregarDia').filter(":checked").val())) {
        this.chequearSiFechaFinalizacionEsPosterior() ? $("#botonAgregaDia").removeClass("disabled") : $("#botonAgregaDia").addClass("disabled");
      } else {
        $("#botonAgregaDia").addClass("disabled");
      }
    });


    $("#finalizaAgregarDia").on("change", () => {
      if (this.chequearSiFechaFinalizacionEsPosterior()) {
        if ($('#inputCupoAgregarDia').val() && $('#inputFechaAgregarDia').val() && $('#inputHoraAgregarDia').val() && $("#finalizaAgregarDia").val() && ($('#inputRWAgregarDia').filter(":checked").val() || $('#inputLSAgregarDia').filter(":checked").val())) {
          $("#botonAgregaDia").removeClass("disabled");
        } else {
          $("#botonAgregaDia").addClass("disabled");
        }
      }
    });

    $('#inputRWAgregarDia').on("change", () => {
      if ($('#inputCupoAgregarDia').val() && $('#inputFechaAgregarDia').val() && $('#inputHoraAgregarDia').val() && $("#finalizaAgregarDia").val() && ($('#inputRWAgregarDia').filter(":checked").val() || $('#inputLSAgregarDia').filter(":checked").val())) {
        this.chequearSiFechaFinalizacionEsPosterior() ? $("#botonAgregaDia").removeClass("disabled") : $("#botonAgregaDia").addClass("disabled");
      } else {
        $("#botonAgregaDia").addClass("disabled");
      }
    })

    $('#inputLSAgregarDia').on("change", () => {
      if ($('#inputCupoAgregarDia').val() && $('#inputFechaAgregarDia').val() && $('#inputHoraAgregarDia').val() && $("#finalizaAgregarDia").val() && ($('#inputRWAgregarDia').filter(":checked").val() || $('#inputLSAgregarDia').filter(":checked").val())) {
        this.chequearSiFechaFinalizacionEsPosterior() ? $("#botonAgregaDia").removeClass("disabled") : $("#botonAgregaDia").addClass("disabled");
      } else {
        $("#botonAgregaDia").addClass("disabled");
      }
    })


  }

  chequearSiEsFechaEditable(fechaExamen) {
    let examenSeleccionado;

    // Si la fecha seleccionada es una semana, calculo el ultimo dia y lo convierto a una fecha comparable
    if (fechaExamen.length === 6) {
      let sem = fechaExamen.substring(4, 6)
      let ano = fechaExamen.substring(0, 4)

      let getLastDayOfWeek = (weekNo, y) => {
        var d1, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
        d1 = new Date("" + y + "");
        numOfdaysPastSinceLastMonday = d1.getDay() - 1;
        d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
        d1.setDate(d1.getDate() + 7 * (weekNo - d1.getWeek()));
        rangeIsFrom =
          d1.getDate() + "/" + (d1.getMonth() + 1) + "/" + d1.getFullYear();
        d1.setDate(d1.getDate() + 6);
        rangeIsTo =
          d1.getDate() + "-" + (d1.getMonth() + 1) + "-" + d1.getFullYear();
        let lastDayOfWeek = this.ddmmyyyyToYyyymmdd(rangeIsTo);
        return lastDayOfWeek
      }
      let temp = getLastDayOfWeek(sem, ano);
      examenSeleccionado = new Date(temp.substring(0, 10))
      // Si la fecha seleccionada es un dia LS o RW, ese dia lo convierto a una fecha comparable
    } else {
      examenSeleccionado = new Date(fechaExamen.substring(0, 10))
    }

    // obtengo la fecha actual para comparar
    let fechaActual = new Date;

    // retorno TRUE si es una fecha editable (posterior a la actual) o FALSE si NO es editable (fecha anterior a la actual)
    if (examenSeleccionado.toISOString().split('T')[0] < fechaActual.toISOString().split('T')[0]) {
      return false;
    } else {
      return true;
    }
  }


  chequearSiFechaFinalizacionEsPosterior() {
    let fechaExamen = this.ddmmyyyyToYyyymmdd($("#inputFechaAgregarDia").val());
    let fechaFinaliza = this.ddmmyyyyToYyyymmdd($("#finalizaAgregarDia").val());

    if (fechaExamen.length > 0 && fechaFinaliza.length > 0) {
      if (fechaExamen > fechaFinaliza) {
        $("#estadoAgregarDia").text("");
        return true;
      } else {
        $("#estadoAgregarDia").empty().append(
          '<div class="rojo-texto padding-top2-5">La Fecha de Finalización de Inscripción debe ser anterior a la fecha de Examen.</div>'
        );
        $("#botonAgregaDia").addClass("disabled");
      }
    }
  }

  chequearSiFechaFinalizacionEsPosteriorEnCambios() {
    let fechaExamen = this.ddmmyyyyToYyyymmdd($("#diaExamenCambio").val());
    let fechaFinaliza = this.ddmmyyyyToYyyymmdd($("#finalizaDiaInscripcionCambio").val());

    if (fechaExamen.length > 0 && fechaFinaliza.length > 0) {
      if (fechaExamen > fechaFinaliza) {
        $("#estadoCambiosFechaExamenes").text("");
        return true;
      } else {
        $("#estadoCambiosFechaExamenes").empty().append(
          '<div class="rojo-texto padding-top2-5">La Fecha de Finalización de Inscripción debe ser anterior a la fecha de Examen.</div>'
        );
        $("#botonGuardarExamenesEnFecha").addClass("disabled");
        $('#resetExamenesEnFecha').addClass('disabled');
      }
    }
  }

  chequearSiFechaFinalizacionEsPosteriorEnSemana() {
    let fechaExamen = this.getDateFirstDayOfWeek(
      $("#listadoSemanas option:selected").attr("semana"),
      $("#listadoSemanas option:selected").attr("ano")
    )
    let fechaFinaliza = this.ddmmyyyyToYyyymmdd($("#finalizaDiaInscripcionCambio").val());
    if (fechaExamen > fechaFinaliza) {
      $("#estadoCambiosFechaExamenes").text("");
      return true;
    } else {
      $("#estadoCambiosFechaExamenes").empty().append(
        '<div class="rojo-texto padding-top2-5">La Fecha de Finalización de Inscripción debe ser anterior a la fecha de Examen.</div>'
      );
      $("#botonGuardarExamenesEnFecha").addClass("disabled");
      $('#resetExamenesEnFecha').addClass('disabled');
    }
  }



  inicializarDateTimePickerDia() {
    $(".timepicker").timepicker({
      twelveHour: false,
      autoClose: true
    });

    $("#inputFechaAgregarDia").datepicker({
      firstDay: 1,
      minDate: new Date(),
      autoClose: true,
      format: "dd-mm-yyyy",
      i18n: {
        months: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre"
        ],
        monthsShort: [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Oct",
          "Nov",
          "Dic"
        ],
        weekdays: [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado"
        ],
        weekdaysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
        weekdaysAbbrev: ["D", "L", "M", "M", "J", "V", "S"]
      },
      onSelect: () => {
        $("#finalizaAgregarDia").removeAttr("disabled");
      },
      onClose: () => {
        this.chequearSiFechaFinalizacionEsPosterior();
      }
    });

    $("#finalizaAgregarDia").datepicker({
      firstDay: 1,
      minDate: new Date(),
      autoClose: true,
      format: "dd-mm-yyyy",
      i18n: {
        months: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre"
        ],
        monthsShort: [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Oct",
          "Nov",
          "Dic"
        ],
        weekdays: [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado"
        ],
        weekdaysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
        weekdaysAbbrev: ["D", "L", "M", "M", "J", "V", "S"]
      },

      onClose: () => {
        this.chequearSiFechaFinalizacionEsPosterior();
      }
    });
  }

  inicializarDateTimePickerDiaCambios() {
    $(".timepicker").timepicker({
      twelveHour: false,
      autoClose: true
    });

    $("#diaExamenCambio").datepicker({
      firstDay: 1,
      minDate: new Date(),
      autoClose: true,
      format: "dd-mm-yyyy",
      i18n: {
        months: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre"
        ],
        monthsShort: [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Oct",
          "Nov",
          "Dic"
        ],
        weekdays: [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado"
        ],
        weekdaysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
        weekdaysAbbrev: ["D", "L", "M", "M", "J", "V", "S"]
      },

      onClose: () => {
        this.chequearSiFechaFinalizacionEsPosteriorEnCambios();
      }
    });

    $("#finalizaDiaInscripcionCambio").datepicker({
      firstDay: 1,
      minDate: new Date(),
      autoClose: true,
      format: "dd-mm-yyyy",
      i18n: {
        months: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre"
        ],
        monthsShort: [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Oct",
          "Nov",
          "Dic"
        ],
        weekdays: [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado"
        ],
        weekdaysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
        weekdaysAbbrev: ["D", "L", "M", "M", "J", "V", "S"]
      },

      onClose: () => {
        this.chequearSiFechaFinalizacionEsPosteriorEnCambios();
      }
    });
  }

  inicializarDateTimePickerSemanaCambios() {
    $("#finalizaDiaInscripcionCambio").datepicker({
      firstDay: 1,
      minDate: new Date(),
      autoClose: true,
      format: "dd-mm-yyyy",
      i18n: {
        months: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre"
        ],
        monthsShort: [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Oct",
          "Nov",
          "Dic"
        ],
        weekdays: [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado"
        ],
        weekdaysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
        weekdaysAbbrev: ["D", "L", "M", "M", "J", "V", "S"]
      },

      onClose: () => {
        this.chequearSiFechaFinalizacionEsPosteriorEnSemana();
      }
    });
  }

  //////////////////////////////////  AGREGAR SEMANA LS
  mostrarAgregarSemana() {
    $("#areaAgregarFecha").empty();
    $("#areaAgregarFecha").append(this.selectorSemanas());

    this.aceptarSoloNumerosEnInput("inputCupoAgregarSemana");
    this.semanasProximoAno();
    this.habilitarFormSelect();
    this.inicializarDateTimePickerSemana();
    this.inicializarListenerBotonAgregarSemana();
  }

  selectorSemanas() {
    return `
    <div class="row">
      <div id="listadoSemanasListenChange" class="input-field col l5 clear-top-3">
          <select id="listadoSemanas">
          </select>
          <label>Seleccionar Semana</label>
      </div>
    </div>

    <div class="row">
      <div class="input-field col s5 m4 l3 xl2">
          <input id="inputCupoAgregarSemana" type="number" autocomplete="off" >
          <label for="inputCupoAgregarSemana">Cupo</label>
      </div>

      <div class="col s5 m4 l3 xl2">
        <input id="finalizaAgregarSemana" type="text" class="datepicker" >
        <label class="gris-texto">FINALIZA inscripción</label>
      </div>
    </div>

    <div class="row margin0">
      <div class="col clear-top-2 valign-wrapper">
          <a id="botonAgregaSemana" class="disabled waves-effect waves-light btn btn-medium weight400 background-azul">Agregar</a>
          <span class="col" id="estadoAgregarSemana"></span>
      </div>      
    </div>
  </div>`;
  }

  seProdujoUnCambio() {
    if (!this.yaSeHizoUnCambio) {
      this.aplicarClaseNoSelectableChips($('#chipsSeleccionDiaSemanaAgregar'));
      this.aplicarClaseNoSelectableChips($('#chipsSeleccionDiaSemanaEditar'));
      this.aplicarClaseNoSelectableChips($('#listaHorarios'));
      this.habilitarTostadaGuardarResetear();
      $('#fechasAntiguas').prop('disabled', true);
      $('#collapsibleEdicionReservas').removeClass('collapsible');
      M.Collapsible.getInstance($('#collapsibleEdicionReservas')).open(0);

    }
    this.yaSeHizoUnCambio = true;
  }

  seGuardoOReseteo() {
    this.deshabilitarTostadaGuardarResetear();
    this.removerClaseNoSelectableChips($('#chipsSeleccionDiaSemanaAgregar'));
    this.removerClaseNoSelectableChips($('#chipsSeleccionDiaSemanaEditar'));
    this.removerClaseNoSelectableChips($('#listaHorarios'));
    $('#fechasAntiguas').prop('disabled', false);
    this.yaSeHizoUnCambio = false;

    $('#botonGuardarExamenesEnFecha').addClass('disabled');
    $('#resetExamenesEnFecha').addClass('disabled');
    $('#collapsibleEdicionReservas').addClass('collapsible');


  }

  escucharCambioEnInputs() {
    $('#diaExamenCambio').on('change', () => {
      $('#botonGuardarExamenesEnFecha').removeClass('disabled');
      $('#resetExamenesEnFecha').removeClass('disabled');
      this.cambioInputFecha = true;
      this.seProdujoUnCambio();
    });

    $('#horaExamenCambio').on('change', () => {
      $('#botonGuardarExamenesEnFecha').removeClass('disabled');
      $('#resetExamenesEnFecha').removeClass('disabled');
      this.cambioInputFecha = true;
      this.seProdujoUnCambio();
    });

    $('#finalizaDiaInscripcionCambio').on('change', () => {
      $('#botonGuardarExamenesEnFecha').removeClass('disabled');
      $('#resetExamenesEnFecha').removeClass('disabled');
      this.cambioInputFecha = true;
      this.seProdujoUnCambio();
    });

    $('#inputCupoCambio').on('input', () => {
      $('#botonGuardarExamenesEnFecha').removeClass('disabled');
      $('#resetExamenesEnFecha').removeClass('disabled');
      this.cambioInputFecha = true;
      this.seProdujoUnCambio();
    });

    $('#listadoSemanasListenChange').on('change', () => {
      $('#botonGuardarExamenesEnFecha').removeClass('disabled');
      $('#resetExamenesEnFecha').removeClass('disabled');
      this.chequearSiFechaFinalizacionEsPosteriorEnSemana()
      this.cambioInputFecha = true;
      this.seProdujoUnCambio();
    });
  }



  inicializarListenerBotonAgregarSemana() {
    // Se prepara la informacion a enviar
    this.chequearInformacionInputSemana();
    $("#botonAgregaSemana").on("click", () => {
      let agregarSemana = {
        uuid: uuidv4(),
        cupo: $("#inputCupoAgregarSemana").val(),
        semana: this.getDateFirstDayOfWeek(
          $("#listadoSemanas option:selected").attr("semana"),
          $("#listadoSemanas option:selected").attr("ano")
        ),
        finaliza: this.ddmmyyyyToYyyymmdd($("#finalizaAgregarSemana").val())
      };

      let id = $('#estadoAgregarSemana')
      // Se envia la informacion
      this.fechasServicio.agregarFechaSemana(agregarSemana, this.accionExitosa, this.huboUnError, this.cleanAgregarSemanaValues, id);
      id.append(this.preloader());

    });
  }

  chequearInformacionInputSemana() {
    $("#inputCupoAgregarSemana").on("input", () => {
      if (!$('#inputCupoAgregarSemana').val()) {
        $("#botonAgregaSemana").addClass("disabled");
      }

      if ($("#inputCupoAgregarSemana").val() > 0) {
        this.chequearSiFechaFinalizacionEsPosteriorSemana() ? $("#botonAgregaSemana").removeClass("disabled") : $("#botonAgregaSemana").addClass("disabled");
      }
    });

    $("#finalizaAgregarSemana").on("change", () => {
      if ($("#inputCupoAgregarSemana").val() > 0) {
        this.chequearSiFechaFinalizacionEsPosteriorSemana() ? $("#botonAgregaSemana").removeClass("disabled") : $("#botonAgregaSemana").addClass("disabled");
      }
    });

    $('#listadoSemanasListenChange').on("change", () => {
      if (this.chequearSiFechaFinalizacionEsPosteriorSemana()) {
        ($("#inputCupoAgregarSemana").val() > 0) ? $("#botonAgregaSemana").removeClass("disabled") : $("#botonAgregaSemana").addClass("disabled");
      }
    });
  }

  chequearSiFechaFinalizacionEsPosteriorSemana() {
    if ($("#finalizaAgregarSemana").val().length > 0) {
      let semanaElegida = this.getDateFirstDayOfWeek($("#listadoSemanas option:selected").attr("semana"), $("#listadoSemanas option:selected").attr("ano"))
      let semanaElegidaDate = new Date(semanaElegida.slice(0, 4), semanaElegida.slice(5, 7) - 1, semanaElegida.slice(8, 11));

      let fechaElegida = this.ddmmyyyyToYyyymmdd($("#finalizaAgregarSemana").val())
      let fechaElegidaDate = new Date(fechaElegida.slice(0, 4), fechaElegida.slice(5, 7) - 1, fechaElegida.slice(8, 11));

      if (semanaElegidaDate > fechaElegidaDate) {
        $("#estadoAgregarSemana").text("")
        return true;
      } else {
        $("#botonAgregaSemana").addClass("disabled");
        $("#estadoAgregarSemana").empty().append(
          '<div class="rojo-texto padding-top0-6">La Fecha de Finalización de Inscripción debe ser anterior a la fecha de Examen.</div>'
        );
        return false;
      }
    }
  }

  cleanAgregarSemanaValues() {
    $("#finalizaAgregarSemana").val('');
    $("#inputCupoAgregarSemana").val('');
    $("#botonAgregaSemana").addClass("disabled")
  }


  accionExitosa(id) {
    id.empty();
    id.append('<div class="azul-texto">Se realizaron los cambios</div>');
    setTimeout(() => id.empty(), 4000)
  }

  huboUnError(id) {
    id.empty();
    id.append('<div class="rojo-texto">Hubo un error. Contactate con personal técnico.</div>');
    setTimeout(() => id.empty(), 6000)
  }

  appendProgressIndeterminate(lista) {
    lista.empty();
    lista.append(`<div class="progress "><div class="indeterminate"></div></div>
    `);
  }


  preloader() {
    return `
    <div class="preloader-wrapper small active ">
      <div class="spinner-layer spinner-yellow-only">
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

  getDateFirstDayOfWeek(weekNo, y) {
    var d1, numOfdaysPastSinceLastMonday, rangeIsFrom;
    d1 = new Date("" + y + "");
    numOfdaysPastSinceLastMonday = d1.getDay() - 1;
    d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
    d1.setDate(d1.getDate() + 7 * (weekNo - d1.getWeek()));
    rangeIsFrom = `${d1.getFullYear()}-${(d1.getMonth() + 1).toString().padStart(2, '0')}-${(d1.getDate()).toString().padStart(2, '0')}`;
    return rangeIsFrom;
  }

  // Hace un listado de las proximas 52 semanas a partir de la fecha actual para seleccionar en dropdown. 
  //Si ingreso una semana como parametro me la pone como seleccionada.
  semanasProximoAno(semanaSelected) {
    let listadoSemanas = $("#listadoSemanas");

    Date.prototype.getWeek = function () {
      var date = new Date(this.getTime());
      date.setHours(0, 0, 0, 0);
      // Thursday in current week decides the year.
      date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
      // January 4 is always in week 1.
      var week1 = new Date(date.getFullYear(), 0, 4);
      // Adjust to Thursday in week 1 and count number of weeks from date to week1.
      return (
        1 +
        Math.round(
          ((date.getTime() - week1.getTime()) / 86400000 -
            3 +
            ((week1.getDay() + 6) % 7)) /
          7
        )
      );
    };

    Date.prototype.getWeekYear = function () {
      var date = new Date(this.getTime());
      date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
      return date.getFullYear();
    };

    function getISOWeeks(y) {
      var d, isLeap;

      d = new Date(y, 0, 1);
      isLeap = new Date(y, 1, 29).getMonth() === 1;

      //check for a Jan 1 that's a Thursday or a leap year that has a
      //Wednesday jan 1. Otherwise it's 52
      return d.getDay() === 4 || (isLeap && d.getDay() === 3) ? 53 : 52;
    }

    //Esta funcion obedece la orden de dd/mm/yyyy
    function getDateRangeOfWeek(weekNo, y) {
      var d1, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
      d1 = new Date("" + y + "");
      numOfdaysPastSinceLastMonday = d1.getDay() - 1;
      d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
      d1.setDate(d1.getDate() + 7 * (weekNo - d1.getWeek()));
      rangeIsFrom =
        d1.getDate() + "/" + (d1.getMonth() + 1) + "/" + d1.getFullYear();
      d1.setDate(d1.getDate() + 6);
      rangeIsTo =
        d1.getDate() + "/" + (d1.getMonth() + 1) + "/" + d1.getFullYear();
      return rangeIsFrom + " a " + rangeIsTo;
    }

    const fechaHoy = new Date();
    const anioActual = () => fechaHoy.getWeekYear();
    const semanaActual = () => fechaHoy.getWeek();
    const semanasTotalAnioActual = () => getISOWeeks(anioActual);

    for (let i = 53, sem = semanaActual(), ano = anioActual(); i >= 1; i--) {
      if (semanaSelected) {
        let semSelected = semanaSelected.toString().substring(4, 6)
        let anoSelected = semanaSelected.toString().substring(0, 4)

        if (semSelected == sem.toString().padStart(2, '0') && anoSelected == ano.toString()) {
          listadoSemanas.append(
            `<option selected value="${sem} ${ano}" semana="${sem}" ano="${ano}">${sem}-${ano} de ${getDateRangeOfWeek(sem, ano)}</option>`
          );
        } else {
          listadoSemanas.append(
            `<option value="${sem} ${ano}" semana="${sem}" ano="${ano}">${sem}-${ano} de ${getDateRangeOfWeek(sem, ano)}</option>`
          );
        }

      } else {
        listadoSemanas.append(
          `<option value="${sem} ${ano}" semana="${sem}" ano="${ano}">Semana ${sem} de ${ano} de ${getDateRangeOfWeek(sem, ano)}</option>`
        );
      }

      if (sem < semanasTotalAnioActual()) {
        sem++;
      } else {
        sem = 1;
        ano++;
      }
    }
  }


  armarStringSemanaAPartirDelPrimerDiaDeSemana(fecha) {
    //Las semanas en la base de datos se guardan escribiiendo el primer dia. 
    //Esta funcion me devuelve el string de la semana elegida dado el lunes de cada semana.

    Date.prototype.getWeek = function () {
      var date = new Date(this.getTime());
      date.setHours(0, 0, 0, 0);
      // Thursday in current week decides the year.
      date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
      // January 4 is always in week 1.
      var week1 = new Date(date.getFullYear(), 0, 4);
      // Adjust to Thursday in week 1 and count number of weeks from date to week1.
      return (
        1 +
        Math.round(
          ((date.getTime() - week1.getTime()) / 86400000 -
            3 +
            ((week1.getDay() + 6) % 7)) /
          7
        )
      );
    };

    Date.prototype.getWeekYear = function () {
      var date = new Date(this.getTime());
      date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
      return date.getFullYear();
    };

    function getDateRangeOfWeek(weekNo, y) {
      var d1, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
      d1 = new Date("" + y + "");
      numOfdaysPastSinceLastMonday = d1.getDay() - 1;
      d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
      d1.setDate(d1.getDate() + 7 * (weekNo - d1.getWeek()));
      rangeIsFrom =
        d1.getDate() + "/" + (d1.getMonth() + 1) + "/" + d1.getFullYear();
      d1.setDate(d1.getDate() + 6);
      rangeIsTo =
        d1.getDate() + "/" + (d1.getMonth() + 1) + "/" + d1.getFullYear();
      return rangeIsFrom + " a " + rangeIsTo;
    }

    let semana = fecha.toString().substring(4, 6)
    let ano = fecha.toString().substring(0, 4)
    let stringSemana = `Semana ${semana} de ${ano} de ${getDateRangeOfWeek(semana, ano)}`
    return stringSemana
  }


  inicializarDateTimePickerSemana() {
    $("#finalizaAgregarSemana").datepicker({
      firstDay: 1,
      minDate: new Date(),
      autoClose: true,
      format: "dd-mm-yyyy",
      i18n: {
        months: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre"
        ],
        monthsShort: [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Oct",
          "Nov",
          "Dic"
        ],
        weekdays: [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado"
        ],
        weekdaysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
        weekdaysAbbrev: ["D", "L", "M", "M", "J", "V", "S"]
      },

      onClose: () => {
        this.chequearSiFechaFinalizacionEsPosteriorSemana();
      }
    });
  }


  aceptarSoloNumerosEnInput(input) {
    $(`#${input}`).on("keydown", function (e) {
      if (e.which == 69 || e.which == 107 || e.which == 109) {
        e.preventDefault();
      }
    });
  }










  //////////////////////////////////  MOSTRAR HORARIOS

  mostrarAreaEdicionFechas() {
    return `

    <div id="ambasListas" class="row">
      <div class="col s12 m12 l7 xl6 clear-top-1 ">
        <div class="azul-texto weight700">Fechas:</div>
        <ul id="listaHorarios" class="collection height24rem content-scroll margin0"></ul>
      </div>

      <div class="col s12 m12 l5 xl6 clear-top-1 ">
        <div class="azul-texto weight700">Exámenes Asignados:</div>
        <ul id="listaExamenes" class="collection height24rem content-scroll margin0"></ul>
      </div>
        
        
      </div>
    </div>

    

    

    <div id="areaReservas" class="row">    
      <div class="col s12 m12 l12 xl12 ">
        <ul id="collapsibleEdicionReservas" class="collapsible collapsible-no-shadow ">
          <li>
            <div class="collapsible-header grey lighten-3 azul-texto">
              <i class="material-icons">edit</i>Editar Fecha y Asignar Exámenes a Fecha
            </div>

            <div class="collapsible-body">

              <div class="row margin0">
                <div id="areaCambios" class="col s6 m6 l6 xl6 margin0"></div>
              

                <div class="col s6 m6 l6 xl6">
                  <div id="inputSelectarExamenes" class="input-field notVisible">
                    <select id="selectarExamenes" multiple>
                      <option value="" disabled>Seleccionar</option>
                    </select>
                    <label>Listado de Exámenes</label>
                
                    <a id="botonAgregarExamenesAFecha" class="azul-texto cursorPointer">
                      <i class="material-icons-outlined left secondary-content button-opacity pointer azul-texto">arrow_upward</i>Agregar Examen a Fecha
                    </a>
                  </div>
                </div>

            </div>

          </li>   


          <li>
            <div class="collapsible-header grey lighten-3 azul-texto">
                <i class="material-icons">assignment</i>Ver Reservas en Fecha, Imprimir Planillas y Enviar Emails
            </div>

            <div class="collapsible-body">
              <div class="row margin0">
                <div id="listadoReservasEnFechas" class="col s12 m12 l12 xl12 "></div>
                <div id="edicionReservasEnFechas" class="col s12 m12 l12 xl12 "></div>
              </div>
            </div>
          </li>   

        </ul>
      </div>
    </div>
    `
  }

  areaCambiosFechaDia() {
    $('#areaCambios').empty();
    $('#areaCambios').append(`
      <div class="row margin0">
        <div class="col s6 m6 l4 xl4 ">
          <input id="diaExamenCambio" type="text" class="datepicker">
          <label class="gris-texto">DIA</label>
        </div>

        <div class="col s4 m4 l2 xl2">
          <input id="horaExamenCambio" type="text" class="timepicker">
          <label class="gris-texto">HORA</label>
        </div>

        <div class="col s6 m6 l4 xl4 ">
          <input id="finalizaDiaInscripcionCambio" type="text" class="datepicker">
          <label class="gris-texto">Finaliza DIA</label>
        </div>

        <div class="input-field col s4 m4 l2 xl2 ">
          <input id="inputCupoCambio" type="number" autocomplete="off" >
          <label for="inputCupoCambio">Cupo</label>
        </div>
      </div>

      <div class="row">
        <div class="col s12 m12 l12 xl12 valign-wrapper">
          <a id="botonGuardarExamenesEnFecha" class="waves-effect waves-light btn btn-medium weight400 background-azul disabled">Guardar</a>
          <a id="resetExamenesEnFecha" class="waves-effect waves-red btn btn-medium white btn-flat azul-texto weight400 disabled">Reset</a>
          <span id="estadoCambiosFechaExamenes" class="padding-left2-4"></span>
        </div>
      </div>
    `)
    this.aceptarSoloNumerosEnInput("inputCupoCambio");
  }



  areaCambiosFechaSemana() {
    $('#areaCambios').empty();
    $('#areaCambios').append(`
      <div class="row margin0">
        <div id="listadoSemanasListenChange" class="input-field col s11 m11 l10 xl10 ">
            <select id="listadoSemanas">
            </select>
            <label>Seleccionar Semana</label>
        </div>
      </div>
      
      <div class="row margin0">
        <div class="col s6 m6 l4 xl4 ">
          <input id="finalizaDiaInscripcionCambio" type="text" class="datepicker">
          <label class="gris-texto">Finaliza DIA</label>
        </div>

        <div class="input-field col s4 m4 l2 xl2 ">
          <input id="inputCupoCambio" type="number" autocomplete="off" >
          <label for="inputCupoCambio">Cupo</label>
        </div>
      </div>

      <div class="row">
        <div class="col s12 m12 l12 xl12 valign-wrapper clear-top-2">
          <a id="botonGuardarExamenesEnFecha" class="waves-effect waves-light btn btn-medium weight400 background-azul disabled">Guardar</a>
          <a id="resetExamenesEnFecha" class="waves-effect waves-red btn btn-medium white btn-flat azul-texto weight400 disabled">Reset</a>
          <span id="estadoCambiosFechaExamenes" class="padding-left2-4"></span>      
        </div>
      </div>        

    `)
    this.aceptarSoloNumerosEnInput("inputCupoCambio");
  }

  areaCambiosFechaRendida() {
    $('#areaCambios').empty();
    $('#areaCambios').append(`
    <div class=" col s12 m12 l12 xl12 azul-texto weight700">La fecha seleccionada no puede editarse porque es anterior a la fecha actual.</div>
    `);
  }


  async mostrarListaDeHorarios(accionLuegoDeGuardar, fechasAntiguas) {
    let id = $("#listaHorarios")
    await this.fechasServicio.getListaHorarios(this.renderHorarios, this.huboUnError, id, accionLuegoDeGuardar, fechasAntiguas);
  }

  renderHorarios = (listaHorarios) => {
    $("#listaHorarios").empty();

    //obtengo la fecha seleccionada y chequeo si es editable o no (true o false) segun si es una fecha anterior a la actual o posterior
    listaHorarios.forEach(horario => {
      console.log(horario)
      let pendientes = horario.reservas_en_proceso_web + horario.reservas_en_proceso_fuera_termino;
      let cupos_libres = horario.cupo_maximo - horario.ventas - pendientes;
      $("#listaHorarios").append(`
            <li id="${horario.uuid}" tipo="${horario.source}" pausado="${horario.pausado}" cupo="${horario.cupo_maximo}" fechaExamen="${horario.fecha_Examen}" fechaFinalizacion="${horario.fecha_finalizacion}" 
            class="collection-item azul-texto weight700 cursorPointer hoverGrey ${horario.pausado ? "inputInactivo" : ""}">

              <div class="row margin0">
                <div class="col s6 m6 l6 xl6 padding0">
                  <span class="title ${horario.pausado ? "inputInactivo" : ""}">
                  <span class="new badge margin-left-0-15 margin-right-1 left ${horario.source === "RW" ? "light-blue " : "orange "} " data-badge-caption="">${horario.source === "RW" ? "ESCR" : "ORAL"}</span>
                    ${this.fechasServicio.stringDiaHoraEspanol(horario.fecha_Examen)}
                  </span>
                </div>
                <div class"col s6 m6 l6 xl6">
                  <div class="secondary-content right">  
                    <i id="${horario.uuid}_pausa" class="noClickable material-icons-outlined secondary-content right white-text button-opacity ">${horario.pausado ? "visibility_off" : "visibility"}</i>
                    <span class="new badge background-azul margin-left-0-15" data-badge-caption="vtas">${horario.ventas}</span>
                    <span class="new badge yellow black-text margin-left-0-15" data-badge-caption="pend">${pendientes}</span>
                    <span class="new badge green margin-left-0-15" data-badge-caption="libres">${cupos_libres}</span>
                    <i id="${horario.uuid}_remover" href="#modalEliminarFecha" class="noClickable material-icons-outlined secondary-content right azul-texto button-opacity margin0 ">${!horario.ventas ? "delete" : ""}</i>
                  </div>
                </div>
              </div>

            </li>
            `);

      this.formatoFechaEditable(horario.uuid)
      this.asignarFuncionBotonPausa(horario.uuid, horario.source);
      this.asignarFuncionEliminarFecha(horario.uuid, horario.source);
    });
  }

  formatoFechaEditable(uuid) {
    // Si la fecha de examen es posterior a la fecha actual, le asigno una clase como no Editable para hacer cambios en mostrar cliente
    let fechaExamen = $(`#${uuid}`).attr("fechaexamen")
    let fechaEditable = this.chequearSiEsFechaEditable(fechaExamen);
    if (!fechaEditable) {
      $(`#${uuid}`).addClass("noEditableMostrarCliente");
      $(`#${uuid}`).removeClass("azul-texto weight700");
      $(`#${uuid}`).addClass("gris-texto ");
    }
  }

  formatoFechaEditableSemana(uuid) {
    // Si la fecha de examen es posterior a la fecha actual, le asigno una clase como no Editable para hacer cambios en mostrar cliente
    let fechaExamen = $(`#${uuid}`).attr("tipo")
    let fechaEditable = this.chequearSiEsFechaEditable(fechaExamen);
    if (!fechaEditable) {
      $(`#${uuid}`).addClass("noEditableMostrarCliente");
      $(`#${uuid}`).removeClass("azul-texto weight700");
      $(`#${uuid}`).addClass("gris-texto ");
    }
  }


  mostrarInputsCambioDia(idSelected) {
    let cupo = $(`#${idSelected}`).attr("cupo");
    let dia = $(`#${idSelected}`).attr("fechaExamen").toString().substring(0, 10);
    let hora = $(`#${idSelected}`).attr("fechaExamen").toString().substring(11, 16);
    let finaliza = $(`#${idSelected}`).attr("fechaFinalizacion").toString().substring(0, 10);
    $('#inputCupoCambio').val(`${cupo}`);
    M.updateTextFields();

    $('#diaExamenCambio').val(`${this.ddmmyyyyToYyyymmdd(dia)}`)

    $('#horaExamenCambio').val(`${hora}`)

    $('#finalizaDiaInscripcionCambio').val(`${this.ddmmyyyyToYyyymmdd(finaliza)}`)
  }


  mostrarInputsCambioSemana(idSelected) {
    let cupo = $(`#${idSelected}`).attr("cupo");
    let finaliza = $(`#${idSelected}`).attr("fechaFinalizacion").toString().substring(0, 10);
    $('#inputCupoCambio').val(`${cupo}`);
    M.updateTextFields();

    $('#finalizaDiaInscripcionCambio').val(`${this.ddmmyyyyToYyyymmdd(finaliza)}`)
  }

  async mostrarListaDeSemanas(accionLuegoDeGuardar, fechasAntiguas) {
    let id = $("#listaHorarios")
    await this.fechasServicio.getListaSemanas(this.renderHorariosSemana, this.huboUnError, id, accionLuegoDeGuardar, fechasAntiguas);
  }

  renderHorariosSemana = (listaSemanas) => {
    $("#listaHorarios").empty();


    listaSemanas.forEach(semana => {
      let pendientes = semana.reservas_en_proceso_web + semana.reservas_en_proceso_fuera_termino;
      let cupos_libres = semana.cupo_maximo - semana.ventas - pendientes;

      console.log(semana)

      $("#listaHorarios").append(`
            <li id="${semana.uuid}" tipo="${semana.yyyyss}" pausado="${semana.pausado}" cupo="${semana.cupo_maximo}" fechaFinalizacion="${semana.finaliza_inscripcion}" class="collection-item azul-texto weight700 cursorPointer hoverGrey ${semana.pausado ? "inputInactivo" : ""}">
              <div class="row margin0">
                <div class="col s7 m7 l7 xl7 padding0">
                  <span class="title ${semana.pausado ? "inputInactivo" : ""}">
                    ${this.armarStringSemanaAPartirDelPrimerDiaDeSemana(semana.yyyyss)}
                  </span>
                </div>
                <div class"col s5 m5 l5 xl5">
                  <div class="secondary-content right">  
                    <i id="${semana.uuid}_pausa" class="noClickable material-icons-outlined secondary-content right white-text button-opacity">${semana.pausado ? "visibility_off" : "visibility"}</i>
                    <span class="new badge background-azul margin-left-0-15" data-badge-caption="vtas">${semana.ventas}</span>
                    <span class="new badge yellow black-text margin-left-0-15" data-badge-caption="pend">${pendientes}</span>
                    <span class="new badge green margin-left-0-15" data-badge-caption="libres">${cupos_libres}</span>
                    <i href="#modalEliminarFecha" id="${semana.uuid}_remover" class="noClickable material-icons-outlined secondary-content right azul-texto button-opacity margin0 noSelectable">${!semana.ventas ? "delete" : ""}</i>
                  </div>
                </div>
              </div>              
            </li>
            `);

      this.formatoFechaEditableSemana(semana.uuid)
      this.asignarFuncionBotonPausa(semana.uuid);
      this.asignarFuncionEliminarFecha(semana.uuid, "semana");
    });
  }

  asignarFuncionEliminarFecha(id, lista) {
    $(`#${id}_remover`).on("click", () => {
      this.fechaAEliminar.uuid = id;
      this.fechaAEliminar.lista = lista;
    });
  }

  async eliminarFecha() {
    let idEstado = $('#estadoCambiosFechaExamenes')
    let fechasAntiguas = ($('#fechasAntiguas').filter(":checked").val()) ? true : false;

    switch (this.fechaAEliminar.lista) {
      case "semana":
        await this.fechasServicio.elminarFechaSemana(this.fechaAEliminar.uuid, this.accionExitosa, this.huboUnError, idEstado);
        await this.mostrarListaDeSemanas(null, fechasAntiguas);
        break;
      case "RW":
        await this.fechasServicio.elminarFechaDiaRw(this.fechaAEliminar.uuid, this.accionExitosa, this.huboUnError, idEstado);
        await this.mostrarListaDeHorarios(null, fechasAntiguas);
        break;
      case "LS":
        await this.fechasServicio.elminarFechaDiaLs(this.fechaAEliminar.uuid, this.accionExitosa, this.huboUnError, idEstado);
        await this.mostrarListaDeHorarios(null, fechasAntiguas);
        break;
    }

    // Si la fecha que elimino estaba seleccionada, debo limpiar los examenes y los paneles del lado derecho.
    if (this.fechaAEliminar.uuid === this.lastExamSelected) {
      $("#listaExamenes").empty();
      $('#areaCambios').empty();
      $('#inputSelectarExamenes').addClass("notVisible");
    } else {
      // Si al eliminar una fecha hay otra fecha seleccionada, le re-asigna la selección debido que el modal que consulta el borrado te la saca
      $(`#${this.lastExamSelected}`).addClass("ui-selected")
    }
  }


  asignarFuncionBotonPausa(id) {
    $(`#${id}_pausa`).on("click", () => {
      if (!$(`#${id}`).hasClass("noEditableMostrarCliente")) {
        let atributoTipo = $(`#${id}`).attr('tipo');
        // Si esta seleccionada una fecha LS, RW o semana, es que tiene un atributo
        if (atributoTipo) {
          // Si esa fecha que tiene un atributo, esta seleccionado, me permite poner pausa (atributoTipo === "LS" no va, porque no se pueden pausar las fechas diaLS, solo se pueden eliminar)
          if ((atributoTipo === "RW" || atributoTipo.length === 6) && $(`#${id}`).hasClass('ui-selected')) {
            this.funcionalidadBotonPausa(id);
            this.cambioPausadoFecha = true;
            this.seProdujoUnCambio();
          }
        } else {
          // Si no es una fecha, es que es un examen. El examen no debe cumplir ninguna condicion para poder pausarse
          this.funcionalidadBotonPausa(id);
          this.cambioPausadoExamenes = true;
          this.seProdujoUnCambio();
        }
      }
    });

  }

  funcionalidadBotonPausa(id) {
    // Si esta la visibilidad en false, el input se ve inactivo
    $(`#${id} div div span`).not('.badge').toggleClass("inputInactivo");

    // Cuando presiono boton visibilidad, cambia su icono
    $(`#${id}_pausa`).text(
      $(`#${id}_pausa`)
        .text()
        .trim() == "visibility"
        ? "visibility_off"
        : "visibility"
    );

    // Si presioné el icono de visibilidad, cambio el atributo html mostrar_cliente y pongo en true el aviso que ocurrio un cambio
    $(`#${id}`).attr("pausado", (index, attr) => (attr == 1 ? 0 : 1));

    // Cambia el atributo dirty del LI que tiene cambios para que se actualize en la DB
    $(`#${id}`).attr("dirty", 1);

    //Habilito la opcion de guardado
    $('#botonGuardarExamenesEnFecha').removeClass('disabled');
    $('#resetExamenesEnFecha').removeClass('disabled');
  }



  generarListaDeExamenes(oralOEscrito) {
    //Genero la lista de opciones para el dropdown de examenes teniendo en cuenta si la fecha de examen corresponde a LS o a RW
    $("#selectarExamenes").empty();

    switch (oralOEscrito) {
      case "RW":
        this.examenesFromDB.forEach(examen => {
          if (examen.uuid && examen.rw && examen.activo_materia && examen.activo_tipo && examen.activo_nivel && examen.activo_modalidad) {
            $("#selectarExamenes").append(`
              <option value="${examen.uuid}">${examen.materia} / ${examen.tipo} / ${examen.nivel} / ${examen.modalidad}</option>
              `);
          }
        });
        break;
      case "LS":
        this.examenesFromDB.forEach(examen => {
          if (examen.uuid && examen.ls && examen.activo_materia && examen.activo_tipo && examen.activo_nivel && examen.activo_modalidad) {
            $("#selectarExamenes").append(`
              <option value="${examen.uuid}">${examen.materia} / ${examen.tipo} / ${examen.nivel} / ${examen.modalidad}</option>
              `);
          }
        });
        break;
    }
    this.habilitarFormSelect();
  }


  templateLiExamen(id, uuidExamen, uuidFecha, nombre, pausado, ventas, pendientes, activo, mostrarCliente, fechaEditable) {

    return `
    <li id="${id}" uuidExamen="${uuidExamen}" uuidFecha="${uuidFecha}" pausado="${pausado}" dirty="0" class="collection-item azul-texto cursorPointer hoverGrey">
      <div class="row margin0">
        <div class="col s7 m7 l7 xl7 padding0">
          <span class="title ${pausado ? "inputInactivo" : ""}">${nombre}</span>
        </div>
        <div class="col s5 m5 l5 xl5 padding0">
          <div class="secondary-content right ">  
            <i id="${id}_pausa" class="material-icons-outlined secondary-content azul-texto right button-opacity ">${fechaEditable ? (pausado ? "visibility_off" : "visibility") : ""}</i>
            <span class="new badge background-azul margin-left-0-15" data-badge-caption="vtas">${ventas}</span>
            <span class="new badge yellow black-text margin-left-0-15" data-badge-caption="pend">${pendientes}</span>
            <i id="${id}_remove" class="material-icons-outlined secondary-content azul-texto right button-opacity margin0 ">${fechaEditable ? (ventas ? "" : "delete") : ""}</i>
            ${activo ? '<a class="tooltipped" data-position="bottom" data-tooltip="Este examen no está siendo mostrado en la web del cliente debido a que fue eliminado desde la sección Exámenes."><span class="new badge red black-text margin-left-0-15" data-badge-caption="eliminado"></span></a>' : ""} 
            ${mostrarCliente ? '<a class="tooltipped" data-position="bottom" data-tooltip="Este examen no está siendo mostrado en la web del cliente. Dirígase a la sección Exámenes y active su visibilidad."><span class="new badge pink black-text margin-left-0-15" data-badge-caption="inactivo"></span></a>' : ""} 
          </div>
        </div>
      </div>
    </li>
    `;
  }

  habilitarBotonGuardarExamenesEnFecha() {
    $("#botonGuardarExamenesEnFecha").on("click", () => {

      $('#estadoCambiosFechaExamenes').empty().append(this.preloader());

      let tipoDeLista = $("#listaHorarios").find(".ui-selected").attr("tipo");
      let fechaDateTime;

      if (tipoDeLista === "RW" || tipoDeLista === "LS") {
        let fechaExamen = this.ddmmyyyyToYyyymmdd($("#diaExamenCambio").val());
        fechaDateTime = `${fechaExamen} ${$("#horaExamenCambio").val()}`;
      }
      else if (tipoDeLista.length === 6) {
        fechaDateTime = this.getDateFirstDayOfWeek($("#listadoSemanas option:selected").attr("semana"), $("#listadoSemanas option:selected").attr("ano"));
      }

      let fechaFinaliza = this.ddmmyyyyToYyyymmdd($("#finalizaDiaInscripcionCambio").val());

      let datos = {
        tipoDeLista: tipoDeLista,

        uuidFecha: $("#listaHorarios")
          .find(".ui-selected")
          .attr("id"),

        fechaPausada: $("#listaHorarios")
          .find(".ui-selected")
          .attr("pausado"),
        cambioPausadoFecha: this.cambioPausadoFecha,

        fechaCupo: $('#inputCupoCambio').val(),
        fechaExamen: fechaDateTime,
        fechaFinaliza: fechaFinaliza,
        cambioInputFecha: this.cambioInputFecha,

        removeExamenesFechaDia: this.removeExamenesFechaDia,
        addExamenesFechaDia: this.addExamenesFechaDia,
        estadoListaExamenesDia: this.obtenerListaDeExamenesDeUl(),
        cambioPausadoExamenes: this.cambioPausadoExamenes,
      };

      let id = $('#estadoCambiosFechaExamenes')
      this.fechasServicio.updateExamenesEnFecha(datos, tipoDeLista, this.guardadoExitoso, this.huboUnError, id);
    });
  }

  guardadoExitoso = (tipoDeLista) => {
    let fechasAntiguas = ($('#fechasAntiguas').filter(":checked").val()) ? true : false;

    if (tipoDeLista === "RW" || tipoDeLista === "LS") {
      this.mostrarListaDeHorarios(this.accionesLuegoDeGuardadoExitoso, fechasAntiguas);
    }
    else if (tipoDeLista.length === 6) {
      this.mostrarListaDeSemanas(this.accionesLuegoDeGuardadoExitoso, fechasAntiguas);
    }
  };

  accionesLuegoDeGuardadoExitoso = () => {
    $(`#${this.lastExamSelected}`).addClass("ui-selected")
    this.cleanEstadoListaExamen();
    this.seGuardoOReseteo();
    let id = $('#estadoCambiosFechaExamenes')
    this.accionExitosa(id)
  }


  habilitarBotonResetExamenesEnFecha() {
    $("#resetExamenesEnFecha").on("click", () => {
      let id = this.lastExamSelected;
      let tipoDeLista = $("#listaHorarios").find(".ui-selected").attr("tipo");
      let fechasAntiguas = ($('#fechasAntiguas').filter(":checked").val()) ? true : false;

      if (tipoDeLista === "RW") {
        let fechaExamen = $(`#${id}`).attr("fechaexamen")
        let fechaEditable = this.chequearSiEsFechaEditable(fechaExamen);
        this.mostrarListaDeHorarios(this.accionLuegoDeReseteo, fechasAntiguas);
        this.mostrarExamenesEnListaFromDB(id, tipoDeLista, fechaEditable)
        this.mostrarInputsCambioDia(id);
      }
      else if (tipoDeLista === "LS") {
        let fechaExamen = $(`#${id}`).attr("fechaexamen")
        this.mostrarListaDeHorarios(this.accionLuegoDeReseteo, fechasAntiguas);
        this.mostrarInputsCambioDia(id);
      }
      else if (tipoDeLista.length === 6) {
        let fechaExamen = $(`#${id}`).attr("tipo")
        let fechaEditable = this.chequearSiEsFechaEditable(fechaExamen);
        console.log(fechaEditable)
        this.mostrarListaDeSemanas(this.accionLuegoDeReseteo, fechasAntiguas);
        this.mostrarExamenesDeSemanaEnListaFromDB(id, fechaEditable);
        this.mostrarInputsCambioSemana(id);
      }
    });
  }

  accionLuegoDeReseteo = () => {
    $(`#${this.lastExamSelected}`).addClass("ui-selected")
    this.cleanEstadoListaExamen();
    this.seGuardoOReseteo();
    $('#botonGuardarExamenesEnFecha').addClass('disabled');
    $('#resetExamenesEnFecha').addClass('disabled');
  }


  generarListaReservaSemanaLs = async (idSelected, fechaEditable) => {
    $('#listadoReservasEnFechas').empty();
    $('#collapsibleReservas').empty()
    this.mostrarTablaReservasEnSemanasLs();

    let idEstado = $('#estadoListadoReservas');
    this.appendProgressIndeterminate($('#estadoListadoReservas'))

    let reservaSemanas = await this.fechasServicio.getElementosListaReservasEnSemanasLs(idSelected, this.huboUnError, this.mostrarElementosListaReservasEnSemanasLs, idEstado);
    this.reservasEnCurso = reservaSemanas;

    // Muestro botones para exportar Excel + el UL para colgar la asignacion de dias a semanas y el envio masivo de emails
    this.mostrarBotoneraYEdicionReservas();
    this.habilitarToggleCheckboxAll()
    this.asignarFuncionBotonExportarAsistencia();
    this.asignarFuncionBotonExportarTrinity();

    if( reservaSemanas.length === 0) {      
      $('#botonExportarTrinity').addClass('disabled');
      $('#botonExportarAsistencia').addClass('disabled');
    } else {
      $('#botonExportarTrinity').removeClass('disabled');
      $('#botonExportarAsistencia').removeClass('disabled');
    }

    console.log("editable fecha", fechaEditable)
  
    if(fechaEditable){    
      this.mostrarListadoDiasOralesParaSemana();    
      this.mostrarEnviarMailASeleccionados();

      let diasOral = await this.fechasServicio.getListaHorariosOrales();
      this.generarListaDeDiasOralesDropdown(diasOral);
      this.asignarFuncionBotonAsignarDiaOralASemana();
      this.listenChequearSiHayCuposLibresParaAsignarExamen();   
    } else {
      $('#collapsibleReservas').remove()
    }
   

  }

  //cuando asigno diasLS a semanas, actualizo la lista de reservas
  updateElementosListaSemanaLs = async (idSelected) => {
    console.log("update editable fecha", fechaEditable)
    let idEstado = $('#estadoListadoReservas');
    $('#botonAsignarDiaOralASemana').addClass('disabled');

    let reservaSemanas = await this.fechasServicio.getElementosListaReservasEnSemanasLs(idSelected, this.huboUnError, this.mostrarElementosListaReservasEnSemanasLs, idEstado);
    this.reservasEnCurso = reservaSemanas;

    let diasOral = await this.fechasServicio.getListaHorariosOrales();
    this.generarListaDeDiasOralesDropdown(diasOral)
    this.listenChequearSiHayCuposLibresParaAsignarExamen();
  }

  async generarListaReservaDiaRw(idSelected, fechaEditable) {
    $('#listadoReservasEnFechas').empty();
    $('#collapsibleReservas').empty()

    this.mostrarTablaReservasEnDiaRw();

    let idEstado = $('#estadoListadoReservas');
    this.appendProgressIndeterminate(idEstado)

    let reservasRw = await this.fechasServicio.getElementosListaReservasEnDiaRw(idSelected, this.huboUnError, this.mostrarElementosListaReservasEnDiaRw, idEstado);
    this.reservasEnCurso = reservasRw;
    
  


    this.mostrarBotoneraYEdicionReservas();
    this.habilitarToggleCheckboxAll()
    this.asignarFuncionBotonExportarAsistencia();
    this.asignarFuncionBotonExportarTrinity();

    if( reservasRw.length === 0 ) {      
      $('#botonExportarTrinity').addClass('disabled');
      $('#botonExportarAsistencia').addClass('disabled');
    } else {
      $('#botonExportarTrinity').removeClass('disabled');
      $('#botonExportarAsistencia').removeClass('disabled');
    }

    fechaEditable ? this.mostrarEnviarMailASeleccionados() : $('#collapsibleReservas').remove();
  }

  async generarListaReservaDiaLs(idSelected, fechaEditable) {
    $('#listadoReservasEnFechas').empty();
    $('#collapsibleReservas').empty();

    this.mostrarTablaReservasEnDiaLs();

    let idEstado = $('#estadoListadoReservas');
    this.appendProgressIndeterminate(idEstado);

    let reservasLs = await this.fechasServicio.getElementosListaReservasEnDiaLs(idSelected, this.huboUnError, this.mostrarElementosListaReservasEnDiaLs, idEstado);
    this.reservasEnCurso = reservasLs;

    

    this.mostrarBotoneraYEdicionReservas();
    this.habilitarToggleCheckboxAll()
    this.asignarFuncionBotonExportarAsistencia();
    this.asignarFuncionBotonExportarTrinity();

    if( reservasLs.length === 0 ) {      
      $('#botonExportarTrinity').addClass('disabled');
      $('#botonExportarAsistencia').addClass('disabled');
    } else {
      $('#botonExportarTrinity').removeClass('disabled');
      $('#botonExportarAsistencia').removeClass('disabled');
    }

    fechaEditable ? this.mostrarEnviarMailASeleccionados() : $('#collapsibleReservas').remove();

  }

  habilitarToggleCheckboxAll() {
    $("#ckbCheckAll").click(function () {
      $(".checkBoxClass").not('.disabled').prop('checked', $(this).prop('checked'));
    });
  }

  mostrarTablaReservasEnSemanasLs() {
    $('#listadoReservasEnFechas').append(
      `<table>
        <thead>
            <tr>
              <th class="th-width-short">
                  <label>
                      <input type="checkbox" id="ckbCheckAll" />
                      <span></span>
                  </label>
              </th>
              <th>NOMBRE</th>
              <th>APELLIDO</th>
              <th>CANDIDATE NUMBER</th>
              <th>DOCUMENTO</th>
              <th>GENERO</th>
              <th>MAIL</th>
              <th class="padding-left1-5">DIA ASIGNADO</th>
              <th>COMPLETO</th>
              <th>DISC</th>
            </tr>
        </thead>

        <tbody id="bodyListadoReservasEnFechas"></tbody>
      </table>
      <div id="estadoListadoReservas"></div>
      `
    )
  }

  mostrarTablaReservasEnDiaRw() {
    $('#listadoReservasEnFechas').append(
      `<table>
          <thead>
              <tr>
                  <th class="th-width-short">
                      <label>
                          <input type="checkbox" id="ckbCheckAll" />
                          <span></span>
                      </label>
                  </th>                  
                  <th>NOMBRE</th>
                  <th>APELLIDO</th>
                  <th>CANDIDATE NUMBER</th>
                  <th>DOCUMENTO</th>
                  <th>GENERO</th>
                  <th>MAIL</th>
                  <th>COMPLETO</th>
                  <th>DISC</th>

              </tr>
          </thead>

          <tbody id="bodyListadoReservasEnFechas"></tbody>
    </table>
    <div id="estadoListadoReservas"></div>
  `)
  }


  mostrarTablaReservasEnDiaLs() {
    $('#listadoReservasEnFechas').empty().append(
      `<table>
          <thead>
              <tr>
                  <th class="th-width-short">
                      <label>
                          <input type="checkbox" id="ckbCheckAll"/>
                          <span></span>
                      </label>
                  </th>
                  <th>NOMBRE</th>
                  <th>APELLIDO</th>
                  <th>CANDIDATE NUMBER</th>
                  <th>DOCUMENTO</th>
                  <th>GENERO</th>
                  <th>MAIL</th>
                  <th>SEMANA</th>
                  <th>COMPLETO</th>
                  <th>DISC</th>
              </tr>
          </thead>

          <tbody id="bodyListadoReservasEnFechas"></tbody>

    </table> 
    <div id="estadoListadoReservas"></div>
    
    `)
  }


  mostrarElementosListaReservasEnSemanasLs = (reservasSemanaLs) => {
    $('#bodyListadoReservasEnFechas').empty();
    $('#estadoListadoReservas').empty();

    if (reservasSemanaLs.length) {
      reservasSemanaLs.sort(function (objA, objB) {
        // Primero ordeno por fecha diaLS asignado
        let ordenFechaA = objA.dia_LS_fecha_examen;
        let ordenFechaB = objB.dia_LS_fecha_examen;

        if (ordenFechaA > ordenFechaB) {
          return 1;
        } else if (ordenFechaA < ordenFechaB) {
          return -1;
        } else if (ordenFechaA === null) {
          return -2;
        } else {
          // luego ordeno por apellido
          let ordenApellidoA = objA.alumno_apellido;
          let ordenApellidoB = objB.alumno_apellido;

          if (ordenApellidoA > ordenApellidoB) {
            return 1;
          } else if (ordenApellidoA < ordenApellidoB) {
            return -1;
          }
        }
      })

      reservasSemanaLs.forEach(reserva => {
        $('#bodyListadoReservasEnFechas').append(
          `<tr>
            <td class="th-width-short">
              <label>
                <input id="${reserva.reserva_uuid}" class="checkBoxClass ${reserva.dia_LS_uuid ? "" : "sinAsignar"}"   type="checkbox"   />
                <span class="margin-top-5px"></span>
              </label>
            </td>
            <td>${reserva.alumno_nombre}</td>
            <td>${reserva.alumno_apellido}</td>
            <td>${reserva.alumno_candidate_number}</td>
            <td>${reserva.alumno_documento_id}</td>
            <td>${reserva.alumno_genero}</td>
            <td>${reserva.alumno_email}</td>
            <td  class="padding-left1-5">${reserva.dia_LS_uuid ? this.fechasServicio.stringDiaHoraEspanol(reserva.dia_LS_fecha_examen) : "SIN ASIGNAR"}</td>
            <td>${(reserva.examen_en_dia_RW_uuid && reserva.examen_en_semana_LS_uuid) ? "SI" : ""}</td>
            <td>${reserva.discapacidad ? "X" : ""}</td>
          </tr>`)
      });
     
    } else {
      $('#estadoListadoReservas').empty().append('<div class="azul-texto weight700">No hay reservas efectuadas en esta fecha.</div>');

    }
  }

  mostrarElementosListaReservasEnDiaRw(reservaDiaRw) {
    $('#bodyListadoReservasEnFechas').empty();
    $('#estadoListadoReservas').empty();

    if (reservaDiaRw.length) {

      reservaDiaRw.sort(function (objA, objB) {
        // ordeno por apellido
        let ordenApellidoA = objA.alumno_apellido;
        let ordenApellidoB = objB.alumno_apellido;

        if (ordenApellidoA > ordenApellidoB) {
          return 1;
        } else if (ordenApellidoA < ordenApellidoB) {
          return -1;
        }
      })

      reservaDiaRw.forEach(reserva => {
        console.log(reserva)
        $('#bodyListadoReservasEnFechas').append(
          `<tr>
            <td class="th-width-short">
              <label>
                <input id="${reserva.reserva_uuid}" class="checkBoxClass" type="checkbox"   />
                          <span class="margin-top-5px"></span>
              </label>
            </td>            
            <td>${reserva.alumno_nombre}</td>
            <td>${reserva.alumno_apellido}</td>
            <td>${reserva.alumno_candidate_number}</td>
            <td>${reserva.alumno_documento_id}</td>
            <td>${reserva.alumno_genero}</td>
            <td>${reserva.alumno_email}</td>
            <td>${(reserva.examen_en_dia_RW_uuid && reserva.examen_en_semana_LS_uuid) ? "SI" : ""}</td>
            <td>${reserva.discapacidad ? "X" : ""}</td>
          </tr>`)
      });

    } else {
      $('#estadoListadoReservas').empty().append('<div class="azul-texto weight700">No hay reservas efectuadas en esta fecha.</div>');

    }


  };


  mostrarElementosListaReservasEnDiaLs = (reservaDiaLs) => {
    $('#bodyListadoReservasEnFechas').empty();
    $('#estadoListadoReservas').empty();

    if (reservaDiaLs.length) {
      reservaDiaLs.sort(function (objA, objB) {
        // ordeno por apellido
        let ordenApellidoA = objA.alumno_apellido;
        let ordenApellidoB = objB.alumno_apellido;

        if (ordenApellidoA > ordenApellidoB) {
          return 1;
        } else if (ordenApellidoA < ordenApellidoB) {
          return -1;
        }
      })

      reservaDiaLs.forEach(reserva => {
        console.log(reserva)
        console.log("dd", )
        $('#bodyListadoReservasEnFechas').append(
          `<tr>
            <td class="th-width-short">
              <label>
                <input id="${reserva.reserva_uuid}" class="checkBoxClass"  type="checkbox"   />
                          <span class="margin-top-5px"></span>
              </label>
            </td>
            <td>${reserva.alumno_nombre}</td>
            <td>${reserva.alumno_apellido}</td>
            <td>${reserva.alumno_candidate_number}</td>
            <td>${reserva.alumno_documento_id}</td>

            <td>${reserva.alumno_genero}</td>
            <td>${reserva.alumno_email}</td>
            <td>${ `${reserva.semana_LS_fecha_examen.toString().substring(0,4)}-${reserva.semana_LS_fecha_examen.toString().substring(4,7)}` }</td>
            <td>${(reserva.examen_en_dia_RW_uuid && reserva.examen_en_semana_LS_uuid) ? "SI" : ""}</td>
            <td>${reserva.discapacidad ? "X" : ""}</td>
          </tr>`)
      });

    } else {
      $('#estadoListadoReservas').empty().append('<div class="azul-texto weight700">No hay reservas efectuadas en esta fecha.</div>');

    }
  };

  mostrarBotoneraYEdicionReservas() {
    $('#edicionReservasEnFechas').empty().append(
      `
      <div class="col s6 m6 l6 xl6 right clear-top-2">
        <a id="botonExportarAsistencia" class="waves-effect waves-light btn btn-small weight400 background-azul right ">Exportar Asistencia</a>
        <a id="botonExportarTrinity" class="waves-effect waves-light btn btn-small weight400 background-azul right margin-right-1">Exportar Trinity</a>
      </div>    

      <div class="col s6 m6 l6 xl6 right clear-top-2">
        <span id="estadoExcels" class=" rojo-texto margin-right-1" ></span>
      </div>

      <div class="col s10 m10 l10 xl10 clear-top-3 offset-s1 offset-m1 offset-l1 offset-xl1">
        <ul id="collapsibleReservas" class="collapsible">
        </ul>
      </div>      
      `)

    $('#collapsibleReservas').collapsible({

      onOpenEnd: () => {
        if ($("#collapsibleReservas").find("li.active").attr("id") === "collapsibleMail") {
          //$(".checkBoxClass, #ckbCheckAll").prop('checked', "");
          $('.sinAsignar').prop('checked', "").attr('disabled', true).addClass('disabled');
          this.chequearCantidadDeReservasSeleccionadas();
        }
      },

      onCloseStart: () => {
        if ($("#collapsibleReservas").find("li.active").attr("id") === "collapsibleMail") {
          $('.sinAsignar').attr('disabled', false).removeClass('disabled');
        }
      }
    });
  };

  mostrarListadoDiasOralesParaSemana() {
    $('#collapsibleReservas').append(`
    <li>
      <div class="collapsible-header grey lighten-3 azul-texto">
        <i class="material-icons">event</i>Asignar Día/Hora de Oral a las Semanas seleccionados
      </div>
      <div class="collapsible-body">
        <div class="row">
          <div class="col s6 m6 l6  xl5">      
            <div class="input-field clear-top-3">
              <select id="listadoDiasOralesParaSemana"></select>
              <label>Asignar Día de Oral a los seleccionados</label>
              <a id="botonAsignarDiaOralASemana" class="waves-effect waves-light btn btn-medium weight400 background-azul disabled">Asignar</a>
              <span id="estadoReserva" class="padding-left2-4 rojo-texto" ></span>
            </div>
          </div>
        </div>
      </div>
    </li>
    `);


  }

  mostrarEnviarMailASeleccionados() {
    $('#collapsibleReservas').append(`
                <li id="collapsibleMail">
                    <div class="collapsible-header grey lighten-3 azul-texto">
                        <i class="material-icons">mail</i>Enviar Email con Fechas a Seleccionados
                    </div>

                    <div class="collapsible-body">
                      <div class="row">
                          <form class="col s12">
                              <div class="row">
                                  <div class="input-field col s12 m12 l12 xl12">
                                      <input placeholder="Placeholder" id="mail_asunto" type="text" class="validate" value="Fechas de Examen MIT">
                                      <label for="mail_asunto">Asunto</label>
                                  </div>
                                  <div class="input-field col s12 m12 l12 xl12">
                                      <textarea id="textarea_Mail" contenteditable="true" class="materialize-textarea gris-texto">Hola {nombre} {apellido},
Ya estás inscripto al examen {examen} el día {dia} en el horario {hora}.
Debés presentarte en Av Cordoba 1659 - 3er piso con una anticipación de 30 minutos.
Cualquier duda te podés comunicar vía telefónica al +34 952 202322.
Saludos!</textarea>
                                      <label for="textarea_Mail">Cuerpo de Mail</label>
                                  </div>
                              </div>
                              <div class="azul-texto weight500 col s12 m12 l12 xl12 padding0">
                            Palabras Clave  ->   {nombre}   {apellido}   {dia}   {hora}   {examen}
                          </div>
                          </form>
                          
                      </div>

                      <div class="row">
                          <div class="col s12 m12 l12 xl12">
                              <div class="azul-texto">Seleccionados: <span id="cantidadSeleccionados" class="azul-texto">0</span></div>
                              <a id="enviarMails" class="waves-effect waves-light btn btn-medium weight400 background-azul left disabled">ENVIAR MAILS</a>                                
                          </div>
                      </div>

                      <div class="row">
                          <div class="col s12 m12 l12 xl12">

                            <div id="estadoEnviarMails" class="padding-left2-4 azul-texto"></div>
                        </div>
                      </div>

                      
                    </div>
                </li>

    `)

    this.asignarFuncionalidadBotonEnviarMails();
    M.updateTextFields();
    let descriptionTextArea = $('#textarea_Mail');
    M.textareaAutoResize(descriptionTextArea);
    this.listenCantidadReservasSeleccionadas();



  }



  asignarFuncionBotonExportarAsistencia() {
    let fecha = $("#listaHorarios").find(".ui-selected").attr("id");
    let tipo = $("#listaHorarios").find(".ui-selected").attr("tipo");
    let fechaString = $("#listaHorarios").find(".ui-selected").attr("fechaExamen");

    $('#botonExportarAsistencia').on('click', () => {
      let id = $('#estadoExcels')
      this.fechasServicio.getExcelAsistencia(fecha, tipo, fechaString, this.huboUnError, id);
    });
  }

  asignarFuncionBotonExportarTrinity() {
    let fecha = $("#listaHorarios").find(".ui-selected").attr("id");
    let tipo = $("#listaHorarios").find(".ui-selected").attr("tipo");
    let fechaString = $("#listaHorarios").find(".ui-selected").attr("fechaExamen");

    $('#botonExportarTrinity').on('click', () => {
      let id = $('#estadoExcels')
      this.fechasServicio.getExcelTrinity(fecha, tipo, fechaString, this.huboUnError, id);
    });
  }


  asignarFuncionBotonAsignarDiaOralASemana() {
    $('#botonAsignarDiaOralASemana').on('click', () => {
      this.asignarDiaASemanaExamenOral();
    })
  }

  generarListaDeDiasOralesDropdown(diasOral) {
    // reinicio los examenes seleccionados
    this.cupoExamenSeleccionado = [];
    $('#listadoDiasOralesParaSemana').empty();

    diasOral.forEach(diaHorario => {
      let pendientes = diaHorario.reservas_en_proceso_web + diaHorario.reservas_en_proceso_fuera_termino;
      let cupos_libres = diaHorario.cupo_maximo - diaHorario.ventas - pendientes;

      this.cupoExamenSeleccionado.push([diaHorario.uuid, cupos_libres])

      $('#listadoDiasOralesParaSemana').append(
        `<option value="${diaHorario.uuid}" >${this.fechasServicio.stringDiaHoraEspanol(diaHorario.fecha_Examen)} // Cupos Libres: ${cupos_libres}</option>`
      )
    });

    $('#listadoDiasOralesParaSemana').append(
      `<option value="" disabled selected>Seleccionar</option>`
    );

    this.habilitarFormSelect();

  }

  listenCantidadReservasSeleccionadas() {
    $('.checkBoxClass').on('change', () => {
      this.chequearCantidadDeReservasSeleccionadas();
    });

    $('#ckbCheckAll').on('change', () => {
      this.chequearCantidadDeReservasSeleccionadas()
    });
  }


  listenChequearSiHayCuposLibresParaAsignarExamen() {
    $('.checkBoxClass').on('change', () => {
      this.chequearSiHayCuposLibresParaAsignarExamen()
    });

    $('#ckbCheckAll').on('change', () => {
      this.chequearSiHayCuposLibresParaAsignarExamen()
    });

    $('#listadoDiasOralesParaSemana').on('change', () => {
      this.chequearSiHayCuposLibresParaAsignarExamen()
    });
  }

  chequearSiHayCuposLibresParaAsignarExamen() {
    $("select").formSelect();
    let instance = M.FormSelect.getInstance($("#listadoDiasOralesParaSemana"));
    let diaOralSeleccionado = instance.getSelectedValues();
    let cuposLibres;
    let alumnosSeleccionados;

    this.cupoExamenSeleccionado.forEach(par => {
      if (par[0] == diaOralSeleccionado) {
        cuposLibres = par[1];
      }
    })

    alumnosSeleccionados = $("#bodyListadoReservasEnFechas :checkbox:checked").length;

    if (diaOralSeleccionado != "" && alumnosSeleccionados > 0) {
      if (alumnosSeleccionados > 0 && alumnosSeleccionados <= cuposLibres) {
        $('#botonAsignarDiaOralASemana').removeClass("disabled");
        $('#estadoReserva').empty();
      } else {
        $('#botonAsignarDiaOralASemana').addClass("disabled");
        $('#estadoReserva').empty().append(`<div>La cantidad de alumnos seleccionados es mayor que los cupos libres en esta fecha.</div>`);
        setTimeout(() => $('#estadoReserva').empty(), 6000)
      }
    }

  }


  async asignarDiaASemanaExamenOral() {
    // Obtengo el día del oral seleccionado
    $("select").formSelect();
    let instance = M.FormSelect.getInstance($("#listadoDiasOralesParaSemana"));
    let diaOralSeleccionado = instance.getSelectedValues();

    // Obtengo las reservas de semana a las que se le debe asignar un día
    let reservasSeleccionadas = $("#bodyListadoReservasEnFechas :checkbox:checked").map(function () {
      return this.id;
    }).get();

    let datos = {
      fecha: diaOralSeleccionado,
      reservas: reservasSeleccionadas,
    }

    let id = $('#estadoReserva')
    id.append(this.preloader());
    this.fechasServicio.asignarDiaASemanaExamenOral(datos, this.lastExamSelected, this.accionExitosa, this.huboUnError, id, this.updateElementosListaSemanaLs);
  }

  botonAgregarExamenesAFecha() {
    $("#botonAgregarExamenesAFecha").on("click", () => {
      // Obtengo los elementos seleccionados
      $("select").formSelect();
      var instance = M.FormSelect.getInstance($("#selectarExamenes"));
      var examenesSeleccionados = instance.getSelectedValues();

      // Obtengo los elementos que ya estan en la lista
      var examenesYaEnLista = this.obtenerListaDeExamenesDeUl();

      // Genero un array con los objetos que se necesitan agregar
      let examenesSelecionadosQueNoEstanEnLista = examenesSeleccionados.filter(
        element => !examenesYaEnLista.some(el => element === el.examen)
      );

      //Reinicia los valores seleccionados
      $("form input").val("");
      $("select").val("None");
      $("#inputSelectarExamenes div input").val("");

      this.mostrarExamenesNuevosEnLista(examenesSelecionadosQueNoEstanEnLista);
    });
  }

  asignarFuncionalidadBotonEliminarExamen(id) {
    $(`#${id}_remove`).on('click', () => {
      let examen = $(`#${id}`).attr("id");

      // Chequeo si el examen fue agregado en una instancia antes de ser guardado en la DB
      let examenEnAdd = this.addExamenesFechaDia.some(element => element === examen);

      // Si el exanen esta pendiente por agregarse a la DB, lo elimino. Si el examen ya esta agregado a la DB, lo pongo en el array para eliminarlo
      if (examenEnAdd) {
        let newAddArray = this.addExamenesFechaDia.filter(element => element != examen)
        this.addExamenesFechaDia = newAddArray;
      } else {
        this.removeExamenesFechaDia.push(examen);
      }

      $('#botonGuardarExamenesEnFecha').removeClass('disabled');
      $('#resetExamenesEnFecha').removeClass('disabled');
      this.seProdujoUnCambio();

      $(`#${id}`).remove();

      if (!$('#listaExamenes').find('li').length) {
        $("#listaExamenes").append('<div id="listaVacia" class="azul-texto padding0-7rem weight700">No se ha asignado ningún examen a esta fecha todavía.</div>')
      }

    });
  }

  mostrarExamenesNuevosEnLista(examenes) {
    if (examenes.length > 0) {
      $('#botonGuardarExamenesEnFecha').removeClass('disabled');
      $('#resetExamenesEnFecha').removeClass('disabled');
      $('#listaVacia').remove();
      this.seProdujoUnCambio();
    }

    examenes.forEach(examen => {
      let nombreCompleto = this.convertirUuidExamenEnTexto(examen)[0];
      let pausado = 0;
      let uuid = uuidv4();
      let fecha = $("#listaHorarios")
        .find(".ui-selected")
        .attr("id");
      let ventas = 0;
      let pendientes = 0;
      let activo = 0;
      let mostrarCliente = this.chequearSiElExamenEstaVisible(examen);
      let fechaEditable = 1;

      $("#listaExamenes").append(
        this.templateLiExamen(uuid, examen, fecha, nombreCompleto, pausado, ventas, pendientes, activo, mostrarCliente, fechaEditable)
      );

      this.habilitarToolTips();
      this.addExamenesFechaDia.push(uuid)
      this.asignarFuncionBotonPausa(uuid);
      this.asignarFuncionalidadBotonEliminarExamen(uuid);

    });
  }

  chequearSiElExamenEstaVisible(examen) {
    let mostrarCliente;

    this.examenesFromDB.forEach(modalidad => {
      if (modalidad.uuid === examen) {
        mostrarCliente = !(modalidad.mostrarCliente_materia & modalidad.mostrarCliente_tipo & modalidad.mostrarCliente_nivel & modalidad.mostrarCliente_modalidad);
      };
    });
    return mostrarCliente;
  }

  habilitarToolTips() {
    $('.tooltipped').tooltip();
  }

  async mostrarExamenesEnListaFromDB(idSelected, tipoSelected, fechaEditable) {
    let id = $("#listaExamenes");
    await this.fechasServicio.getExamenesEnFecha(idSelected, tipoSelected, fechaEditable, this.renderExamenesEnLista, this.huboUnError, id);
  }


  renderExamenesEnLista = (fechaEditable, examenes, tipoSelected) => {
    console.log(examenes)
    $("#listaExamenes").empty();
    if (examenes.length === 0) {
      $("#listaExamenes").append('<div id="listaVacia" class="azul-texto padding0-7rem weight700">No se ha asignado ningún examen a esta fecha todavía.</div>')
    }

    // Los examenes que vienen de la DB vienen ordenados por el uuid. Vamos a ordeñarlos.
    let arrayLis = [];

    // de cada examen que voy a mostrar en la tabla, chequeo su estado de activo desde el listado que traje de la DB
    examenes.forEach(examen => {
      let nombre = this.convertirUuidExamenEnTexto(examen.modalidad_uuid)[0];
      let activo;
      let mostrarCliente;
      console.log(examen)
      let pendientes = examen.reservas_en_proceso_web + examen.reservas_en_proceso_fuera_termino;

      // de cada examen que voy a mostrar en la tabla, chequeo su estado de activo desde el listado que traje de la DB
      this.examenesFromDB.map(exam => {
        if (exam.uuid === examen.modalidad_uuid) {
          activo = !(exam.activo_materia & exam.activo_tipo & exam.activo_nivel & exam.activo_modalidad) ? true : false;
        }
      })

      // de cada examen que voy a mostrar en la tabla, chequeo su estado de mostrarCliente desde el listado que traje de la DB
      this.examenesFromDB.map(exam => {
        if (exam.uuid === examen.modalidad_uuid) {
          mostrarCliente = !(exam.mostrarCliente_materia & exam.mostrarCliente_tipo & exam.mostrarCliente_nivel & exam.mostrarCliente_modalidad) ? true : false;
        }
      })

      // como los examenes en dia LS no se pueden editar (porque se asignan desde el listado de semana), la asigno como fecha no editable
      if (tipoSelected === "LS") {
        fechaEditable = 0;
      }

      // Guardo en un array temporal: [0]index + [1]LI del examen + [2]uuid del examen (para luego asignar funcionalidad a los botones)
      arrayLis.push([
        this.convertirUuidExamenEnTexto(examen.modalidad_uuid)[1],

        this.templateLiExamen(
          examen.uuid,
          examen.modalidad_uuid,
          examen.fecha_uuid,
          nombre,
          examen.pausado,
          examen.ventas,
          pendientes,
          activo,
          mostrarCliente,
          fechaEditable
        ),
        examen.uuid
      ]);
    });

    // Ordeno el array temporal por el index
    arrayLis.sort(function (liA, liB) {
      let ordenLiA = liA[0];
      let ordenLiB = liB[0];
      if (ordenLiA > ordenLiB) {
        return 1;
      } else {
        return -1;
      }
    })

    // Renderizo los LIs en orden y le asigno funcionalidad a los botones segun su uuid array[2]
    arrayLis.forEach(array => {
      $('#listaExamenes').append(array[1])
      // habilito los mensajes en hover en los badges de inactivo y eliminado
      this.habilitarToolTips();
      this.asignarFuncionBotonPausa(array[2]);
      this.asignarFuncionalidadBotonEliminarExamen(array[2]);
    });
  }


  async mostrarExamenesDeSemanaEnListaFromDB(idSelected, fechaEditable) {
    let id = $("#listaExamenes");
    await this.fechasServicio.getExamenesEnSemana(idSelected, fechaEditable, this.renderExamenesEnLista, this.huboUnError, id);
  }


  renderExamenesSemanaEnLista = (fechaEditable, examenes) => {
    $("#listaExamenes").empty();

    // Los examenes que vienen de la DB vienen ordenados por el uuid. Vamos a ordeñarlos.
    let arrayLis = [];

    examenes.forEach(examen => {
      let nombre = this.convertirUuidExamenEnTexto(examen.modalidad_uuid)[0];
      let activo;
      let mostrarCliente;


      // de cada examen que voy a mostrar en la tabla, chequeo su estado de activo desde el listado que traje de la DB
      this.examenesFromDB.map(exam => {
        if (exam.uuid === examen.modalidad_uuid) {
          activo = !(exam.activo_materia & exam.activo_tipo & exam.activo_nivel & exam.activo_modalidad) ? true : false;
        }
      })

      // de cada examen que voy a mostrar en la tabla, chequeo su estado de mostrarCliente desde el listado que traje de la DB
      this.examenesFromDB.map(exam => {
        if (exam.uuid === examen.modalidad_uuid) {
          mostrarCliente = !(exam.mostrarCliente_materia & exam.mostrarCliente_tipo & exam.mostrarCliente_nivel & exam.mostrarCliente_modalidad) ? true : false;
        }
      })

      // Guardo en un array temporal: [0]index + [1]LI del examen + [2]uuid del examen (para luego asignar funcionalidad a los botones)
      arrayLis.push([
        this.convertirUuidExamenEnTexto(examen.modalidad_uuid)[1],

        this.templateLiExamen(
          examen.uuid,
          examen.modalidad_uuid,
          examen.fecha_uuid,
          nombre,
          examen.pausado,
          examen.ventas,
          activo,
          mostrarCliente,
          fechaEditable
        ),
        examen.uuid
      ]);
    });

    // Ordeno el array temporal por el index
    arrayLis.sort(function (liA, liB) {
      let ordenLiA = liA[0];
      let ordenLiB = liB[0];
      if (ordenLiA > ordenLiB) {
        return 1;
      } else {
        return -1;
      }
    })

    // Renderizo los LIs en orden y le asigno funcionalidad a los botones segun su uuid array[2]
    arrayLis.forEach(array => {
      $('#listaExamenes').append(array[1])
      // habilito los mensajes en hover en los badges de inactivo y eliminado
      this.habilitarToolTips();
      this.asignarFuncionBotonPausa(array[2]);
      this.asignarFuncionalidadBotonEliminarExamen(array[2]);

    })
  };


  obtenerListaDeExamenesDeUl() {
    let examenesEnUl = [];

    $("#listaExamenes li").each(function () {
      examenesEnUl.push({
        uuid: $(this)
          .attr("id")
          .trim(),
        examen: $(this)
          .attr("uuidExamen")
          .trim(),
        pausado: $(this)
          .attr("pausado")
          .trim(),
        fecha: $(this)
          .attr("uuidfecha")
          .trim(),
      });
    });
    return examenesEnUl;
  }

  asignarFuncionalidadBotonEnviarMails() {
    $('#enviarMails').on('click', () => {
      this.generarDatosAEnviarPorMail();
    })
  }

  chequearCantidadDeReservasSeleccionadas() {
    let reservasSeleccionadas = $("#bodyListadoReservasEnFechas :checkbox:checked").map(function () {
      return this.id
    }).get();
    console.log(reservasSeleccionadas.length)

    $('#cantidadSeleccionados').empty().append(`
    ${reservasSeleccionadas.length}
    `)

    if (reservasSeleccionadas.length === 0) {
      $('#enviarMails').addClass("disabled")
    } else {
      $('#enviarMails').removeClass("disabled")
    }
  }

  generarDatosAEnviarPorMail() {
    let infoDestinatarios = [];

    let reservasSeleccionadas = $("#bodyListadoReservasEnFechas :checkbox:checked").map(function () {
      return this.id
    }).get();

    console.log("ids de reservas", reservasSeleccionadas);
    console.log("reservas en curso", this.reservasEnCurso);



    reservasSeleccionadas.forEach(reserva => {

      this.reservasEnCurso.map(res => {

        let tipo = $('#listaHorarios .ui-selected').attr('tipo');
        let examen;
        let dia;
        let hora;

        if (res.reserva_uuid === reserva) {

          if (tipo === "RW") {
            examen = this.convertirUuidExamenEnTexto(res.rw_modalidad_uuid)[0];
            dia = this.fechasServicio.stringDiaEspanol(res.dia_RW_fecha_examen);
            hora = this.fechasServicio.stringHoraEspanol(res.dia_RW_fecha_examen);
          } else if (tipo === "LS") {
            examen = this.convertirUuidExamenEnTexto(res.ls_modalidad_uuid)[0];
            dia = this.fechasServicio.stringDiaEspanol(res.dia_LS_fecha_examen);
            hora = this.fechasServicio.stringHoraEspanol(res.dia_LS_fecha_examen);
          } else if (tipo.length === 6) {
            examen = this.convertirUuidExamenEnTexto(res.sem_modalidad_uuid)[0];
            dia = this.fechasServicio.stringDiaEspanol(res.dia_LS_fecha_examen);
            hora = this.fechasServicio.stringHoraEspanol(res.dia_LS_fecha_examen);
          }

          infoDestinatarios.push({
            nombre: res.alumno_nombre,
            apellido: res.alumno_apellido,
            cd: res.alumno_candidate_number,
            email: res.alumno_email,
            examen: examen,
            dia: dia,
            hora: hora,
          })
        }
      })
    })

    let datosParaEnviarMail = {
      destinatarios: infoDestinatarios,
      asunto: $('#mail_asunto').val(),
      cuerpo: $('#textarea_Mail').val(),
    }

    console.log(datosParaEnviarMail)

    let idEstado = $('#estadoEnviarMails')
    this.appendProgressIndeterminate(idEstado);
    this.fechasServicio.enviarMails(datosParaEnviarMail, this.mostrarMensaje, this.huboUnError, idEstado)

  }

  mostrarMensaje(id, mensaje) {
    let mensajeInline = mensaje.replace("./", ". <br />").replace("./", ". <br />")
    id.empty().append(`<div>${mensajeInline}</div>`)
  }

  convertirUuidExamenEnTexto(uuidExamen) {
    let nombreSegunUuid;
    let indexOrder;

    this.examenesFromDB.forEach(function (item, index) {
      if (item.uuid === uuidExamen) {
        nombreSegunUuid = `${item.materia} / ${item.tipo} / ${item.nivel} / ${item.modalidad}`;
        indexOrder = index;
      }
    });
    return [nombreSegunUuid, indexOrder];
  }
}
