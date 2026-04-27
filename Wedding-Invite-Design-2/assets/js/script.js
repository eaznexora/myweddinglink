document.addEventListener('DOMContentLoaded', () => {
    // Generate stable glitter particles immediately inside the container.
    const glitterContainer = document.getElementById('glitterContainer');
    if (glitterContainer) {
        for (let i = 0; i < 60; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 2 + 's';
            // Variable duration between 1.5s and 3s for a natural twinkling effect
            sparkle.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
            glitterContainer.appendChild(sparkle);
        }
    }

    // ============================================
    // CONTENT PROTECTION
    // Disable right-click, image drag, long-press save
    // ============================================

    // Block right-click context menu
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Block image dragging
    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG') e.preventDefault();
    });

    // Block long-press on mobile (touch hold to save image)
    document.addEventListener('touchstart', (e) => {
        if (e.target.tagName === 'IMG') {
            e.target.style.pointerEvents = 'none';
            setTimeout(() => { e.target.style.pointerEvents = ''; }, 500);
        }
    }, { passive: true });

    // Disable text selection site-wide
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
});


// ============================================
// OPEN INVITATION (Curtain Reveal)
// ============================================
function openInvitation() {
    const introScreen = document.getElementById('introScreen');
    const mainInvitation = document.querySelector('.main-invitation');

    // Prevent double-click
    if (introScreen.classList.contains('open')) return;

    // Add open class to start the curtain animation
    introScreen.classList.add('open');

    // After the curtain finishes opening, trigger hero animations
    setTimeout(() => {
        mainInvitation.classList.add('ready');

        // Trigger hero section slide-down animations
        triggerHeroAnimations();

        // Show the sticky bottom navigation
        showStickyNav();

        // Initialize scroll-based Intersection Observer
        initScrollObserver();

        // Initialize desktop scrollbar drag functionality
        initDesktopScrollbarDrag();

        // Fully remove the intro overlay after animations complete
        setTimeout(() => {
            introScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 1600);

    }, 100);
}


// ============================================
// SECTION SCALING (Pixel-perfect on all devices)
// ============================================
function scaleSections() {
    const container = document.getElementById('invitationContent');
    if (!container) return;

    const containerWidth = container.clientWidth;
    const designWidth = 428;
    const scale = Math.min(1, containerWidth / designWidth);
    const scaledWidth = designWidth * scale;
    const offsetX = (containerWidth - scaledWidth) / 2;

    // List of all sections that need fixed-canvas scaling
    const sectionsToScale = [
        { innerId: 'heroInner', sectionId: 'heroSection', designHeight: 1050 },
        { innerId: 'countdownInner', sectionId: 'countdownSection', designHeight: 300 },
        { innerId: 'mehendiInner', sectionId: 'mehendiSection', designHeight: 700 },
        { innerId: 'nikahInner', sectionId: 'nikahSection', designHeight: 920 },
        { innerId: 'receptionInner', sectionId: 'receptionSection', designHeight: 660 },
        { innerId: 'footerInner', sectionId: 'footerSection', designHeight: 1300 }
    ];

    sectionsToScale.forEach((sec) => {
        const inner = document.getElementById(sec.innerId);
        const section = document.getElementById(sec.sectionId);
        if (inner && section) {
            // Apply scale and horizontal centering offset
            inner.style.transform = `scale(${scale})`;
            inner.style.marginLeft = offsetX + 'px';

            // Set the outer section height to match the scaled content
            section.style.height = (sec.designHeight * scale) + 'px';
        }
    });
}

// Run on load and resize
window.addEventListener('resize', scaleSections);
window.addEventListener('DOMContentLoaded', scaleSections);


// ============================================
// HERO SECTION LOAD ANIMATIONS
// ============================================
function triggerHeroAnimations() {
    const heroElements = document.querySelectorAll('#heroSection .anim-hero');
    heroElements.forEach((el) => {
        // Each element has its own transition-delay set inline for staggering
        el.classList.add('visible');
    });
}


// ============================================
// STICKY BOTTOM NAVIGATION
// Show on scroll-up, hide when scroll stops
// ============================================
let navScrollTimeout = null;
let lastScrollTop = 0;
let navReady = false;

function showStickyNav() {
    const nav = document.getElementById('stickyNav');
    const scrollContainer = document.getElementById('invitationContent');
    if (!nav || !scrollContainer) return;

    // Mark nav as ready (don't show yet — wait for first scroll-up)
    setTimeout(() => {
        navReady = true;
        nav.classList.remove('pointer-events-none');
        nav.classList.add('nav-hidden');
    }, 1200);

    // Listen for scroll events on the content container
    scrollContainer.addEventListener('scroll', () => {
        if (!navReady) return;

        const currentScrollTop = scrollContainer.scrollTop;

        if (currentScrollTop < lastScrollTop) {
            // Scrolling UP — show nav
            nav.classList.remove('nav-hidden');
            nav.classList.add('nav-visible');
        } else {
            // Scrolling DOWN — hide nav
            nav.classList.remove('nav-visible');
            nav.classList.add('nav-hidden');
        }

        lastScrollTop = currentScrollTop;

        // Auto-hide after 1.5s of no scrolling
        clearTimeout(navScrollTimeout);
        navScrollTimeout = setTimeout(() => {
            nav.classList.remove('nav-visible');
            nav.classList.add('nav-hidden');
        }, 1500);

        // Update desktop scrollbar position
        updateDesktopScrollbar();
    }, { passive: true });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    const scrollContainer = document.getElementById('invitationContent');
    if (section && scrollContainer) {
        const targetTop = section.offsetTop - 20; // Small offset for breathing room
        scrollContainer.scrollTo({
            top: targetTop,
            behavior: 'smooth'
        });
    }
}


// ============================================
// INTERSECTION OBSERVER (Scroll Animations)
// ============================================
function initScrollObserver() {
    const scrollContainer = document.getElementById('invitationContent');
    if (!scrollContainer) return;

    // Elements to observe for fade-up
    const fadeUpElements = scrollContainer.querySelectorAll('.anim-fade-up');
    // Elements to observe for slide-left
    const slideLeftElements = scrollContainer.querySelectorAll('.anim-slide-left');
    // Elements to observe for slide-right
    const slideRightElements = scrollContainer.querySelectorAll('.anim-slide-right');

    const allAnimElements = [...fadeUpElements, ...slideLeftElements, ...slideRightElements];

    // Use the scroll container as the observation root
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: scrollContainer,
        rootMargin: '0px 0px -60px 0px', // Trigger slightly before element is fully in view
        threshold: 0.15
    });

    allAnimElements.forEach((el) => {
        // Don't re-observe hero elements that are already visible
        if (!el.classList.contains('visible')) {
            observer.observe(el);
        }
    });
}


