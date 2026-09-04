/* ═══════════════════════════════════════════
   Portfolio JS — Vanilla
   Scroll reveal, mobile nav, active section
   ═══════════════════════════════════════════ */

(function () {
    'use strict';

    /* ─── Scroll Reveal via IntersectionObserver ─── */
    function initScrollReveal() {
        var elements = document.querySelectorAll('[data-animate]');
        if (!elements.length) return;

        // Trigger hero elements immediately (they're above the fold)
        var heroEls = document.querySelectorAll('.hero [data-animate]');
        heroEls.forEach(function (el) {
            // Small delay so the CSS transition-delay stagger works
            requestAnimationFrame(function () {
                el.classList.add('visible');
            });
        });

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        elements.forEach(function (el) {
            // Skip hero elements — already handled above
            if (!el.closest('.hero')) {
                observer.observe(el);
            }
        });
    }

    /* ─── Mobile Navigation ─── */
    function initMobileNav() {
        var toggle = document.getElementById('nav-toggle');
        var links = document.getElementById('nav-links');
        if (!toggle || !links) return;

        toggle.addEventListener('click', function () {
            toggle.classList.toggle('open');
            links.classList.toggle('open');
            document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
        });

        // Close on link click
        var navAnchors = links.querySelectorAll('a');
        navAnchors.forEach(function (a) {
            a.addEventListener('click', function () {
                toggle.classList.remove('open');
                links.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ─── Active Nav Link on Scroll ─── */
    function initActiveNav() {
        var sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        if (!sections.length || !navLinks.length) return;

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var id = entry.target.getAttribute('id');
                        navLinks.forEach(function (link) {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === '#' + id) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            },
            { threshold: 0.2, rootMargin: '-80px 0px -50% 0px' }
        );

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    /* ─── Nav Background on Scroll ─── */
    function initNavScroll() {
        var nav = document.getElementById('site-nav');
        if (!nav) return;

        var scrolled = false;

        function checkScroll() {
            var shouldBeScrolled = window.scrollY > 20;
            if (shouldBeScrolled !== scrolled) {
                scrolled = shouldBeScrolled;
                if (scrolled) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
            }
        }

        window.addEventListener('scroll', checkScroll, { passive: true });
        checkScroll();
    }

    /* ─── Smooth Scroll with Nav Offset ─── */
    function initSmoothScroll() {
        var anchors = document.querySelectorAll('a[href^="#"]');
        anchors.forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var href = this.getAttribute('href');
                if (href === '#') return;

                var target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();
                var navHeight = document.getElementById('site-nav').offsetHeight;
                var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({ top: top, behavior: 'smooth' });
            });
        });
    }

    /* ─── Init ─── */
    document.addEventListener('DOMContentLoaded', function () {
        initScrollReveal();
        initMobileNav();
        initActiveNav();
        initNavScroll();
        initSmoothScroll();
    });
})();
