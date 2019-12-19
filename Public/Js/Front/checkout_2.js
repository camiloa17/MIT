
document.querySelector('.mobile-logo-ham').addEventListener('click', openNav);
document.querySelector('.secondary-menu-logo span').addEventListener('click', closeNav);

/*step2 */
document.getElementsByName('horario-selector').forEach(input => {
    input.addEventListener('change', setRoute)
})

let route = window.location.href;

function openNav(item) {
    const clickItems = item.target.classList;
    if (clickItems.contains('right-side')) {
        document.querySelector('.right-side-menu').classList.add('active');
        document.querySelector('.overflow').classList.add('overflow-menu');
    } else if (clickItems.contains('left-side')) {
        document.querySelector('.left-side-menu').classList.add('active');
        document.querySelector('.overflow').classList.add('overflow-menu');
    }

}

function closeNav(item) {
    const clickItems = item.target.classList;
    if (clickItems.contains('right-side')) {
        document.querySelector('.right-side-menu').classList.remove('active');;
        document.querySelector('.overflow').classList.remove('overflow-menu');
    } else if (clickItems.contains('left-side')) {
        document.querySelector('.left-side-menu').classList.remove('active');
        document.querySelector('.overflow').classList.remove('overflow-menu');
    }
}


function habilitarBoton() {
    const boton = document.querySelector('button.button-checkout');
    if (boton) {
        boton.disabled = false;
    }

}

function desHabilitarBotton() {
    const boton = document.querySelector('button.button-checkout');
    if (boton) {
        boton.disabled = true;
    }
}


/* Paso 2  */
async function setRoute() {
    try {
        desHabilitarBotton()
        const linkConId = route.match(/^\w*:\/\/[\w|\d]*:[\w]*\/[\w]*\/[\w]*\/[(\w|%)]*\/[\w]*\/[\w]*\/[\w|&]*\?[\w]*=[\w|\d]{8}-[\w|\d]{4}-[\w|\d]{4}-[\w|\d]{4}-[\w|\d]{12}/)[0];
        const submitRoute = linkConId.replace(/step_2/g, "horario-selected");
        const modalidad = route.match(/(Completo|Reading_&_Writing|Listening_&_Speaking)/)[0].replace(/_/g," ");
        const obtenerHorarios = await getHorario()
        const verFueraDeTermino =await verFueraDeTermino(modalidad,obtenerHorarios);
        document.querySelector('form').setAttribute('action', `${submitRoute}&idhorario=${obtenerHorarios.horarioSeleccionado}${(obtenerHorarios.horarioListening ? `&idhorarioL=${obtenerHorarios.horarioListening}` : "")}`);
        habilitarBoton()
    } catch (err) {
        console.log(err)
    }
}


async function getReserva(id){
    try{
        const verSiEstaLaReerva = await fetch(`/checkout/ver-fuera-de-termino/${id}`);
        return verSiEstaLaReerva
    }catch(err){
        console.log(err)
    }
}


async function getHorario() {
    let horarioSeleccionado;
    let horarioListening;
    document.getElementsByName('horario-selector').forEach(horario => {
        if (horario.checked) {
            if (horario.classList.length == 2) {
                horarioSeleccionado = (horario.classList[0]);
                horarioListening = (horario.classList[1])
            } else {
                horarioSeleccionado = (horario.classList[0]);
            }

        }
    });
    return { horarioSeleccionado: horarioSeleccionado, horarioListening: horarioListening }

}

async function verFueraDeTermino(modalidad,horario){
    try {
        
    } catch (err) {
        console.log(err)
    }
}

