// === INITIALIZE ANIMATIONS ===
AOS.init({
    once: false,
    mirror: true
});

// === CAROUSEL LOGIC ===
(function () {
    const track = document.getElementById("sliderTrack");
    const slides = Array.from(track.children);
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const dots = document.querySelectorAll(".dot");
    const viewport = document.getElementById("touchArea");

    if (!track || slides.length === 0) return;

    let index = 0;
    let autoTimer = null;
    const slideCount = slides.length;

    function updateSlider(animate = true) {
        track.style.transition = animate ? "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)" : "none";
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
            dot.style.background = (i === index) ? '#FFFFFF' : '#2B8174';
        });
    }

    function next() { index = (index + 1) % slideCount; updateSlider(); }
    function prev() { index = (index - 1 + slideCount) % slideCount; updateSlider(); }
    function startAuto() { stopAuto(); autoTimer = setInterval(next, 3500); }
    function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }

    nextBtn.addEventListener("click", () => { next(); startAuto(); });
    prevBtn.addEventListener("click", () => { prev(); startAuto(); });

    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            index = Number(dot.dataset.index);
            updateSlider();
            startAuto();
        });
    });

    let startX = 0;
    let currentX = 0;
    let dragging = false;

    viewport.addEventListener("pointerdown", e => { dragging = true; startX = e.clientX; stopAuto(); viewport.setPointerCapture(e.pointerId); });
    viewport.addEventListener("pointermove", e => { if (!dragging) return; currentX = e.clientX - startX; track.style.transition = "none"; track.style.transform = `translateX(calc(-${index * 100}% + ${currentX}px))`; });
    viewport.addEventListener("pointerup", () => { dragging = false; const threshold = 60; if (currentX < -threshold) next(); else if (currentX > threshold) prev(); else updateSlider(); currentX = 0; startAuto(); });
    viewport.addEventListener("pointercancel", () => { dragging = false; updateSlider(); startAuto(); });

    updateSlider(false);
    startAuto();
})();

// === HAMBURGER MENU LOGIC ===
const openMenuBtn = document.getElementById('openMenuBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

function toggleMenu() {
    if (mobileMenu.classList.contains('translate-x-full')) {
        mobileMenu.classList.remove('translate-x-full');
    } else {
        mobileMenu.classList.add('translate-x-full');
    }
}

openMenuBtn.addEventListener('click', toggleMenu);
closeMenuBtn.addEventListener('click', toggleMenu);