// ===== MAIN JAVASCRIPT FILE =====

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ===== MOBILE MENU FUNCTIONALITY =====
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Toggle aria-expanded
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle menu visibility
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (!isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a link (mobile)
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });
        
        // Close menu when clicking outside (mobile)
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                !mobileMenuToggle.contains(e.target) && 
                !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }
    
    // ===== ACTIVE NAVIGATION LINK =====
    function updateActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || 
                (currentPage === 'index.html' && linkHref === '#inicio') ||
                (currentPage === '' && linkHref === '#inicio')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }
    
    updateActiveNavLink();
    
    // ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset for fixed header/nav
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                const navHeight = document.querySelector('.main-navigation')?.offsetHeight || 0;
                const offset = headerHeight + navHeight + 20;
                
                const targetPosition = targetElement.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash
                history.pushState(null, null, `#${targetId}`);
                
                // Focus on target element for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
            }
        });
    });
    
    // ===== BACK TO TOP BUTTON =====
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        function toggleBackToTopButton() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }
        
        // Show/hide button on scroll
        window.addEventListener('scroll', throttle(toggleBackToTopButton, 100));
        
        // Scroll to top when clicked
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Focus on first focusable element for accessibility
            const firstFocusable = document.querySelector('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        });
    }
    
    // ===== HEADER SCROLL EFFECT =====
    const header = document.querySelector('.site-header');
    const navigation = document.querySelector('.main-navigation');
    
    function handleHeaderScroll() {
        // Verifica se está em dispositivo móvel (largura <= 768px)
        const isMobile = window.innerWidth <= 768;
        const scrolled = window.pageYOffset > 50;
        
        // Em mobile, NÃO esconde o header para o menu hamburger ficar sempre visível
        if (isMobile) {
            if (header) {
                header.style.transform = 'translateY(0)';
            }
            if (navigation) {
                navigation.style.top = 'auto';
            }
        } else {
            // Em desktop, mantém o comportamento original
            if (header) {
                header.style.transform = scrolled ? 'translateY(-100%)' : 'translateY(0)';
            }
            
            if (navigation) {
                navigation.style.top = scrolled ? '0' : 'auto';
            }
        }
    }
    
    window.addEventListener('scroll', throttle(handleHeaderScroll, 100));
    
    // Chama ao redimensionar a janela para ajustar corretamente
    window.addEventListener('resize', throttle(handleHeaderScroll, 100));
    
    // Chama imediatamente ao carregar para aplicar o estado inicial correto
    handleHeaderScroll();
    
    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.feature-card, .course-card, .schedule-card');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
    
    // ===== FORM VALIDATION (for future contact forms) =====
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            const errorElement = input.parentNode.querySelector('.error-message');
            
            // Remove existing error
            if (errorElement) {
                errorElement.remove();
            }
            
            input.classList.remove('error');
            
            // Validate input
            if (!input.value.trim()) {
                showFieldError(input, 'Este campo é obrigatório.');
                isValid = false;
            } else if (input.type === 'email' && !isValidEmail(input.value)) {
                showFieldError(input, 'Por favor, insira um email válido.');
                isValid = false;
            } else if (input.type === 'tel' && !isValidPhone(input.value)) {
                showFieldError(input, 'Por favor, insira um telefone válido.');
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function showFieldError(input, message) {
        input.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.setAttribute('role', 'alert');
        
        input.parentNode.appendChild(errorDiv);
        input.focus();
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[\s\d\(\)\-\+]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }
    
    // ===== SOCIAL MEDIA SHARING =====
    function shareOnSocialMedia(platform, url, text) {
        const encodedUrl = encodeURIComponent(url);
        const encodedText = encodeURIComponent(text);
        let shareUrl = '';
        
        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
                break;
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400,resizable=yes,scrollbars=yes');
        }
    }
    
    // ===== ACCESSIBILITY ENHANCEMENTS =====
    
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
                target.addEventListener('blur', function() {
                    this.removeAttribute('tabindex');
                }, { once: true });
            }
        });
    }
    
    // Enhanced keyboard navigation
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            mobileMenuToggle.focus();
        }
        
        // Space or Enter activates buttons
        if ((e.key === ' ' || e.key === 'Enter') && e.target.classList.contains('btn')) {
            e.preventDefault();
            e.target.click();
        }
    });
    
    // Focus management for modals and overlays
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
    
    // ===== PERFORMANCE OPTIMIZATIONS =====
    
    // Throttle function for scroll events
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Debounce function for resize events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Lazy loading for images
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    lazyLoadImages();
    
    // ===== RESPONSIVE BEHAVIOR =====
    function handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
        
        // Update viewport height for mobile browsers
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    window.addEventListener('resize', debounce(handleResize, 250));
    handleResize(); // Initial call
    
    // ===== ERROR HANDLING =====
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        
        // Optional: Send error to monitoring service
        // sendErrorToMonitoring(e.error);
    });
    
    // ===== SERVICE WORKER REGISTRATION (for PWA features) =====
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
    
    // ===== ANALYTICS (placeholder for future implementation) =====
    function trackEvent(category, action, label) {
        // Placeholder for analytics tracking
        console.log(`Event tracked: ${category} - ${action} - ${label}`);
        
        // Example: Google Analytics
        // if (typeof gtag !== 'undefined') {
        //     gtag('event', action, {
        //         event_category: category,
        //         event_label: label
        //     });
        // }
    }
    
    // Track button clicks
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            trackEvent('Button', 'Click', buttonText);
        });
    });
    
    // Track navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            const linkText = this.textContent.trim();
            trackEvent('Navigation', 'Click', linkText);
        });
    });
    
    // ===== CONSOLE WELCOME MESSAGE =====
    console.log('%c🏛️ Igreja de Cristo do Centro', 'color: #3182ce; font-size: 16px; font-weight: bold;');
    console.log('%cSite desenvolvido com foco em acessibilidade e performance.', 'color: #4a5568; font-size: 12px;');
    
});

