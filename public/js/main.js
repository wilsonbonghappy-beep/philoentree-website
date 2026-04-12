/* ═══════════════════════════════════════════════════
   PHILOENTREE — Frontend JavaScript
   ═══════════════════════════════════════════════════ */

'use strict';

/* ── Navbar scroll behaviour ─────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile nav toggle ───────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close nav when any link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ── Scroll reveal ───────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger cards in the same parent grid
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      const idx = [...siblings].indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Active nav link on scroll ───────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ── Contact form ────────────────────────────────── */
const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMsg   = document.getElementById('formMsg');

const fields = {
  name:    { el: document.getElementById('name'),    err: document.getElementById('nameErr') },
  email:   { el: document.getElementById('email'),   err: document.getElementById('emailErr') },
  service: { el: document.getElementById('service'), err: document.getElementById('serviceErr') },
  message: { el: document.getElementById('message'), err: document.getElementById('messageErr') },
};

function validateField(name) {
  const { el, err } = fields[name];
  let msg = '';

  if (name === 'name' && !el.value.trim()) msg = 'Name is required.';
  if (name === 'email') {
    if (!el.value.trim()) msg = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim())) msg = 'Enter a valid email address.';
  }
  if (name === 'service' && !el.value) msg = 'Please select a service.';
  if (name === 'message' && !el.value.trim()) msg = 'Please describe your project.';

  err.textContent = msg;
  el.classList.toggle('error', !!msg);
  return !msg;
}

// Validate on blur
Object.keys(fields).forEach(name => {
  fields[name].el.addEventListener('blur', () => validateField(name));
  fields[name].el.addEventListener('input', () => {
    if (fields[name].el.classList.contains('error')) validateField(name);
  });
});

function setLoading(loading) {
  const btnText    = submitBtn.querySelector('.btn-text');
  const btnSpinner = submitBtn.querySelector('.btn-spinner');
  submitBtn.disabled = loading;
  btnText.hidden    = loading;
  btnSpinner.hidden = !loading;
}

function showMsg(text, type) {
  formMsg.textContent = text;
  formMsg.className   = `form-msg ${type}`;
  formMsg.hidden      = false;
  formMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validate all fields
  const valid = Object.keys(fields).map(n => validateField(n)).every(Boolean);
  if (!valid) return;

  setLoading(true);
  formMsg.hidden = true;

  const payload = {
    name:    fields.name.el.value.trim(),
    email:   fields.email.el.value.trim(),
    phone:   document.getElementById('phone').value.trim(),
    service: fields.service.el.value,
    message: fields.message.el.value.trim(),
  };

  try {
    const res  = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.success) {
      showMsg('✓ Message sent! We will be in touch within one business day.', 'success');
      form.reset();
      Object.keys(fields).forEach(n => fields[n].el.classList.remove('error'));
    } else {
      const msgs = data.errors ? data.errors.map(e => e.msg).join(' ') : data.message;
      showMsg(msgs || 'Something went wrong. Please try again.', 'error');
    }
  } catch {
    showMsg('Network error. Please check your connection and try again.', 'error');
  } finally {
    setLoading(false);
  }
});

/* ── Smooth scroll for anchor links ─────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 8;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Ticker pause on hover ───────────────────────── */
const ticker = document.querySelector('.ticker');
if (ticker) {
  ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
  ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
}
