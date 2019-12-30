class AlumnosVista {
    constructor() {
        this.alumnosServicio = new AlumnosServicio();

        $(document).ready(function () {
            $('select').formSelect();
        });

        this.habilitarFuncionBuscarAlumno();
        this.escucharCambioEnInputsBuscarAlumno();

    }


    habilitarFuncionBuscarAlumno() {
        $('#botonBuscarAlumnos').on('click', () => {
            let filtro = $("#listadoFiltroBusqueda option:selected").attr("tipo");
            let valor = $('#inputAlumnosBuscar').val().split(".").join("");
            let todos = $('#checkboxTodos').prop('checked');

            if (todos === true) {
                this.generarListadoAlumnos(null, null, todos)
            } else if (valor.length > 0 && filtro && todos === false) {
                this.generarListadoAlumnos(filtro, valor, null)
            }
        })
    }

    async generarListadoAlumnos(filtro, valor, todos) {
        this.appendProgressIndeterminate($('#listadoAlumnos'))
        let id = $('#listadoAlumnos');
        await this.alumnosServicio.getAlumnos(filtro, valor, todos, this.mostrarListaAlumnos, this.huboUnError, id);
    }

    mostrarListaAlumnos = (alumnos) => {
        $('#listadoAlumnos').empty();

        alumnos.forEach(alumno => {
            $('#listadoAlumnos').append(
                this.liTemplateAlumno(alumno.nombre, alumno.apellido, alumno.candidate_number, alumno.documento, alumno.genero)
            );
        })
    }

    liTemplateAlumno(nombre, apellido, candidateNumber, dni, genero) {
        let color;
        if (genero === "M") {
            color = "background-azul"
        } else if (genero === "F") {
            color = "background-rosa"
        } else {
            color = "background-gris"
        }

        return `
        <li class="collection-item avatar">
            <i class="material-icons circle large white-text ${color}">account_circle</i>
            <span class="title">${nombre} ${apellido}</span>
            <p>DNI ${dni} <br>
                Candidate Number ${candidateNumber}
            </p>
        </li>        
        `
    }

    

    escucharCambioEnInputsBuscarAlumno() {
        
        $('#checkboxTodos').on('change', () => {
            let todos = $('#checkboxTodos').prop('checked');
            let filtro = $("#listadoFiltroBusqueda option:selected").attr("tipo");
            let valor = $('#inputAlumnosBuscar').val().split(".").join("");


            console.log("valor lenght", valor, valor.length, valor.lenght == 0 )
            console.log("filtro", filtro, filtro === undefined)

            if(todos === true){
                $('#botonBuscarAlumnos').removeClass('disabled');
                console.log("ddd")

            } else if (todos === false &&  $('#inputAlumnosBuscar').val().split(".").join("").lenght === 0 && filtro === undefined  ) {
                $('#botonBuscarAlumnos').addClass('disabled');

            } else if (todos === false &&  $('#inputAlumnosBuscar').val().split(".").join("").lenght !== 0 && filtro === undefined  ) {
                $('#botonBuscarAlumnos').addClass('disabled'); 

            } else if (todos === false &&  $('#inputAlumnosBuscar').val().split(".").join("") && filtro !== undefined  ) {   
                $('#botonBuscarAlumnos').addClass('disabled')
            }
        });

        $('#inputAlumnosBuscar').on('input', () => {
            console.log("input")
        });

        $('#listadoFiltroBusqueda').on('change', () => {
            console.log("filtro")
        });

        


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

}