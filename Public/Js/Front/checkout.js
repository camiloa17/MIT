

document.querySelector('.mobile-logo-ham').addEventListener('click', openNav);
document.querySelector('.secondary-menu-logo span').addEventListener('click', closeNav);

document.querySelector('#adicion-nuevo-domicilio').addEventListener('change', mostrarNuevoDomicilio);
document.querySelector('#idTrinity').addEventListener('change', mostrarNumeroTrinity);


document.querySelector('#uso-datos').addEventListener('change', activarPago);

document.querySelectorAll('.envio-seleccion').forEach(element => {
  element.addEventListener('change', sumarEnvio)
})


window.addEventListener("DOMContentLoaded", () => {
  
    const fecha = new Date(new Date(document.querySelector(".timer-wrapper").id).getTime()+10*60000).getTime()
    const intervalo = setInterval(async () => {
    let distance = fecha-new Date().getTime();
  
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.querySelector('#timer').innerText = `${minutes} Mins:${seconds} Segs`
      if (distance<0) {
      clearInterval(intervalo)
      document.querySelector('#timer').innerText = `0 Mins:0 Segs`
        /*
      alert("se acabo el tiempo, vas a ser redireccionado a el segundo paso");
      
      window.location.href=window.location.pathname.replace(/step_4/,"step_2")+"?id="+idModalidad;
      */
    }
  }, 1000)
  
});


const information = {};
const url = window.location.href;
const precio = document.querySelector("#precio").innerText;
const idreserva = window.location.href.match(/idreserva=([\w|\d]{8}-[\w|\d]{4}-[\w|\d]{4}-[\w|\d]{4}-[\w|\d]{12})/)[1];
const idModalidad = window.location.href.match(/id=([\w|\d]{8}-[\w|\d]{4}-[\w|\d]{4}-[\w|\d]{4}-[\w|\d]{12})/)[1];

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
// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = Stripe('pk_test_NFgnA1R0cP1acniKsCNNDeol00eL4fJMUx');
const elements = stripe.elements({ locale: "es" });

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
const style = {
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
const card = elements.create('card', { style: style });

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.addEventListener('change', ({ error }) => {
  const displayError = document.getElementById('card-errors');
  if (error) {
    displayError.textContent = error.message;
  } else {
    displayError.textContent = '';
  }
});




/*Codigo Stripe */


function mostrarNuevoDomicilio() {
  let estado = this.checked;
  const elementoDomicilio = document.querySelector('#seccion-nuevo-domicilio');
  if (estado === true) {
    elementoDomicilio.style.height = `${elementoDomicilio.scrollHeight + 10}px`;
  } else if (estado === false) {
    elementoDomicilio.style.height = `0px`;
  }

}

function mostrarNumeroTrinity() {
  let estado = this.checked;
  const elementoNumero = document.querySelector('.seccion-input-trinity');
  if (estado === true) {
    elementoNumero.style.height = `${elementoNumero.scrollHeight}px`;
    document.querySelector('#input-trinity').required = true;
  } else if (estado === false) {
    elementoNumero.style.height = `0px`;
    document.querySelector('#input-trinity').required = false;
  }
}

function sumarEnvio() {
  let botonSeleccionado = document.querySelector('.envio-seleccion:checked').value;
  let innerText = document.querySelector('#detalles-compra p').innerText;
  let domicilioWrapper = document.querySelector('.wrapper-nuevo-domicilio');

  if (botonSeleccionado === "si") {
    document.querySelector('#precio').innerText = parseInt(document.querySelector("#precio").innerText) + 10;
    document.querySelector('#detalles-compra p').innerText = `${innerText} + Envío`;
    
    domicilioWrapper.style.height = "auto";
  } else if (botonSeleccionado === "no") {
    document.querySelector("#precio").innerText = precio;
    document.querySelector('.wrapper-nuevo-domicilio').style.height = "0px";
    document.querySelector('#detalles-compra p').innerText = innerText.replace(/\s\+\sEnvío/, "");
  }
}


function activarPago() {
  if (this.checked === false) {
    document.querySelector('#boton-pago').disabled = true
  } else if (this.checked === true) {

    document.querySelector('#boton-pago').disabled = false
  }
}


document.querySelector("#payment-form").addEventListener("submit", async (form) => {
  form.preventDefault()
  const formElements = form.target.elements;
  const mensjaeRechazo = (document.querySelector('.resultado-pago') ? document.querySelector('.resultado-pago').remove():"");
  habilitaroDesFormulario(formElements,true);
  if(information.envioSi===true){
    const paymentId = document.querySelector('#hidden-payment').dataset.payment.match(/^(\S{27})/)[0];
    const sumarEnvio = fetch('/checkout/adicionar-envio/'+paymentId+"/"+idreserva,{
      method:'post',
      headers:{
        'Content-Type': 'application/json'
      }
    });
    const respuesta = await sumarEnvio;
    
    if(respuesta.status===200){
       submitPayment(formElements);
    }
  
  }else{
    submitPayment(formElements)
    
  }
});

async function habilitaroDesFormulario(formElements,estado){
  if(estado===true){
    for (element of formElements) {
      element.disabled = true;
      createObject(element)
    }
  }else if(estado===false){
    for (element of formElements) {
      element.disabled = false;
      
    }
  }
}



async function submitPayment(formElements){
  const clientSecret = document.querySelector('#hidden-payment').dataset.payment;
  stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: card,
      billing_details: {
        name: information.nombre + " " + information.apellido,
        phone: information.tmovil,
        email: information.email,
      }
    }
  }).then(function (result) {
    if (result.error) {
      habilitaroDesFormulario(formElements,false);
      const elemento = document.querySelector(".form-row");
      const elementoP = document.createElement("p");
      elementoP.classList.add("resultado-pago")
      elementoP.style.color="red";
      elementoP.innerHTML="<span id='x-pago'>X </span>"+" "+result.error.message;
      elemento.appendChild(elementoP);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        information.resultado=result;
        fetch(url.replace(/step_\d/,"reserva"),{
          method:"post",
          headers:{
            'Content-Type': 'application/json'
          },
          body:JSON.stringify(information)
        }).then((resultado)=>{
          console.log(resultado);
          if(resultado.status===200){
            const step = url.match(/step_\d/)[0];
            if (step==="step_3"){
              window.location.href = url.replace(/step_\d/, "step_4")
            }else{
              window.location.href = url.replace(/step_\d/, "step_5")
            }
            
          }
          
        })
      }
    }
  })
}


