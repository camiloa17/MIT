class FechasVista {
  constructor() {
    this.fechasServicio = new FechasServicio();

    this.traerListaDeExamenesDb(); 
    this.examenesFromDB = [];

    this.habilitarSelectableChipDiaSemana($("#chipsSeleccionDiaSemana"));
    this.habilitarSelectableFechas($("#listaHorarios"));
    this.habilitarSelectableExamenes($('#listaExamenes'));

    this.mostrarListaDeHorarios();
    this.botonAgregarExamenesAFecha(); 

    this.habilitarBotonGuardarExamenesEnFecha();


    /// Agregar Examenes a Fecha día:
    this.addExamenesFechaDia=[];
    this.removeExamenesFechaDia=[];
    this.cambioPausaExamenesFechaDia=[];

    this.lastExamSelected=[];
  }



  habilitarFormSelect() {
    $("select").formSelect();
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

  habilitarSelectableFechas(lista) {
    lista.selectable({
      cancel: ".noSelectable",

      stop: (event, ui) => {
         // Obtengo elemento seleccionado
         let  idSelected= $(event.target).children(".ui-selected").attr("id");


         if(idSelected){        
          // Evito que se seleccionen multiples chips. Quedará solo seleccionado el primero si hay una selección de más de un chip
          $(event.target)
            .children(".ui-selected")
            .not(":first")
            .removeClass("ui-selected");
          
          // Obtengo el tipo de dia (RW o LS)
          let tipoSelected = $(event.target)
          .children(".ui-selected")
          .attr("tipo");

          // Asigno a una variable temporal el ultimo id seleccionado (porque si apreto el scrollbar me deselecciona el elemento)
          this.lastExamSelected= idSelected;
          
          this.cleanEstadoListaExamen();
          this.generarListaDeExamenes(tipoSelected);
          this.mostrarExamenesEnListaFromDB(idSelected, tipoSelected);     
        } else {
          // Si apreto en el scrollbar, no tengo ningun ID seleccionado. Como me deselecciona el elemento, le vuelvo a aplicar la clase ui-selected.
          $(event.target).find(`[id='${this.lastExamSelected}']`).addClass("ui-selected");
        }
      }
    });
  }

  cleanEstadoListaExamen() {
    this.addExamenesFechaDia=[];
    this.removeExamenesFechaDia=[];
    this.cambioPausaExamenesFechaDia=[];
  }

  habilitarSelectableExamenes(lista) {
    lista.selectable({
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

          console.log(idSelected)
      
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
      let fechaDateTime = `${$("#inputFechaAgregarDia").val()} ${$("#inputHoraAgregarDia").val()}`;

      let agregarDia = {
        uuid: this.fechasServicio.uuid(),
        cupo: $("#inputCupoAgregarDia").val(),
        fecha: fechaDateTime,        
        finaliza: $("#finalizaAgregarDia").val(),
        tipo: $("#inputRWAgregarDia").filter(":checked").val() == "on" ? "RW" : "LS"
      };

      this.fechasServicio.agregarFechaDia(agregarDia);
    });
  }

  mostrarAgregarSemana() {    
    $("#areaAgregarFecha").empty();
    $("#areaAgregarFecha").append(this.selectorSemanas());
    
    this.aceptarSoloNumerosEnInput('inputCupoAgregarSemana') 
    this.semanasProximoAno();
    this.habilitarFormSelect();
    this.inicializarListenerBotonAgregarSemana();
    
  }




  selectorSemanas(){
    return`
    <div class="row">
      <div class="input-field col l5 clear-top-3">
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
        <input id="finalizaAgregarSemana" type="text" class="datepicker" disabled>
        <label class="gris-texto">FINALIZA inscripción</label>
      </div>
    </div>

    <div class="row margin0">
      <div class="col clear-top-2">
          <a id="botonAgregaSemana" class="waves-effect waves-light btn btn-medium weight400 background-azul">Agregar</a>
      </div>
      <span id="estadoAgregarSemana"></span>
    </div>
  </div>`
  }

  inicializarListenerBotonAgregarSemana() {
    $("#botonAgregaSemana").on("click", () => {

      var instanceSemana = M.FormSelect.getInstance($("#listadoSemanas"));
      //var semanaSeleccionada = instanceSemana.getSelectedValues();
      
      let agregarSemana = {
        uuid: this.fechasServicio.uuid(),
        cupo: $("#inputCupoAgregarSemana").val(),
        semana: this.getDateFirstDayOfWeek($('#listadoSemanas option:selected').attr("semana"), $('#listadoSemanas option:selected').attr("ano")),
        finaliza: $("#finalizaAgregarSemana").val(),
      };
      console.log(agregarSemana)
      this.fechasServicio.agregarFechaSemana(agregarSemana);
    });
  }

  getDateFirstDayOfWeek(weekNo, y) {
    var d1, numOfdaysPastSinceLastMonday, rangeIsFrom;
    d1 = new Date('' + y + '');
    numOfdaysPastSinceLastMonday = d1.getDay() - 1;
    d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
    d1.setDate(d1.getDate() + (7 * (weekNo - d1.getWeek())));
    rangeIsFrom = `${d1.getFullYear()}-${(d1.getMonth() + 1)}-${d1.getDate()}`;
    return rangeIsFrom;
  }


  semanasProximoAno() {
    let listadoSemanas=$('#listadoSemanas')

    Date.prototype.getWeek = function () {
        var date = new Date(this.getTime());
        date.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        // January 4 is always in week 1.
        var week1 = new Date(date.getFullYear(), 0, 4);
        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
            - 3 + (week1.getDay() + 6) % 7) / 7);
    }

    Date.prototype.getWeekYear = function () {
        var date = new Date(this.getTime());
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        return date.getFullYear();
    }

    function getISOWeeks(y) {
        var d, isLeap;

        d = new Date(y, 0, 1);
        isLeap = new Date(y, 1, 29).getMonth() === 1;

        //check for a Jan 1 that's a Thursday or a leap year that has a 
        //Wednesday jan 1. Otherwise it's 52
        return d.getDay() === 4 || isLeap && d.getDay() === 3 ? 53 : 52
    }

    function getDateRangeOfWeek(weekNo, y) {
        var d1, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
        d1 = new Date('' + y + '');
        numOfdaysPastSinceLastMonday = d1.getDay() - 1;
        d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
        d1.setDate(d1.getDate() + (7 * (weekNo - d1.getWeek())));
        rangeIsFrom = d1.getDate() + "/" + (d1.getMonth() + 1) + "/" + d1.getFullYear();
        d1.setDate(d1.getDate() + 6);
        rangeIsTo = d1.getDate() + "/" + (d1.getMonth() + 1) + "/" + d1.getFullYear();
        return rangeIsFrom + " a " + rangeIsTo;
    };

    // function getDateFirstDayOfWeek(weekNo, y) {
    //   var d1, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
    //   d1 = new Date('' + y + '');
    //   numOfdaysPastSinceLastMonday = d1.getDay() - 1;
    //   d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
    //   d1.setDate(d1.getDate() + (7 * (weekNo - d1.getWeek())));
    //   rangeIsFrom = d1.getDate() + "/" + (d1.getMonth() + 1) + "/" + d1.getFullYear();
    //   d1.setDate(d1.getDate() + 6);
    //   rangeIsTo = `${d1.getFullYear()}-${(d1.getMonth() + 1)}-${d1.getDate()}`;
    //   return rangeIsFrom;
    // }

    const fechaHoy = new Date;
    const anioActual = () => fechaHoy.getWeekYear(fechaHoy);
    const semanaActual = () => fechaHoy.getWeek(fechaHoy);
    const semanasTotalAnioActual = () => getISOWeeks(anioActual);


    for (let i = 53, sem = semanaActual(), ano = anioActual(); i >= 1; i--) {

        listadoSemanas.append(`<option value="${sem} ${ano}" semana="${sem}" ano="${ano}">Semana ${sem} de ${ano} de ${getDateRangeOfWeek(sem, ano)}</option>`)

        if (sem < semanasTotalAnioActual()) {
            sem++
        } else {
            sem = 1
            ano++
        }

    }
};

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
            "La Fecha de Finalización de Inscripción debe ser anterior a la fecha de Examen."
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
    console.log(this.zone)

    listaHorarios.forEach(horario => {
      $("#listaHorarios").append(`
            <li id="${horario.uuid}" tipo="${horario.source}" pausado="${horario.pausado}" class="collection-item azul-texto cursorPointer hoverGrey ${horario.pausado ? "inputInactivo" : ""}">
                <i id="${horario.uuid}_pausa" class="material-icons-outlined secondary-content right azul-texto button-opacity margin0 noSelectable">${horario.pausado ? "visibility_off" : "visibility"}</i>
                <span class="badge cupos" data-badge-caption="cupos">${
                  horario.cupo_maximo
                }</span>
                <span class="new badge background-azul" data-badge-caption="libres">24</span>
                <span class="new badge blue-grey  lighten-2" data-badge-caption="">${
                  horario.source === "RW" ? "ESCR" : "ORAL"
                }</span>
                ${this.fechasServicio.stringDiaHoraEspanol(horario.fecha_Examen)}
            </li>
            `);
      this.asignarFuncionBotonPausa(horario.uuid)
    });
  }

  

  asignarFuncionBotonPausa(id) {
    $(`#${id}_pausa`).on("click", () => {

      this.seGeneroUnCambioPausaEnExamen= true;

      // Si esta la visibilidad en false, el input se ve inactivo
      $(`#${id}`).toggleClass("inputInactivo");
    
      // Cuando presiono boton visibilidad, cambia su icono
      $(`#${id}_pausa`).text(  $(`#${id}_pausa`).text().trim() == "visibility" ? "visibility_off" : "visibility"  );
    
      // Si presioné el icono de visibilidad, cambio el atributo html mostrar_cliente y pongo en true el aviso que ocurrio un cambio
      $(`#${id}`).attr("pausado", (index, attr) =>
        attr == 1 ? 0 : 1
      );

    });
  }




  async traerListaDeExamenesDb() {
    this.examenesFromDB = await this.fechasServicio.getListaExamenes();
    this.establecerOrdenListaExamenes(this.examenesFromDB);
  }

  establecerOrdenListaExamenes(listaExamenes) {
    //Ordeno la lista de examenes primero por Materia, luego Tipo, luego Nivel, luego Modalidad.
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


  

  generarListaDeExamenes(oralOEscrito) {
    //Genero la lista de opciones para el dropdown de examenes teniendo en cuenta si la fecha de examen corresponde a LS o a RW

    $("#selectarExamenes").empty();
    
    switch (oralOEscrito){
      case 'RW':
          this.examenesFromDB.forEach(examen => {
            if (examen.uuid  && (examen.rw && !examen.ls )) {
              $("#selectarExamenes").append(`
              <option value="${examen.uuid}">${examen.materia} / ${examen.tipo} / ${examen.nivel} / ${examen.modalidad}</option>
              `);
            }
          });
        break;
      case 'LS':
          this.examenesFromDB.forEach(examen => {
            if (examen.uuid  && (!examen.rw && examen.ls )) {
              $("#selectarExamenes").append(`
              <option value="${examen.uuid}">${examen.materia} / ${examen.tipo} / ${examen.nivel} / ${examen.modalidad}</option>
              `);
            }
          });
          break;
    }
  
    //Inicializo el form select de materialize css
    this.habilitarFormSelect();
  }



  templateLiVerTodos(){
    return `<div id="verTodosLosExamenes" class="collection-item azul-texto weight700">
    VER TODOS
    </div>`;
  }

  templateLiEliminarFechaVacia(){
    return `<li id="eliminarFechaVacia" class="collection-item azul-texto weight700">
    Eliminar Fecha Vacía        X
    </li>`;
  }

  templateLiExamen(id, uuidExamen, uuidFecha, nombre, pausado){
    return `
    <li id="${id}" uuidExamen="${uuidExamen}" uuidFecha="${uuidFecha}" pausado="${pausado}" class="collection-item azul-texto cursorPointer hoverGrey">
      <span>${nombre}</span>
      <i id="${id}_visibility" class="material-icons-outlined azul-texto right button-opacity">${pausado ? "visibility_off" : "visibility"}</i>
    </li>
    `
  }

  habilitarBotonGuardarExamenesEnFecha() {
    $('#botonGuardarExamenesEnFecha').on("click", () => {

      
      let datos={
        estadoListaExamenesDia: this.obtenerListaDeExamenesDeUl(),
        addExamenesFechaDia: this.addExamenesFechaDia,
        removeExamenesFechaDia: this.removeExamenesFechaDia,
        cambioPausaExamenesFechaDia: this.cambioPausaExamenesFechaDia,
        uuidFechaDia: $('#listaHorarios').find(".ui-selected").attr("id"),
      } 
      console.log("Se guardaran estos cambios ", datos)
   

      this.fechasServicio.agregarExamenFechaDia(datos);

    });
  }

  botonAgregarExamenesAFecha() {
    $("#botonAgregarExamenesAFecha").on("click", () => {
      // Obtengo los elementos seleccionados
      $("select").formSelect();
      var instance = M.FormSelect.getInstance($("#selectarExamenes"));
      var examenesSeleccionados = instance.getSelectedValues();

      // Obtengo los elementos que ya estan en la lista
      var examenesYaEnLista = this.obtenerListaDeExamenesDeUl()
 
      // Genero un array con los objetos que se necesitan agregar
      let examenesSelecionadosQueNoEstanEnLista = examenesSeleccionados.filter( element => !examenesYaEnLista.some(el => element === el.examen) );

      // Agrego al array el examen agregado, asi luego se actualiza la DB
      examenesSelecionadosQueNoEstanEnLista.forEach( examen => this.addExamenesFechaDia.push(examen) );

      //Reinicia los valores seleccionados
      $("form input").val("");
      $("select").val("None");
      $('#inputSelectarExamenes div input').val('');

      this.mostrarExamenesNuevosEnLista(examenesSelecionadosQueNoEstanEnLista);
    });
  }

  mostrarExamenesNuevosEnLista(examenes) {
    examenes.forEach(examen => {
      let nombreCompleto = this.convertirUuidExamenEnTexto(examen);
      let pausado=0;
      let uuid= this.fechasServicio.uuid();
      let fecha= $('#listaHorarios').find(".ui-selected").attr("id");

      $("#listaExamenes").append(this.templateLiExamen(uuid, examen, fecha, nombreCompleto, pausado));
    });
  }


  async mostrarExamenesEnListaFromDB(idSelected, tipoSelected){
    let examenes = await this.fechasServicio.getExamenesEnFecha(idSelected, tipoSelected);
    $("#listaExamenes").empty();
    
    examenes.forEach( examen => {
      console.log(examen)
      let nombre= this.convertirUuidExamenEnTexto(examen.modalidad_uuid)
      
      $("#listaExamenes").append(this.templateLiExamen(examen.uuid, examen.modalidad_uuid, examen.fecha_uuid, nombre, examen.pausado));
            
    });
  }

  obtenerListaDeExamenesDeUl() {
    let examenesEnUl =[];
   
    $("#listaExamenes li").each(function() {
      examenesEnUl.push(
        {
          uuid: $(this).attr('id').trim(),
          examen: $(this).attr('uuidExamen').trim(),
          fecha: $(this).attr('uuidFecha').trim(), 
          nombreCompleto: $(this).find('span').text(), 
          pausado: $(this).attr('pausado').trim(),
        }        
      );
    });
    return examenesEnUl;
  }

  convertirUuidExamenEnTexto(uuidExamen) {
    let nombreSegunUuid;

    this.examenesFromDB.forEach(function(item) {
      if (item.uuid === uuidExamen) {
        nombreSegunUuid = `${item.materia} / ${item.tipo} / ${item.nivel} / ${item.modalidad}`;
      }
    });
    return nombreSegunUuid;
  }
}
