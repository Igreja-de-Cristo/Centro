/**
 * Performance Utilities
 * Funções otimizadas para throttle, debounce e RAF
 * @module utils/performance
 */

export class PerformanceUtils {
    /**
     * Throttle: Garante que função execute no máximo 1x a cada `wait` ms
     * Útil para: scroll, mousemove, resize quando precisa de feedback contínuo
     * 
     * @param {Function} func - Função a ser throttled
     * @param {number} wait - Intervalo mínimo entre execuções (ms)
     * @param {Object} options - { leading: boolean, trailing: boolean }
     * @returns {Function} Função throttled com método cancel()
     * 
     * @example
     * const handleScroll = PerformanceUtils.throttle(() => {
     *     console.log('Scroll position:', window.scrollY);
     * }, 100);
     * window.addEventListener('scroll', handleScroll);
     */
    static throttle(func, wait, options = {}) {
        let timeout, context, args, result;
        let previous = 0;
        const { leading = true, trailing = true } = options;

        const later = () => {
            previous = leading === false ? 0 : Date.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };

        const throttled = function (...params) {
            const now = Date.now();
            if (!previous && leading === false) previous = now;

            const remaining = wait - (now - previous);
            context = this;
            args = params;

            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && trailing !== false) {
                timeout = setTimeout(later, remaining);
            }

            return result;
        };

        throttled.cancel = function () {
            clearTimeout(timeout);
            previous = 0;
            timeout = context = args = null;
        };

        return throttled;
    }

    /**
     * Debounce: Adia execução até `wait` ms após última chamada
     * Útil para: busca, validação de formulário, resize quando só importa o valor final
     * 
     * @param {Function} func - Função a ser debounced
     * @param {number} wait - Tempo de espera (ms)
     * @param {boolean} immediate - Se true, executa na primeira chamada
     * @returns {Function} Função debounced com método cancel()
     * 
     * @example
     * const handleSearch = PerformanceUtils.debounce((query) => {
     *     fetch(`/api/search?q=${query}`);
     * }, 300);
     * input.addEventListener('input', (e) => handleSearch(e.target.value));
     */
    static debounce(func, wait, immediate = false) {
        let timeout;

        const debounced = function (...args) {
            const context = this;
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };

            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);

            if (callNow) func.apply(context, args);
        };

        debounced.cancel = function () {
            clearTimeout(timeout);
            timeout = null;
        };

        return debounced;
    }

    /**
     * RequestAnimationFrame throttle para animações suaves
     * Garante execução sincronizada com refresh rate do monitor (~60fps)
     * 
     * @param {Function} func - Função a ser executada
     * @returns {Function} Função RAF-throttled
     * 
     * @example
     * const updatePosition = PerformanceUtils.rafThrottle((x, y) => {
     *     element.style.transform = `translate(${x}px, ${y}px)`;
     * });
     * document.addEventListener('mousemove', (e) => updatePosition(e.clientX, e.clientY));
     */
    static rafThrottle(func) {
        let rafId = null;

        return function (...args) {
            if (rafId !== null) return;

            rafId = requestAnimationFrame(() => {
                func.apply(this, args);
                rafId = null;
            });
        };
    }

    /**
     * Mede performance de uma função
     * @param {Function} func - Função a ser medida
     * @param {string} label - Label para o console
     * @returns {Function} Função wrapped com medição
     */
    static measure(func, label) {
        return function (...args) {
            const start = performance.now();
            const result = func.apply(this, args);
            const end = performance.now();
            console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
            return result;
        };
    }
}

// Exportar também como funções standalone para compatibilidade
export const throttle = PerformanceUtils.throttle;
export const debounce = PerformanceUtils.debounce;
export const rafThrottle = PerformanceUtils.rafThrottle;
export const measure = PerformanceUtils.measure;
