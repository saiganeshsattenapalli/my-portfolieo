/* ═══════════════════════════════════════════
   Curiora JS — Vanilla, Zero Dependencies
   Pointer interactions, lerp animation, scroll
   ═══════════════════════════════════════════ */

(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Linear Interpolation helper
    const lerp = (start, end, factor) => start + (end - start) * factor;

    /* ─── Pointer Interactions (Ambient, Tilt, Magnetic) ─── */
    function initPointerEffects() {
        if (prefersReducedMotion) return;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        // Track global mouse
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Ambient Canvas State
        let ambientX = mouseX;
        let ambientY = mouseY;
        const root = document.documentElement;

        // Glass Tilt State
        const glassElements = document.querySelectorAll('[data-depth]');
        const glassData = Array.from(glassElements).map(el => ({
            el,
            depth: parseFloat(el.getAttribute('data-depth')) || 10,
            curTiltX: 0,
            curTiltY: 0,
            targetTiltX: 0,
            targetTiltY: 0
        }));

        // Magnetic Buttons State
        const buttons = document.querySelectorAll('.btn');
        const btnData = Array.from(buttons).map(el => ({
            el,
            curMagX: 0,
            curMagY: 0,
            targetMagX: 0,
            targetMagY: 0
        }));

        // Render Loop
        function render() {
            // 1. Ambient Light
            ambientX = lerp(ambientX, mouseX, 0.05);
            ambientY = lerp(ambientY, mouseY, 0.05);
            root.style.setProperty('--mouse-x', `${ambientX}px`);
            root.style.setProperty('--mouse-y', `${ambientY}px`);

            // 2. Glass Tilt
            glassData.forEach(data => {
                const rect = data.el.getBoundingClientRect();
                
                // Only calculate if in viewport
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const elCenterX = rect.left + rect.width / 2;
                    const elCenterY = rect.top + rect.height / 2;
                    
                    // Normalize cursor position from -1 to 1 relative to element center
                    const normX = (mouseX - elCenterX) / (window.innerWidth / 2);
                    const normY = (mouseY - elCenterY) / (window.innerHeight / 2);

                    data.targetTiltY = normX * data.depth;       // Mouse X controls Rotate Y
                    data.targetTiltX = -(normY * data.depth);    // Mouse Y controls Rotate X
                } else {
                    data.targetTiltX = 0;
                    data.targetTiltY = 0;
                }

                data.curTiltX = lerp(data.curTiltX, data.targetTiltX, 0.05);
                data.curTiltY = lerp(data.curTiltY, data.targetTiltY, 0.05);

                data.el.style.setProperty('--tilt-x', `${data.curTiltY}deg`);
                data.el.style.setProperty('--tilt-y', `${data.curTiltX}deg`);
            });

            // 3. Magnetic Buttons
            btnData.forEach(data => {
                const rect = data.el.getBoundingClientRect();
                const elCenterX = rect.left + rect.width / 2;
                const elCenterY = rect.top + rect.height / 2;
                
                // Calculate distance
                const distX = mouseX - elCenterX;
                const distY = mouseY - elCenterY;
                const distance = Math.sqrt(distX * distX + distY * distY);
                
                // Magnet radius ~ 100px
                if (distance < 100) {
                    data.targetMagX = distX * 0.3;
                    data.targetMagY = distY * 0.3;
                } else {
                    data.targetMagX = 0;
                    data.targetMagY = 0;
                }

                data.curMagX = lerp(data.curMagX, data.targetMagX, 0.1);
                data.curMagY = lerp(data.curMagY, data.targetMagY, 0.1);

                data.el.style.setProperty('--mag-x', `${data.curMagX}px`);
                data.el.style.setProperty('--mag-y', `${data.curMagY}px`);
            });

            requestAnimationFrame(render);
        }

        render();
    }

    /* ─── Scroll Reveal ─── */
    function initScrollReveal() {
        const elements = document.querySelectorAll('[data-animate]');
        if (!elements.length) return;

        // Hero immediate reveal
        const heroEls = document.querySelectorAll('.hero [data-animate]');
        heroEls.forEach(el => {
            requestAnimationFrame(() => el.classList.add('visible'));
        });

        if (prefersReducedMotion) {
            elements.forEach(el => el.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        elements.forEach(el => {
            if (!el.closest('.hero')) observer.observe(el);
        });
    }

    /* ─── Navigation ─── */
    function initNav() {
        // Mobile Toggle
        const toggle = document.getElementById('nav-toggle');
        const links = document.getElementById('nav-links');
        
        if (toggle && links) {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('open');
                links.classList.toggle('open');
                document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
            });

            const navAnchors = links.querySelectorAll('a');
            navAnchors.forEach(a => {
                a.addEventListener('click', () => {
                    toggle.classList.remove('open');
                    links.classList.remove('open');
                    document.body.style.overflow = '';
                });
            });
        }

        // Nav Pill Scrolled State
        const navPill = document.querySelector('.nav-pill');
        if (navPill) {
            const checkScroll = () => {
                if (window.scrollY > 20) navPill.classList.add('scrolled');
                else navPill.classList.remove('scrolled');
            };
            window.addEventListener('scroll', checkScroll, { passive: true });
            checkScroll();
        }

        // Active Link tracking
        const sections = document.querySelectorAll('.chapter[id]');
        const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
        
        if (sections.length && navAnchors.length) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        navAnchors.forEach(link => {
                            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                        });
                    }
                });
            }, { threshold: 0.2, rootMargin: '-10% 0px -60% 0px' });

            sections.forEach(sec => observer.observe(sec));
        }

        // Smooth Scroll Offset
        navAnchors.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    const top = target.getBoundingClientRect().top + window.pageYOffset - 100;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });
    }

    /* ─── Init ─── */
    document.addEventListener('DOMContentLoaded', () => {
        initPointerEffects();
        initScrollReveal();
        initNav();
    });
})();
