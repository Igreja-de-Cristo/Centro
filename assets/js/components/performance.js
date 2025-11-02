// Performance e Otimização
const Performance = {
    // Lazy loading de imagens
    setupLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        } else {
            // Fallback para navegadores que não suportam lazy loading nativo
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lozad.js/1.16.0/lozad.min.js';
            script.onload = function() {
                const observer = lozad();
                observer.observe();
            };
            document.body.appendChild(script);
        }
    },

    // Cache de recursos estáticos
    setupCaching() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registrado com sucesso:', registration.scope);
                })
                .catch(error => {
                    console.log('Falha ao registrar ServiceWorker:', error);
                });
        }
    },

    // Otimização de carregamento de fontes
    optimizeFonts() {
        const fonts = document.querySelectorAll('link[rel="stylesheet"][href*="fonts.googleapis.com"]');
        fonts.forEach(font => {
            font.setAttribute('rel', 'preload');
            font.setAttribute('as', 'style');
            font.setAttribute('onload', "this.onload=null;this.rel='stylesheet'");
        });
    },

    // Otimização de carregamento de scripts
    optimizeScripts() {
        const scripts = document.querySelectorAll('script[data-defer]');
        scripts.forEach(script => {
            script.setAttribute('defer', '');
            script.removeAttribute('data-defer');
        });
    },

    // Prefetch de links
    setupPrefetch() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            if (link.hostname === window.location.hostname) {
                const prefetchLink = document.createElement('link');
                prefetchLink.rel = 'prefetch';
                prefetchLink.href = link.href;
                document.head.appendChild(prefetchLink);
            }
        });
    },

    // Otimização de imagens
    optimizeImages() {
        const images = document.querySelectorAll('img:not([loading="lazy"])');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Adicionar srcset para imagens responsivas
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
            
            // Adicionar sizes para imagens responsivas
            if (img.dataset.sizes) {
                img.sizes = img.dataset.sizes;
            }
        });
    },

    // Inicialização
    init() {
        this.setupLazyLoading();
        this.setupCaching();
        this.optimizeFonts();
        this.optimizeScripts();
        this.setupPrefetch();
        this.optimizeImages();
    }
};

// Service Worker
const CACHE_NAME = 'igreja-cristo-centro-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/assets/css/style.css',
    '/assets/js/main.js',
    '/assets/images/icons/logo-igreja.svg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

// Exportar módulo
export default Performance;