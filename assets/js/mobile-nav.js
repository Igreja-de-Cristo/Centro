// Mobile Navigation - v1.0
document.addEventListener('DOMContentLoaded', function() {
    const moreBtn = document.getElementById('mobile-more-btn');
    const moreMenu = document.getElementById('mobile-more-menu');
    const moreClose = document.getElementById('mobile-more-close');
    const overlay = document.getElementById('mobile-overlay');
    const body = document.body;

    // Funções de gerenciamento do menu
    function toggleMoreMenu() {
        moreMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('mobile-more-active');
    }

    // Event Listeners
    moreBtn.addEventListener('click', toggleMoreMenu);
    moreClose.addEventListener('click', toggleMoreMenu);
    overlay.addEventListener('click', toggleMoreMenu);

    // Fechar menu com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && moreMenu.classList.contains('active')) {
            toggleMoreMenu();
        }
    });

    // Atualizar item ativo no menu
    function updateActiveMenuItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        
        mobileNavLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
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