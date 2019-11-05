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

document.querySelector('.mobile-logo-ham').addEventListener('click', openNav);
document.querySelector('.secondary-menu-logo span').addEventListener('click', closeNav);
document.querySelectorAll('.button-checkout').forEach(button=>{
  button.addEventListener('click', step)
})

function step(item){
  const wrapper = item.target.parentElement.parentElement.parentElement;
  const nextElement = wrapper.nextElementSibling;
  const previousElement = wrapper.previousElementSibling;
  const numeroPasos = document.querySelectorAll('.step-number').length;
  if(item.target.classList.contains('next')){
    wrapper.classList.remove('ongoing');
    wrapper.classList.add('.backwards-wrapper');
    nextElement.classList.add('ongoing');
    document.querySelectorAll('.step-number')[parseInt(wrapper.dataset.step) - 1].classList.remove('selected-step');
    document.querySelectorAll('.step-number')[parseInt(wrapper.dataset.step)].classList.add('selected-step');
    document.querySelector('#progress-bar-inner').style.width = `${(numeroPasos == 4) ? 25 * (parseInt(wrapper.dataset.step) + 1) : 20 * (parseInt(wrapper.dataset.step) + 1)}%`;
  } else if (item.target.classList.contains('backwards')){
    wrapper.classList.remove('ongoing');
    previousElement.classList.remove('.backwards-wrapper');
    previousElement.classList.add('ongoing');
    document.querySelectorAll('.step-number')[parseInt(wrapper.dataset.step) - 2].classList.add('selected-step');
    document.querySelectorAll('.step-number')[parseInt(wrapper.dataset.step)-1].classList.remove('selected-step');
    document.querySelector('#progress-bar-inner').style.width = `${(numeroPasos == 4) ? 25 * (parseInt(wrapper.dataset.step) - 1) : 20 * (parseInt(wrapper.dataset.step) - 1)}%`;
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
var card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});


/*Codigo Stripe */

