// ===== WHATSAPP CONFIG =====
// Замените номер перед публикацией: формат 39391234567 (без +)
const WA_PHONE = '393318442104';
const WA_TEXT = encodeURIComponent('Здравствуйте! Хочу записаться на консультацию по поступлению в Италию.');
const WA_URL = `https://wa.me/${WA_PHONE}?text=${WA_TEXT}`;

document.querySelectorAll('.wa-link').forEach(el => el.setAttribute('href', WA_URL));

// ===== SCROLL REVEAL =====
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-stagger]').forEach(group => {
  group.querySelectorAll('[data-reveal]').forEach((el, i) => {
    el.style.transitionDelay = `${i * 75}ms`;
  });
});

document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

// ===== PARALLAX ON HERO EMBLEM =====
const heroVisual = document.querySelector('.hero__visual-inner');
window.addEventListener('scroll', () => {
  if (heroVisual && window.scrollY < window.innerHeight * 1.5) {
    heroVisual.style.transform = `translateY(${window.scrollY * 0.12}px)`;
  }
}, { passive: true });

// ===== HEADER SHADOW ON SCROLL =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ===== BURGER MENU =====
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobile-nav');

function closeMobileNav() {
  burger.classList.remove('active');
  burger.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

burger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.contains('open');
  if (isOpen) {
    closeMobileNav();
  } else {
    burger.classList.add('active');
    burger.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
});

mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

// ===== MOBILE STICKY CTA =====
const mobileCta = document.getElementById('mobile-cta');
const hero = document.getElementById('hero');

const heroObserver = new IntersectionObserver(([entry]) => {
  const show = !entry.isIntersecting;
  mobileCta.classList.toggle('visible', show);
  mobileCta.setAttribute('aria-hidden', String(!show));
}, { threshold: 0 });

if (hero) heroObserver.observe(hero);

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq__q').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    document.querySelectorAll('.faq__q').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });

    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 8;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
