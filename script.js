// ===========================
// SCROLL PROGRESS
// ===========================
const progress = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  if (h > 0) progress.style.height = (window.scrollY / h * 100) + '%';
}, { passive: true });

// ===========================
// CUSTOM CURSOR
// ===========================
const cursor    = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });
  (function ring() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(ring);
  })();
  document.querySelectorAll('a, button, .svc-card, .gal-item, .about__card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('expanded'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('expanded'));
  });
  document.addEventListener('mouseleave', () => { cursor.classList.add('hidden'); cursorRing.classList.add('hidden'); });
  document.addEventListener('mouseenter', () => { cursor.classList.remove('hidden'); cursorRing.classList.remove('hidden'); });
}

// ===========================
// NAV SCROLL STATE
// ===========================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ===========================
// MOBILE MENU
// ===========================
const burger   = document.getElementById('burger');
const mobMenu  = document.getElementById('mobMenu');
const mobClose = document.getElementById('mobClose');

function openMob()  { mobMenu.classList.add('open'); mobMenu.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; }
function closeMob() { mobMenu.classList.remove('open'); mobMenu.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }

burger.addEventListener('click', openMob);
mobClose.addEventListener('click', closeMob);
document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', closeMob));

// ===========================
// SCROLL REVEAL (IntersectionObserver)
// ===========================
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = parseInt(el.dataset.delay) || 0;
    setTimeout(() => el.classList.add('visible'), delay);
    revealObs.unobserve(el);
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

// ===========================
// HERO ENTRANCE
// ===========================
window.addEventListener('load', () => {
  const heroEls = document.querySelectorAll('.hero [data-reveal]');
  heroEls.forEach(el => {
    const delay = parseInt(el.dataset.delay) || 0;
    setTimeout(() => el.classList.add('visible'), 400 + delay);
  });
});

// ===========================
// HERO PARALLAX
// ===========================
const glows = document.querySelectorAll('.hero__glow');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  glows.forEach((g, i) => {
    const speed = [0.25, 0.18, 0.12][i] || 0.2;
    g.style.transform = `translateY(${y * speed}px)`;
  });
}, { passive: true });

// ===========================
// PROCESS STEPS REVEAL
// ===========================
const steps = document.querySelectorAll('.step[data-step]');
const stepsFill = document.getElementById('stepsFill');

steps.forEach((step, i) => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => step.classList.add('visible'), i * 130);
        obs.unobserve(step);
      }
    });
  }, { threshold: 0.3 });
  obs.observe(step);
});

// Animate the vertical fill line as user scrolls through process section
const processSection = document.querySelector('.process');
if (processSection && stepsFill) {
  window.addEventListener('scroll', () => {
    const rect = processSection.getBoundingClientRect();
    const sectionH = processSection.offsetHeight;
    const viewH = window.innerHeight;
    const progress = Math.max(0, Math.min(1, (viewH - rect.top) / (sectionH + viewH)));
    stepsFill.style.height = (progress * 100) + '%';
  }, { passive: true });
}

// ===========================
// COUNTER ANIMATION
// ===========================
document.querySelectorAll('.stat__n[data-count]').forEach(el => {
  const target   = parseInt(el.dataset.count);
  const suffix   = el.dataset.suffix || '';
  const duration = parseInt(el.dataset.duration) || 1800;
  let started = false;

  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || started) return;
    started = true;
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    obs.unobserve(el);
  }, { threshold: 0.5 });
  obs.observe(el);
});

// ===========================
// PRICING BAR
// ===========================
const pricingFill = document.getElementById('pricingFill');
if (pricingFill) {
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      pricingFill.classList.add('animate');
      obs.unobserve(pricingFill);
    }
  }, { threshold: 0.5 });
  obs.observe(pricingFill);
}

// ===========================
// FAQ ACCORDION
// ===========================
document.querySelectorAll('.faq__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    document.querySelectorAll('.faq__q').forEach(other => {
      if (other !== btn) {
        other.setAttribute('aria-expanded', 'false');
        other.nextElementSibling.classList.remove('open');
      }
    });

    btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    answer.classList.toggle('open', !isOpen);
  });
});

// ===========================
// CONTACT FORM
// ===========================
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn');
    btn.textContent = "Thank you — we'll be in touch within 24 hours.";
    btn.style.background = 'var(--gold)';
    btn.style.color = 'var(--black)';
    btn.style.borderColor = 'var(--gold)';
    btn.disabled = true;
  });
}

// ===========================
// SMOOTH ANCHOR SCROLL
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = nav.offsetHeight;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    }
  });
});

// ===========================
// FOOTER YEAR
// ===========================
const yearEl = document.querySelector('.footer__bottom p');
if (yearEl) yearEl.textContent = yearEl.textContent.replace('2026', new Date().getFullYear());
