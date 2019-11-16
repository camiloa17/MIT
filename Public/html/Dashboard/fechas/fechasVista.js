class FechasVista {
  constructor() {
    this.fechasServicio = new FechasServicio();
    this.habilitarSelectableChipDiaSemana($("#chipsSeleccionDiaSemana"));
    this.habilitarSelectableFechas($("#listaHorarios"));
    this.mostrarListaDeHorarios();
    this.mostrarListaDeExamenes();
  }

  habilitarSelectableChipDiaSemana(ulChips) {
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

        // Selecciono una Chip y me muestra lo solicitado
        idSelected === "agregarChipDiaHora"
          ? this.mostrarAgregarDiaHora()
          : null;

        idSelected === "agregarChipSemana" ? this.mostrarAgregarSemana() : null;
      }
    });
  }

  mostrarAgregarDiaHora() {
    $("#areaAgregarFecha").empty();
    $("#areaAgregarFecha").append(this.selectorDiaEscritoUOral());
    $("#areaAgregarFecha").append(this.seleccionarDiaYHora());
    this.inicializarDateTimePicker();
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
            <a id="botonAgregaDia" class="waves-effect waves-light btn btn-medium weight400 background-azul">Agregar</a>
        </div>
        <span id="estadoAgregarDia"></span>
    </div>

  
    `;
  }

  inicializarListenerBotonAgregarDia() {
    $("#botonAgregaDia").on("click", () => {
      let agregarDia = {
        uuid: this.fechasServicio.uuid(),
        cupo: $("#inputCupoAgregarDia").val(),
        dia: $("#inputFechaAgregarDia").val(),
        hora: $("#inputHoraAgregarDia").val(),
        finaliza: $("#finalizaAgregarDia").val(),
        tipo:
          $("#inputRWAgregarDia")
            .filter(":checked")
            .val() == "on"
            ? "RW"
            : "LS"
      };

      this.fechasServicio.agregarFechaDia(agregarDia);
    });
  }

  mostrarAgregarSemana() {
    console.log("agrego semana");
  }

  inicializarDateTimePicker() {
    $(".timepicker").timepicker({
      twelveHour: false,
      autoClose: true
    });

    $("#inputFechaAgregarDia").datepicker({
      firstDay: 1,
      minDate: new Date(),
      autoClose: true,
      format: "yyyy-mm-dd",
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
      format: "yyyy-mm-dd",
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

  chequearSiFechaFinalizacionEsPosterior() {
    if ($("#finalizaAgregarDia").val().length > 0) {
      $("#inputFechaAgregarDia").val() < $("#finalizaAgregarDia").val()
        ? $("#estadoAgregarDia").text("")
        : $("#estadoAgregarDia").text(
            "La Fecha de Finalización de Inscripción debe ser posterior a la fecha de Examen."
          );
    }
  }

  aceptarSoloNumerosEnInput(input) {
    $(`#${input}`).on("keydown", function(e) {
      if (e.which == 69 || e.which == 107 || e.which == 109) {
        e.preventDefault();
      }
    });
  }

  async mostrarListaDeHorarios() {
    let listaHorarios = await this.fechasServicio.getListaHorarios();


    listaHorarios.forEach(horario => {
      $("#listaHorarios").append(        `
            <li class="collection-item azul-texto">
                <i
                    class="material-icons-outlined secondary-content right azul-texto button-opacity">visibility</i>
                <span class="badge" data-badge-caption="cupos">${horario.cupo_maximo}</span>
                <span class="new badge background-azul" data-badge-caption="libres">24</span>
                <span class="new badge blue-grey  lighten-2" data-badge-caption="">${(horario.source === "RW") ? "ESCR" : "ORAL"}</span>
                ${this.fechasServicio.stringDiaHoraEspanol(horario.fecha_Examen)}
            </li>
            `
      );
    });
  }

    establecerOrdenListaExamenes(listaExamenes){
    listaExamenes.sort(function(objA, objB) {
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

  async mostrarListaDeExamenes() {
    let listaExamenes = await this.fechasServicio.getListaExamenes();

    this.establecerOrdenListaExamenes(listaExamenes);
    

    console.log(listaExamenes);

  }
  
//borrar esto de abajo que esta repetido
/*
  async mostrarListaDeHorarios() {
    let listaHorarios = await this.fechasServicio.getListaHorarios();


    listaHorarios.forEach(horario => {
      console.log(horario.source);
      $("#listaExamenes").append(
        `
            <li class="collection-item azul-texto">
                <i
                    class="material-icons-outlined secondary-content right azul-texto button-opacity">visibility</i>
                <span class="badge" data-badge-caption="cupos">30</span>
                <span class="new badge background-azul" data-badge-caption="libres">24</span>
                <span class="new badge blue-grey  lighten-2" data-badge-caption="">ORAL</span>
                ${this.fechasServicio.stringDiaHoraEspanol(horario.fecha_Examen)}
            </li>
            `
      );
    });
  }*/

  habilitarSelectableFechas(ulChips) {
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
      }
    });
  }
}
