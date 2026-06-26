(() => {
  const frame = document.querySelector('.showreel__video[data-src]');
  const tickers = document.querySelectorAll('.showreel__ticker');
  if (!frame && !tickers.length) return;

  const loadVideo = () => {
    const src = frame.getAttribute('data-src');
    if (!src || frame.getAttribute('src') === src) return true;
    frame.setAttribute('src', src);
    if (typeof frame.load === 'function') {
      frame.load();
    }
    if (typeof frame.play === 'function') {
      frame.play().catch(() => {});
    }
    return true;
  };

  const visibilityRatio = () => {
    const rect = frame.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    if (!rect.height || !viewportHeight) return 0;

    const visibleHeight = Math.max(
      0,
      Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
    );

    return visibleHeight / rect.height;
  };

  let rafId = 0;
  let loaded = false;
  let intervalId = 0;
  const check = () => {
    if (loaded) return;
    rafId = 0;
    if (visibilityRatio() >= 0.15) {
      loaded = loadVideo();
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = 0;
      }
    }
  };

  const onScroll = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(check);
  };

  const syncTicker = (tickerEl) => {
    const tickerTrack = tickerEl.querySelector('.showreel__ticker-track');
    const tickerGroup = tickerEl.querySelector('.showreel__ticker-group');
    if (!tickerTrack || !tickerGroup) return;

    const distance = tickerGroup.getBoundingClientRect().width;
    tickerEl.style.setProperty('--ticker-distance', `${distance}px`);
    tickerTrack.style.animationDuration = `${Math.max(distance / 42.5, 36)}s`;
  };

  const syncTickers = () => {
    tickers.forEach(syncTicker);
  };

  // Keep the trigger simple: once the user scrolls near the frame,
  // swap the URL in and let YouTube autoplay muted.
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', onScroll, { once: true });
  intervalId = window.setInterval(check, 200);
  syncTickers();
  window.addEventListener('resize', syncTickers, { passive: true });
  onScroll();
})();
