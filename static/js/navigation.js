export function initNavigation() {
    const nav = document.querySelector('.site-nav');
    const toggle = document.querySelector('.nav-hamburger');
    const links = document.querySelector('.nav-links');
    const linkItems = document.querySelectorAll('.nav-links a');

    // Scroll state for translucent background strength
    if (nav) {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                nav.classList.add('is-scrolled');
            } else {
                nav.classList.remove('is-scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // Mobile menu toggle
    if (toggle && links) {
        const toggleMenu = () => {
            const isOpen = toggle.classList.toggle('is-open');
            links.classList.toggle('is-open');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        };

        toggle.addEventListener('click', toggleMenu);

        // Close on link click
        linkItems.forEach(link => {
            link.addEventListener('click', () => {
                if (toggle.classList.contains('is-open')) {
                    toggleMenu();
                }
            });
        });
    }

    // Smooth scroll offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offset = 80; // approximate nav height
                const position = targetElement.getBoundingClientRect().top + window.scrollY - offset;
                
                window.scrollTo({
                    top: position,
                    behavior: 'smooth'
                });
            }
        });
    });
}
