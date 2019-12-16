
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


/* Paso 2  */
function setRoute() {
    try {
        const submitRoute = route.replace(/step_2/g, "horario-selected");
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

        document.querySelector('form').setAttribute('action', `${submitRoute}&idhorario=${horarioSeleccionado}${(horarioListening ? `&idhorarioL=${horarioListening}` : "")}`);
        habilitarBoton()
        /*
        const ingresarAlServer= await postData(`${submitRoute}&idhorario=${horarioSeleccionado}`,this);
        */

    } catch (err) {
        console.log(err)
    }
}