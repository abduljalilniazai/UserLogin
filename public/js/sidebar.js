document.querySelectorAll('.has-sub').forEach(item => {
    item.addEventListener('click', () => {
        const submenu = item.nextElementSibling;
        submenu.style.display =
            submenu.style.display === 'block' ? 'none' : 'block';
    });
});