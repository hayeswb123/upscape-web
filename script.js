// ===========================
// SCROLL PROGRESS BAR
// ===========================
(function () {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / max * 100) + '%';
  }, { passive: true });
})();

// ===========================
// AMBIENT GOLD PARTICLES
// ===========================
(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const COUNT = 55;
  const particles = Array.from({ length: COUNT }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.4 + 0.3,
    speed: Math.random() * 0.35 + 0.08,
    drift: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.45 + 0.1,
    fade: Math.random() * 0.008 + 0.002,
    dir: 1,
  }));

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y -= p.speed;
      p.x += p.drift;
      p.alpha += p.fade * p.dir;
      if (p.alpha > 0.55 || p.alpha < 0.05) p.dir *= -1;
      if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(184,154,88,${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  tick();
})();

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
// HERO PARALLAX
// ===========================
const lightsCanvas = document.getElementById('lightsCanvas');
window.addEventListener('scroll', () => {
  if (!lightsCanvas) return;
  lightsCanvas.style.transform = `translateY(${window.scrollY * 0.18}px)`;
}, { passive: true });

// ===========================
// DIRECTIONAL REVEALS
// ===========================
const dirObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = parseInt(el.dataset.delay) || 0;
    setTimeout(() => el.classList.add('visible'), delay);
    dirObs.unobserve(el);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal-left, .reveal-right').forEach(el => dirObs.observe(el));

// ===========================
// WORD SPLIT HEADINGS
// ===========================
(function () {
  document.querySelectorAll('.sec-title').forEach(heading => {
    const rawHtml = heading.innerHTML;
    const lines = rawHtml.split(/<br\s*\/?>/i);
    const wrapped = lines.map(line =>
      line.trim().split(/\s+/).filter(Boolean).map(w =>
        `<span class="split-word">${w}</span>`
      ).join(' ')
    ).join('<br>');
    heading.innerHTML = wrapped;
    heading.style.perspective = '400px';

    const words = heading.querySelectorAll('.split-word');
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      words.forEach((w, i) => {
        setTimeout(() => w.classList.add('visible'), i * 70);
      });
      obs.unobserve(heading);
    }, { threshold: 0.3 });
    obs.observe(heading);
  });
})();

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
// HERO SPOTLIGHT BEAMS
// ===========================
(function () {
  const canvas = document.getElementById('lightsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth  * (window.devicePixelRatio || 1);
    canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }
  resize();
  window.addEventListener('resize', () => { ctx.setTransform(1,0,0,1,0,0); resize(); }, { passive: true });

  const W = () => canvas.offsetWidth;
  const H = () => canvas.offsetHeight;

  const beams = [
    { ox: 0.18, speed: 0.00035, phase: 0,    spread: 0.18, alpha: 0.13, width: 220 },
    { ox: 0.38, speed: 0.00028, phase: 1.4,  spread: 0.14, alpha: 0.10, width: 180 },
    { ox: 0.55, speed: 0.00042, phase: 2.8,  spread: 0.20, alpha: 0.15, width: 260 },
    { ox: 0.72, speed: 0.00031, phase: 0.9,  spread: 0.13, alpha: 0.09, width: 160 },
    { ox: 0.88, speed: 0.00038, phase: 2.1,  spread: 0.16, alpha: 0.11, width: 200 },
  ];

  const orbs = Array.from({ length: 6 }, (_, i) => ({
    x: (0.15 + i * 0.15) * 800,
    y: 200 + Math.random() * 400,
    r: 60 + Math.random() * 80,
    phase: Math.random() * Math.PI * 2,
    speed: 0.0004 + Math.random() * 0.0003,
    alpha: 0.04 + Math.random() * 0.04,
  }));

  let t = 0;

  function drawBeam(beam, w, h) {
    const angle = Math.sin(t * beam.speed + beam.phase) * beam.spread;
    const ox = beam.ox * w;
    const oy = -30;

    const dx = Math.sin(angle);
    const dy = Math.cos(angle);

    const len = h * 1.4;
    const tx = ox + dx * len;
    const ty = oy + dy * len;

    const px = -dy * beam.width * 0.5;
    const py =  dx * beam.width * 0.5;

    const grad = ctx.createLinearGradient(ox, oy, tx, ty);
    grad.addColorStop(0,   `rgba(212,184,122,${beam.alpha * 1.8})`);
    grad.addColorStop(0.3, `rgba(184,154,88,${beam.alpha})`);
    grad.addColorStop(1,   `rgba(184,154,88,0)`);

    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(tx + px, ty + py);
    ctx.lineTo(tx - px, ty - py);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }

  function frame(ts) {
    t = ts;
    const w = W(), h = H();
    ctx.clearRect(0, 0, w, h);

    ctx.globalCompositeOperation = 'screen';

    orbs.forEach(orb => {
      const wobbleX = orb.x + Math.sin(t * orb.speed + orb.phase) * 40;
      const wobbleY = orb.y + Math.cos(t * orb.speed * 0.7 + orb.phase) * 25;
      const g = ctx.createRadialGradient(wobbleX, wobbleY, 0, wobbleX, wobbleY, orb.r);
      g.addColorStop(0, `rgba(212,184,122,${orb.alpha * 2})`);
      g.addColorStop(1, `rgba(184,154,88,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(wobbleX, wobbleY, orb.r, 0, Math.PI * 2);
      ctx.fill();
    });

    beams.forEach(b => drawBeam(b, w, h));

    ctx.globalCompositeOperation = 'source-over';

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
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

// ===========================
// HORIZONTAL SCROLL SECTION
// ===========================
(function () {
  const section = document.querySelector('.hscroll');
  const track   = document.getElementById('hscrollTrack');
  const dots    = document.querySelectorAll('.hscroll__dot');
  const hint    = document.querySelector('.hscroll__hint');
  const panels  = document.querySelectorAll('.hscroll__panel');
  if (!section || !track) return;

  const PANEL_COUNT = panels.length;

  function update() {
    const rect    = section.getBoundingClientRect();
    const sectionH = section.offsetHeight;
    const viewH   = window.innerHeight;

    const raw = -rect.top / (sectionH - viewH);
    const p   = Math.max(0, Math.min(1, raw));

    const maxShift = track.scrollWidth - window.innerWidth;
    track.style.transform = `translateX(${-p * maxShift}px)`;

    const idx = Math.min(Math.floor(p * PANEL_COUNT + 0.15), PANEL_COUNT - 1);

    panels.forEach((panel, i) => panel.classList.toggle('active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));

    if (hint) hint.style.opacity = p > 0.05 ? '0' : '1';
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();
