/**
 * Security Utilities
 * Funções para sanitização e prevenção de XSS
 * @module utils/security
 */

export class SecurityUtils {
    /**
     * Escapa HTML para prevenir XSS
     * Converte caracteres especiais em entidades HTML
     * 
     * @param {string} text - Texto a ser escapado
     * @returns {string} Texto seguro
     * 
     * @example
     * const userInput = '<script>alert("XSS")</script>';
     * const safe = SecurityUtils.escapeHtml(userInput);
     * // Resultado: '&lt;script&gt;alert("XSS")&lt;/script&gt;'
     */
    static escapeHtml(text) {
        if (typeof text !== 'string') return '';

        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Cria elemento DOM de forma segura
     * Alternativa segura ao innerHTML
     * 
     * @param {string} tag - Tag HTML
     * @param {Object} attributes - Atributos do elemento
     * @param {string|Node|Array} children - Conteúdo filho
     * @returns {HTMLElement}
     * 
     * @example
     * const card = SecurityUtils.createElement('div', 
     *     { className: 'card', 'data-id': '123' },
     *     [
     *         SecurityUtils.createElement('h3', {}, userTitle),
     *         SecurityUtils.createElement('p', {}, userDescription)
     *     ]
     * );
     */
    static createElement(tag, attributes = {}, children = null) {
        const element = document.createElement(tag);

        // Adicionar atributos de forma segura
        for (const [key, value] of Object.entries(attributes)) {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else if (key.startsWith('data-')) {
                element.setAttribute(key, value);
            } else if (key.startsWith('aria-')) {
                element.setAttribute(key, value);
            } else {
                element[key] = value;
            }
        }

        // Adicionar children de forma segura
        if (children !== null) {
            if (Array.isArray(children)) {
                children.forEach(child => {
                    if (typeof child === 'string') {
                        element.appendChild(document.createTextNode(child));
                    } else if (child instanceof Node) {
                        element.appendChild(child);
                    }
                });
            } else if (typeof children === 'string') {
                element.textContent = children;
            } else if (children instanceof Node) {
                element.appendChild(children);
            }
        }

        return element;
    }

    /**
     * Sanitiza URL para prevenir javascript: e data: URIs
     * 
     * @param {string} url - URL a ser sanitizada
     * @param {Array<string>} allowedProtocols - Protocolos permitidos
     * @returns {string} URL segura ou '#' se inválida
     * 
     * @example
     * const url = SecurityUtils.sanitizeUrl(userInput);
     * link.href = url;
     */
    static sanitizeUrl(url, allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:']) {
        if (!url || typeof url !== 'string') return '#';

        const trimmed = url.trim();

        // Bloquear javascript: e data: URIs
        if (/^(javascript|data|vbscript):/i.test(trimmed)) {
            console.warn('⚠️ URL perigosa bloqueada:', trimmed);
            return '#';
        }

        // Verificar protocolo se for URL absoluta
        try {
            const urlObj = new URL(trimmed, window.location.origin);
            if (!allowedProtocols.includes(urlObj.protocol)) {
                console.warn('⚠️ Protocolo não permitido:', urlObj.protocol);
                return '#';
            }
            return urlObj.href;
        } catch (e) {
            // URL relativa ou inválida - permitir apenas se não começar com protocolo
            if (/^[a-z]+:/i.test(trimmed)) {
                console.warn('⚠️ URL inválida:', trimmed);
                return '#';
            }
            return trimmed;
        }
    }

    /**
     * Valida e sanitiza atributos HTML
     * 
     * @param {string} attributeName - Nome do atributo
     * @param {string} attributeValue - Valor do atributo
     * @returns {string|null} Valor sanitizado ou null se inválido
     */
    static sanitizeAttribute(attributeName, attributeValue) {
        // Bloquear atributos perigosos
        const dangerousAttributes = ['onerror', 'onload', 'onclick', 'onmouseover'];
        if (dangerousAttributes.some(attr => attributeName.toLowerCase().startsWith('on'))) {
            console.warn('⚠️ Atributo de evento bloqueado:', attributeName);
            return null;
        }

        // Sanitizar URLs em atributos específicos
        if (['href', 'src', 'action', 'formaction'].includes(attributeName.toLowerCase())) {
            return this.sanitizeUrl(attributeValue);
        }

        return attributeValue;
    }

    /**
     * Cria um template HTML seguro usando tagged template literals
     * 
     * @param {Array<string>} strings - Partes estáticas do template
     * @param {...any} values - Valores dinâmicos a serem escapados
     * @returns {string} HTML seguro
     * 
     * @example
     * const html = SecurityUtils.html`
     *     <div class="card">
     *         <h3>${userTitle}</h3>
     *         <p>${userDescription}</p>
     *     </div>
     * `;
     */
    static html(strings, ...values) {
        let result = strings[0];

        for (let i = 0; i < values.length; i++) {
            const value = values[i];

            // Escapar valores dinâmicos
            const escaped = typeof value === 'string'
                ? this.escapeHtml(value)
                : String(value);

            result += escaped + strings[i + 1];
        }

        return result;
    }

    /**
     * Valida input do usuário contra regex
     * 
     * @param {string} input - Input do usuário
     * @param {RegExp} pattern - Padrão permitido
     * @param {string} errorMessage - Mensagem de erro
     * @returns {Object} { valid: boolean, sanitized: string, error: string }
     */
    static validateInput(input, pattern, errorMessage = 'Input inválido') {
        if (typeof input !== 'string') {
            return { valid: false, sanitized: '', error: 'Input deve ser string' };
        }

        const trimmed = input.trim();

        if (!pattern.test(trimmed)) {
            return { valid: false, sanitized: trimmed, error: errorMessage };
        }

        return { valid: true, sanitized: trimmed, error: null };
    }

    /**
     * Gera um ID único e seguro
     * @returns {string} ID único
     */
    static generateId() {
        return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Implementação simples de Content Security Policy via meta tag
     * (Idealmente deve ser configurado no servidor)
     */
    static setupCSP() {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://www.youtube.com https://www.google.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' https://img.youtube.com data: https:",
            "font-src 'self' https://fonts.gstatic.com",
            "frame-src https://www.youtube.com",
            "connect-src 'self'"
        ].join('; ');

        document.head.appendChild(meta);
    }
}

// Exportar funções standalone
export const escapeHtml = SecurityUtils.escapeHtml.bind(SecurityUtils);
export const createElement = SecurityUtils.createElement.bind(SecurityUtils);
export const sanitizeUrl = SecurityUtils.sanitizeUrl.bind(SecurityUtils);
export const html = SecurityUtils.html.bind(SecurityUtils);
