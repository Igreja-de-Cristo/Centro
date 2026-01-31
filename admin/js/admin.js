import Auth from './auth.js';

class AdminApp {
    constructor() {
        this.routes = {
            '/': 'dashboard',
            '/informativos': 'informativos',
            '/banners': 'banners',
            '/midia': 'midia',
            '/videos': 'videos'
        };
        
        this.init();
    }

    async init() {
        if (!Auth.checkAuth()) {
            window.location.href = 'login.html';
            return;
        }

        this.bindEvents();
        this.handleRoute();
        this.setupMobileMenu();
    }

    bindEvents() {
        window.addEventListener('hashchange', () => this.handleRoute());
        
        document.getElementById('logout-btn').addEventListener('click', () => {
            if (confirm('Deseja realmente sair?')) {
                Auth.logout();
            }
        });

        // admin.js - Main SPA Logic
let dashboardModule;

class AdminApp {
    constructor() {
        this.contentContainer = document.getElementById('mainContent');
        this.menuToggle = document.getElementById('menuToggle');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.navLinks = document.querySelectorAll('.sidebar-link');
        
        this.setupEventListeners();
        this.handleRoute();
    }

    setupEventListeners() {
        // Menu Toggle
        this.menuToggle.addEventListener('click', () => {
            document.body.classList.toggle('sidebar-collapsed');
        });

        // Navigation
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                window.history.pushState({}, '', href);
                this.handleRoute();
                
                // Update active state
                this.navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Handle browser navigation
        window.addEventListener('popstate', () => this.handleRoute());

        // Logout handler
        this.logoutBtn.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja sair?')) {
                this.handleLogout();
            }
        });
    }

    async handleRoute() {
        const path = window.location.hash || '#/';

        if (!dashboardModule) {
            const module = await import('./modules/dashboard.js');
            dashboardModule = module.default;
        }

        const routes = {
            '#/': () => dashboardModule(),
            '#/informativos': () => this.loadModule('informativos'),
            '#/banners': () => this.loadModule('banners'),
            '#/videos': () => this.loadModule('videos'),
            '#/midia': () => this.loadModule('midia')
        };

        const route = routes[path] || routes['#/'];
        const content = await route();
        
        this.contentContainer.innerHTML = content;
        this.setupModuleListeners();
    }

    async loadModule(moduleName) {
        try {
            const module = await import(`./modules/${moduleName}.js`);
            return module.default();
        } catch (error) {
            console.error(`Erro ao carregar módulo ${moduleName}:`, error);
            return this.getErrorContent();
        }
    }

    setupModuleListeners() {
        // Implementar listeners específicos do módulo se necessário
        const moduleListeners = {
            'dashboard': () => {
                // Listeners específicos do dashboard
            },
            'informativos': () => {
                // Listeners específicos de informativos
            }
            // Adicionar mais listeners conforme necessário
        };

        const currentModule = window.location.hash.slice(2) || 'dashboard';
        if (moduleListeners[currentModule]) {
            moduleListeners[currentModule]();
        }
    }

    getErrorContent() {
        return `
            <div class="error-container">
                <h2>😕 Ops! Algo deu errado</h2>
                <p>Não foi possível carregar o conteúdo solicitado.</p>
                <button class="btn btn-primary" onclick="window.location.href='#/'">
                    Voltar ao Dashboard
                </button>
            </div>
        `;
    }

    handleLogout() {
        // Limpar dados de autenticação
        localStorage.removeItem('igreja_auth_token');
        localStorage.removeItem('igreja_user');
        
        // Redirecionar para a página de login
        window.location.href = 'admin-login.html';
    }
}

// Inicializar aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new AdminApp();
});
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
    }

    async handleRoute() {
        const hash = window.location.hash || '#/';
        const page = this.routes[hash.slice(1)] || 'error';
        
        try {
            const module = await import(`./modules/${page}.js`);
            const content = await module.default();
            document.getElementById('main-content').innerHTML = content;
            
            this.updateActiveNav(hash.slice(1));
            
            // Fechar menu mobile após navegação
            if (window.innerWidth <= 768) {
                this.closeMobileMenu();
            }
        } catch (err) {
            console.error('Erro ao carregar página:', err);
            document.getElementById('main-content').innerHTML = `
                <div class="error-page">
                    <h1>Página não encontrada</h1>
                    <p>A página que você procura não existe ou foi movida.</p>
                    <a href="#/" class="btn btn-primary">Voltar ao Dashboard</a>
                </div>
            `;
        }
    }

    updateActiveNav(route) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === this.routes[route]) {
                item.classList.add('active');
            }
        });
    }

    setupMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);

        overlay.addEventListener('click', () => this.closeMobileMenu());
    }

    toggleMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Iniciar aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new AdminApp();
});