
document.querySelector('.mobile-logo-ham').addEventListener('click', openNav);
document.querySelector('.secondary-menu-logo span').addEventListener('click', closeNav);

/*step2 */
document.getElementsByName('horario-selector').forEach(input => {
    input.addEventListener('change', validarHorario)
})

const route = window.location.href;
const idMod= route.match(/[\w|\d]{8}-[\w|\d]{4}-[\w|\d]{4}-[\w|\d]{4}-[\w|\d]{12}/)[0];


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
async function validarHorario() {
    try {
        desHabilitarBotton()
        agregarClaseHorarioActivo(this)
        const obtenerHorarios = await getHorario();
        const fueraDeTermino = await verFueraDeTermino(idMod,obtenerHorarios);
        if(fueraDeTermino.modalidad.exrw===1 && fueraDeTermino.modalidad.exls===1){
            if(fueraDeTermino.rw==='true'&& fueraDeTermino.ls==='true'){
                setRoute(obtenerHorarios)
            }else if(fueraDeTermino.rw==='false'|| fueraDeTermino.ls==='false'){
                notificar(this);
            }
        }else{
             if(fueraDeTermino.rw==='true'){
                 setRoute(obtenerHorarios)
             } else if (fueraDeTermino.rw === 'false'){
                 notificar(this);
             }
        }
        
    } catch (err) {
        console.log(err)
        notificar(this,"error")
    }
}

async function setRoute(obtenerHorarios){
    try {
        const submitRoute = route.replace(/step_2/g, "horario-selected");
        document.querySelector('form').setAttribute('action', `${submitRoute}&idhorario=${obtenerHorarios.horarioSeleccionado}${(obtenerHorarios.horarioListening ? `&idhorarioL=${obtenerHorarios.horarioListening}` : "")}`);
        if (document.querySelector('#notificacion')) {
            document.querySelector('#notificacion').remove();
        }
        habilitarBoton()
    } catch (error) {
        
    }
    
}


async function verFueraDeTermino(modalidad,horarioSeleccionados){
    try{
        const verSiEstaFuera = await fetch(`/checkout/ver-fecha-fuera-de-termino/${modalidad}?horario=${horarioSeleccionados.horarioSeleccionado}${(horarioSeleccionados.horarioListening ? `&idhorarioL=${horarioSeleccionados.horarioListening}` : "")}`);
        const respuesta = await verSiEstaFuera.json();
        return respuesta ;
    }catch(err){
        console.log(err)
    }
}


async function getHorario() {
    try {
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
        
    } catch (error) {
        
    }
    

}

async function notificar(elemento,error){
    const div= document.createElement('div');
    div.id="notificacion";
    const parrafo = document.createElement('p');
    parrafo.className="texto-notificacion";
    const texto='El horario seleccionado esta fuera de termino, comunciate con MIT para buscar un cupo';
    
    if (document.querySelector('#notificacion')){
        document.querySelector('#notificacion').remove();
    }
    parrafo.innerText=texto;
    if (error) {
        parrafo.innerText="occurrio un error en la comprobacion, comunicate con mit";
        parrafo.style.color="red";
    }
    div.appendChild(parrafo)
    
    elemento.parentNode.parentNode.insertBefore(div,elemento.parentNode);
}


function agregarClaseHorarioActivo(element){
    let parent= element.parentNode;
    let allElements = document.querySelectorAll(".horario-inner-wrapper");
    allElements.forEach(element=>{
        if(element.classList.contains("horario-activo")){
            element.classList.remove("horario-activo")
        }
    })
    parent.classList.add("horario-activo");
}