// ===== SISTEMA DE QUIZ DOS CURSOS =====

// URLs dos Google Forms de cada lição - CONFIGURE AQUI!
const LESSON_QUIZZES = {
    'igreja': {
        1: 'https://forms.gle/LurdBuwVzb4GrGk5A',
        2: 'https://forms.gle/SEU_FORM_IGREJA_LICAO_2',
        3: 'https://forms.gle/SEU_FORM_IGREJA_LICAO_3',
        4: 'https://forms.gle/SEU_FORM_IGREJA_LICAO_4',
        5: 'https://forms.gle/SEU_FORM_IGREJA_LICAO_5',
        6: 'https://forms.gle/SEU_FORM_IGREJA_LICAO_6',
        7: 'https://forms.gle/SEU_FORM_IGREJA_LICAO_7',
        8: 'https://forms.gle/SEU_FORM_IGREJA_LICAO_8',
        9: 'https://forms.gle/SEU_FORM_IGREJA_LICAO_9',
        10: 'https://forms.gle/SEU_FORM_IGREJA_LICAO_10',
        11: 'https://forms.gle/SEU_FORM_IGREJA_LICAO_11',
        12: 'https://forms.gle/SEU_FORM_IGREJA_LICAO_12',
        13: 'https://forms.gle/SEU_FORM_IGREJA_LICAO_13',
        14: 'https://forms.gle/SEU_FORM_IGREJA_LICAO_14',
        15: 'https://forms.gle/SEU_FORM_IGREJA_LICAO_15',
        16: 'https://forms.gle/SEU_FORM_IGREJA_LICAO_16'
    },
    'revelacoes': {
        1: 'https://forms.gle/SEU_FORM_REVELACOES_1',
        2: 'https://forms.gle/SEU_FORM_REVELACOES_2',
        3: 'https://forms.gle/SEU_FORM_REVELACOES_3',
        4: 'https://forms.gle/SEU_FORM_REVELACOES_4',
        5: 'https://forms.gle/SEU_FORM_REVELACOES_5',
        6: 'https://forms.gle/SEU_FORM_REVELACOES_6',
        7: 'https://forms.gle/SEU_FORM_REVELACOES_7'
    },
    'cristao': {
        1: 'https://forms.gle/SEU_FORM_CRISTAO_1',
        2: 'https://forms.gle/SEU_FORM_CRISTAO_2',
        3: 'https://forms.gle/SEU_FORM_CRISTAO_3',
        4: 'https://forms.gle/SEU_FORM_CRISTAO_4',
        5: 'https://forms.gle/SEU_FORM_CRISTAO_5',
        6: 'https://forms.gle/SEU_FORM_CRISTAO_6',
        7: 'https://forms.gle/SEU_FORM_CRISTAO_7'
    }
};