// ============================================
// DESKTOP CUSTOM SCROLLBAR
// Syncs with invitation-content scroll
// ============================================
function updateDesktopScrollbar() {
    const scrollContainer = document.getElementById('invitationContent');
    const track = document.getElementById('desktopScrollTrack');
    const thumb = document.getElementById('desktopScrollThumb');
    if (!scrollContainer || !track || !thumb) return;

    const scrollHeight = scrollContainer.scrollHeight;
    const clientHeight = scrollContainer.clientHeight;
    const scrollTop = scrollContainer.scrollTop;

    // Calculate thumb height proportional to visible area
    const thumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 40);
    thumb.style.height = thumbHeight + 'px';

    // Calculate thumb position
    const maxScroll = scrollHeight - clientHeight;
    const maxThumbTop = clientHeight - thumbHeight;
    const thumbTop = maxScroll > 0 ? (scrollTop / maxScroll) * maxThumbTop : 0;
    thumb.style.top = thumbTop + 'px';

    // Show track
    track.classList.add('visible');

    // Hide after inactivity
    clearTimeout(track._hideTimeout);
    track._hideTimeout = setTimeout(() => {
        track.classList.remove('visible');
    }, 2000);
}

// Enable drag on desktop scrollbar thumb
function initDesktopScrollbarDrag() {
    const scrollContainer = document.getElementById('invitationContent');
    const track = document.getElementById('desktopScrollTrack');
    const thumb = document.getElementById('desktopScrollThumb');
    if (!scrollContainer || !track || !thumb) return;

    let isDragging = false;
    let startY = 0;
    let startScrollTop = 0;

    thumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        startY = e.clientY;
        startScrollTop = scrollContainer.scrollTop;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaY = e.clientY - startY;
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;
        const thumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 40);
        const maxThumbTop = clientHeight - thumbHeight;
        const maxScroll = scrollHeight - clientHeight;
        const scrollDelta = (deltaY / maxThumbTop) * maxScroll;
        scrollContainer.scrollTop = startScrollTop + scrollDelta;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Click on track to jump
    track.addEventListener('click', (e) => {
        if (e.target === thumb) return;
        const trackRect = track.getBoundingClientRect();
        const clickY = e.clientY - trackRect.top;
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;
        const scrollTo = (clickY / clientHeight) * scrollHeight;
        scrollContainer.scrollTo({ top: scrollTo, behavior: 'smooth' });
    });
}


// ============================================
// DAYS UNTIL NIKAH COUNTDOWN
// ============================================
function updateCountdown() {
    const nikahDate = new Date('2026-05-25T00:00:00');
    const now = new Date();
    const diffTime = nikahDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const el = document.getElementById('countdownNumber');
    if (el) {
        if (diffDays > 0) {
            el.textContent = diffDays;
        } else if (diffDays === 0) {
            el.textContent = 'Today!';
            el.style.fontSize = '50px';
        } else {
            el.textContent = '💍';
        }
    }
}

// Run countdown on load and update daily
window.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    setInterval(updateCountdown, 60000); // Update every minute
});
