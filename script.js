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

  const COUNT = 80;
  const particles = Array.from({ length: COUNT }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.6 + 0.4,
    rot: Math.random() * Math.PI,
    speed: Math.random() * 0.3 + 0.06,
    drift: (Math.random() - 0.5) * 0.25,
    alpha: Math.random() * 0.4 + 0.08,
    fade: Math.random() * 0.006 + 0.002,
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
      p.rot += 0.003;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = `rgba(184,154,88,${p.alpha})`;
      ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
      ctx.restore();
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
// HERO FLOATING ORB CONSTELLATION
// ===========================
(function () {
  const canvas = document.getElementById('lightsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth  * (window.devicePixelRatio || 1);
    canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const W = () => canvas.offsetWidth;
  const H = () => canvas.offsetHeight;

  // Orbs: large, slow-drifting glowing spheres with bokeh blur
  const orbs = Array.from({ length: 12 }, (_, i) => {
    const seed = i * 137.5;
    return {
      xFrac: Math.sin(seed * 0.1) * 0.4 + 0.5,
      yFrac: Math.sin(seed * 0.2) * 0.25 + 0.2,
      r: 80 + Math.sin(seed * 0.05) * 60,
      vx: (Math.sin(seed * 0.15) * 0.00008),
      vy: (Math.cos(seed * 0.18) * 0.00006),
      phase: Math.random() * Math.PI * 2,
      speed: 0.0003 + Math.random() * 0.0002,
      color: [
        200 + Math.sin(seed * 0.3) * 18,
        145 + Math.cos(seed * 0.25) * 18,
        55  + Math.sin(seed * 0.35) * 18,
      ],
      alpha: 0.16 + Math.sin(seed * 0.1) * 0.08,
    };
  });

  let t = 0;

  function drawOrb(orb, w, h) {
    // Position: slow drift + subtle oscillation
    const x = orb.xFrac * w + Math.sin(t * 0.0002) * 40;
    const y = orb.yFrac * h + Math.sin(t * orb.speed + orb.phase) * 50;

    const [r, g, b] = orb.color;
    const pulse = 0.7 + 0.3 * Math.sin(t * 0.0004 + orb.phase);

    // Multiple bokeh layers for that blurred, overlapping effect
    for (let layer = 0; layer < 4; layer++) {
      const layerR = orb.r * (1 + layer * 1.5);
      const layerAlpha = Math.min(0.25, orb.alpha * pulse * Math.pow(0.7 - layer * 0.15, 1.4));

      const grad = ctx.createRadialGradient(x, y, 0, x, y, layerR);
      grad.addColorStop(0,   `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${layerAlpha * 1.5})`);
      grad.addColorStop(0.4, `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${layerAlpha * 0.6})`);
      grad.addColorStop(1,   `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, layerR, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function frame(ts) {
    t = ts;
    const w = W(), h = H();
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'screen';

    orbs.forEach(orb => drawOrb(orb, w, h));

    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();

// ===========================
// HERO SCROLL ZOOM + LIGHTS ON
// ===========================
(function () {
  const track    = document.getElementById('heroTrack');
  const hero     = document.getElementById('hero');
  const imgOff   = document.querySelector('.hero__lights-off');
  const imgOn    = document.querySelector('.hero__lights-on');
  const content  = document.querySelector('.hero__content');
  const hint     = document.querySelector('.hero__scroll-hint');
  if (!hero || !imgOff || !imgOn) return;

  window.addEventListener('scroll', () => {
    const y      = window.scrollY;
    const trackH = (track ? track.offsetHeight : hero.offsetHeight * 3.5) - hero.offsetHeight;
    const p      = Math.min(y / trackH, 1); // 0 → 1 across the pinned scroll

    // Both images zoom together: 1× → 2.6×
    const scale = 1 + p * 1.6;
    imgOff.style.transform = `scale(${scale})`;
    imgOn.style.transform  = `scale(${scale})`;

    // Lights fade in during 20%–65% of scroll — fade off out, fade on in
    const lightsP = Math.min(Math.max((p - 0.2) / 0.45, 0), 1);
    imgOff.style.opacity = String(1 - lightsP);
    imgOn.style.opacity  = String(lightsP);

    // Content fades out in first 25%
    const cp = Math.min(p / 0.25, 1);
    if (content) {
      content.style.opacity   = String(Math.max(0, 1 - cp));
      content.style.transform = `translateY(${-cp * 40}px)`;
    }
    if (hint) hint.style.opacity = String(Math.max(0, 1 - cp * 4));
  }, { passive: true });
})();

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

// ===========================
// MOUSE-FOLLOWING HALO (Hero only)
// ===========================
(function () {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'haloCanvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '1';
  document.body.append(canvas);

  const ctx = canvas.getContext('2d');
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let t = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function isInHero() {
    return window.scrollY < hero.offsetHeight;
  }

  function frame(ts) {
    t = ts;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isInHero()) {
      ctx.globalCompositeOperation = 'screen';

      const r1 = 120 + Math.sin(t * 0.0006) * 20;
      const grad1 = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, r1);
      grad1.addColorStop(0,   'rgba(200,220,240,0.08)');
      grad1.addColorStop(0.5, 'rgba(150,190,230,0.04)');
      grad1.addColorStop(1,   'rgba(150,190,230,0)');
      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, r1, 0, Math.PI * 2);
      ctx.fill();

      const r2 = 200 + Math.sin(t * 0.0004) * 30;
      const grad2 = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, r2);
      grad2.addColorStop(0,   'rgba(180,200,220,0)');
      grad2.addColorStop(0.7, 'rgba(180,200,220,0.02)');
      grad2.addColorStop(1,   'rgba(180,200,220,0)');
      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, r2, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = 'source-over';
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();

// ===========================
// BEFORE / AFTER SLIDER
// ===========================
(function () {
  const slider = document.getElementById('baSlider');
  const before = document.getElementById('baBefore');
  const handle = document.getElementById('baHandle');
  if (!slider || !before || !handle) return;

  let pct = 50;
  let dragging = false;

  function setPosition(x) {
    const rect = slider.getBoundingClientRect();
    pct = Math.min(Math.max(((x - rect.left) / rect.width) * 100, 2), 98);
    before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = pct + '%';
  }

  slider.addEventListener('mousedown', e => { dragging = true; setPosition(e.clientX); });
  window.addEventListener('mousemove', e => { if (dragging) setPosition(e.clientX); });
  window.addEventListener('mouseup', () => { dragging = false; });

  slider.addEventListener('touchstart', e => { dragging = true; setPosition(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove', e => { if (dragging) setPosition(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend', () => { dragging = false; });
})();

// ===========================
// SPOTLIGHT CURSOR
// ===========================
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const el = document.getElementById('spotlight');
  if (!el) return;

  let tx = window.innerWidth / 2;
  let ty = window.innerHeight / 2;
  let cx = tx, cy = ty;
  let active = false;

  document.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
    if (!active) { active = true; el.classList.add('active'); }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    active = false;
    el.classList.remove('active');
  });

  function tick() {
    cx += (tx - cx) * 0.09;
    cy += (ty - cy) * 0.09;
    el.style.background = `radial-gradient(
      circle 420px at ${cx.toFixed(1)}px ${cy.toFixed(1)}px,
      rgba(184,154,88,0.07) 0%,
      rgba(184,154,88,0.02) 28%,
      transparent 55%,
      rgba(0,0,0,0.38) 100%
    )`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();


// ===========================
// MAGNETIC BUTTONS
// ===========================
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const STRENGTH = 0.38;
  const RADIUS   = 130;

  document.querySelectorAll('.btn, .nav__cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS) {
        const pull = (1 - dist / RADIUS) * STRENGTH;
        btn.style.transform = `translate(${dx * pull}px, ${dy * pull}px) scale(1.04)`;
        btn.classList.remove('mag-reset');
      }
    });

    btn.addEventListener('mouseleave', () => {
      btn.classList.add('mag-reset');
      btn.style.transform = '';
      setTimeout(() => btn.classList.remove('mag-reset'), 600);
    });
  });
})();

// ===========================
// WORD-BY-WORD ANIMATION
// ===========================
(function () {
  document.querySelectorAll('.animate-words').forEach(el => {
    // Split each text node into word spans, preserve <br> tags
    const rawHtml = el.innerHTML;
    const lines = rawHtml.split(/<br\s*\/?>/i);
    el.innerHTML = lines.map(line =>
      line.trim().split(/\s+/).filter(Boolean).map(w =>
        `<span class="word">${w}</span>`
      ).join(' ')
    ).join('<br>');

    const words = el.querySelectorAll('.word');
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      // Already revealed by parent reveal observer — just stagger the words
      words.forEach((w, i) => {
        setTimeout(() => {
          w.style.transitionDelay = `${i * 55}ms`;
        }, 0);
      });
      obs.unobserve(el);
    }, { threshold: 0.2 });
    obs.observe(el);
  });
})();

// ===========================
// STAGGER CHILDREN OBSERVER
// ===========================
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.stagger-children, .reveal-scale, .reveal-blur, .reveal-rotate').forEach(el => {
    obs.observe(el);
  });
})();

// ===========================
// BUTTON RIPPLE ON CLICK
// ===========================
(function () {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 1.8;
      ripple.style.cssText = `
        position:absolute;
        border-radius:50%;
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
        background:rgba(255,255,255,0.18);
        pointer-events:none;
        transform:scale(0);
        animation:ripple-out 0.55s var(--ease) forwards;
        z-index:0;
      `;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
})();

// ===========================
// SCROLL ZOOM PANELS
// ===========================
(function () {
  const panels = document.querySelectorAll('[data-zoom]');
  if (!panels.length) return;

  const SCALE_MAX = 1.08;
  const SCALE_MIN = 1.0;

  // Each panel tracks its own lerped scale
  const state = Array.from(panels).map(panel => ({
    el: panel.querySelector('.parallax-strip__bg'),
    current: SCALE_MAX,
    target: SCALE_MAX,
  }));

  function getProgress(panel) {
    const rect = panel.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 when top of panel hits bottom of viewport, 1 when bottom hits top
    const raw = (vh - rect.top) / (vh + rect.height);
    return Math.max(0, Math.min(1, raw));
  }

  function tick() {
    state.forEach(({ el, current }, i) => {
      const panel = panels[i];
      const progress = getProgress(panel);
      // Peak zoom (1.0) at center (progress ~0.5), max zoom at edges
      const distFromCenter = Math.abs(progress - 0.5) * 2; // 0 at center, 1 at edges
      state[i].target = SCALE_MIN + (SCALE_MAX - SCALE_MIN) * distFromCenter;

      // Lerp for buttery smoothness
      state[i].current += (state[i].target - state[i].current) * 0.06;

      if (el) el.style.transform = `scale(${state[i].current.toFixed(4)})`;
    });
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();

// ===========================
// GALLERY FILTERS
// ===========================
(function () {
  const filterBtns = document.querySelectorAll('.gal-filter');
  const galCards   = document.querySelectorAll('.gal-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      galCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
        if (filter === 'all') {
          if (card.dataset.featured) card.classList.add('gal-card--featured');
        } else {
          card.classList.remove('gal-card--featured');
        }
      });
    });
  });
})();

// ===========================
// LIGHTBOX
// ===========================
(function () {
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  const lbImg     = document.getElementById('lbImg');
  const lbTag     = document.getElementById('lbTag');
  const lbTitle   = document.getElementById('lbTitle');
  const lbCounter = document.getElementById('lbCounter');
  const lbClose   = document.getElementById('lbClose');
  const lbPrev    = document.getElementById('lbPrev');
  const lbNext    = document.getElementById('lbNext');

  const cards = Array.from(document.querySelectorAll('.gal-card[data-img]'));
  let current = 0;

  function visibleCards() {
    return cards.filter(c => c.style.display !== 'none');
  }

  function open(idx) {
    const visible = visibleCards();
    current = idx;
    const card = visible[current];
    lbImg.classList.add('loading');
    lbImg.onload = () => lbImg.classList.remove('loading');
    lbImg.src   = card.dataset.img;
    lbImg.alt   = card.dataset.tag || '';
    lbTag.textContent   = card.dataset.tag   || '';
    lbTitle.textContent = card.dataset.title || '';
    lbCounter.textContent = `${current + 1} / ${visible.length}`;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function prev() {
    const visible = visibleCards();
    open((current - 1 + visible.length) % visible.length);
  }

  function next() {
    const visible = visibleCards();
    open((current + 1) % visible.length);
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const visible = visibleCards();
      open(visible.indexOf(card));
    });
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });
})();

// ===========================
// CUSTOM CURSOR
// ===========================
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch

  const cursor = document.createElement('div');
  cursor.className = 'c-cursor';
  document.body.append(cursor);

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    cursor.classList.add('ready');
  }, { passive: true });

  document.addEventListener('mouseleave', () => cursor.classList.remove('ready'));

  document.querySelectorAll('a, button, .gal-card, .faq__q').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });
})();
