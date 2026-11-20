(function () {
  'use strict';

  const header = document.getElementById('header');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('overlay');
  const themeToggle = document.getElementById('themeToggle');

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header scroll state
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  function closeMenu() {
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
  }
  mobileMenuBtn.addEventListener('click', function () {
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');
  });
  overlay.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });

  // Theme toggle (light / dark), remembered between visits
  function syncThemeIcon() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeToggle.innerHTML = dark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }
  themeToggle.addEventListener('click', function () {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncThemeIcon();
  });
  syncThemeIcon();

  // Reveal on scroll
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el, i) {
      // light stagger for siblings inside the same grid
      el.style.transitionDelay = ((i % 3) * 0.08) + 's';
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Active nav link on scroll
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = Array.from(navLinks)
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  // Client carousel
  const track = document.getElementById('clientTrack');
  const prev = document.getElementById('clientPrev');
  const next = document.getElementById('clientNext');
  const dotsWrap = document.getElementById('clientDots');
  const slides = document.querySelectorAll('.client-slide');
  let index = 0;

  slides.forEach(function (_, i) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', 'Go to client work ' + (i + 1));
    dot.addEventListener('click', function () { index = i; update(); });
    dotsWrap.appendChild(dot);
  });

  function update() {
    track.style.transform = 'translateX(-' + (index * 100) + '%)';
    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    dotsWrap.querySelectorAll('.carousel-dot').forEach(function (d, i) {
      d.classList.toggle('active', i === index);
    });
  }
  prev.addEventListener('click', function () { if (index > 0) { index--; update(); } });
  next.addEventListener('click', function () { if (index < slides.length - 1) { index++; update(); } });

  // Swipe support
  let startX = null;
  track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', function (e) {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) {
      if (dx < 0 && index < slides.length - 1) index++;
      else if (dx > 0 && index > 0) index--;
      update();
    }
    startX = null;
  }, { passive: true });

  update();
})();
