// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initNavigation();
});

function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const dropdownNav = document.getElementById('dropdownNav');
    const navToggleText = navToggle.querySelector('.nav-toggle-text');
    const navLinks = document.querySelectorAll('.nav-link');
    let isNavOpen = false;
    
    // Toggle navigation
    function toggleNav() {
        isNavOpen = !isNavOpen;
        dropdownNav.classList.toggle('active');
        
        // Change button text
        if (isNavOpen) {
            navToggleText.textContent = 'Скрыть навигацию';
        } else {
            navToggleText.textContent = 'Показать навигацию';
        }
    }
    
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleNav();
    });
    
    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
        if (isNavOpen && !dropdownNav.contains(e.target) && !navToggle.contains(e.target)) {
            toggleNav();
        }
    });
    
    // Smooth scroll to section
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offset = 100;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Navigation stays open - no closing
            }
        });
    });
    
    // Highlight active section in navigation
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollPos = window.scrollY + 200;
        let currentSection = '';
        
        // Check hero section first
        const hero = document.getElementById('hero');
        if (hero && window.scrollY < hero.offsetHeight * 0.5) {
            currentSection = 'hero';
        } else {
            // Check other sections
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.id;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    currentSection = sectionId;
                }
            });
        }
        
        // Update nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    // Update on scroll
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial check
}

function initAnimations() {
    // Register GSAP ScrollTrigger plugin
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP or ScrollTrigger not loaded');
        return;
    }
    
    gsap.registerPlugin(ScrollTrigger);

    // Set up smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';

    // Hero Section Animations
    const heroTimeline = gsap.timeline();

    // Set initial state for logos
    gsap.set('.logo', { opacity: 0, scale: 0 });
    
    // Animate logos on load
    heroTimeline.to('.logo', {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.2,
        ease: 'back.out(1.7)',
        stagger: 0
    });

    // Animate title
    heroTimeline.from('.hero-title .title-line', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0,
        ease: 'power3.out'
    }, '-=0.5');

// Animate subtitle
heroTimeline.from('.hero-subtitle', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power2.out'
}, '-=0.3');

