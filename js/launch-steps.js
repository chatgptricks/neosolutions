(() => {
  'use strict';

  const sections = Array.from(document.querySelectorAll('.launch-steps'));
  if (!sections.length) return;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const allStepsVisibleProgress = 1.0;

  const getProgress = (section) => {
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollRange = Math.max(1, rect.height - viewportHeight);

    return {
      progress: clamp(-rect.top / scrollRange, 0, 1),
      rect,
      scrollRange,
      viewportHeight
    };
  };

  const resetSection = (section) => {
    const cards = Array.from(section.querySelectorAll('.launch-steps__card'));
    section.dataset.maxProgress = '0';
    section.style.setProperty('--steps-progress', '0');
    section.classList.remove('is-condensed', 'is-complete');

    cards.forEach((card) => {
      card.classList.remove('is-visible', 'is-current');
    });
  };

  const updateSection = (section) => {
    const cards = Array.from(section.querySelectorAll('.launch-steps__card'));
    const { progress, rect, viewportHeight } = getProgress(section);

    if (rect.top >= viewportHeight || rect.bottom <= 0) {
      resetSection(section);
      return;
    }

    const previousMaxProgress = Number(section.dataset.maxProgress || '0');
    const revealProgress = Math.max(previousMaxProgress, progress);

    section.dataset.maxProgress = revealProgress.toFixed(3);

    const activeStep = revealProgress >= allStepsVisibleProgress
      ? 3
      : revealProgress >= 0.66
        ? 2
        : revealProgress >= 0.10
          ? 1
          : 0;
    const isCondensed = revealProgress >= allStepsVisibleProgress;
    const showCta = revealProgress >= allStepsVisibleProgress;

    section.style.setProperty('--steps-progress', revealProgress.toFixed(3));
    section.classList.toggle('is-condensed', isCondensed || showCta);
    section.classList.toggle('is-complete', showCta);

    cards.forEach((card, index) => {
      const step = index + 1;
      card.classList.toggle('is-visible', activeStep >= step);
      card.classList.toggle('is-current', activeStep === step);
    });
  };

  let rafId = 0;

  const update = () => {
    rafId = 0;
    sections.forEach(updateSection);
  };

  const requestUpdate = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  window.addEventListener('load', requestUpdate, { once: true });
  requestUpdate();
})();
