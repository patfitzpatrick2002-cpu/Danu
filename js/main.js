/* ═══════════════════════════════════════════════════════════
   DANU SAUNAS — Main JS
   ═══════════════════════════════════════════════════════════ */

// ─── Nav scroll behaviour ──────────────────────────────────
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── Mobile nav toggle ─────────────────────────────────────
const navToggle = document.querySelector('.nav__toggle');
const navMobile = document.getElementById('nav-mobile');

navToggle?.addEventListener('click', () => {
  const isOpen = navMobile.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  navMobile.setAttribute('aria-hidden', !isOpen);
  // Animate hamburger to X
  navToggle.querySelectorAll('span').forEach((s, i) => {
    s.style.transform = isOpen
      ? (i === 0 ? 'rotate(45deg) translate(4px, 4px)' : 'rotate(-45deg) translate(4px, -4px)')
      : '';
  });
});

// Close mobile nav on link click
navMobile?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navMobile.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
    navMobile.setAttribute('aria-hidden', true);
    navToggle.querySelectorAll('span').forEach(s => s.style.transform = '');
  });
});

// ─── Scroll reveal (IntersectionObserver) ──────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ─── Visualiser upload ─────────────────────────────────────
const uploadZone    = document.getElementById('uploadZone');
const uploadIdle    = document.getElementById('uploadIdle');
const uploadProc    = document.getElementById('uploadProcessing');
const uploadResult  = document.getElementById('uploadResult');
const fileInput     = document.getElementById('fileInput');
const previewImg    = document.getElementById('previewImg');
const retryBtn      = document.getElementById('retryBtn');

function showState(state) {
  uploadIdle.hidden   = state !== 'idle';
  uploadProc.hidden   = state !== 'processing';
  uploadResult.hidden = state !== 'result';
}

function processFile(file) {
  if (!file || !file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = e => {
    showState('processing');

    // Magical pause — simulate compositing
    setTimeout(() => {
      previewImg.src = e.target.result;
      showState('result');
    }, 2200);
  };
  reader.readAsDataURL(file);
}

// File input change
fileInput?.addEventListener('change', e => {
  processFile(e.target.files[0]);
});

// Drag and drop
uploadZone?.addEventListener('dragover', e => {
  e.preventDefault();
  uploadZone.classList.add('drag-over');
});

uploadZone?.addEventListener('dragleave', () => {
  uploadZone.classList.remove('drag-over');
});

uploadZone?.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  processFile(e.dataTransfer.files[0]);
});

// Retry
retryBtn?.addEventListener('click', () => {
  previewImg.src = '';
  fileInput.value = '';
  showState('idle');
});

// ─── Sauna card hover — subtle parallax on visual ──────────
document.querySelectorAll('.sauna-card').forEach(card => {
  const visual = card.querySelector('.sauna-card__visual');
  if (!visual) return;

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
    visual.style.transform = `scale(1.04) translate(${x * 0.3}px, ${y * 0.3}px)`;
  });

  card.addEventListener('mouseleave', () => {
    visual.style.transform = '';
  });
});

// ─── Hero scroll fade ──────────────────────────────────────
const heroContent = document.querySelector('.hero__content');
const heroScroll  = document.querySelector('.hero__scroll-indicator');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  if (heroContent) {
    heroContent.style.transform = `translateY(${scrolled * 0.25}px)`;
    heroContent.style.opacity = Math.max(0, 1 - scrolled / 500);
  }
  if (heroScroll) {
    heroScroll.style.opacity = Math.max(0, 1 - scrolled / 200);
  }
}, { passive: true });
