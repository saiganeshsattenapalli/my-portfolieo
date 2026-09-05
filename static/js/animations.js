export function initAnimations() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = document.querySelectorAll('.reveal');

    if (prefersReducedMotion) {
        elements.forEach(el => el.classList.add('is-visible'));
        return;
    }

    // Hero elements reveal immediately
    const heroElements = document.querySelectorAll('#hero .reveal');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('is-visible');
        }, 50 + (index * 100)); // Staggered reveal
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => {
        if (!el.closest('#hero')) {
            observer.observe(el);
        }
    });
}
