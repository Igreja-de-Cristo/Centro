// Módulo de autenticação admin
export const Auth = {
    isAuthenticated: false,
    
    init() {
        this.checkAuth();
        this.setupLoginForm();
    },

    checkAuth() {
        const token = localStorage.getItem('adminToken');
        if (token) {
            this.isAuthenticated = true;
            this.redirectIfNeeded();
        }
    },

    setupLoginForm() {
        const form = document.getElementById('admin-login-form');
        if (form) {
            form.addEventListener('submit', this.handleLogin.bind(this));
        }
    },

    async handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const isValid = await this.validateCredentials(username, password);
            if (isValid) {
                this.isAuthenticated = true;
                localStorage.setItem('adminToken', 'token_here');
                window.location.href = '/admin/index.html';
            } else {
                this.showError('Credenciais inválidas');
            }
        } catch (error) {
            this.showError('Erro ao fazer login');
        }
    },

    validateCredentials(username, password) {
        // Implementar validação segura
        return new Promise((resolve) => {
            resolve(username === 'admin' && password === 'senha_segura');
        });
    },

    redirectIfNeeded() {
        const isLoginPage = window.location.pathname.includes('login.html');
        if (this.isAuthenticated && isLoginPage) {
            window.location.href = '/admin/index.html';
        } else if (!this.isAuthenticated && !isLoginPage) {
            window.location.href = '/admin/login.html';
        }
    },

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    },

    logout() {
        localStorage.removeItem('adminToken');
        this.isAuthenticated = false;
        window.location.href = '/admin/login.html';
    }
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});