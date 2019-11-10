class FechasVista {
  constructor() {
    this.habilitarSelectableChipDiaSemana($('#chipsSeleccionDiaSemana'));
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
        idSelected === 'agregarChipDiaHora'
            ? this.mostrarAgregarDiaHora() 
            : null;

        idSelected === 'agregarChipSemana'
          ? this.mostrarAgregarSemana()
          : null;
      }
    });
  }

  mostrarAgregarDiaHora(){
    $('#areaAgregarFecha').empty();
    $('#areaAgregarFecha').append(
        this.selectorDiaEscritoUOral()
    );
    $('#areaAgregarFecha').append(
        this.seleccionarDiaYHora()  
    );
    this.inicializarDateTimePicker()
    this.aceptarSoloNumerosEnInput("ingresoCupoDia")
  }

  selectorDiaEscritoUOral(){
    return `
    <div class="row clear-top-2">    
        <div class="col s12 m12 l12 xl12">
            <label>
                <input name="selectorDiaEscritoUOral" type="radio" />
                <span class="gris-texto">Examen ORAL</span>
            </label>
        </div>
        <div class="col">
        <label>
            <input name="selectorDiaEscritoUOral" type="radio" />
            <span class="gris-texto">Examen ESCRITO</span>
        </label>
        </div>
    </div>
    `
  }

  seleccionarDiaYHora(){
    return `
    <div class="row margin0">
        <div class="input-field col s5 m4 l3 xl2">
            <input id="ingresoCupoDia" type="number" autocomplete="off" >
            <label for="ingresoCupoDia">Cupo máx.</label>
        </div>
    </div>

    <div class="row margin0">
        <div class="col s5 m4 l3 xl2">
            <input type="text" class="datepicker">
            <label class="gris-texto">DIA</label>
        </div>
        <div class="col s5 m4 l3 xl2">
            <input type="text" class="timepicker">
            <label class="gris-texto">HORA</label>
        </div>
    </div>

    <div class="row margin0">
        <div class="col s5 m4 l3 xl2">
            <input type="text" class="datepicker">
            <label class="gris-texto">Fecha FINALIZA inscripción</label>
        </div>
    </div>

    <div class="row">
        <div class="col clear-top-2">
            <a class="waves-effect waves-light btn btn-medium weight400 background-azul">Agregar</a>
        </div>
    </div>
    `
    }

    mostrarAgregarSemana(){
        console.log("agrego semana")
      }

    

    inicializarDateTimePicker() {
        $('.timepicker').timepicker({
            twelveHour: false,
            autoClose: true,
        });

        $('.datepicker').datepicker({
            firstDay: 1,
            minDate: new Date,
            autoClose: true,
            i18n: {
                months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"],
                weekdays: ["Domingo","Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
                weekdaysShort: ["Dom","Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
                weekdaysAbbrev: ["D","L", "M", "M", "J", "V", "S"]
            }
        });
    }

    aceptarSoloNumerosEnInput(input){
        $(`#${input}`).on('keydown', function(e) {
          if (e.which == 69 || e.which == 107  || e.which == 109 ) {
              e.preventDefault();
          }
        });
      }


}

let fechasVista = new FechasVista();
