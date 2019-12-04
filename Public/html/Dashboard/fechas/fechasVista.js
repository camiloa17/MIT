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
    this.cambioPausaExamenesFechaDia = [];

    this.lastExamSelected = [];

    this.fechaAEliminar = {uuid: "", lista: ""}
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

        if (idSelected === "agregarChipDiaHora" ||  idSelected === "agregarChipSemana" ){
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
        $(event.target)
          .children(".ui-selected")
          .not(":first")
          .removeClass("ui-selected");

        // Obtengo chip seleccionado
        let idSelected = $(event.target)
          .children(".ui-selected")
          .attr("id");

        if (idSelected === "editarChipDiaHora" || idSelected === "editarChipSemana"){
          $('#areaAgregarFecha').empty();
          $('#areaEditarFecha').empty().append( this.mostrarAreaEdicionFechas() )
          this.habilitarSelectableFechas($("#listaHorarios"));
          this.habilitarSelectableExamenes($("#listaExamenes"));
          this.botonAgregarExamenesAFecha();
          this.habilitarBotonGuardarExamenesEnFecha();
        }

        // Selecciono una Chip y me muestra lo solicitado
        idSelected === "editarChipDiaHora" ? this.mostrarListaDeHorarios() : null;

        idSelected === "editarChipSemana" ? this.mostrarListaDeSemanas() : null;
      }
    });
  }

  habilitarSelectableFechas(lista) {
    lista.selectable({
      cancel: ".noSelectable",

      stop: (event, ui) => {
        // Obtengo elemento seleccionado
        let idSelected = $(event.target)
          .children(".ui-selected")
          .attr("id");

        if (idSelected) {
          // Evito que se seleccionen multiples chips. Quedará solo seleccionado el primero si hay una selección de más de un chip
          $(event.target)
            .children(".ui-selected")
            .not(":first")
            .removeClass("ui-selected");

          // Obtengo el tipo de dia si es una fecha (RW o LS) o un numero de 6 cifras si es una semana YYYYSS          

          let tipoSelected = $(event.target)
            .children(".ui-selected")
            .attr("tipo");

          // Asigno a una variable temporal el ultimo id seleccionado (porque si apreto el scrollbar me deselecciona el elemento)
          this.lastExamSelected = idSelected;

          if (tipoSelected === "RW") {
            this.cleanEstadoListaExamen();
            $('#inputSelectarExamenes').removeClass("notVisible");
            this.generarListaDeExamenes(tipoSelected);
            this.mostrarExamenesEnListaFromDB(idSelected, tipoSelected);
            this.generarListaReservaDiaRw(idSelected)
            this.mostrarInputsCambioDia(idSelected);
            this.inicializarDateTimePickerDiaCambios();
            $("#estadoCambiosFechaExamenes").empty()
            
          } else if (tipoSelected === "LS") {
            $("#listaExamenes").empty();
            this.cleanEstadoListaExamen();
            $('#inputSelectarExamenes').addClass("notVisible");
            this.generarListaReservaDiaLs(idSelected)
            this.mostrarInputsCambioDia(idSelected);
            this.inicializarDateTimePickerDiaCambios();
            $("#estadoCambiosFechaExamenes").empty()

          } else if (tipoSelected.length === 6) {
            // Selecciono una semana (yyyyss tiene un length de 6)
            this.mostrarExamenesDeSemanaEnListaFromDB(idSelected);
            $('#inputSelectarExamenes').removeClass("notVisible");
            this.generarListaDeExamenes("LS");
            this.generarListaReservaSemanaLs(idSelected);
            this.inicializarDateTimePickerDiaCambios();
            $("#estadoCambiosFechaExamenes").empty()
          }
        } else {
          // Si apreto en el scrollbar, no tengo ningun ID seleccionado. Como me deselecciona el elemento, le vuelvo a aplicar la clase ui-selected.
          $(event.target)
            .find(`[id='${this.lastExamSelected}']`)
            .addClass("ui-selected");
        }
      }
    });
  }

  


  habilitarSelectableExamenes(lista) {
    lista.selectable({
      // Cuando selecciono un examen y tengo cambios pendientes, asigno una clase noSelectable a los chips y debo ejecutar listaX.selectable("disable")
      cancel: ".noSelectable",

      stop: (event, ui) => {
        // Evito que se seleccionen multiples examenes. Quedará solo seleccionado el primero si hay una selección de más de un chip
        $(event.target)
          .children(".ui-selected")
          .not(":first")
          .removeClass("ui-selected");

        // Obtengo examen seleccionado
        let idSelected = $(event.target)
          .children(".ui-selected")
          .attr("id");
      }
    });
  }

  cleanEstadoListaExamen() {
    this.addExamenesFechaDia = [];
    this.removeExamenesFechaDia = [];
    this.cambioPausaExamenesFechaDia = [];
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
    <div class="row clear-top-2">    
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
        <div class="col clear-top-2">
            <a id="botonAgregaDia"  class="col disabled waves-effect waves-light btn btn-medium weight400 background-azul">Agregar</a>
            <span id="estadoAgregarDia" class="" ></span>
        </div>
        
    </div>
    `;
  }

  inicializarListenerBotonAgregarDia() {
    this.chequearInformacionInputDia();
       
    $("#botonAgregaDia").on("click", () => {
      let fechaExamen= this.ddmmyyyyToYyyymmdd($("#inputFechaAgregarDia").val());
      let fechaFinaliza= this.ddmmyyyyToYyyymmdd($("#finalizaAgregarDia").val());
      
      // DateTime pongo primero el dia luego la hora
      let fechaDateTime = `${fechaExamen} ${$("#inputHoraAgregarDia").val()}`;

      let agregarDia = {
        uuid: this.fechasServicio.uuid(),
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
        if ( $('#inputCupoAgregarDia').val() && $('#inputFechaAgregarDia').val() && $('#inputHoraAgregarDia').val() && $("#finalizaAgregarDia").val() && ($('#inputRWAgregarDia').filter(":checked").val() || $('#inputLSAgregarDia').filter(":checked").val())) {
          $("#botonAgregaDia").removeClass("disabled");
        } else {
          $("#botonAgregaDia").addClass("disabled");
        }           
      }
    });
    

    $('#inputHoraAgregarDia').on("change", () => {
      if ( $('#inputCupoAgregarDia').val() && $('#inputFechaAgregarDia').val() && $('#inputHoraAgregarDia').val() && $("#finalizaAgregarDia").val() && ($('#inputRWAgregarDia').filter(":checked").val() || $('#inputLSAgregarDia').filter(":checked").val())) {
        this.chequearSiFechaFinalizacionEsPosterior() ? $("#botonAgregaDia").removeClass("disabled") : $("#botonAgregaDia").addClass("disabled");
      } else {
        $("#botonAgregaDia").addClass("disabled");
      }          
    });


    $("#finalizaAgregarDia").on("change", () => {
      if (this.chequearSiFechaFinalizacionEsPosterior()) {
        if ( $('#inputCupoAgregarDia').val() && $('#inputFechaAgregarDia').val() && $('#inputHoraAgregarDia').val() && $("#finalizaAgregarDia").val() && ($('#inputRWAgregarDia').filter(":checked").val() || $('#inputLSAgregarDia').filter(":checked").val())) {
          $("#botonAgregaDia").removeClass("disabled");
        } else {
          $("#botonAgregaDia").addClass("disabled");
        }           
      }
    });

    $('#inputRWAgregarDia').on("change", () => {
      if ( $('#inputCupoAgregarDia').val() && $('#inputFechaAgregarDia').val() && $('#inputHoraAgregarDia').val() && $("#finalizaAgregarDia").val() && ($('#inputRWAgregarDia').filter(":checked").val() || $('#inputLSAgregarDia').filter(":checked").val())) {
        this.chequearSiFechaFinalizacionEsPosterior() ? $("#botonAgregaDia").removeClass("disabled") : $("#botonAgregaDia").addClass("disabled");
      } else {
        $("#botonAgregaDia").addClass("disabled");
      } 
    })

    $('#inputLSAgregarDia').on("change", () => {
      if ( $('#inputCupoAgregarDia').val() && $('#inputFechaAgregarDia').val() && $('#inputHoraAgregarDia').val() && $("#finalizaAgregarDia").val() && ($('#inputRWAgregarDia').filter(":checked").val() || $('#inputLSAgregarDia').filter(":checked").val())) {
        this.chequearSiFechaFinalizacionEsPosterior() ? $("#botonAgregaDia").removeClass("disabled") : $("#botonAgregaDia").addClass("disabled");
      } else {
        $("#botonAgregaDia").addClass("disabled");
      } 
    })


  }

  
  chequearSiFechaFinalizacionEsPosterior() {
    let fechaExamen= this.ddmmyyyyToYyyymmdd($("#inputFechaAgregarDia").val());
    let fechaFinaliza= this.ddmmyyyyToYyyymmdd($("#finalizaAgregarDia").val());

    if (fechaExamen.length > 0 && fechaFinaliza.length > 0 ) {      
      if ( fechaExamen > fechaFinaliza  ) {
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
    let fechaExamen= this.ddmmyyyyToYyyymmdd($("#diaExamenCambio").val());
    let fechaFinaliza= this.ddmmyyyyToYyyymmdd($("#finalizaDiaInscripcionCambio").val());

    if (fechaExamen.length > 0 && fechaFinaliza.length > 0 ) {      
      console.log(fechaExamen, fechaFinaliza)
      console.log(fechaExamen > fechaFinaliza   )
      if ( fechaExamen > fechaFinaliza  ) {
        $("#estadoCambiosFechaExamenes").text("");
        return true;
      } else {
        $("#estadoCambiosFechaExamenes").empty().append(
          '<div class="rojo-texto padding-top2-5">La Fecha de Finalización de Inscripción debe ser anterior a la fecha de Examen.</div>'
        );
        $("#botonGuardarExamenesEnFecha").addClass("disabled");
      }
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




  inicializarListenerBotonAgregarSemana() {
    // Se prepara la informacion a enviar
    this.chequearInformacionInputSemana();
    $("#botonAgregaSemana").on("click", () => {
      let agregarSemana = {
        uuid: this.fechasServicio.uuid(),
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
      let semanaElegidaDate = new Date(semanaElegida.slice(0, 4), semanaElegida.slice(5, 7)-1, semanaElegida.slice(8, 11));

      let fechaElegida = this.ddmmyyyyToYyyymmdd($("#finalizaAgregarSemana").val())
      let fechaElegidaDate = new Date(fechaElegida.slice(0, 4), fechaElegida.slice(5, 7)-1, fechaElegida.slice(8, 11));

      console.log(semanaElegidaDate, fechaElegidaDate)
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
    rangeIsFrom = `${d1.getFullYear()}-${d1.getMonth() + 1}-${d1.getDate()}`;
    return rangeIsFrom;
  }

  semanasProximoAno() {
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
      listadoSemanas.append(
        `<option value="${sem} ${ano}" semana="${sem}" ano="${ano}">Semana ${sem} de ${ano} de ${getDateRangeOfWeek(
          sem,
          ano
        )}</option>`
      );

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

    <div class="row">
      <div class="col s12 m12 l7 xl6 clear-top-2 ">
        <ul id="listaHorarios" class="collection height24rem content-scroll margin-bottom22"></ul>
      </div>

      <div class="col s12 m12 l5 xl6  ">
        <div id="inputSelectarExamenes" class="input-field margin-top-0 margin-bottom-0 heigth78px notVisible">
          <select id="selectarExamenes" multiple>
            <option value="" disabled>Seleccionar</option>
          </select>
          <label>Listado de Exámenes</label>
       
          <a id="botonAgregarExamenesAFecha" class="azul-texto cursorPointer">
            <i class="material-icons-outlined left secondary-content button-opacity pointer azul-texto">arrow_downward</i>Agregar
          </a>
        </div>
         
        <ul id="listaExamenes" class="collection height24rem content-scroll "></ul>
      </div>
    </div>

    <div class="row margin0">
    
      <div class="col s3 m3 l2 xl2 offset-l6 offset-xl6">
        <input id="diaExamenCambio" type="text" class="datepicker">
        <label class="gris-texto">DIA</label>
      </div>

      <div class="col s2 m2 l1 xl1">
        <input id="horaExamenCambio" type="text" class="timepicker">
        <label class="gris-texto">HORA</label>
      </div>

      <div class="col s3 m3 l2 xl2 ">
      <input id="finalizaDiaInscripcionCambio" type="text" class="datepicker">
      <label class="gris-texto">Finaliza DIA</label>
      </div>

      <div class="input-field col s2 m2 l1 xl1 ">
        <input id="inputCupoCambio" type="number" autocomplete="off" >
        <label for="inputCupoCambio">Cupo</label>
      </div>
    </div>

    <div class="row">
      <div class="col s6 m6 l6 xl6 offset-l6 offset-xl6 valign-wrapper">
        <a id="botonGuardarExamenesEnFecha" class="waves-effect waves-light btn btn-medium weight400 background-azul">Guardar</a>
        <span id="estadoCambiosFechaExamenes" class="padding-left2-4"></span>
      </div>
    </div>

    <div class="row">
        <div id="listadoReservasEnFechas" class="col s11 m11 l11 xl11 clear-top-3 "></div>
    </div>
    `
  }

  async mostrarListaDeHorarios() {
    let listaHorarios = await this.fechasServicio.getListaHorarios();
    $("#listaHorarios").empty();
    console.log(listaHorarios)

    listaHorarios.forEach(horario => {
      $("#listaHorarios").append(`
            <li id="${horario.uuid}" tipo="${horario.source}" pausado="${horario.pausado}" cupo="${horario.cupo_maximo}" fechaExamen="${horario.fecha_Examen}" fechaFinalizacion="${horario.fecha_finalizacion}" 
            class="collection-item azul-texto cursorPointer hoverGrey ${horario.pausado ? "inputInactivo" : ""}">

              <div class="row margin0">
                <div class="col s6 m6 l6 xl6 padding0">
                  <span class="title ${horario.pausado ? "inputInactivo" : ""}">
                    <span class="new badge margin-left-0-15 margin-right-1 left ${horario.source === "RW" ? "light-blue " : "orange "} " data-badge-caption="">${horario.source === "RW" ? "ESCR" : "ORAL"}</span>
                    ${this.fechasServicio.stringDiaHoraEspanol(horario.fecha_Examen)}
                  </span>
                </div>
                <div class"col s6 m6 l6 xl6">
                  <div class="secondary-content right">  
                    <i id="${horario.uuid}_pausa" class="material-icons-outlined secondary-content right azul-texto button-opacity noSelectable">${horario.pausado ? "visibility_off" : "visibility"}</i>
                    <span class="new badge background-azul margin-left-0-15" data-badge-caption="vtas">${horario.ventas}</span>
                    <span class="new badge yellow black-text margin-left-0-15" data-badge-caption="pend">0</span>
                    <span class="new badge green margin-left-0-15" data-badge-caption="libres">${horario.cupos_libres}</span>
                    <i href="#modalEliminarFecha" id="${horario.uuid}_remover" class="modal-trigger material-icons-outlined secondary-content right azul-texto button-opacity margin0 noSelectable">${!horario.ventas ? "delete" : ""}</i>
                  </div>
                </div>
              </div>
            </li>
            `);
      this.asignarFuncionBotonPausa(horario.uuid);
      this.asignarFuncionEliminarFecha(horario.uuid, horario.source);
    });
  }

 

  mostrarInputsCambioDia(idSelected){
    let cupo=$(`#${idSelected}`).attr("cupo");
    let dia=$(`#${idSelected}`).attr("fechaExamen").toString().substring(0,10);
    let hora=$(`#${idSelected}`).attr("fechaExamen").toString().substring(11,16);
    let finaliza=$(`#${idSelected}`).attr("fechaFinalizacion").toString().substring(0,10);
    $('#inputCupoCambio').val(`${cupo}`);
    M.updateTextFields();

    $('#diaExamenCambio').val(`${this.ddmmyyyyToYyyymmdd(dia)}`)

    $('#horaExamenCambio').val(`${hora}`)

    $('#finalizaDiaInscripcionCambio').val(`${this.ddmmyyyyToYyyymmdd(finaliza)}`)

  }

  async mostrarListaDeSemanas() {
    let listaSemanas = await this.fechasServicio.getListaSemanas();
    //console.log(listaSemanas);
    $("#listaHorarios").empty();
    console.log(listaSemanas)

    listaSemanas.forEach(semana => {
      $("#listaHorarios").append(`
            <li id="${semana.uuid}" tipo="${semana.yyyyss}" pausado="${semana.pausado}" class="collection-item azul-texto cursorPointer hoverGrey ${semana.pausado ? "inputInactivo" : ""}">
              <div class="row margin0">
                <div class="col s7 m7 l7 xl7 padding0">
                  <span class="title ${semana.pausado ? "inputInactivo" : ""}">
                    ${this.armarStringSemanaAPartirDelPrimerDiaDeSemana(semana.yyyyss)}
                  </span>
                </div>
                <div class"col s5 m5 l5 xl5">
                  <div class="secondary-content right">  
                    <i id="${semana.uuid}_pausa" class="material-icons-outlined secondary-content right azul-texto button-opacity noSelectable">${semana.pausado ? "visibility_off" : "visibility"}</i>
                    <span class="new badge background-azul margin-left-0-15" data-badge-caption="vtas">${semana.ventas}</span>
                    <span class="new badge yellow black-text margin-left-0-15" data-badge-caption="pend">0</span>
                    <span class="new badge green margin-left-0-15" data-badge-caption="libres">${semana.cupos_libres}</span>
                    <i href="#modalEliminarFecha" id="${semana.uuid}_remover" class="modal-trigger material-icons-outlined secondary-content right azul-texto button-opacity margin0 noSelectable">${!semana.ventas ? "delete" : ""}</i>
                  </div>
                </div>
              </div>              
            </li>
            `);
      this.asignarFuncionBotonPausa(semana.uuid);
      this.asignarFuncionEliminarFecha(semana.uuid, "semana");
    });
  }

  asignarFuncionEliminarFecha(id, lista) {
    $(`#${id}_remover`).on("click", () => {
      this.fechaAEliminar.uuid= id;
      this.fechaAEliminar.lista= lista;
      });
  }

  async eliminarFecha(){   
    let idEstado = $('#estadoCambiosFechaExamenes')

    switch (this.fechaAEliminar.lista) {
      case "semana":
        await this.fechasServicio.elminarFechaSemana(this.fechaAEliminar.uuid, this.accionExitosa, this.huboUnError, idEstado);
        await this.mostrarListaDeSemanas();
      break;
      case "RW":
        await this.fechasServicio.elminarFechaDiaRw(this.fechaAEliminar.uuid, this.accionExitosa, this.huboUnError, idEstado);
        await this.mostrarListaDeHorarios();
      break;
      case "LS":
        await this.fechasServicio.elminarFechaDiaLs(this.fechaAEliminar.uuid, this.accionExitosa, this.huboUnError, idEstado);
        await this.mostrarListaDeHorarios();
      break;
    } 

  }

  asignarFuncionBotonPausa(id) {
    $(`#${id}_pausa`).on("click", () => {
      this.seGeneroUnCambioPausaEnExamen = true;

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
    });
  }




  generarListaDeExamenes(oralOEscrito) {
    //Genero la lista de opciones para el dropdown de examenes teniendo en cuenta si la fecha de examen corresponde a LS o a RW

    $("#selectarExamenes").empty();

    switch (oralOEscrito) {
      case "RW":
        this.examenesFromDB.forEach(examen => {
          if (examen.uuid && examen.rw && !examen.ls) {
            $("#selectarExamenes").append(`
              <option value="${examen.uuid}">${examen.materia} / ${examen.tipo} / ${examen.nivel} / ${examen.modalidad}</option>
              `);
          }
        });
        break;
      case "LS":
        this.examenesFromDB.forEach(examen => {
          if (examen.uuid && !examen.rw && examen.ls) {
            $("#selectarExamenes").append(`
              <option value="${examen.uuid}">${examen.materia} / ${examen.tipo} / ${examen.nivel} / ${examen.modalidad}</option>
              `);
          }
        });
        break;
    }

    this.habilitarFormSelect();
  }


  templateLiExamen(id, uuidExamen, uuidFecha, nombre, pausado, ventas) {
    return `
    <li id="${id}" uuidExamen="${uuidExamen}" uuidFecha="${uuidFecha}" pausado="${pausado}" class="collection-item azul-texto cursorPointer hoverGrey">
      <div class="row margin0">
        <div class="col s7 m7 l7 xl7 padding0">
          <span class="title ${pausado ? "inputInactivo" : ""}">${nombre}</span>
        </div>
        <div class="col s5 m5 l5 xl5 padding0">
          <div class="secondary-content right ">  
            <i id="${id}_pausa" class="material-icons-outlined secondary-content azul-texto right button-opacity noSelectable">${pausado ? "visibility_off" : "visibility"}</i>
            <span class="new badge background-azul margin-left-0-15" data-badge-caption="vtas">${ventas}</span>
            <span class="new badge yellow black-text margin-left-0-15" data-badge-caption="pend">0</span>
            <i id="${id}_remove" class="material-icons-outlined secondary-content azul-texto right button-opacity margin0 noSelectable">${ventas ? "" : "delete"}</i>
          </div>
        </div>
      </div>
    </li>
    `;
  }

  habilitarBotonGuardarExamenesEnFecha() {
    $("#botonGuardarExamenesEnFecha").on("click", () => {
      let datos = {
        tipoDeLista: $("#listaHorarios")
          .find(".ui-selected")
          .attr("tipo"),
        estadoListaExamenesDia: this.obtenerListaDeExamenesDeUl(),
        addExamenesFechaDia: this.addExamenesFechaDia,
        removeExamenesFechaDia: this.removeExamenesFechaDia,
        cambioPausaExamenesFechaDia: this.cambioPausaExamenesFechaDia,
        uuidFechaDia: $("#listaHorarios")
          .find(".ui-selected")
          .attr("id")
      };

      this.fechasServicio.agregarExamenFechaDia(datos);
    });
  }


  async generarListaReservaSemanaLs(idSelected) {
    $('#listadoReservasEnFechas').empty();
    let reservaSemanas = await this.fechasServicio.getElementosListaReservasEnSemanasLs(idSelected);
    let diasOral = await this.fechasServicio.getListaHorariosOrales();

    this.mostrarlistadoReservasEnFechasSemanasLs();
    this.mostrarElementosListReservasEnFEchasSemanasLs(reservaSemanas, diasOral);
    console.log(reservaSemanas)
  }

  async generarListaReservaDiaRw(idSelected) {
    $('#listadoReservasEnFechas').empty();
    let reservaDiaRw = await this.fechasServicio.getElementosListaReservasEnDiaRw(idSelected);
    this.mostrarlistadoReservasEnDiaRw();
    this.mostrarElementosListReservasEnDiaRw(reservaDiaRw)
    console.log(reservaDiaRw)
  }

  async generarListaReservaDiaLs(idSelected) {
    $('#listadoReservasEnFechas').empty();
    let reservaDiaLs = await this.fechasServicio.getElementosListaReservasEnDiaLs(idSelected);
    this.mostrarlistadoReservasEnDiaLs();
    this.mostrarElementosListReservasEnDiaLs(reservaDiaLs)
  }


  mostrarlistadoReservasEnFechasSemanasLs() {
    $('#listadoReservasEnFechas').append(
      `<table>
          <thead>
              <tr>
                  <th class="">
                      <label>
                          <input type="checkbox" id="ckbCheckAll" />
                          <span></span>
                      </label>
                  </th>
                  <th>NOMBRE</th>
                  <th>APELLIDO</th>
                  <th>CANDIDATE NUMBER</th>
                  <th>DOCUMENTO</th>
                  <th>DIA ASIGNADO</th>
              </tr>
          </thead>

          <tbody id="bodyListadoReservasEnFechas"></tbody>
    </table>`)
  }

  mostrarlistadoReservasEnDiaRw() {
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
              </tr>
          </thead>

          <tbody id="bodyListadoReservasEnFechas"></tbody>
    </table>`)
  }

  mostrarElementosListReservasEnDiaRw(reservaDiaRw) {
    $('#bodyListadoReservasEnFechas').empty();

    reservaDiaRw.forEach(reserva => {
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
          </tr>`)
    });
    this.habilitarToggleCheckboxAll()
  };

  habilitarToggleCheckboxAll() {
    $("#ckbCheckAll").click(function () {
      $(".checkBoxClass").prop('checked', $(this).prop('checked'));
    });
  }

  mostrarlistadoReservasEnDiaLs() {
    $('#listadoReservasEnFechas').append(
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
              </tr>
          </thead>

          <tbody id="bodyListadoReservasEnFechas"></tbody>
    </table>`)
  }

  mostrarElementosListReservasEnDiaLs(reservaDiaLs) {
    $('#bodyListadoReservasEnFechas').empty();

    reservaDiaLs.forEach(reserva => {
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
          </tr>`)
    });

    this.habilitarToggleCheckboxAll()
  };


  mostrarElementosListReservasEnFEchasSemanasLs(reservasSemanaLs, diasOral) {
    $('#bodyListadoReservasEnFechas').empty();

    console.log(reservasSemanaLs)


    reservasSemanaLs.forEach(reserva => {
      console.log(reserva.dia_LS_uuid, reserva.dia_LS_fecha_examen)
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
            <td>${reserva.dia_LS_uuid ? this.fechasServicio.stringDiaHoraEspanol(reserva.dia_LS_fecha_examen) : "sin asignar"}</td>
          </tr>`)
    });

    $('#listadoReservasEnFechas').append(
      `
        <div class="col s12 m10 l8  xl5">
      
          <div class="input-field clear-top-3">
            <select id="listadoDiasOralesParaSemana">
          </select>
          <label>Asignar Día de Oral a los seleccionados</label>

          <a id="botonAsignarDiaOralASemana" class="waves-effect waves-light btn btn-medium weight400 background-azul">Asignar</a>

      </div>
        </div>

        
  

     `);
    console.log(diasOral)

    $('#listadoDiasOralesParaSemana').append(
      `<option value="" disabled selected>Seleccionar</option>`
    )


    diasOral.forEach(diaHorario => {
      $('#listadoDiasOralesParaSemana').append(
        `<option value="${diaHorario.uuid}" >${this.fechasServicio.stringDiaHoraEspanol(diaHorario.fecha_Examen)} // Cupos Libres: ${diaHorario.cupos_libres}</option>`
      )
    }
    );


    this.habilitarFormSelect();
    this.asignarFuncionBotonAsignarDiaOralASemana();
    this.habilitarToggleCheckboxAll()


  }

  asignarFuncionBotonAsignarDiaOralASemana() {
    $('#botonAsignarDiaOralASemana').on('click', () => {
      this.asignarDiaASemanaExamenOral()
    })
  }


  asignarDiaASemanaExamenOral() {
    // Obtengo el día del oral seleccionado
    $("select").formSelect();
    let instance = M.FormSelect.getInstance($("#listadoDiasOralesParaSemana"));
    let diaOralSeleccionado = instance.getSelectedValues();

    // Obtengo las reservas de semana a las que se le debe asignar un día
    let reservasSeleccionadas = $("#bodyListadoReservasEnFechas :checkbox:checked").map(function () {
      return this.id;
    }).get();

    console.log(diaOralSeleccionado, reservasSeleccionadas)

    let datos = {
      fecha: diaOralSeleccionado,
      reservas: reservasSeleccionadas,
    }

    this.fechasServicio.asignarDiaASemanaExamenOral(datos);

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

      // Agrego al array el examen agregado, asi luego se actualiza la DB
      examenesSelecionadosQueNoEstanEnLista.forEach(examen =>
        this.addExamenesFechaDia.push(examen)
      );

      //Reinicia los valores seleccionados
      $("form input").val("");
      $("select").val("None");
      $("#inputSelectarExamenes div input").val("");

      this.mostrarExamenesNuevosEnLista(examenesSelecionadosQueNoEstanEnLista);
    });
  }

  mostrarExamenesNuevosEnLista(examenes) {
    examenes.forEach(examen => {
      let nombreCompleto = this.convertirUuidExamenEnTexto(examen);
      let pausado = 0;
      let uuid = this.fechasServicio.uuid();
      let fecha = $("#listaHorarios")
        .find(".ui-selected")
        .attr("id");
      let ventas = 0;

      $("#listaExamenes").append(
        this.templateLiExamen(uuid, examen, fecha, nombreCompleto, pausado, ventas)
      );
    });

    this.asignarFuncionBotonPausa(uuid);
  }

  async mostrarExamenesEnListaFromDB(idSelected, tipoSelected) {
    let examenes = await this.fechasServicio.getExamenesEnFecha(
      idSelected,
      tipoSelected
    );
    $("#listaExamenes").empty();

    

    examenes.forEach(examen => {
       let nombre = this.convertirUuidExamenEnTexto(examen.modalidad_uuid);

      $("#listaExamenes").append(
        this.templateLiExamen(
          examen.uuid,
          examen.modalidad_uuid,
          examen.fecha_uuid,
          nombre,
          examen.pausado,
          examen.ventas
        )
      );

      this.asignarFuncionBotonPausa(examen.uuid);
    });
  }


  async mostrarExamenesDeSemanaEnListaFromDB(idSelected) {
    let examenes = await this.fechasServicio.getExamenesEnSemana(idSelected);
    $("#listaExamenes").empty();

    console.log(examenes)


    examenes.forEach(examen => {
      let nombre = this.convertirUuidExamenEnTexto(examen.modalidad_uuid);

      $("#listaExamenes").append(
        this.templateLiExamen(
          examen.uuid,
          examen.modalidad_uuid,
          examen.fecha_uuid,
          nombre,
          examen.pausado,
          examen.ventas
        )
      );
    });
  }

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
        fecha: $(this)
          .attr("uuidFecha")
          .trim(),
        nombreCompleto: $(this)
          .find("span")
          .text(),
        pausado: $(this)
          .attr("pausado")
          .trim()
      });
    });
    return examenesEnUl;
  }

  convertirUuidExamenEnTexto(uuidExamen) {
    let nombreSegunUuid;

    this.examenesFromDB.forEach(function (item) {
      if (item.uuid === uuidExamen) {
        nombreSegunUuid = `${item.materia} / ${item.tipo} / ${item.nivel} / ${item.modalidad}`;
      }
    });
    return nombreSegunUuid;
  }
}
