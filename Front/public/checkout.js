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