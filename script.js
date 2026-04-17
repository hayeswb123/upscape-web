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
// SPINNING GLOBE
// ===========================
(function () {
  const canvas = document.getElementById('globeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = window.devicePixelRatio || 1;
  const SIZE = 700;
  canvas.width  = SIZE * DPR;
  canvas.height = SIZE * DPR;
  ctx.scale(DPR, DPR);

  const cx = SIZE / 2, cy = SIZE / 2, R = SIZE / 2 - 20;
  let rot = 0;

  const GOLD      = 'rgba(184,154,88,';
  const GOLD_LITE = 'rgba(212,184,122,';

  function project(lat, lng, r) {
    const phi   = (90 - lat) * Math.PI / 180;
    const theta = (lng + rot) * Math.PI / 180;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.cos(phi);
    const z = r * Math.sin(phi) * Math.sin(theta);
    return { x: cx + x, y: cy - y, z };
  }

  function drawLine(pts, alpha) {
    if (pts.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.strokeStyle = GOLD + alpha + ')';
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }

  function frame() {
    ctx.clearRect(0, 0, SIZE, SIZE);

    // globe glow halo
    const grd = ctx.createRadialGradient(cx, cy, R * 0.5, cx, cy, R * 1.1);
    grd.addColorStop(0, GOLD_LITE + '0.08)');
    grd.addColorStop(1, GOLD_LITE + '0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.1, 0, Math.PI * 2);
    ctx.fill();

    // latitude lines
    for (let lat = -75; lat <= 75; lat += 15) {
      const pts = [];
      for (let lng = 0; lng <= 360; lng += 4) {
        const p = project(lat, lng, R);
        if (p.z >= 0) pts.push(p);
        else {
          if (pts.length > 1) drawLine(pts, 0.28);
          pts.length = 0;
        }
      }
      if (pts.length > 1) drawLine(pts, 0.28);
    }

    // longitude lines
    for (let lng = 0; lng < 360; lng += 20) {
      const pts = [];
      for (let lat = -90; lat <= 90; lat += 3) {
        const p = project(lat, lng, R);
        if (p.z >= 0) pts.push(p);
        else {
          if (pts.length > 1) drawLine(pts, 0.22);
          pts.length = 0;
        }
      }
      if (pts.length > 1) drawLine(pts, 0.22);
    }

    // equator accent
    const eqPts = [];
    for (let lng = 0; lng <= 360; lng += 2) {
      const p = project(0, lng, R);
      if (p.z >= 0) eqPts.push(p);
      else {
        if (eqPts.length > 1) {
          ctx.beginPath();
          ctx.moveTo(eqPts[0].x, eqPts[0].y);
          eqPts.forEach(pt => ctx.lineTo(pt.x, pt.y));
          ctx.strokeStyle = GOLD_LITE + '0.55)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        eqPts.length = 0;
      }
    }

    // sphere edge ring
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = GOLD + '0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();

    rot += 0.12;
    requestAnimationFrame(frame);
  }

  frame();
})();

// ===========================
// HERO SCROLL FADE
// ===========================
const heroOverlay = document.querySelector('.hero .hero__overlay');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (heroOverlay) heroOverlay.style.opacity = String(Math.min(1, y / window.innerHeight * 1.2));
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
