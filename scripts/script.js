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
    initI18n();
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
 * Internationalization (i18n)
 * Handles language switching between English and Spanish
 */
function initI18n() {
    const translations = {
        en: {
            "nav.benefits": "Benefits",
            "nav.features": "Features",
            "nav.testimonials": "Testimonials",
            "nav.about": "About Us",
            "nav.faq": "FAQ",
            "nav.cta": "Start for Free",
            "hero.title": "The App Your Dog ",
            "hero.titleHighlight": "Needed",
            "hero.subtitle": "Dogimax is the premium app that revolutionizes your pet's care. Schedule vet appointments, manage feeding times, and access our personalized AI assistant to answer all your questions.",
            "hero.cta": "Start Free Now",
            "benefits.title": "Why Do Thousands of Dog Lovers Choose Dogimax?",
            "benefits.subtitle": "Discover all the benefits that will make a difference in your pet's life",
            "benefits.card1.title": "Health Under Control",
            "benefits.card1.description": "Never forget a vet appointment again. Receive smart reminders and keep your dog's complete medical history.",
            "benefits.card2.title": "Perfect Schedules",
            "benefits.card2.description": "Set up personalized feeding routines and receive notifications to keep your dog happy and healthy.",
            "benefits.card3.title": "Personal AI Assistant",
            "benefits.card3.description": "Access our virtual expert who knows your dog and answers all your questions 24 hours a day.",
            "benefits.card4.title": "Active Community",
            "benefits.card4.description": "Connect with other dog lovers, share experiences, and get advice from veterinary experts.",
            "benefits.card5.title": "Vaccine Records",
            "benefits.card5.description": "Keep a clear and accessible record of your pet's vaccination schedule, with alerts and digital certificates for appointments and travel.",
            "benefits.card6.title": "Medication Reminders",
            "benefits.card6.description": "Schedule doses and times, receive notifications, and avoid missing critical treatments for your dog's health.",
            "benefits.cta": "Join the Community",
            "features.title": "Features That Make a Difference",
            "features.subtitle": "Advanced technology designed specifically for canine care",
            "features.item1.title": "Smart Vet Scheduler",
            "features.item1.description": "An advanced reminder system that syncs with your calendar and your vet's. Includes complete medical history, vaccinations, medications, and treatment tracking.",
            "features.item1.bullet1": "Automatic appointment reminders",
            "features.item1.bullet2": "Digitalized medical history",
            "features.item1.bullet3": "Direct connection with veterinarians",
            "features.item1.bullet4": "Treatment tracking",
            "features.item2.title": "Personalized AI Assistant",
            "features.item2.description": "Our artificial intelligence assistant learns about your dog and provides personalized advice based on breed, age, medical history, and behavior.",
            "features.item2.bullet1": "24/7 answers about your pet",
            "features.item2.bullet2": "Personalized advice by breed",
            "features.item2.bullet3": "Preventive health alerts",
            "features.item2.bullet4": "Care recommendations",
            "features.cta": "Explore All Features",
            "testimonials.title": "Trusted by Thousands of Dog Lovers",
            "testimonials.subtitle": "Find out why we are the #1 app for canine care",
            "testimonials.card1.text": "\"Dogimax completely changed how I care for Max. The AI assistant helped me when I was worried about his behavior, and it turned out to be just a normal phase. Incredible!\"",
            "testimonials.card1.author": "Maria Gonzalez",
            "testimonials.card1.location": "Madrid, Spain",
            "testimonials.card2.text": "\"As a veterinarian, I recommend Dogimax to all my clients. The information they bring to the consultation is much more detailed and useful for diagnosis.\"",
            "testimonials.card2.author": "Dr. Carlos Ruiz",
            "testimonials.card2.location": "Veterinarian, Barcelona",
            "testimonials.card3.text": "\"The meal reminders have been a lifesaver. Luna now has a perfect routine and her digestion has improved so much. The premium version is worth every penny.\"",
            "testimonials.card3.author": "Ana Martin",
            "testimonials.card3.location": "Valencia, Spain",
            "stats.item1": "Happy Dogs",
            "stats.item2": "Satisfaction",
            "stats.item3": "Rating",
            "stats.item4": "AI Support",
            "testimonials.cta": "Join Our Community",
            "footer.description": "The premium app that revolutionizes your dog's care with artificial intelligence technology and the best management tools.",
            "footer.product.title": "Product",
            "footer.product.features": "Features",
            "footer.product.pricing": "Pricing",
            "footer.product.premium": "Premium",
            "footer.product.mobile": "Mobile App",
            "footer.company.title": "Company",
            "footer.company.about": "About Us",
            "footer.company.blog": "Blog",
            "footer.company.careers": "Careers",
            "footer.company.press": "Press",
            "footer.support.title": "Support",
            "footer.support.faq": "FAQ",
            "footer.support.contact": "Contact",
            "footer.support.help": "Help Center",
            "footer.support.community": "Community",
            "footer.legal.title": "Legal",
            "footer.legal.privacy": "Privacy",
            "footer.legal.terms": "Terms",
            "footer.legal.cookies": "Cookies",
            "footer.legal.gdpr": "GDPR",
            "footer.copyright": "© 2025 Dogimax. All rights reserved. Made with ❤️ for dog lovers.",
            "about.hero.title": "About Us",
            "about.hero.subtitle": "Discover the passion and dedication behind Dogimax, the app that is revolutionizing dog care worldwide.",
            "about.mission.title": "Our Mission",
            "about.mission.subtitle": "We created Dogimax with a clear mission: to make dog care easier, smarter, and more accessible for all pet lovers.",
            "about.mission.description": "Our team of developers, veterinarians, and animal behavior experts works tirelessly to create tools that strengthen the bond between people and their dogs, while ensuring the best possible care.",
            "about.values.title": "Our Values",
            "about.values.card1.title": "Love for Dogs",
            "about.values.card1.description": "Every decision we make has the well-being and happiness of our four-legged friends in mind.",
            "about.values.card2.title": "Innovation",
            "about.values.card2.description": "We use the latest technologies in AI and machine learning to offer unique solutions in dog care.",
            "about.values.card3.title": "Community",
            "about.values.card3.description": "We believe in the power of connecting dog lovers to share experiences and learn together.",
            "about.values.card4.title": "Simplicity",
            "about.values.card4.description": "We make complex technology simple and accessible for everyone, regardless of their technical level.",
            "about.team.title": "Our Team",
            "about.team.subtitle": "Passionate professionals working to make a difference in your dog's life",
            "about.team.member1.description": "A student passionate about technology, programming, and process automation with artificial intelligence.",
            "about.team.member2.description": "I am a student with a strong inclination towards technological innovation, software development, and the implementation of automated solutions driven by artificial intelligence. I also find inspiration in music and various forms of creativity, which complements my multidisciplinary approach to problem-solving and continuous learning.",
            "about.team.member3.description": "I am a Software Engineering student with a deep passion for technological innovation, programming, and process automation using artificial intelligence. I consider myself a committed and responsible person who prioritizes duties and strives to meet deadlines.",
            "about.team.member4.description": "I am a software engineering student at the Peruvian University of Applied Sciences. I am a committed and responsible person, I prioritize my responsibilities and always try to complete my work within the established deadlines.",
            "about.team.member5.description": "Software engineering student, with a strong inclination towards computer science and cybersecurity.",
            "faq.hero.title": "Frequently Asked Questions",
            "faq.hero.subtitle": "Find quick answers to the most common questions about Dogimax and discover how to get the most out of our application.",
            "faq.category.general": "General",
            "faq.category.features": "Features",
            "faq.category.premium": "Premium",
            "faq.category.technical": "Technical",
            "faq.general.q1": "What is Dogimax and how can it help my dog?",
            "faq.general.a1": "<p>Dogimax is a premium application designed to revolutionize your dog's care. It helps you schedule vet appointments, manage feeding times, and access an artificial intelligence assistant that answers all your pet care questions 24 hours a day.</p>",
            "faq.general.q2": "Is Dogimax really free?",
            "faq.general.a2": "<p>Yes, Dogimax has a free version that includes basic features like meal reminders and appointment scheduling. The Premium version unlocks advanced features like the personalized AI assistant, detailed health analytics, and priority support access.</p>",
            "faq.general.q3": "Does Dogimax work with any dog breed?",
            "faq.general.a3": "<p>Absolutely! Dogimax is designed to work with all dog breeds, from Chihuahuas to Great Danes. Our AI assistant adapts to the specific needs of each breed, age, and size to offer personalized recommendations.</p>",
            "faq.general.q4": "Do I need technical skills to use the app?",
            "faq.general.a4": "<p>Not at all. Dogimax is designed to be extremely easy to use. If you can send a text message, you can use Dogimax. Our initial setup process takes less than 2 minutes, and we guide you step by step.</p>",
            "faq.features.q1": "How does the artificial intelligence assistant work?",
            "faq.features.a1": "<p>Our AI assistant learns about your dog through the information you provide in your pet's profile. It uses data on breed, age, weight, medical history, and behavior to offer personalized advice. It can answer questions about feeding, behavior, health, and general care.</p>",
            "faq.features.q2": "Can I connect the app with my veterinarian?",
            "faq.features.a2": "<p>Yes, Dogimax allows you to share your dog's medical history and health data directly with your vet. This significantly improves the quality of consultations and helps the professional make better decisions about your pet's care.</p>",
            "faq.features.q3": "What kind of reminders can I set up?",
            "faq.features.a3": "<p>You can set reminders for meals, medications, vet appointments, vaccinations, deworming, exercise, grooming, and any custom activity that is important for your dog. Reminders can be repeated daily, weekly, or according to your specific schedule.</p>",
            "faq.premium.q1": "What does the Premium version include?",
            "faq.premium.a1": "<p>The Premium version includes: full access to the AI assistant, advanced health analytics, personalized nutritional recommendations, detailed activity tracking, 24/7 priority support, synchronization across multiple devices, and access to exclusive content from veterinary experts.</p>",
            "faq.premium.q2": "How much does the Premium version cost?",
            "faq.premium.a2": "<p>We offer flexible plans: $4.99/month, $39.99/year (save 33%), or $99.99 for lifetime access. All Premium plans include a 30-day satisfaction guarantee. You can cancel at any time, no questions asked.</p>",
            "faq.premium.q3": "Can I try Premium for free?",
            "faq.premium.a3": "<p>Of course! We offer a 14-day free trial of Dogimax Premium with no commitment. You don't need a credit card to start the trial, and you can cancel at any time during the trial period.</p>",
            "faq.technical.q1": "On which devices does Dogimax work?",
            "faq.technical.a1": "<p>Dogimax is available as a web application that works on any modern browser (Chrome, Safari, Firefox, Edge) on computers, tablets, and mobile devices. We are also developing native apps for iOS and Android, which will be available soon.</p>",
            "faq.technical.q2": "Is my data secure?",
            "faq.technical.a2": "<p>The security of your data is our absolute priority. We use military-grade encryption, comply with GDPR, conduct regular security audits, and never sell your personal information. All data is stored on secure servers.</p>",
            "faq.technical.q3": "Does it work without an internet connection?",
            "faq.technical.a3": "<p>Some basic functions like viewing reminders and saved data work offline. However, to access the AI assistant, sync data, and receive real-time updates, you need an internet connection. Data syncs automatically when you reconnect.</p>",
            "faq.cta.title": "Didn't find your answer?",
            "faq.cta.subtitle": "Our support team is here to help. Contact us and we will get back to you in less than 24 hours.",
            "faq.cta.contact": "Contact Support",
            "faq.cta.try": "Try Dogimax"
        },
        es: {
            "nav.benefits": "Beneficios",
            "nav.features": "Características",
            "nav.testimonials": "Testimonios",
            "nav.about": "Nosotros",
            "nav.faq": "FAQ",
            "nav.cta": "Comenzar Gratis",
            "hero.title": "La App Que Tu Perro ",
            "hero.titleHighlight": "Necesitaba",
            "hero.subtitle": "Dogimax es la aplicación premium que revoluciona el cuidado de tu mascota. Agenda citas veterinarias, controla horarios de comida y accede a nuestro asistente IA personalizado para resolver todas tus dudas.",
            "hero.cta": "Empezar Gratis Ahora",
            "benefits.title": "¿Por Qué Miles de Dog Lovers Eligen Dogimax?",
            "benefits.subtitle": "Descubre todos los beneficios que harán la diferencia en la vida de tu mascota",
            "benefits.card1.title": "Salud Bajo Control",
            "benefits.card1.description": "Nunca más olvides una cita veterinaria. Recibe recordatorios inteligentes y mantén el historial médico completo de tu perro.",
            "benefits.card2.title": "Horarios Perfectos",
            "benefits.card2.description": "Establece rutinas de alimentación personalizadas y recibe notificaciones para mantener a tu perro feliz y saludable.",
            "benefits.card3.title": "Asistente IA Personal",
            "benefits.card3.description": "Accede a nuestro experto virtual que conoce a tu perro y responde todas tus preguntas las 24 horas del día.",
            "benefits.card4.title": "Comunidad Activa",
            "benefits.card4.description": "Conecta con otros amantes de los perros, comparte experiencias y obtén consejos de expertos veterinarios.",
            "benefits.card5.title": "Registro de Vacunas",
            "benefits.card5.description": "Lleva un control claro y accesible del esquema de vacunación de tu mascota, con alertas y certificados digitales para consultas y viajes.",
            "benefits.card6.title": "Recordatorios de Medicación",
            "benefits.card6.description": "Programa dosis y horarios, recibe notificaciones y evita olvidos en tratamientos críticos para la salud de tu perro.",
            "benefits.cta": "Únete a la Comunidad",
            "features.title": "Características Que Marcan la Diferencia",
            "features.subtitle": "Tecnología avanzada diseñada específicamente para el cuidado canino",
            "features.item1.title": "Agenda Veterinaria Inteligente",
            "features.item1.description": "Sistema avanzado de recordatorios que se sincroniza con tu calendario y el de tu veterinario. Incluye historial médico completo, vacunas, medicamentos y seguimiento de tratamientos.",
            "features.item1.bullet1": "Recordatorios automáticos de citas",
            "features.item1.bullet2": "Historial médico digitalizado",
            "features.item1.bullet3": "Conexión directa con veterinarios",
            "features.item1.bullet4": "Seguimiento de tratamientos",
            "features.item2.title": "Asistente IA Personalizado",
            "features.item2.description": "Nuestro asistente de inteligencia artificial aprende sobre tu perro y proporciona consejos personalizados basados en raza, edad, historial médico y comportamiento.",
            "features.item2.bullet1": "Respuestas 24/7 sobre tu mascota",
            "features.item2.bullet2": "Consejos personalizados por raza",
            "features.item2.bullet3": "Alertas de salud preventivas",
            "features.item2.bullet4": "Recomendaciones de cuidado",
            "features.cta": "Explorar Todas las Características",
            "testimonials.title": "Confiado por Miles de Dog Lovers",
            "testimonials.subtitle": "Descubre por qué somos la aplicación #1 para el cuidado canino",
            "testimonials.card1.text": "\"Dogimax cambió completamente cómo cuido a Max. El asistente IA me ayudó cuando estaba preocupada por su comportamiento y resultó ser solo una fase normal. ¡Increíble!\"",
            "testimonials.card1.author": "María González",
            "testimonials.card1.location": "Madrid, España",
            "testimonials.card2.text": "\"Como veterinario, recomiendo Dogimax a todos mis clientes. La información que llegan con a la consulta es mucho más detallada y útil para el diagnóstico.\"",
            "testimonials.card2.author": "Dr. Carlos Ruiz",
            "testimonials.card2.location": "Veterinario, Barcelona",
            "testimonials.card3.text": "\"Los recordatorios de comida han sido un salvavidas. Luna ahora tiene una rutina perfecta y su digestión ha mejorado muchísimo. La versión premium vale cada euro.\"",
            "testimonials.card3.author": "Ana Martín",
            "testimonials.card3.location": "Valencia, España",
            "stats.item1": "Perros Felices",
            "stats.item2": "Satisfacción",
            "stats.item3": "Valoración",
            "stats.item4": "Soporte IA",
            "testimonials.cta": "Únete a Nuestra Comunidad",
            "footer.description": "La aplicación premium que revoluciona el cuidado de tu perro con tecnología de inteligencia artificial y las mejores herramientas de gestión.",
            "footer.product.title": "Producto",
            "footer.product.features": "Características",
            "footer.product.pricing": "Precios",
            "footer.product.premium": "Premium",
            "footer.product.mobile": "App Móvil",
            "footer.company.title": "Empresa",
            "footer.company.about": "Sobre Nosotros",
            "footer.company.blog": "Blog",
            "footer.company.careers": "Carrera",
            "footer.company.press": "Prensa",
            "footer.support.title": "Soporte",
            "footer.support.faq": "FAQ",
            "footer.support.contact": "Contacto",
            "footer.support.help": "Centro de Ayuda",
            "footer.support.community": "Comunidad",
            "footer.legal.title": "Legal",
            "footer.legal.privacy": "Privacidad",
            "footer.legal.terms": "Términos",
            "footer.legal.cookies": "Cookies",
            "footer.legal.gdpr": "GDPR",
            "footer.copyright": "© 2025 Dogimax. Todos los derechos reservados. Hecho con ❤️ para dog lovers.",
            "about.hero.title": "Sobre Nosotros",
            "about.hero.subtitle": "Conoce la pasión y dedicación detrás de Dogimax, la aplicación que está revolucionando el cuidado canino en todo el mundo.",
            "about.mission.title": "Nuestra Misión",
            "about.mission.subtitle": "Creamos Dogimax con una misión clara: hacer que el cuidado de los perros sea más fácil, inteligente y accesible para todos los amantes de las mascotas.",
            "about.mission.description": "Nuestro equipo de desarrolladores, veterinarios y expertos en comportamiento animal trabaja incansablemente para crear herramientas que fortalezcan el vínculo entre las personas y sus perros, mientras garantizan el mejor cuidado posible.",
            "about.values.title": "Nuestros Valores",
            "about.values.card1.title": "Amor por los Perros",
            "about.values.card1.description": "Cada decisión que tomamos tiene en mente el bienestar y felicidad de nuestros amigos de cuatro patas.",
            "about.values.card2.title": "Innovación",
            "about.values.card2.description": "Utilizamos las últimas tecnologías en IA y machine learning para ofrecer soluciones únicas en el cuidado canino.",
            "about.values.card3.title": "Comunidad",
            "about.values.card3.description": "Creemos en el poder de conectar a los amantes de los perros para compartir experiencias y aprender juntos.",
            "about.values.card4.title": "Simplicidad",
            "about.values.card4.description": "Hacemos que la tecnología compleja sea simple y accesible para todos, sin importar su nivel técnico.",
            "about.team.title": "Nuestro Equipo",
            "about.team.subtitle": "Profesionales apasionados trabajando para hacer la diferencia en la vida de tu perro",
            "about.team.member1.description": "Estudiante apasionado por la tecnología, la programación además de la automatizacion de procesos con inteligencia artificial.",
            "about.team.member2.description": "Soy un estudiante con fuerte inclinación hacia la innovación tecnológica, el desarrollo de software y la implementación de soluciones automatizadas impulsadas por inteligencia artificial. También encuentro inspiración en la música y en diversas formas de creatividad, lo que complementa mi enfoque multidisciplinario para resolver problemas y aprender continuamente.",
            "about.team.member3.description": "Soy un estudiante de Ingeniería de Software, con una profunda pasión por la innovación tecnológica, la programación y la automatización de procesos mediante la inteligencia artificial. Me considero una persona comprometida y responsable que prioriza sus deberes y se esfuerza por cumplir con los plazos establecidos.",
            "about.team.member4.description": "Soy estudiante de la carrera de ingeniería de software de la universidad Peruana de ciencias aplicadas, soy una persona comprometida y responsable, priorizo mucho mis responsabilidades y siempre trato de cumplir mis trabajos en los tiempos establecidos.",
            "about.team.member5.description": "Estudiante de ingeniería de software, con fuerte tendencia por las ciencias de la computación y ciberseguridad.",
            "faq.hero.title": "Preguntas Frecuentes",
            "faq.hero.subtitle": "Encuentra respuestas rápidas a las preguntas más comunes sobre Dogimax y descubre cómo aprovechar al máximo nuestra aplicación.",
            "faq.category.general": "General",
            "faq.category.features": "Características",
            "faq.category.premium": "Premium",
            "faq.category.technical": "Técnico",
            "faq.general.q1": "¿Qué es Dogimax y cómo puede ayudar a mi perro?",
            "faq.general.a1": "<p>Dogimax es una aplicación premium diseñada para revolucionar el cuidado de tu perro. Te ayuda a agendar citas veterinarias, controlar horarios de alimentación, y acceder a un asistente de inteligencia artificial que responde todas tus dudas sobre el cuidado de tu mascota las 24 horas del día.</p>",
            "faq.general.q2": "¿Es Dogimax realmente gratis?",
            "faq.general.a2": "<p>Sí, Dogimax tiene una versión gratuita que incluye funciones básicas como recordatorios de comida y agenda de citas. La versión Premium desbloquea características avanzadas como el asistente IA personalizado, análisis de salud detallados y acceso prioritario al soporte.</p>",
            "faq.general.q3": "¿Funciona Dogimax con cualquier raza de perro?",
            "faq.general.a3": "<p>¡Absolutamente! Dogimax está diseñado para funcionar con todas las razas de perros, desde Chihuahuas hasta Gran Daneses. Nuestro asistente IA se adapta a las necesidades específicas de cada raza, edad y tamaño para ofrecer recomendaciones personalizadas.</p>",
            "faq.general.q4": "¿Necesito conocimientos técnicos para usar la app?",
            "faq.general.a4": "<p>Para nada. Dogimax está diseñado para ser extremadamente fácil de usar. Si puedes enviar un mensaje de texto, puedes usar Dogimax. Nuestro proceso de configuración inicial toma menos de 2 minutos y te guiamos paso a paso.</p>",
            "faq.features.q1": "¿Cómo funciona el asistente de inteligencia artificial?",
            "faq.features.a1": "<p>Nuestro asistente IA aprende sobre tu perro a través de la información que proporcionas en el perfil de tu mascota. Utiliza datos sobre raza, edad, peso, historial médico y comportamiento para ofrecer consejos personalizados. Puede responder preguntas sobre alimentación, comportamiento, salud y cuidados generales.</p>",
            "faq.features.q2": "¿Puedo conectar la app con mi veterinario?",
            "faq.features.a2": "<p>Sí, Dogimax te permite compartir el historial médico y los datos de salud de tu perro directamente con tu veterinario. Esto mejora significativamente la calidad de las consultas y ayuda al profesional a tomar mejores decisiones sobre el cuidado de tu mascota.</p>",
            "faq.features.q3": "¿Qué tipo de recordatorios puedo configurar?",
            "faq.features.a3": "<p>Puedes configurar recordatorios para comidas, medicamentos, citas veterinarias, vacunas, desparasitaciones, ejercicio, aseo y cualquier actividad personalizada que sea importante para tu perro. Los recordatorios se pueden repetir diariamente, semanalmente o según tu programación específica.</p>",
            "faq.premium.q1": "¿Qué incluye la versión Premium?",
            "faq.premium.a1": "<p>La versión Premium incluye: acceso completo al asistente IA, análisis avanzados de salud, recomendaciones nutricionales personalizadas, seguimiento detallado de actividad, soporte prioritario 24/7, sincronización con múltiples dispositivos y acceso a contenido exclusivo de expertos veterinarios.</p>",
            "faq.premium.q2": "¿Cuánto cuesta la versión Premium?",
            "faq.premium.a2": "<p>Ofrecemos planes flexibles: 4.99€/mes, 39.99€/año (ahorra 33%), o 99.99€ para acceso de por vida. Todos los planes Premium incluyen una garantía de satisfacción de 30 días. Puedes cancelar en cualquier momento sin preguntas.</p>",
            "faq.premium.q3": "¿Puedo probar Premium gratis?",
            "faq.premium.a3": "<p>¡Por supuesto! Ofrecemos una prueba gratuita de 14 días de Dogimax Premium sin compromiso. No necesitas tarjeta de crédito para comenzar la prueba, y puedes cancelar en cualquier momento durante el período de prueba.</p>",
            "faq.technical.q1": "¿En qué dispositivos funciona Dogimax?",
            "faq.technical.a1": "<p>Dogimax está disponible como aplicación web que funciona en cualquier navegador moderno (Chrome, Safari, Firefox, Edge) en computadoras, tablets y móviles. También estamos desarrollando aplicaciones nativas para iOS y Android que estarán disponibles próximamente.</p>",
            "faq.technical.q2": "¿Mis datos están seguros?",
            "faq.technical.a2": "<p>La seguridad de tus datos es nuestra prioridad absoluta. Utilizamos encriptación de grado militar, cumplimos con GDPR, realizamos auditorías de seguridad regulares y nunca vendemos tu información personal. Todos los datos se almacenan en servidores seguros.</p>",
            "faq.technical.q3": "¿Funciona sin conexión a internet?",
            "faq.technical.a3": "<p>Algunas funciones básicas como ver recordatorios y datos guardados funcionan sin conexión. Sin embargo, para acceder al asistente IA, sincronizar datos y recibir actualizaciones en tiempo real, necesitas conexión a internet. Los datos se sincronizan automáticamente cuando recuperas la conexión.</p>",
            "faq.cta.title": "¿No encontraste tu respuesta?",
            "faq.cta.subtitle": "Nuestro equipo de soporte está aquí para ayudarte. Contáctanos y te responderemos en menos de 24 horas.",
            "faq.cta.contact": "Contactar Soporte",
            "faq.cta.try": "Probar Dogimax"
        }
    };

    const langToggle = document.getElementById('lang-toggle');
    let currentLang = localStorage.getItem('lang') || 'en';

    const setLanguage = (lang) => {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = translations[lang][key];
            if (translation) {
                // Handle special cases like hero title with a span inside
                if (key === 'hero.title') {
                    const highlightKey = 'hero.titleHighlight';
                    const highlightText = translations[lang][highlightKey];
                    element.innerHTML = `${translation}<span class="text-highlight" data-i18n="${highlightKey}">${highlightText}</span>`;
                } else if (element.tagName === 'P' || element.classList.contains('faq-answer')) {
                    // Use innerHTML for elements that might contain <p> tags from the translation
                    element.innerHTML = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        langToggle.checked = lang === 'es';
        console.log(`Language switched to ${lang}`);
    };

    langToggle.addEventListener('change', () => {
        setLanguage(langToggle.checked ? 'es' : 'en');
    });

    // Set initial language on page load
    setLanguage(currentLang);
    console.log('i18n initialized');
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
