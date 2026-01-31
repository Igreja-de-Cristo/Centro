/**
 * DOM Utilities
 * Helpers para manipulação segura do DOM
 * @module utils/dom
 */

import { SecurityUtils } from './security.js';

export class DOMUtils {
    /**
     * Renderiza lista de elementos de forma eficiente
     * Usa DocumentFragment para minimizar reflows
     * 
     * @param {HTMLElement} container - Container onde renderizar
     * @param {Array} items - Array de itens
     * @param {Function} renderFn - Função que retorna HTMLElement para cada item
     * @param {boolean} clear - Se deve limpar container antes
     */
    static renderList(container, items, renderFn, clear = true) {
        if (clear) {
            // Limpar de forma eficiente
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        }

        const fragment = document.createDocumentFragment();

        items.forEach((item, index) => {
            const element = renderFn(item, index);
            if (element instanceof HTMLElement) {
                fragment.appendChild(element);
            }
        });

        container.appendChild(fragment);
    }

    /**
     * Adiciona event listener com cleanup automático
     * 
     * @param {HTMLElement} element - Elemento
     * @param {string} event - Nome do evento
     * @param {Function} handler - Handler
     * @param {Object} options - Opções do addEventListener
     * @returns {Function} Função para remover listener
     */
    static addListener(element, event, handler, options = {}) {
        element.addEventListener(event, handler, options);

        return () => {
            element.removeEventListener(event, handler, options);
        };
    }

    /**
     * Event delegation helper
     * 
     * @param {HTMLElement} container - Container pai
     * @param {string} selector - Seletor CSS dos elementos alvo
     * @param {string} event - Nome do evento
     * @param {Function} handler - Handler que recebe (event, matchedElement)
     * @returns {Function} Função para remover listener
     */
    static delegate(container, selector, event, handler) {
        const delegatedHandler = (e) => {
            const matched = e.target.closest(selector);
            if (matched && container.contains(matched)) {
                handler(e, matched);
            }
        };

        container.addEventListener(event, delegatedHandler);

        return () => {
            container.removeEventListener(event, delegatedHandler);
        };
    }

    /**
     * Aguarda elemento aparecer no DOM
     * 
     * @param {string} selector - Seletor CSS
     * @param {number} timeout - Timeout em ms
     * @returns {Promise<HTMLElement>}
     */
    static waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    clearTimeout(timeoutId);
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            const timeoutId = setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Elemento ${selector} não encontrado após ${timeout}ms`));
            }, timeout);
        });
    }

    /**
     * Verifica se elemento está visível no viewport
     * 
     * @param {HTMLElement} element - Elemento
     * @param {number} threshold - Porcentagem visível (0-1)
     * @returns {boolean}
     */
    static isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;

        const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
        const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

        return vertInView && horInView;
    }

    /**
     * Scroll suave para elemento
     * 
     * @param {HTMLElement|string} target - Elemento ou seletor
     * @param {Object} options - Opções de scroll
     */
    static scrollTo(target, options = {}) {
        const element = typeof target === 'string'
            ? document.querySelector(target)
            : target;

        if (!element) return;

        const {
            offset = 0,
            behavior = 'smooth',
            block = 'start'
        } = options;

        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior
        });
    }

    /**
     * Toggle de classe com callback
     * 
     * @param {HTMLElement} element - Elemento
     * @param {string} className - Nome da classe
     * @param {boolean} force - Forçar adicionar/remover
     * @returns {boolean} Se classe foi adicionada
     */
    static toggleClass(element, className, force = undefined) {
        const result = element.classList.toggle(className, force);
        return result;
    }

    /**
     * Cria modal de forma programática
     * 
     * @param {Object} config - Configuração do modal
     * @returns {Object} { element, open, close }
     */
    static createModal(config = {}) {
        const {
            title = '',
            content = '',
            closeOnOverlay = true,
            closeOnEsc = true
        } = config;

        const modal = SecurityUtils.createElement('div', {
            className: 'modal',
            role: 'dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'modal-title'
        });

        const modalContent = SecurityUtils.createElement('div', {
            className: 'modal-content'
        });

        const modalHeader = SecurityUtils.createElement('div', {
            className: 'modal-header'
        }, [
            SecurityUtils.createElement('h2', {
                id: 'modal-title',
                className: 'modal-title'
            }, title),
            SecurityUtils.createElement('button', {
                className: 'modal-close',
                'aria-label': 'Fechar modal'
            }, '×')
        ]);

        const modalBody = SecurityUtils.createElement('div', {
            className: 'modal-body'
        });

        if (typeof content === 'string') {
            modalBody.textContent = content;
        } else if (content instanceof HTMLElement) {
            modalBody.appendChild(content);
        }

        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modal.appendChild(modalContent);

        const open = () => {
            document.body.appendChild(modal);
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';

            // Focus no primeiro elemento focável
            const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        };

        const close = () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        };

        // Event listeners
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', close);

        if (closeOnOverlay) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) close();
            });
        }

        if (closeOnEsc) {
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    close();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        }

        return { element: modal, open, close };
    }
}

// Exportar funções standalone
export const renderList = DOMUtils.renderList.bind(DOMUtils);
export const delegate = DOMUtils.delegate.bind(DOMUtils);
export const scrollTo = DOMUtils.scrollTo.bind(DOMUtils);
