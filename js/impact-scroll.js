(() => {
  'use strict';

  const sections = Array.from(document.querySelectorAll('.impact'));
  if (!sections.length) return;

  const stateBySection = new WeakMap();

  const getState = (section) => {
    let state = stateBySection.get(section);
    if (state) return state;

    const bubbles = Array.from(section.querySelectorAll('.impact__bubble'));
    const title = section.querySelector('.impact__title');
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const offset = Math.min(280, Math.max(160, viewportHeight * 0.2));
    state = {
      bubbles,
      title,
      offset,
      current: bubbles.map(() => ({ x: -offset, y: 0, opacity: 0 })),
      target: bubbles.map(() => ({ x: -offset, y: 0, opacity: 0 })),
      stage: 0,
    };

    stateBySection.set(section, state);
    return state;
  };

  const setTargets = (state, stage) => {
    const hiddenX = -state.offset;

    state.bubbles.forEach((_, index) => {
      state.target[index] = stage >= index + 1
        ? { x: 0, y: 0, opacity: 1 }
        : { x: hiddenX, y: 0, opacity: 0 };
    });
  };

  const resetState = (state) => {
    const hiddenX = -state.offset;
    state.stage = 0;
    state.bubbles.forEach((_, index) => {
      const hidden = { x: hiddenX, y: 0, opacity: 0 };
      state.current[index] = { ...hidden };
      state.target[index] = hidden;
    });
  };

  const updateSection = (section) => {
    const state = getState(section);
    const sectionRect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const titleRect = state.title?.getBoundingClientRect();
    state.offset = Math.min(280, Math.max(160, viewportHeight * 0.2));

    if (sectionRect.top >= viewportHeight) {
      resetState(state);
      return;
    }

    const triggerProgress = titleRect ? viewportHeight * 0.45 - titleRect.top : -Infinity;
    const messagePause = Math.min(280, Math.max(190, viewportHeight * 0.22));
    const nextStage = Math.min(
      state.bubbles.length,
      Math.max(0, Math.floor(triggerProgress / messagePause) + 1)
    );
    const stage = Math.max(state.stage, nextStage);
    setTargets(state, stage);

    if (stage !== state.stage) {
      state.stage = stage;
    }
  };

  const renderSection = (section) => {
    const state = getState(section);
    let needsMore = false;
    const eased = 0.18;

    state.bubbles.forEach((bubble, index) => {
      const current = state.current[index];
      const target = state.target[index];
      current.x += (target.x - current.x) * eased;
      current.y += (target.y - current.y) * eased;
      current.opacity += (target.opacity - current.opacity) * eased;

      if (
        Math.abs(target.x - current.x) > 0.5 ||
        Math.abs(target.y - current.y) > 0.5 ||
        Math.abs(target.opacity - current.opacity) > 0.01
      ) {
        needsMore = true;
      }

      bubble.style.setProperty('--bubble-x', `${current.x.toFixed(2)}px`);
      bubble.style.setProperty('--bubble-y', `${current.y.toFixed(2)}px`);
      bubble.style.setProperty('--bubble-opacity', current.opacity.toFixed(3));
    });

    return needsMore;
  };

  let rafId = 0;
  const tick = () => {
    rafId = 0;
    sections.forEach(updateSection);
    const needsMore = sections.some(renderSection);
    if (needsMore) {
      rafId = window.requestAnimationFrame(tick);
    }
  };

  const onScroll = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(tick);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('load', onScroll, { once: true });
  onScroll();
})();
