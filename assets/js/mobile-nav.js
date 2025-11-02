// Mobile Navigation - v2.0
document.addEventListener('DOMContentLoaded', function() {
    const moreBtn = document.getElementById('mobile-more-btn');
    const moreMenu = document.getElementById('mobile-more-menu');
    const moreClose = document.getElementById('mobile-more-close');
    const overlay = document.getElementById('mobile-overlay');
    const body = document.body;

    // Funções de gerenciamento do menu
    function showMoreMenu(event) {
        event.preventDefault();
        moreMenu.classList.add('active');
        overlay.classList.add('active');
        body.classList.add('mobile-more-active');
    }

    function hideMoreMenu() {
        moreMenu.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('mobile-more-active');
    }

    // Event Listeners
    if (moreBtn) {
        moreBtn.addEventListener('click', showMoreMenu);
    }

    if (moreClose) {
        moreClose.addEventListener('click', hideMoreMenu);
    }

    if (overlay) {
        overlay.addEventListener('click', hideMoreMenu);
    }

    // Fechar menu com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && moreMenu.classList.contains('active')) {
            hideMoreMenu();
        }
    });

    // Atualizar item ativo no menu
    function updateActiveMenuItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        
        mobileNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === 'index.html' && href === '/') || 
                (href !== '/' && currentPage.startsWith(href))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Inicializar item ativo
    updateActiveMenuItem();

    // Atualizar item ativo ao navegar (para SPA se necessário)
    window.addEventListener('popstate', updateActiveMenuItem);
});