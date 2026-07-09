import { initParticles } from './particles.js';
import { initTerminal } from './terminal.js';
import { initCtiDashboard } from './cti-dashboard.js';
import { initAsciiInteractions } from './ascii-interactions.js';

const canvas = document.getElementById('particle-canvas');
initParticles(canvas);

const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');
const terminalPrompt = document.getElementById('terminal-prompt');
initTerminal(terminalOutput, terminalInput, terminalPrompt);
initCtiDashboard();
initAsciiInteractions();

document.getElementById('terminal-window')?.addEventListener('click', () => {
  terminalInput.focus();
});

const slideVariants = ['slide-from-left', 'slide-from-right', 'slide-from-bottom'];

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.section-header').forEach((el, i) => {
  el.style.opacity = '0';
  el.classList.add(i % 2 === 0 ? 'slide-from-left' : 'slide-from-right');
  el.style.transition = 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
  observer.observe(el);
});

document.querySelectorAll('.brutal-box').forEach((el, i) => {
  if (el.closest('.hero-grid') && !el.classList.contains('interactive-card')) return;
  if (el.closest('.cti-ascii-container')) return;
  el.style.opacity = '0';
  el.classList.add(slideVariants[i % slideVariants.length]);
  el.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${(i % 4) * 0.08}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${(i % 4) * 0.08}s`;
  observer.observe(el);
});

// Stagger nav link entrance
document.querySelectorAll('.header-nav a').forEach((link, i) => {
  link.style.opacity = '0';
  link.style.animation = `slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + i * 0.06}s both`;
});
