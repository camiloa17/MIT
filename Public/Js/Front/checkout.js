

document.querySelector('.mobile-logo-ham').addEventListener('click', openNav);
document.querySelector('.secondary-menu-logo span').addEventListener('click', closeNav);

document.querySelector('#adicion-nuevo-domicilio').addEventListener('change', mostrarNuevoDomicilio);
document.querySelector('#idTrinity').addEventListener('change', mostrarNumeroTrinity);
document.querySelectorAll('.envio-seleccion').forEach(element=>{
  element.addEventListener('change', sumarEnvio)
})

const precio = document.querySelector("#precio").innerText;

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


function mostrarNuevoDomicilio(){
  let estado= this.checked;
  const elementoDomicilio = document.querySelector('#seccion-nuevo-domicilio');
  if(estado===true){
   elementoDomicilio.style.height= `${elementoDomicilio.scrollHeight+10}px`;
  }else if(estado===false){
    elementoDomicilio.style.height = `0px`;
  }
  
}

function mostrarNumeroTrinity(){
  let estado = this.checked;
  const elementoNumero = document.querySelector('.seccion-input-trinity');
  if (estado === true) {
    elementoNumero.style.height = `${elementoNumero.scrollHeight + 10}px`;
    document.querySelector('#input-trinity').required=true;
  } else if (estado === false) {
    elementoNumero.style.height = `0px`;
    document.querySelector('#input-trinity').required = false;
  }
}

function sumarEnvio(){
  let botonSeleccionado = document.querySelector('.envio-seleccion:checked').value;
  console.log(botonSeleccionado)
  if(botonSeleccionado==="si"){
  document.querySelector('#precio').innerText= parseInt(document.querySelector("#precio").innerText)+10;
    document.querySelector('#detalles-compra p').innerText ="Examen de ingles ISE1 Reading & Writing + Envio"
  }else if(botonSeleccionado==="no"){
    document.querySelector("#precio").innerText=precio;
    document.querySelector('#detalles-compra p').innerText = "Examen de ingles ISE1 Reading & Writing"
  }
}


