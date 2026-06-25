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

  /**
   * IntersectionObserver approach:
   * - rootMargin bottom of -85% means the observer fires when the
   *   hero section's bottom edge crosses 15% from the top of the viewport.
   * - This triggers the nav to appear as soon as the user starts to
   *   leave the hero — ready for the next section.
   */
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        header.classList.add('is-visible');
      } else {
        header.classList.remove('is-visible');
      }
    },
    {
      threshold: 0,
      rootMargin: '0px 0px -85% 0px',
    }
  );

  observer.observe(hero);
})();
