

document.querySelector('.mobile-logo-ham').addEventListener('click', openNav);
document.querySelector('.secondary-menu-logo span').addEventListener('click', closeNav);

/*step2 */
document.getElementsByName('horario-selector').forEach(input=>{
  input.addEventListener('change', setRoute)
})

/* ruta para el step2 */
let route=window.location.href;


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
 function setRoute(){
  try{
  const submitRoute = route.replace(/step_2/g,"horario-selected");
  let horarioSeleccionado;
  document.getElementsByName('horario-selector').forEach(horario => {
      if (horario.checked) {
        horarioSeleccionado=(horario.classList[0]);
      }
    });

    document.querySelector('form').setAttribute('action', `${submitRoute}&idhorario=${horarioSeleccionado}`);
    habilitarBoton()
  /*
  const ingresarAlServer= await postData(`${submitRoute}&idhorario=${horarioSeleccionado}`,this);
  */
  
  }catch(err){
    console.log(err)
  }
}
/*
async function postData(url='',data={}){
  try{
  const response = await fetch(url,{
    method:'POST',
    mode:'cors',
    cache:'no-cache',
    credentials:'same-origin',
    headers:{'Content-type':'application/json'},
    redirect:'follow',
    referrer:'no-referrer',
    body:JSON.stringify(data)
  })
}catch(err){
  console.log(err)
}
}
*/





/*Codigo Stripe */

// Create a Stripe client.
var stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

// Create an instance of Elements.
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
  base: {
    color: '#32325d',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

// Create an instance of the card Element.
var card = elements.create('card', { style: style });

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.addEventListener('change', function (event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});


/*Codigo Stripe */


/*Paso3 y 4 */

document.querySelector('#adicion-nuevo-domicilio').addEventListener('change',mostrarNuevoDomiciolio);

function mostrarNuevoDomiciolio(){
  let estado= this.checked;
  const elementoDomicilio = document.querySelector('#seccion-nuevo-domicilio');
  if(estado===true){
   elementoDomicilio.style.height= `${elementoDomicilio.scrollHeight+10}px`;
  }else if(estado===false){
    elementoDomicilio.style.height = `0px`;
  }
  
}

