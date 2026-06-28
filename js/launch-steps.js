(() => {
  'use strict';

  const sections = Array.from(document.querySelectorAll('.launch-steps'));
  if (!sections.length) return;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const allStepsVisibleProgress = 0.576;

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

  const updateSection = (section) => {
    const cards = Array.from(section.querySelectorAll('.launch-steps__card'));
    const { progress } = getProgress(section);
    const previousMaxProgress = Number(section.dataset.maxProgress || '0');
    const revealProgress = Math.max(previousMaxProgress, progress);

    section.dataset.maxProgress = revealProgress.toFixed(3);

    const activeStep = revealProgress >= allStepsVisibleProgress
      ? 3
      : revealProgress >= 0.32
        ? 2
        : revealProgress >= 0.08
          ? 1
          : 0;
    const isCondensed = revealProgress >= 0.64;
    const showCta = revealProgress >= 0.84;

    section.style.setProperty('--steps-progress', revealProgress.toFixed(3));
    section.classList.toggle('is-condensed', isCondensed || showCta);
    section.classList.toggle('is-complete', showCta);

    cards.forEach((card, index) => {
      const step = index + 1;
      card.classList.toggle('is-visible', activeStep >= step);
      card.classList.toggle('is-current', activeStep === step);
    });
  };

  const releaseCompletedSection = (event) => {
    if (event.deltaY >= 0) return;

    const section = event.currentTarget;
    const maxProgress = Number(section.dataset.maxProgress || '0');
    if (maxProgress < allStepsVisibleProgress) return;

    const { progress, rect, viewportHeight } = getProgress(section);
    const isPinnedInsideSection = rect.top < -4 && rect.bottom > viewportHeight + 4;
    if (!isPinnedInsideSection || progress <= 0.02) return;

    event.preventDefault();

    const targetTop = Math.max(0, section.offsetTop - 1);
    const root = document.documentElement;
    const body = document.body;
    const previousRootScrollBehavior = root.style.scrollBehavior;
    const previousBodyScrollBehavior = body.style.scrollBehavior;

    root.style.scrollBehavior = 'auto';
    body.style.scrollBehavior = 'auto';
    window.scrollTo(0, targetTop);
    root.style.scrollBehavior = previousRootScrollBehavior;
    body.style.scrollBehavior = previousBodyScrollBehavior;

    requestUpdate();
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
  sections.forEach((section) => {
    section.addEventListener('wheel', releaseCompletedSection, { passive: false });
  });
  requestUpdate();
})();