// Animate scroll indicator
heroTimeline.from('.scroll-indicator', {
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out'
}, '-=0.2');

    // Logo morphing animation (continuous)
    const logos = document.querySelectorAll('.logo');
    let currentLogo = 0;

    function morphLogos() {
        logos.forEach((logo, index) => {
            if (index === currentLogo) {
                gsap.to(logo, {
                    scale: 1.15,
                    duration: 0.5,
                    ease: 'power2.inOut'
                });
            } else {
                gsap.to(logo, {
                    scale: 1,
                    duration: 0.5,
                    ease: 'power2.inOut'
                });
            }
        });
        
        currentLogo = (currentLogo + 1) % logos.length;
    }

    // Start morphing after initial animation
    setTimeout(() => {
        setInterval(morphLogos, 3000);
    }, 2000);

    // Parallax effect for background symbols in hero
    gsap.to('.hero .symbol', {
        y: (i, el) => {
            return ScrollTrigger.maxScroll(window) * 0.3;
        },
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
    
    // Color animation for symbols - make them change color on scroll
    const allSymbols = document.querySelectorAll('.symbol');
    
    allSymbols.forEach((symbol, index) => {
        // Create scroll-based color animation
        ScrollTrigger.create({
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            onUpdate: (self) => {
                const progress = self.progress;
                let color;
                if (progress < 0.33) {
                    // MATLAB blue to Maple red
                    const t = progress / 0.33;
                    color = gsap.utils.interpolate('#0076A5', '#D50000', t);
                } else if (progress < 0.66) {
                    // Maple red to Mathcad green
                    const t = (progress - 0.33) / 0.33;
                    color = gsap.utils.interpolate('#D50000', '#00A859', t);
                } else {
                    // Mathcad green back to MATLAB blue
                    const t = (progress - 0.66) / 0.34;
                    color = gsap.utils.interpolate('#00A859', '#0076A5', t);
                }
                symbol.style.color = color;
                
                // Also animate opacity based on scroll
                const opacity = 0.08 + (Math.sin(progress * Math.PI * 2) * 0.07);
                symbol.style.opacity = opacity;
            }
        });
        
        // Parallax effect for symbols
        gsap.to(symbol, {
            y: ScrollTrigger.maxScroll(window) * (0.05 + (index % 3) * 0.02),
            rotation: 180,
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true
            }
        });
    });
    
    // Make floating elements change color on scroll
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((el, index) => {
        ScrollTrigger.create({
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            onUpdate: (self) => {
                const progress = self.progress;
                const colorType = el.getAttribute('data-color');
                let opacity;
                
                if (colorType === 'matlab') {
                    opacity = 0.1 + Math.sin(progress * Math.PI * 2 + index) * 0.1;
                } else if (colorType === 'maple') {
                    opacity = 0.1 + Math.sin(progress * Math.PI * 2 + index + 1) * 0.1;
                } else {
                    opacity = 0.1 + Math.sin(progress * Math.PI * 2 + index + 2) * 0.1;
                }
                
                el.style.opacity = opacity;
                
                // Scale based on scroll
                const scale = 1 + Math.sin(progress * Math.PI * 4) * 0.2;
                el.style.transform = `scale(${scale})`;
            }
        });
    });
    
    // Animate connector lines with color changes and movement
    const connector = document.getElementById('symbol-connector');
    if (connector) {
        const svg = connector.querySelector('.connector-svg');
        const paths = connector.querySelectorAll('.connector-path');
        const gradient = connector.querySelector('#connectorGradient');
        
        // Make SVG scale with page height
        const updateSVGHeight = () => {
            const pageHeight = document.documentElement.scrollHeight;
            if (svg) {
                svg.setAttribute('viewBox', `0 0 100 ${pageHeight / 10}`);
                svg.style.height = `${pageHeight}px`;
            }
        };
        updateSVGHeight();
        window.addEventListener('resize', updateSVGHeight);
        
        paths.forEach((path, index) => {
            // Animate dash offset for flowing effect
            gsap.to(path, {
                strokeDashoffset: -100,
                ease: 'none',
                scrollTrigger: {
                    trigger: document.body,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true
                }
            });
        });
        
        // Animate gradient colors on scroll
        ScrollTrigger.create({
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            onUpdate: (self) => {
                const progress = self.progress;
                if (gradient) {
                    const stops = gradient.querySelectorAll('stop');
                    stops.forEach((stop) => {
                        const offset = parseFloat(stop.getAttribute('offset'));
                        let color;
                        if (offset === 0) {
                            color = gsap.utils.interpolate('#0076A5', '#D50000', progress);
                        } else if (offset === 0.33) {
                            color = gsap.utils.interpolate('#D50000', '#00A859', progress);
                        } else if (offset === 0.66) {
                            color = gsap.utils.interpolate('#00A859', '#0076A5', progress);
                        } else {
                            color = gsap.utils.interpolate('#0076A5', '#D50000', progress);
                        }
                        stop.setAttribute('style', `stop-color:${color};stop-opacity:${0.1 + Math.sin(progress * Math.PI * 2) * 0.1}`);
                    });
                }
                
                // Animate connector opacity
                if (connector) {
                    const opacity = 0.15 + Math.sin(progress * Math.PI * 4) * 0.1;
                    connector.style.opacity = opacity;
                }
            }
        });
    }

    // Set initial states for introduction
    gsap.set('.introduction .section-title', { opacity: 0, y: 50 });
    gsap.set('.intro-text', { opacity: 0, x: -50 });
    gsap.set('.intro-question', { opacity: 0, scale: 0.9 });
    
    // Introduction Section Animation
    gsap.to('.introduction .section-title', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.introduction',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.to('.intro-text', {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.introduction',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        }
    });

    gsap.to('.intro-question', {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: '.intro-question',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    // Set initial state for philosophy section title
    gsap.set('.philosophy .section-title', { opacity: 0, y: 30 });
    
    // Philosophy section title animation
    gsap.to('.philosophy .section-title', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.philosophy',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Set initial state for philosophy cards
    gsap.set('.philosophy-card', { opacity: 0, y: 50 });
    gsap.set('.card-icon', { opacity: 0, scale: 0, rotation: 180 });
    
    // Philosophy Section Animation
    gsap.to('.philosophy-card', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.philosophy-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    // Animate card icons
    gsap.to('.card-icon', {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.6,
        stagger: 0,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: '.philosophy-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    // Set initial state for comparison section title
    gsap.set('.comparison .section-title', { opacity: 0, y: 30 });
    
    // Comparison section title animation
    gsap.to('.comparison .section-title', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.comparison',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Comparison Section Animations
    const criterionBlocks = document.querySelectorAll('.criterion-block');

    criterionBlocks.forEach((block, index) => {
        const title = block.querySelector('.criterion-title');
        const items = block.querySelectorAll('.criterion-item');
        
        // Set initial states with different animations for each type
        gsap.set(title, { opacity: 0, y: 30 });
        
        items.forEach((item, i) => {
            if (item.classList.contains('item-matlab')) {
                // MATLAB: slide from left with rotation
                gsap.set(item, { opacity: 0, x: -100, rotation: -5, scale: 0.8 });
            } else if (item.classList.contains('item-maple')) {
                // Maple: slide from top with scale
                gsap.set(item, { opacity: 0, y: -100, scale: 0.7, rotation: 5 });
            } else if (item.classList.contains('item-mathcad')) {
                // Mathcad: slide from bottom with bounce
                gsap.set(item, { opacity: 0, y: 100, scale: 0.8, rotation: -3 });
            }
        });
        
        // Animate criterion title
        gsap.to(title, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: block,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate criterion items with different animations
        items.forEach((item, i) => {
            if (item.classList.contains('item-matlab')) {
                gsap.to(item, {
                    opacity: 1,
                    x: 0,
                    rotation: 0,
                    scale: 1,
                    duration: 1,
                    delay: 0,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: block,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    }
                });
            } else if (item.classList.contains('item-maple')) {
                gsap.to(item, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotation: 0,
                    duration: 1,
                    delay: 0,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: block,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    }
                });
            } else if (item.classList.contains('item-mathcad')) {
                gsap.to(item, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotation: 0,
                    duration: 1,
                    delay: 0,
                    ease: 'elastic.out(1, 0.5)',
                    scrollTrigger: {
                        trigger: block,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    }
                });
            }
        });
    });

    // Set initial states for example task section
    gsap.set('.example-task .section-title', { opacity: 0, y: 30 });
    gsap.set('.task-intro', { opacity: 0, y: 20 });
    gsap.set('.solution-tabs', { opacity: 0, y: 20 });
    
    // Set initial states for real life examples section
    gsap.set('.real-life-examples .section-title', { opacity: 0, y: 30 });
    gsap.set('.section-subtitle', { opacity: 0, y: 20 });
    gsap.set('.life-example-card', { opacity: 0, y: 50 });
    
    // Example Task Section Animation
    gsap.to('.example-task .section-title', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.example-task',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
    
    gsap.to('.task-intro', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.task-intro',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
    
    gsap.to('.solution-tabs', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.solution-tabs',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Real Life Examples Section Animation
    gsap.to('.real-life-examples .section-title', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.real-life-examples',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
    
    gsap.to('.real-life-examples .section-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.real-life-examples .section-subtitle',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
    
    gsap.to('.life-example-card', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.life-examples-grid',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Tab switching functionality - fixed version
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    function switchTab(targetTab) {
        // Hide all contents first
        tabContents.forEach(content => {
            if (content.classList.contains('active')) {
                gsap.to(content, {
                    opacity: 0,
                    y: -10,
                    duration: 0.2,
                    ease: 'power2.in',
                    onComplete: () => {
                        content.classList.remove('active');
                        content.style.display = 'none';
                    }
                });
            }
        });
        
        // Remove active from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Activate clicked button
        const clickedButton = document.querySelector(`[data-tab="${targetTab}"]`);
        if (clickedButton) {
            clickedButton.classList.add('active');
        }
        
        // Show target content
        const targetContent = document.getElementById(`${targetTab}-tab`);
        if (targetContent) {
            targetContent.style.display = 'block';
            targetContent.classList.add('active');
            
                // Animate content appearance
                gsap.fromTo(targetContent, 
                    { opacity: 0, y: 20, scale: 0.95 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        duration: 0.5, 
                        ease: 'power3.out',
                        delay: 0
                    }
                );
                
                // Animate console output
                const consoleOutput = targetContent.querySelector('.console-output');
                if (consoleOutput) {
                    const consoleLines = consoleOutput.querySelectorAll('.console-line');
                    gsap.fromTo(consoleLines,
                        { opacity: 0, x: -30 },
                        {
                            opacity: 1, 
                            x: 0, 
                            duration: 0.4, 
                            stagger: 0, 
                            ease: 'power2.out'
                        }
                    );
                }
                
                // Animate code block
                const codeBlock = targetContent.querySelector('.code-block');
                if (codeBlock) {
                    gsap.fromTo(codeBlock,
                        { opacity: 0, scale: 0.98 },
                        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
                    );
                }
        }
    }
    
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const targetTab = button.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
    
    // Animate console on initial load
    const activeConsole = document.querySelector('.tab-content.active .console-output');
    if (activeConsole) {
        const consoleLines = activeConsole.querySelectorAll('.console-line');
        gsap.fromTo(consoleLines,
            { opacity: 0, x: -20 },
            { 
                opacity: 1, 
                x: 0, 
                duration: 0.4, 
                stagger: 0, 
                ease: 'power2.out',
                delay: 0
            }
        );
    }

    // Set initial state for summary section title
    gsap.set('.summary .section-title', { opacity: 0, y: 30 });
    
    // Summary section title animation
    gsap.to('.summary .section-title', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.summary',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Set initial state for table
    gsap.set('.table-wrapper', { opacity: 0, y: 20 });
    
    // Summary Table Animation
    gsap.to('.table-wrapper', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.summary',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        }
    });

    // Set initial state for table rows
    gsap.set('.comparison-table tr', { opacity: 0, x: -20 });
    
    gsap.to('.comparison-table tr', {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.comparison-table',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    // Set initial state for conclusion section title
    gsap.set('.conclusion .section-title', { opacity: 0, y: 30 });
    
    // Conclusion section title animation
    gsap.to('.conclusion .section-title', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.conclusion',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Set initial state for decision cards
    gsap.set('.decision-card', { opacity: 0, y: 30 });
    
    // Conclusion Section Animation
    gsap.to('.decision-card', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.decision-cards',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    // Set initial state for CTA section title
    gsap.set('.cta-section .section-title', { opacity: 0, y: 30 });
    gsap.set('.cta-text', { opacity: 0, y: 20 });
    
    // CTA section title animation
    gsap.to('.cta-section .section-title', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
    
    gsap.to('.cta-text', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.cta-text',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Set initial state for CTA buttons
    gsap.set('.cta-button', { opacity: 0, y: 20 });
    
    // CTA Section Animation
    gsap.to('.cta-button', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: '.cta-buttons',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    // Color transition effect on scroll
    const sections = document.querySelectorAll('.section');
    const colors = [
        { bg: 'rgba(0, 118, 165, 0.1)', text: '#0076A5' }, // MATLAB
        { bg: 'rgba(213, 0, 0, 0.1)', text: '#D50000' },   // Maple
        { bg: 'rgba(0, 168, 89, 0.1)', text: '#00A859' }   // Mathcad
    ];

    // Add gradient animation to all sections on scroll
    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top 70%',
            end: 'bottom 30%',
            onEnter: () => {
                section.classList.add('active');
                // Animate floating elements
                const floatingElements = section.querySelectorAll('.floating-element');
                floatingElements.forEach((el, index) => {
                    gsap.to(el, {
                        opacity: 0.25,
                        scale: 1.2,
                        duration: 1,
                        delay: 0,
                        ease: 'power2.out'
                    });
                });
                
                // Animate connector
                const connector = section.querySelector('.section-connector');
                if (connector) {
                    gsap.fromTo(connector,
                        { opacity: 0, y: -30 },
                        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
                    );
                }
                
                // Animate corner decorative element
                gsap.to(section, {
                    '--corner-opacity': 1,
                    duration: 0.6,
                    ease: 'power2.out'
                });
            },
            onLeave: () => {
                section.classList.remove('active');
                const floatingElements = section.querySelectorAll('.floating-element');
                floatingElements.forEach(el => {
                    gsap.to(el, {
                        opacity: 0.1,
                        scale: 1,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                });
            },
            onEnterBack: () => {
                section.classList.add('active');
                const floatingElements = section.querySelectorAll('.floating-element');
                floatingElements.forEach((el, index) => {
                    gsap.to(el, {
                        opacity: 0.25,
                        scale: 1.2,
                        duration: 1,
                        delay: 0,
                        ease: 'power2.out'
                    });
                });
                
                // Animate connector
                const connector = section.querySelector('.section-connector');
                if (connector) {
                    gsap.to(connector, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                }
            },
            onLeaveBack: () => {
                section.classList.remove('active');
                const floatingElements = section.querySelectorAll('.floating-element');
                floatingElements.forEach(el => {
                    gsap.to(el, {
                        opacity: 0.1,
                        scale: 1,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                });
            }
        });
    });
    
    // Parallax effect for floating elements
    sections.forEach(section => {
        const floatingElements = section.querySelectorAll('.floating-element');
        floatingElements.forEach((el, index) => {
            gsap.to(el, {
                y: (i) => {
                    return ScrollTrigger.maxScroll(window) * (0.1 + index * 0.05);
                },
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    });

    // Add scroll-based color transitions
    ScrollTrigger.create({
        trigger: '.philosophy',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
            document.body.style.setProperty('--accent-color', colors[0].text);
        },
        onLeave: () => {
            document.body.style.setProperty('--accent-color', colors[1].text);
        },
        onEnterBack: () => {
            document.body.style.setProperty('--accent-color', colors[0].text);
        }
    });

    ScrollTrigger.create({
        trigger: '.comparison',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
            document.body.style.setProperty('--accent-color', colors[1].text);
        },
        onLeave: () => {
            document.body.style.setProperty('--accent-color', colors[2].text);
        },
        onEnterBack: () => {
            document.body.style.setProperty('--accent-color', colors[1].text);
        }
    });

    // Smooth scroll indicator click
    document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
        const introduction = document.querySelector('#introduction');
        introduction?.scrollIntoView({ behavior: 'smooth' });
    });

    // Add hover effects to logos
    logos.forEach(logo => {
        logo.addEventListener('mouseenter', () => {
            gsap.to(logo, {
                scale: 1.2,
                rotation: 10,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        logo.addEventListener('mouseleave', () => {
            gsap.to(logo, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Performance optimization: use will-change
    const animatedElements = document.querySelectorAll('.logo, .philosophy-card, .criterion-item, .decision-card');
    animatedElements.forEach(el => {
        el.style.willChange = 'transform, opacity';
    });

    // Clean up will-change after animations
    ScrollTrigger.addEventListener('scrollEnd', () => {
        animatedElements.forEach(el => {
            el.style.willChange = 'auto';
        });
    });

    console.log('Scroll animations initialized!');
}

