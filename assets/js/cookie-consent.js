// Cookie Consent Manager
class CookieConsent {
    constructor() {
        this.cookieConsent = localStorage.getItem('cookieConsent');
        this.initBanner();
    }

    initBanner() {
        if (!this.cookieConsent) {
            this.showBanner();
        }
    }

    showBanner() {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-text">
                    Este site utiliza armazenamento local e integrações com YouTube para melhorar sua experiência. 
                    Ao continuar navegando, você concorda com nossa 
                    <a href="politica-privacidade.html" style="color: #4CAF50; text-decoration: underline;">Política de Privacidade</a>.
                </div>
                <div class="cookie-buttons">
                    <button class="cookie-btn cookie-btn-accept" id="acceptCookies">Aceitar</button>
                    <button class="cookie-btn cookie-btn-settings" id="cookieSettings">Configurações</button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);
        setTimeout(() => banner.classList.add('active'), 100);

        document.getElementById('acceptCookies').addEventListener('click', () => this.acceptAll());
        document.getElementById('cookieSettings').addEventListener('click', () => this.showSettings());
    }

    acceptAll() {
        localStorage.setItem('cookieConsent', JSON.stringify({
            necessary: true,
            youtube: true,
            analytics: true,
            timestamp: new Date().toISOString()
        }));
        this.hideBanner();
    }

    showSettings() {
        // Implementar modal de configurações detalhadas se necessário
        window.location.href = 'politica-privacidade.html#configuracoes-privacidade';
    }

    hideBanner() {
        const banner = document.querySelector('.cookie-banner');
        if (banner) {
            banner.classList.remove('active');
            setTimeout(() => banner.remove(), 300);
        }
    }

    // Verifica se o usuário consentiu com um tipo específico de cookie/armazenamento
    hasConsent(type) {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) return false;
        try {
            const settings = JSON.parse(consent);
            return settings[type] === true;
        } catch (e) {
            return false;
        }
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new CookieConsent();
});