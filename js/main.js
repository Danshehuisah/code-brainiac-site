/* ============================================
   CODE BRAINIAC - MAIN JAVASCRIPT
============================================ */

(function() {
    'use strict';

    // ============================================
    // DOM READY
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        initNavbar();
        initMobileMenu();
        initSmoothScroll();
        initScrollAnimations();
        initBackToTop();
        initTestimonialCarousel();
        initActiveNavLink();
        setCurrentYear();
    });

    // ============================================
    // NAVBAR - STICKY & SCROLL EFFECT
    // ============================================
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Trigger once on load
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        }
    }

    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    function initMobileMenu() {
        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.getElementById('navMenu');
        if (!mobileToggle || !navMenu) return;

        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !mobileToggle.contains(e.target)) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ============================================
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.fade-in-up');
        if (!elements.length) return;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(function(el) {
            observer.observe(el);
        });
    }

    // ============================================
    // BACK TO TOP BUTTON
    // ============================================
    function initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;

        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // TESTIMONIAL CAROUSEL
    // ============================================
    function initTestimonialCarousel() {
        const track = document.getElementById('testimonialsTrack');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const dotsContainer = document.getElementById('carouselDots');

        if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

        const cards = track.querySelectorAll('.testimonial-card');
        if (!cards.length) return;

        let currentIndex = 0;
        let autoSlideInterval;
        let cardsPerView = getCardsPerView();

        function getCardsPerView() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 992) return 2;
            return 3;
        }

        function getTotalPages() {
            return Math.ceil(cards.length / cardsPerView);
        }

        function updateCarousel() {
            const cardWidth = cards[0].offsetWidth;
            const gap = 24;
            const offset = -(cardWidth + gap) * currentIndex;
            track.style.transform = `translateX(${offset}px)`;
            updateDots();
        }

        function updateDots() {
            dotsContainer.innerHTML = '';
            const totalPages = getTotalPages();
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', function() {
                    currentIndex = i;
                    updateCarousel();
                    resetAutoSlide();
                });
                dotsContainer.appendChild(dot);
            }
        }

        function nextSlide() {
            const totalPages = getTotalPages();
            currentIndex = (currentIndex + 1) % totalPages;
            updateCarousel();
        }

        function prevSlide() {
            const totalPages = getTotalPages();
            currentIndex = (currentIndex - 1 + totalPages) % totalPages;
            updateCarousel();
        }

        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        prevBtn.addEventListener('click', function() {
            prevSlide();
            resetAutoSlide();
        });

        nextBtn.addEventListener('click', function() {
            nextSlide();
            resetAutoSlide();
        });

        // Pause on hover
        track.addEventListener('mouseenter', function() {
            clearInterval(autoSlideInterval);
        });

        track.addEventListener('mouseleave', function() {
            startAutoSlide();
        });

        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                const newCardsPerView = getCardsPerView();
                if (newCardsPerView !== cardsPerView) {
                    cardsPerView = newCardsPerView;
                    currentIndex = 0;
                    updateCarousel();
                }
            }, 200);
        });

        // Initialize
        updateCarousel();
        startAutoSlide();
    }

    // ============================================
    // ACTIVE NAV LINK ON SCROLL
    // ============================================
    function initActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        if (!sections.length || !navLinks.length) return;

        window.addEventListener('scroll', function() {
            let current = '';
            const scrollPosition = window.scrollY + 100;

            sections.forEach(function(section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(function(link) {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // ============================================
    // CURRENT YEAR IN FOOTER
    // ============================================
    function setCurrentYear() {
        const yearElement = document.getElementById('year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // ============================================
    // SEARCH BUTTON (Placeholder)
    // ============================================
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            alert('Search functionality coming soon!');
        });
    }

})();