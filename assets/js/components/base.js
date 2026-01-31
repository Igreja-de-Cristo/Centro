// Módulo de navegação mobile
export const MobileNav = {
    init() {
        this.setupEventListeners();
        this.setupMoreMenu();
    },

    setupEventListeners() {
        const moreBtn = document.getElementById('mobile-more-btn');
        const moreMenu = document.getElementById('mobile-more-menu');
        const moreClose = document.getElementById('mobile-more-close');
        const overlay = document.getElementById('mobile-overlay');
        const body = document.body;

        if (moreBtn) {
            moreBtn.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                if (moreMenu && overlay) {
                    moreMenu.classList.add('active');
                    overlay.classList.add('active');
                    body.classList.add('mobile-more-active');
                }
            });
        }

        if (moreClose) {
            moreClose.addEventListener('click', () => {
                if (moreMenu && overlay) {
                    moreMenu.classList.remove('active');
                    overlay.classList.remove('active');
                    body.classList.remove('mobile-more-active');
                }
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => {
                if (moreMenu) {
                    moreMenu.classList.remove('active');
                    overlay.classList.remove('active');
                    body.classList.remove('mobile-more-active');
                }
            });
        }

        // Fechar menu com tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && moreMenu?.classList.contains('active')) {
                moreMenu.classList.remove('active');
                overlay?.classList.remove('active');
                body.classList.remove('mobile-more-active');
            }
        });
    },

    setupMoreMenu() {
        const currentPath = window.location.pathname;
        const moreLinks = document.querySelectorAll('.mobile-more-link');
        
        moreLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }
};

// Módulo de cookie consent
export const CookieConsent = {
    init() {
        this.setupCookieConsent();
    },

    setupCookieConsent() {
        const cookieConsent = localStorage.getItem('cookieConsent');
        const banner = document.getElementById('cookie-consent-banner');
        
        if (!cookieConsent && banner) {
            banner.style.display = 'block';
            
            document.getElementById('accept-cookies')?.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'accepted');
                banner.style.display = 'none';
            });
        }
    }
};

// Inicialização dos módulos
document.addEventListener('DOMContentLoaded', () => {
    MobileNav.init();
    CookieConsent.init();
});