// Função para abrir quiz
function openQuiz(course, lessonNumber) {
    const quizUrl = LESSON_QUIZZES[course][lessonNumber];
    
    if (quizUrl && !quizUrl.includes('SEU_FORM_')) {
        window.open(quizUrl, '_blank');
    } else {
        alert('📝 Quiz ainda não configurado. Entre em contato via WhatsApp para fazer a prova.');
        // Fallback para WhatsApp
        const courseName = course === 'igreja' ? 'A Igreja Bíblica' : 
                          course === 'revelacoes' ? 'Revelações de Cristo' : 
                          'Simplesmente Cristão';
        const itemName = course === 'igreja' ? 'Lição' : 
                        course === 'revelacoes' ? 'Revelação' : 'Estudo';
        
        const message = `Olá! Gostaria de fazer a prova da ${itemName} ${lessonNumber} do curso "${courseName}".`;
        window.open(`https://wa.me/5592988357459?text=${encodeURIComponent(message)}`, '_blank');
    }
}

// Event listeners para quiz buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('quiz-btn')) {
        e.preventDefault();
        const quizData = e.target.getAttribute('data-quiz').split('-');
        const course = quizData[0];
        const lesson = parseInt(quizData[1]);
        openQuiz(course, lesson);
    }
});

// ===== ESTUDOS BÍBLICOS AVANÇADOS (REMOVIDAS AS FUNÇÕES DE DOWNLOAD EM LOTE) =====

// Format phone number for display
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
    
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    
    return phone;
}

// Format date for display
function formatDate(date, locale = 'pt-BR') {
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Texto copiado!', 'success');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showNotification('Texto copiado!', 'success');
        } catch (err) {
            showNotification('Erro ao copiar texto', 'error');
        }
        
        document.body.removeChild(textArea);
    }
}

// Show notification (for future use)
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.classList.add('notification-show');
    });
    
    // Remove after duration
    setTimeout(() => {
        notification.classList.remove('notification-show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Export functions for use in other scripts
window.IgrejaDeCreisto = {
    formatPhoneNumber,
    formatDate,
    copyToClipboard,
    showNotification
};

// ===== SISTEMA DE EXPANDIR/COLAPSAR LIÇÕES DOS CURSOS =====
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os botões de toggle
    const toggleButtons = document.querySelectorAll('.toggle-lessons-btn');
    
    toggleButtons.forEach(button => {
        // Adiciona evento de clique no botão
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Evita propagação do evento
            toggleLessons(this);
        });
        
        // Também permite clicar no header inteiro
        const header = button.closest('.collapsible-header');
        if (header) {
            header.addEventListener('click', function(e) {
                // Evita duplo toggle se clicar diretamente no botão
                if (e.target === button || button.contains(e.target)) {
                    return;
                }
                toggleLessons(button);
            });
        }
    });
    
    // Função para expandir/colapsar as lições
    function toggleLessons(button) {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        const header = button.closest('.collapsible-header');
        const content = header.nextElementSibling;
        
        if (!content || !content.classList.contains('collapsible-content')) {
            console.warn('Conteúdo colapsável não encontrado');
            return;
        }
        
        if (isExpanded) {
            // Colapsar
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('aria-label', button.getAttribute('aria-label').replace('Ocultar', 'Expandir'));
            content.classList.remove('expanded');
            content.style.display = 'none';
            
            // Animação suave de saída
            setTimeout(() => {
                content.style.display = 'none';
            }, 400);
        } else {
            // Expandir
            button.setAttribute('aria-expanded', 'true');
            button.setAttribute('aria-label', button.getAttribute('aria-label').replace('Expandir', 'Ocultar'));
            content.style.display = 'grid';
            
            // Força o reflow para a animação funcionar
            content.offsetHeight;
            
            // Adiciona a classe expanded para animar
            setTimeout(() => {
                content.classList.add('expanded');
            }, 10);
            
            // Scroll suave até o conteúdo
            setTimeout(() => {
                const yOffset = -100;
                const y = header.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }, 100);
        }
        
        // Log para debug
        console.log(`Lições ${isExpanded ? 'colapsadas' : 'expandidas'}`);
    }
    
    // Adiciona suporte para teclado (Enter e Espaço)
    toggleButtons.forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleLessons(this);
            }
        });
    });
    
    // Se houver hash na URL apontando para um curso específico, expande automaticamente
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const targetSection = document.getElementById(hash);
        
        if (targetSection) {
            const toggleBtn = targetSection.querySelector('.toggle-lessons-btn');
            if (toggleBtn && toggleBtn.getAttribute('aria-expanded') === 'false') {
                setTimeout(() => {
                    toggleLessons(toggleBtn);
                }, 500);
            }
        }
    }
    
    console.log('✅ Sistema de expandir/colapsar lições carregado!');
});