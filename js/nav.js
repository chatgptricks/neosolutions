/**
 * nav.js — Scroll-reveal for the global nav bar.
 *
 * The nav bar is hidden on page load (opacity: 0, pointer-events: none).
 * It reveals with a smooth slide-down animation once the user scrolls past
 * the hero section. When more sections are added below, this will activate
 * automatically without any code changes needed.
 */
(() => {
  'use strict';

  const header = document.querySelector('.hero__header');
  if (!header) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const updateVisibility = () => {
    header.classList.toggle('is-visible', window.scrollY > 24);
  };

  updateVisibility();
  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', updateVisibility);
})();
