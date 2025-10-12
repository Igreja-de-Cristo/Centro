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
        const scrolled = window.pageYOffset > 50;
        
        if (header) {
            header.style.transform = scrolled ? 'translateY(-100%)' : 'translateY(0)';
        }
        
        if (navigation) {
            navigation.style.top = scrolled ? '0' : 'auto';
        }
    }
    
    window.addEventListener('scroll', throttle(handleHeaderScroll, 100));
    
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

// ===== SISTEMA DE PROGRESSÃO SEQUENCIAL DE CURSOS =====

// URLs dos Google Forms de cada lição - CONFIGURE AQUI!
const LESSON_QUIZZES = {
    'igreja': {
        1: 'https://forms.gle/SEU_FORM_IGREJA_LICAO_1',
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

// URLs dos PDFs para desbloqueio
const LESSON_PDFS = {
    'igreja': {
        2: 'https://drive.google.com/file/d/1FYK002AteGAMw6VXGcUTlzreg4A2hHC_/view?usp=drive_link',
        3: 'https://drive.google.com/file/d/1AIgojoUiQBKSFy1aKNJQ13YBErxyGs9e/view?usp=drive_link',
        4: 'https://drive.google.com/file/d/1vvLsJ75mbmFnqKyz55f0BMU4OuHclaRo/view?usp=drive_link',
        5: 'https://drive.google.com/file/d/16eJUqhtnYYVcDC4Ie2O-mUtEtHIxglGg/view?usp=drive_link',
        6: 'https://drive.google.com/file/d/1OUmw9jEqDCiysT1OptT_vNnGHJglYeT3/view?usp=drive_link',
        7: 'https://drive.google.com/file/d/1m4XJ3ZnoWNLx5KZWQsrfLWAEdKGEaqj6/view?usp=drive_link',
        8: 'https://drive.google.com/file/d/18ltIzbBLwiIu9qGQy6XsL-5YG3w5q0Oc/view?usp=drive_link',
        9: 'https://drive.google.com/file/d/10YC-EQ2cuh-jYohM8qHu8t_0YldhforT/view?usp=drive_link',
        10: 'https://drive.google.com/file/d/1dDc6FgvTCaS3yJFPzH11MxYqF9GR6Dt3/view?usp=drive_link',
        11: 'https://drive.google.com/file/d/1_0JuBy96TTWYTuuMFwmU2JRF5864I1he/view?usp=drive_link',
        12: 'https://drive.google.com/file/d/1zpaRYyzIXBiEgaYCIac8kT7wDelVyPyi/view?usp=drive_link',
        13: 'https://drive.google.com/file/d/1IDpFiSgwAeDk5-MyxCYdJjeTV9_Tl9Uv/view?usp=drive_link',
        14: 'https://drive.google.com/file/d/1kAIVCvWiAYRLdXo5L05OEvM_caD6C7ck/view?usp=drive_link',
        15: 'https://drive.google.com/file/d/1Lp40FpxtPF6PPlezdSZVAThmpaeYlMB4/view?usp=drive_link',
        16: 'https://drive.google.com/file/d/1VZ_K_YKexifGkyyq8BXhxnUa3JXvFZp0/view?usp=drive_link'
    },
    'revelacoes': {
        2: 'https://drive.google.com/file/d/1zc4CDMcyEmWMNVzgeSobnKLZjIFaFils/view?usp=drive_link',
        3: 'https://drive.google.com/file/d/1po4pxMp8vMHJOHcu0V7ID0rm7xUPd0bB/view?usp=drive_link',
        4: 'https://drive.google.com/file/d/18w89iGYNqLewG1rr1C_9_8G3Wx4aHG7c/view?usp=drive_link',
        5: 'https://drive.google.com/file/d/1yhk-4FRfDySM__5T9JFMjSNHoBJ4nclC/view?usp=drive_link',
        6: 'https://drive.google.com/file/d/17C5NTk_kg8QOfl63jaP--wyBokowdLxk/view?usp=drive_link',
        7: 'https://drive.google.com/file/d/1iHXPnFk0pkBvrsOVw-LjQ3rskVzSaGux/view?usp=drive_link'
    },
    'cristao': {
        2: 'https://drive.google.com/file/d/1sgtW4F0ToqRcNg2o2OmKjilUAtmdFC71/view?usp=drive_link',
        3: 'https://drive.google.com/file/d/1tgZH9cQ4Z-YJyaosvGfbjg1tjotlajeo/view?usp=drive_link',
        4: 'https://drive.google.com/file/d/1lxt8Y_qIOYx0NERx4zi1ICVC1BsKtVsu/view?usp=drive_link',
        5: 'https://drive.google.com/file/d/1Y7eNdDhQgVwEf8G5CUkEsu04mW10HYbO/view?usp=drive_link',
        6: 'https://drive.google.com/file/d/1iCNqqB_ZQaLGHVw4x8FzBXtNb9dsrkjG/view?usp=drive_link',
        7: 'https://drive.google.com/file/d/1SGuQwaczIAVfKw5nr7S2tYAafunEcJ_8/view?usp=drive_link'
    }
};

// Códigos de desbloqueio para cada lição
const UNLOCK_CODES = {
    'igreja': {
        2: 'IGREJA2024',
        3: 'BIBLIA2024',
        4: 'CRISTO2024',
        5: 'SALVA2024',
        6: 'BATISMO2024',
        7: 'ADORACAO2024',
        8: 'SERVICO2024',
        9: 'COMUNHAO2024',
        10: 'ENSINO2024',
        11: 'MISSAO2024',
        12: 'UNIDADE2024',
        13: 'AMOR2024',
        14: 'PAZ2024',
        15: 'ESPERANCA2024',
        16: 'GLORIA2024'
    },
    'revelacoes': {
        2: 'VERBO2024',
        3: 'CORDEIRO2024',
        4: 'PASTOR2024',
        5: 'VIDA2024',
        6: 'CAMINHO2024',
        7: 'VERDADE2024'
    },
    'cristao': {
        2: 'SIMPLES2024',
        3: 'PURO2024',
        4: 'ORIGINAL2024',
        5: 'GENUINO2024',
        6: 'ESSENCIAL2024',
        7: 'CRISTAO2024'
    }
};

// Função para desbloquear próxima lição
function unlockNextLesson(course) {
    const input = document.getElementById(`unlock-code-${course}`);
    const code = input.value.trim().toUpperCase();
    
    if (!code) {
        alert('❌ Digite o código de desbloqueio!');
        return;
    }
    
    // Encontrar qual lição desbloquear
    const unlockedLessons = getUnlockedLessons(course);
    const maxLessons = course === 'igreja' ? 16 : 7; // Igreja tem 16, outros têm 7
    const nextLesson = unlockedLessons + 1;
    
    if (nextLesson > maxLessons) {
        alert('🎉 Parabéns! Você já completou todo o curso!');
        return;
    }
    
    const correctCode = UNLOCK_CODES[course][nextLesson];
    
    if (code === correctCode) {
        unlockLesson(course, nextLesson);
        input.value = '';
        
        const courseName = course === 'igreja' ? 'A Igreja Bíblica' : 
                          course === 'revelacoes' ? 'Revelações de Cristo' : 
                          'Simplesmente Cristão';
        const itemName = course === 'igreja' ? 'Lição' : 
                        course === 'revelacoes' ? 'Revelação' : 'Estudo';
        
        alert(`🎉 Parabéns! ${itemName} ${nextLesson} desbloqueada!`);
    } else {
        alert('❌ Código incorreto! Verifique se você inseriu o código correto da prova.');
        input.value = '';
    }
}

// Função para desbloquear uma lição específica
function unlockLesson(course, lessonNumber) {
    const lessonItem = document.querySelector(`#lessons-${course} [data-lesson="${lessonNumber}"]`);
    if (!lessonItem) return;
    
    // Atualizar visual
    lessonItem.classList.remove('locked');
    lessonItem.classList.add('unlocked');
    
    // Atualizar título
    const title = lessonItem.querySelector('h4');
    const itemName = course === 'igreja' ? 'Lição' : 
                    course === 'revelacoes' ? 'Revelação' : 'Estudo';
    title.textContent = `📖 ${itemName} ${lessonNumber}`;
    
    // Atualizar conteúdo
    const content = lessonItem.querySelector('.lesson-content');
    const pdfUrl = LESSON_PDFS[course][lessonNumber];
    
    content.innerHTML = `
        <a href="${pdfUrl}" target="_blank" class="btn btn-outline btn-small">📄 Abrir PDF</a>
        <a href="#" data-quiz="${course}-${lessonNumber}" class="btn btn-primary btn-small quiz-btn">📝 Fazer Prova</a>
    `;
    
    // Salvar progresso
    saveProgress(course, lessonNumber);
}

// Função para obter lições desbloqueadas
function getUnlockedLessons(course) {
    const progress = JSON.parse(localStorage.getItem(`course_progress_${course}`) || '{"unlockedLessons": 1}');
    return progress.unlockedLessons || 1;
}

// Função para salvar progresso
function saveProgress(course, lessonNumber) {
    const progress = {
        unlockedLessons: lessonNumber,
        lastUpdate: new Date().toISOString()
    };
    localStorage.setItem(`course_progress_${course}`, JSON.stringify(progress));
}

// Função para carregar progresso salvo
function loadProgress(course) {
    const unlockedLessons = getUnlockedLessons(course);
    
    for (let i = 2; i <= unlockedLessons; i++) {
        unlockLesson(course, i);
    }
}

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

// Carregar progresso quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('lessons-igreja')) {
        loadProgress('igreja');
    }
    if (document.getElementById('lessons-revelacoes')) {
        loadProgress('revelacoes');
    }
    if (document.getElementById('lessons-cristao')) {
        loadProgress('cristao');
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