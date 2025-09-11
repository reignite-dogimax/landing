/**
 * Dogimax Landing Page - Main JavaScript File
 * Handles mobile navigation, FAQ interactions, form submissions, and other dynamic features
 */

// Wait for DOM to be fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dogimax Landing Page - JavaScript Loaded');
    
    // Initialize all functionality
    initMobileNavigation();
    initFAQFunctionality();
    initFormHandling();
    initScrollEffects();
    initSmoothScrolling();
    initHeaderScrollEffect();
});

/**
 * Mobile Navigation Toggle Functionality
 * Handles hamburger menu toggle for mobile devices
 */
function initMobileNavigation() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav__link');
    
    if (!mobileMenuToggle || !mainNav) {
        console.warn('Mobile navigation elements not found');
        return;
    }
    
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        // Toggle aria-expanded attribute
        this.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle active classes
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        
        console.log('Mobile menu toggled:', !isExpanded);
    });
    
    // Close mobile menu when clicking on navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mainNav.classList.contains('active')) {
                mobileMenuToggle.click(); // Trigger the toggle to close menu
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenuToggle.contains(event.target) && 
            !mainNav.contains(event.target) && 
            mainNav.classList.contains('active')) {
            mobileMenuToggle.click();
        }
    });
    
    // Close mobile menu on window resize if it's open
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
            mobileMenuToggle.click();
        }
    });
    
    console.log('Mobile navigation initialized');
}

/**
 * FAQ Section Functionality
 * Handles accordion-style FAQ interactions on the FAQ page
 */
function initFAQFunctionality() {
    const faqCategories = document.querySelectorAll('.faq-category');
    const faqGroups = document.querySelectorAll('.faq-group');
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    // Initialize FAQ categories (if on FAQ page)
    if (faqCategories.length > 0) {
        faqCategories.forEach(category => {
            category.addEventListener('click', function() {
                const targetCategory = this.getAttribute('data-category');
                
                // Remove active class from all categories
                faqCategories.forEach(cat => cat.classList.remove('faq-category--active'));
                
                // Add active class to clicked category
                this.classList.add('faq-category--active');
                
                // Hide all FAQ groups
                faqGroups.forEach(group => {
                    group.style.display = 'none';
                });
                
                // Show target FAQ group (select specifically the .faq-group element)
                const targetGroup = document.querySelector(`.faq-group[data-category="${targetCategory}"]`);
                if (targetGroup) {
                    // use flex to match CSS layout
                    targetGroup.style.display = 'flex';
                }
                
                console.log('FAQ category switched to:', targetCategory);
            });
        });
    }
    
    // Initialize FAQ question toggles
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const faqAnswer = this.nextElementSibling;
            
            // Close all other FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    const otherAnswer = otherQuestion.nextElementSibling;
                    if (otherAnswer) {
                        otherAnswer.classList.remove('show');
                        setTimeout(() => {
                            otherAnswer.style.display = 'none';
                        }, 300);
                    }
                }
            });
            
            // Toggle current FAQ item
            this.setAttribute('aria-expanded', !isExpanded);
            
            if (!isExpanded) {
                faqAnswer.style.display = 'block';
                setTimeout(() => {
                    faqAnswer.classList.add('show');
                }, 10);
            } else {
                faqAnswer.classList.remove('show');
                setTimeout(() => {
                    faqAnswer.style.display = 'none';
                }, 300);
            }
            
            console.log('FAQ question toggled:', !isExpanded);
        });
    });
    
    if (faqQuestions.length > 0) {
        console.log('FAQ functionality initialized');
    }
}

/**
 * Form Handling
 * Handles signup form submission and validation
 */
function initFormHandling() {
    const signupForm = document.getElementById('signupForm');
    
    if (!signupForm) {
        return; // No signup form on this page
    }
    
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        
        const formData = new FormData(this);
        const email = this.querySelector('input[type="email"]').value;
        
        // Basic email validation
        if (!isValidEmail(email)) {
            showFormMessage('Por favor, introduce un email válido.', 'error');
            return;
        }
        
        // Show loading state
        const submitButton = this.querySelector('.signup-form__submit');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Creando cuenta...';
        submitButton.disabled = true;
        
        // Simulate API call (replace with actual API endpoint)
        setTimeout(() => {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Show success message
            showFormMessage('¡Perfecto! Te hemos enviado un email para confirmar tu cuenta.', 'success');
            
            // Clear form
            this.reset();
            
            // Track conversion (replace with actual analytics)
            trackConversion('signup_completed', { email: email });
            
            console.log('Signup form submitted successfully for email:', email);
        }, 2000);
    });
    
    console.log('Form handling initialized');
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show form message to user
 * @param {string} message - Message to display
 * @param {string} type - Message type (success, error, info)
 */
function showFormMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message--${type}`;
    messageDiv.textContent = message;
    
    // Add styles for the message
    messageDiv.style.cssText = `
        padding: 12px 16px;
        margin-top: 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        text-align: center;
        transition: all 0.3s ease;
        ${type === 'success' ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' :
          type === 'error' ? 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' :
          'background-color: #e2e3e5; color: #383d41; border: 1px solid #d6d8db;'}
    `;
    
    // Insert message after the form
    const signupForm = document.getElementById('signupForm');
    signupForm.parentNode.insertBefore(messageDiv, signupForm.nextSibling);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }
    }, 5000);
}

/**
 * Scroll Effects
 * Adds animations and effects based on scroll position
 */
function initScrollEffects() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-in-up');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.benefit-card, .testimonial-card, .feature-item, .stat-item, .value-card, .team-member'
    );
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Scroll to top button
    initScrollToTopButton();
    
    console.log('Scroll effects initialized');
}

/**
 * Scroll to Top Button
 * Shows/hides scroll to top button based on scroll position
 */
function initScrollToTopButton() {
    // Create scroll to top button if it doesn't exist
    let scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    if (!scrollToTopBtn) {
        scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.className = 'scroll-to-top';
        scrollToTopBtn.innerHTML = '↑';
        scrollToTopBtn.setAttribute('aria-label', 'Volver arriba');
        document.body.appendChild(scrollToTopBtn);
    }
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Smooth Scrolling for Anchor Links
 * Adds smooth scrolling behavior to internal anchor links
 */
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                event.preventDefault();
                
                // Calculate offset for fixed header
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                console.log('Smooth scroll to:', href);
            }
        });
    });
    
    console.log('Smooth scrolling initialized');
}

/**
 * Header Scroll Effect
 * Adds visual effects to header when scrolling
 */
function initHeaderScrollEffect() {
    const header = document.querySelector('.main-header');
    
    if (!header) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    console.log('Header scroll effects initialized');
}

/**
 * Track Conversion Events
 * Placeholder for analytics tracking (replace with actual analytics service)
 * @param {string} eventName - Name of the conversion event
 * @param {object} eventData - Additional data for the event
 */
function trackConversion(eventName, eventData = {}) {
    // Google Analytics 4 example (uncomment and configure as needed)
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', eventName, eventData);
    // }
    
    // Facebook Pixel example (uncomment and configure as needed)
    // if (typeof fbq !== 'undefined') {
    //     fbq('track', eventName, eventData);
    // }
    
    // Custom analytics example
    console.log('Conversion tracked:', eventName, eventData);
    
    // You can also send to your own analytics endpoint
    // fetch('/api/analytics/track', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         event: eventName,
    //         data: eventData,
    //         timestamp: new Date().toISOString(),
    //         url: window.location.href,
    //         userAgent: navigator.userAgent
    //     })
    // });
}

/**
 * Utility Functions
 */

// Debounce function for performance optimization
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Performance optimization for scroll events
const optimizedScrollHandler = throttle(function() {
    // Scroll-based functionality can be added here
}, 100);

window.addEventListener('scroll', optimizedScrollHandler);

// Handle viewport meta tag for iOS Safari
function handleiOSViewport() {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
            );
        }
    }
}

handleiOSViewport();

/**
 * Error Handling
 * Global error handler for JavaScript errors
 */
window.addEventListener('error', function(event) {
    console.error('JavaScript Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
    
    // You can send error reports to your analytics service here
    // trackConversion('javascript_error', {
    //     message: event.message,
    //     filename: event.filename,
    //     line: event.lineno
    // });
});

/**
 * Service Worker Registration (Progressive Web App)
 * Uncomment if you want to add PWA functionality
 */
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', function() {
//         navigator.serviceWorker.register('/sw.js')
//             .then(function(registration) {
//                 console.log('ServiceWorker registration successful');
//             })
//             .catch(function(err) {
//                 console.log('ServiceWorker registration failed: ', err);
//             });
//     });
// }

console.log('Dogimax Landing Page - All JavaScript functionality loaded successfully');
