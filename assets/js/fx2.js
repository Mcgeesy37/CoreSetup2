/* ============================================================
   CoreSetup Studio — fx.js v2
   Enhanced animations & interactions
   ============================================================ */

(function () {
  'use strict';

  /* ── Cursor glow ─────────────────────────────────────────── */
  const cursor = document.querySelector('.cursor-glow');
  if (cursor && window.matchMedia('(pointer:fine)').matches) {
    let cx = -9999, cy = -9999;
    let tx = -9999, ty = -9999;

    document.addEventListener('mousemove', e => {
      tx = e.clientX;
      ty = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      tx = -9999; ty = -9999;
    });

    (function lerp() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
      requestAnimationFrame(lerp);
    })();
  }

  /* ── Spotlight on bg ─────────────────────────────────────── */
  const spotlight = document.querySelector('.bg-spotlight');
  if (spotlight) {
    document.addEventListener('mousemove', e => {
      const px = (e.clientX / window.innerWidth  * 100).toFixed(2);
      const py = (e.clientY / window.innerHeight * 100).toFixed(2);
      spotlight.style.setProperty('--sx', px + '%');
      spotlight.style.setProperty('--sy', py + '%');
    });
  }

  /* ── Scroll progress bar ─────────────────────────────────── */
  const progressBar = document.querySelector('.scroll-progress span');
  if (progressBar) {
    const updateProgress = () => {
      const max  = document.documentElement.scrollHeight - window.innerHeight;
      const pct  = max > 0 ? (window.scrollY / max * 100).toFixed(2) : 0;
      progressBar.style.width = pct + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ── Header scroll class ─────────────────────────────────── */
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 48);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Reveal on scroll ────────────────────────────────────── */
  const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
  if (revealEls.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ── Nav toggle (mobile) ─────────────────────────────────── */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
    });

    // close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // close on outside click
    document.addEventListener('click', e => {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Smooth scroll for anchor links ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Tilt effect on cards (desktop only) ────────────────── */
  if (window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.card, .price-card, .review-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `translateY(-5px) perspective(600px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ── Star particles in orb wrap ─────────────────────────── */
  const starsEl = document.querySelector('.stars');
  if (starsEl) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 400 400');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.style.cssText = 'width:100%;height:100%;position:absolute;inset:0;';

    for (let i = 0; i < 48; i++) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const x = Math.random() * 400;
      const y = Math.random() * 400;
      const r = Math.random() * 1.5 + 0.4;
      const delay = (Math.random() * 4).toFixed(2);
      const dur   = (2 + Math.random() * 3).toFixed(2);
      circle.setAttribute('cx', x.toFixed(1));
      circle.setAttribute('cy', y.toFixed(1));
      circle.setAttribute('r', r.toFixed(2));
      circle.setAttribute('fill', 'rgba(226,197,137,0.85)');
      circle.style.cssText = `animation: starTwinkle ${dur}s ease-in-out ${delay}s infinite`;
      svg.appendChild(circle);
    }
    starsEl.appendChild(svg);

    // inject keyframes once
    if (!document.getElementById('star-kf')) {
      const style = document.createElement('style');
      style.id = 'star-kf';
      style.textContent = `
        @keyframes starTwinkle {
          0%,100%{ opacity:.15; r:0.4 }
          50%    { opacity:1;   r:1.6 }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /* ── Modal for project images ────────────────────────────── */
  const modal        = document.querySelector('.modal');
  const modalClose   = document.querySelector('.modal-close');
  const modalBackdrop = document.querySelector('.modal-backdrop');
  const modalTitle   = document.querySelector('.modal-head strong');
  const modalSub     = document.querySelector('.modal-head small');
  const modalImg     = document.querySelector('.modal-body img');

  document.querySelectorAll('.project').forEach(project => {
    project.addEventListener('click', () => {
      if (!modal) return;
      const img    = project.querySelector('img');
      const title  = project.querySelector('.project-overlay strong');
      const sub    = project.querySelector('.project-overlay span');
      if (modalImg   && img)   modalImg.src          = img.src;
      if (modalTitle && title) modalTitle.textContent = title.textContent;
      if (modalSub   && sub)   modalSub.textContent   = sub.textContent;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };
  if (modalClose)   modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal() });

  /* ── Orb 3-D mouse parallax ─────────────────────────────── */
  const orbWrap = document.querySelector('.orb-wrap');
  const orb     = document.querySelector('.orb');
  if (orbWrap && orb && window.matchMedia('(pointer:fine)').matches) {
    orbWrap.addEventListener('mousemove', e => {
      const r  = orbWrap.getBoundingClientRect();
      const x  = ((e.clientX - r.left)  / r.width  - 0.5) * 2;
      const y  = ((e.clientY - r.top)   / r.height - 0.5) * 2;
      orb.style.transform = `translateY(0) rotate(0deg) perspective(600px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
    });
    orbWrap.addEventListener('mouseleave', () => {
      orb.style.transform = '';
    });
  }

  /* ── Count-up numbers ────────────────────────────────────── */
  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur    = parseInt(el.dataset.dur) || 1400;
    const start  = performance.now();

    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      // ease out expo
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      const val = eased * target;
      el.textContent = (Number.isInteger(target) ? Math.floor(val) : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const countEls = document.querySelectorAll('[data-count]');
  if (countEls.length) {
    const countObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    countEls.forEach(el => countObserver.observe(el));
  }

  /* ── Active nav link highlight ───────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href*="#"]');
  if (sections.length && navAnchors.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href').endsWith('#' + entry.target.id));
          });
        }
      });
    }, { threshold: 0.35 });
    sections.forEach(s => sectionObserver.observe(s));
  }

  /* ── Glassmorphism card shimmer on hover ─────────────────── */
  document.querySelectorAll('.hero-glass-card, .mini, .hosting-box').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      el.style.setProperty('--mx', x + '%');
      el.style.setProperty('--my', y + '%');
    });
  });

})();