function createObject(element) {

  switch (element.id) {
    case "nombre":
      information.nombre = element.value;
      break;
    case "apellido":
      information.apellido = element.value;
      break
    case "fnacimiento":
      information.fnacimiento = element.value;
      break
    case "doc":
      information.doc = element.value;
      break
    case "masculino":
      if (element.checked) {
        information.genero = element.value;
      }
      break
    case "femenino":
      if (element.checked) {
        information.genero = element.value;
      }
      break
    case "email":
      information.email = element.value;
      break
    case "tfijo":
      information.tfijo = element.value;
      break
    case "telm":
      information.tmovil = element.value;
      break
    case "tfijo":
      information.tfijo = element.value;
      break
    case "prov":
      information.prov = element.value;
      break
    case "localidad":
      information.localidad = element.value;
      break
    case "direccion":
      information.direccion = element.value;
      break
    case "direccion2":
      information.direccion2 = element.value;
      break
    case "zip":
      information.zip = element.value;
      break
    case "discapacidad":
      information.discapacidad = element.checked;
      break
    case "idTrinity":
      information.idTrinity = element.checked;
      break
    case "input-trinity":
      information.inputTrinity = element.value;
      break
    case "b1":
      if (element.checked) {
        information.envioSi = element.checked;
      }
      break
    case "b2":
      if (element.checked) {
        information.envioNo = element.checked;
      }
      break
    case "adicion-nuevo-domicilio":
      information.adicionDom = element.checked;
      break
    case "adicion-nuevo-domicilio":
      information.adicionDom = element.checked;
      break
    case "direccion-nueva":
      information.provinciaEnvioAd = element.value;
      break
    case "localidad-adicional":
      information.localidadEnvioAd = element.value;
      break
    case "direccion-adicional":
      information.direccionEnvioAd = element.value;
      break
    case "direccion2-adicional":
      information.direccion2EnvioAd = element.value;
      break
    case "zip-adicional":
      information.zipEnvioAd = element.value;
      break
  }
}



