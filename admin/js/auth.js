class Auth {
    static TOKEN_KEY = 'adminToken';
    static SESSION_KEY = 'admin_session';

    static async login(username, password) {
        try {
            // No backend real, isso seria uma chamada API
            const validCredentials = {
                'admin': 'IgrejaAdmin2025!'
            };

            if (validCredentials[username] === password) {
                const token = this.generateToken();
                const session = {
                    username,
                    token,
                    expires: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
                };

                localStorage.setItem(this.TOKEN_KEY, token);
                localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
                
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Erro no login:', error);
            return false;
        }
    }

    static logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.SESSION_KEY);
        window.location.href = 'login.html';
    }

    static isAuthenticated() {
        const session = localStorage.getItem(this.SESSION_KEY);
        if (!session) return false;

        try {
            const data = JSON.parse(session);
            return Date.now() < data.expires;
        } catch {
            return false;
        }
    }

    static getSession() {
        try {
            return JSON.parse(localStorage.getItem(this.SESSION_KEY));
        } catch {
            return null;
        }
    }

    static generateToken() {
        // Em produção, isso seria gerado pelo backend
        return 'admin_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
    }

    static getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static refreshSession() {
        const session = this.getSession();
        if (session) {
            session.expires = Date.now() + (24 * 60 * 60 * 1000);
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        }
    }

    static checkAuth() {
        if (!this.isAuthenticated()) {
            this.logout();
            return false;
        }
        this.refreshSession();
        return true;
    }
}

export default Auth;