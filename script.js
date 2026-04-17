// ===========================
// NAV SCROLL STATE
// ===========================
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ===========================
// MOBILE MENU
// ===========================
const burger  = document.getElementById('burger');
const mob     = document.getElementById('mob');
const mobClose = document.getElementById('mobClose');

function openMob()  { mob.classList.add('open'); mob.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; }
function closeMob() { mob.classList.remove('open'); mob.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; }

if (burger)   burger.addEventListener('click', openMob);
if (mobClose) mobClose.addEventListener('click', closeMob);
document.querySelectorAll('.mob__link').forEach(l => l.addEventListener('click', closeMob));

// ===========================
// SCROLL REVEAL
// ===========================
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = parseInt(el.dataset.delay) || 0;
    setTimeout(() => el.classList.add('visible'), delay);
    revealObs.unobserve(el);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ===========================
// HERO ENTRANCE
// ===========================
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal, .hero .reveal-clip').forEach(el => {
    const delay = parseInt(el.dataset.delay) || 0;
    setTimeout(() => el.classList.add('visible'), 400 + delay);
  });
});

// ===========================
// HERO PARALLAX
// ===========================
const layerFar  = document.querySelector('.hero__layer--far');
const layerMid  = document.querySelector('.hero__layer--mid');
const layerNear = document.querySelector('.hero__layer--near');
const heroOverlay = document.querySelector('.hero .hero__overlay');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (layerFar)  layerFar.style.transform  = `translateY(${y * 0.15}px)`;
  if (layerMid)  layerMid.style.transform  = `translateY(${y * 0.3}px)`;
  if (layerNear) layerNear.style.transform = `translateY(${y * 0.5}px)`;
  if (heroOverlay) heroOverlay.style.opacity = 1 - (y / window.innerHeight) * 0.6;
}, { passive: true });

// ===========================
// PROCESS FILL SLIDER
// ===========================
const stepsEl   = document.getElementById('steps');
const stepsFill = document.getElementById('stepsFill');

if (stepsEl && stepsFill) {
  window.addEventListener('scroll', () => {
    const rect    = stepsEl.getBoundingClientRect();
    const sectionH = stepsEl.offsetHeight;
    const viewH   = window.innerHeight;
    const raw = (viewH * 0.55 - rect.top) / sectionH;
    const p   = Math.max(0, Math.min(1, raw));
    stepsFill.style.height = (p * 100) + '%';
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
        const otherAnswer = other.nextElementSibling;
        if (otherAnswer) otherAnswer.classList.remove('open');
      }
    });

    btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    if (answer) answer.classList.toggle('open', !isOpen);
  });
});

// ===========================
// CONTACT FORM
// ===========================
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = "Thank you, we'll be in touch within 24 hours.";
    btn.style.background = 'var(--gold)';
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
      const offset = nav ? nav.offsetHeight : 0;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    }
  });
});

// ===========================
// FOOTER YEAR
// ===========================
const yearEl = document.querySelector('.footer__bottom p');
if (yearEl) yearEl.textContent = yearEl.textContent.replace('2026', new Date().getFullYear());
