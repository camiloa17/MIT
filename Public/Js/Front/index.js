
function openNav(item){
    const clickItems = item.target.classList;
    if(clickItems.contains('right-side')){
        document.querySelector('.right-side-menu').classList.add('active');
        document.querySelector('.overflow').classList.add('overflow-menu');
    }else if(clickItems.contains('left-side')){
        item.target.nextElementSibling.classList.add('active')
        document.querySelector('.overflow').classList.add('overflow-menu');
    }
    
}

function closeNav(item){
    const clickItems = item.target.classList;
    if(clickItems.contains('right-side')){
        document.querySelector('.right-side-menu').classList.remove('active');;
        document.querySelector('.overflow').classList.remove('overflow-menu');
    } else if (clickItems.contains('left-side')) {
        document.querySelector('.left-side-menu.active').classList.remove('active');
        document.querySelector('.overflow').classList.remove('overflow-menu');
    }
}

function openMenuItem(item){
    const menuList = (item.target.nextElementSibling ? item.target.nextElementSibling:false);
    const height = (menuList?menuList.scrollHeight:0);
    const parent = item.target.parentElement;
    const container = item.target.parentElement.parentElement.parentElement;
    
    if((menuList?menuList.dataset.state:false) == 'closed'){
       
        parent.classList.add('tipo-activa');
        if(container.classList.contains('materia-tipo')){
        item.target.parentElement.parentElement.style.height =`${item.target.parentElement.parentElement.scrollHeight + height}px`;
        }
        menuList.dataset.state = 'open';
        menuList.style.height = `${height}px`;
        
    } else if ((menuList ? menuList.dataset.state : false) == 'open'){
        parent.classList.remove('tipo-activa');
        
        if(container.classList.contains('materia-tipo')){
            item.target.parentElement.parentElement.style.height = `${item.target.parentElement.parentElement.scrollHeight-height}px`;
        }
        menuList.style.height = `${menuList.clientHeight}px`;
        menuList.dataset.state = 'closed';
        menuList.style.height = "0px";

    }
}


function closeMenuItem(item){
    item.target.nextElementSibling.style.height = `0px`;
}

function donwloadPrices(){

   window.location.href="/download/tarifas"
   

}

document.querySelector('.mobile-logo-ham').addEventListener('click',openNav);
document.querySelector('.secondary-menu-logo span').addEventListener('click',closeNav);
//document.querySelector('#ingles-menu').addEventListener('click',openNav);
document.querySelectorAll('.examen-materia').forEach(element=>{
    element.addEventListener('click',openNav)
})
document.querySelectorAll('.primary-menu-logo span').forEach(element=>{
    element.addEventListener('click', closeNav);
})
//document.querySelector('.primary-menu-logo span').addEventListener('click', closeNav);
document.querySelectorAll('.materia-tipo').forEach(element => {
    element.addEventListener('click',openMenuItem)
});

document.querySelector('#tarifas').addEventListener('click',donwloadPrices)




