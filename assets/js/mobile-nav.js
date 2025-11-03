// Mobile Navigation - v3.0
document.addEventListener('DOMContentLoaded', function() {
    const mobileMoreBtn = document.getElementById('mobile-more-btn');
    const mobileDropdown = document.querySelector('.mobile-dropdown');

    if (mobileMoreBtn && mobileDropdown) {
        mobileMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            mobileMoreBtn.classList.toggle('active');
            mobileDropdown.classList.toggle('active');
        });

        // Fechar dropdown ao clicar fora
        document.addEventListener('click', (e) => {
            if (!mobileDropdown.contains(e.target) && e.target !== mobileMoreBtn) {
                mobileMoreBtn.classList.remove('active');
                mobileDropdown.classList.remove('active');
            }
        });

        // Fechar dropdown ao clicar em um link
        const dropdownLinks = mobileDropdown.querySelectorAll('a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMoreBtn.classList.remove('active');
                mobileDropdown.classList.remove('active');
            });
        });

        // Fechar dropdown com tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileDropdown.classList.contains('active')) {
                mobileMoreBtn.classList.remove('active');
                mobileDropdown.classList.remove('active');
            }
        });
        
        console.log('Menu dropdown mobile inicializado com sucesso');
    } else {
        console.error('Elementos do menu dropdown não encontrados no DOM');
    }

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.mobile-more-link').forEach(link => {
        link.addEventListener('click', () => {
            hideMoreMenu();
        });
    });

    // Atualizar item ativo no menu
    function updateActiveMenuItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        
        mobileNavLinks.forEach(link => {
            if (link.tagName.toLowerCase() === 'button') return; // Pula o botão "Mais"
            
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

    // Atualizar item ativo ao navegar
    window.addEventListener('popstate', updateActiveMenuItem);
});