(() => {
  'use strict';

  const carousels = Array.from(document.querySelectorAll('.audience'));
  if (!carousels.length) return;

  const getStep = (track) => {
    const card = track.querySelector('.audience__card');
    if (!card) return track.clientWidth * 0.8;

    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const updateButtons = (section) => {
    const track = section.querySelector('[data-carousel-viewport] .audience__track');
    const prev = section.querySelector('[data-carousel-prev]');
    const next = section.querySelector('[data-carousel-next]');
    if (!track || !prev || !next) return;

    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const left = track.scrollLeft;
    const tolerance = 2;

    prev.disabled = left <= tolerance;
    next.disabled = left >= maxScroll - tolerance;
  };

  const canScrollHorizontally = (track, delta) => {
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const tolerance = 2;

    if (maxScroll <= tolerance) return false;
    if (delta > 0) return track.scrollLeft < maxScroll - tolerance;
    if (delta < 0) return track.scrollLeft > tolerance;
    return false;
  };

  carousels.forEach((section) => {
    const track = section.querySelector('[data-carousel-viewport] .audience__track');
    const prev = section.querySelector('[data-carousel-prev]');
    const next = section.querySelector('[data-carousel-next]');
    if (!track || !prev || !next) return;

    prev.addEventListener('click', () => {
      track.scrollBy({ left: -getStep(track), behavior: 'smooth' });
    });

    next.addEventListener('click', () => {
      track.scrollBy({ left: getStep(track), behavior: 'smooth' });
    });

    section.addEventListener('wheel', (event) => {
      const dominantDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;

      if (!canScrollHorizontally(track, dominantDelta)) return;

      event.preventDefault();
      track.scrollLeft += dominantDelta;
      updateButtons(section);
    }, { passive: false });

    track.addEventListener('scroll', () => updateButtons(section), { passive: true });
    window.addEventListener('resize', () => updateButtons(section), { passive: true });
    updateButtons(section);
  });
})();
