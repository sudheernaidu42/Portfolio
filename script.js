/* ==============================
   SCRIPT.JS — Portfolio Interactivity
   ============================== */

// Lock to dark mode only
document.documentElement.setAttribute('data-theme', 'dark');


// ─── HAMBURGER ───────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ─── NAVBAR ACTIVE LINK ──────────────────────────
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.style.background = 'rgba(7,13,18,0.97)';
  } else {
    navbar.style.background = '';
  }
  let current = '';
  sections.forEach(sec => {
    const top    = sec.offsetTop - 90;
    const bottom = top + sec.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) current = sec.getAttribute('id');
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

// ─── TYPED TEXT EFFECT ───────────────────────────
const phrases = [
  'Computer Science Engineering Student',
  'Developer & Problem Solver',
  'Cybersecurity Enthusiast',
  'DSA Practitioner',
];
const typedEl = document.getElementById('typedText');
let phraseIdx = 0, charIdx = 0, isDeleting = false, typingPause = false;

function typeEffect() {
  if (typingPause) { setTimeout(typeEffect, 1300); typingPause = false; return; }
  const phrase = phrases[phraseIdx];
  if (!isDeleting) {
    typedEl.textContent = phrase.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === phrase.length) { isDeleting = true; typingPause = true; }
    setTimeout(typeEffect, 75);
  } else {
    typedEl.textContent = phrase.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) { isDeleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
    setTimeout(typeEffect, 40);
  }
}
typeEffect();

// ─── SCROLL ANIMATIONS (data-aos) ────────────────
document.querySelectorAll('[data-aos]').forEach((el, i) => {
  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.style.transitionDelay = `${(i % 5) * 0.07}s`;
      entry.target.classList.add('aos-animate');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }).observe(el);
});

// ─── CERTIFICATION CAROUSEL ──────────────────────
(function initCertCarousel() {
  const track   = document.getElementById('certTrack');
  const prevBtn = document.getElementById('certPrev');
  const nextBtn = document.getElementById('certNext');
  const dotsEl  = document.getElementById('certDots');

  if (!track) return;

  const slides     = Array.from(track.querySelectorAll('.cert-slide'));
  const slideCount = slides.length;
  let currentIdx   = 0;

  // ── Build dots ──────────────────────────────────
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'cert-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  const dots = Array.from(dotsEl.querySelectorAll('.cert-dot'));

  function getSlideWidth() {
    if (!slides[0]) return 0;
    return slides[0].getBoundingClientRect().width +
      parseInt(getComputedStyle(track).gap || '22', 10);
  }

  function updateDots() {
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIdx));
  }

  function updateArrows() {
    prevBtn.disabled = currentIdx === 0;
    nextBtn.disabled = currentIdx >= slideCount - 1;
  }

  function goTo(idx) {
    currentIdx = Math.max(0, Math.min(idx, slideCount - 1));
    const offset = getSlideWidth() * currentIdx;
    track.scrollTo({ left: offset, behavior: 'smooth' });
    updateDots();
    updateArrows();
  }

  prevBtn.addEventListener('click', () => goTo(currentIdx - 1));
  nextBtn.addEventListener('click', () => goTo(currentIdx + 1));

  // Sync dots when user manually scrolls
  let scrollTimer;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const sw    = getSlideWidth();
      const idx   = sw > 0 ? Math.round(track.scrollLeft / sw) : 0;
      currentIdx  = Math.max(0, Math.min(idx, slideCount - 1));
      updateDots();
      updateArrows();
    }, 80);
  }, { passive: true });

  // Keyboard support
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(currentIdx - 1);
    if (e.key === 'ArrowRight') goTo(currentIdx + 1);
  });

  // Initial state
  updateDots();
  updateArrows();
})();

// ─── CONTACT FORM ────────────────────────────────
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formNote    = document.getElementById('formNote');

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !subject || !message) {
    setFormNote('⚠️ Please fill in all fields.', '#f87171'); return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFormNote('⚠️ Please enter a valid email address.', '#f87171'); return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    setFormNote('✅ Message sent! I\'ll get back to you soon.', '#10b981');
    contactForm.reset();
    setTimeout(() => formNote.textContent = '', 5000);
  }, 1800);
});

function setFormNote(msg, color) {
  formNote.textContent = msg;
  formNote.style.color = color;
}

// ─── SMOOTH SCROLL ───────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 76, behavior: 'smooth' });
  });
});

// ─── STAT COUNTER ANIMATION ──────────────────────
document.querySelectorAll('.stat-value').forEach(el => {
  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const raw = el.textContent.trim();
      const num = parseFloat(raw);
      if (isNaN(num)) return;
      const suffix = raw.replace(String(num), '');
      let cur = 0;
      const step = 16;
      const inc  = num / (1200 / step);
      const timer = setInterval(() => {
        cur = Math.min(cur + inc, num);
        el.textContent = (Number.isInteger(num) ? Math.round(cur) : cur.toFixed(2)) + suffix;
        if (cur >= num) clearInterval(timer);
      }, step);
    });
  }, { threshold: 0.5 }).observe(el);
});
