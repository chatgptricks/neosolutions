(() => {
  const frame = document.querySelector('.showreel__video[data-src], .showreel__video[data-youtube-id]');
  const tickers = document.querySelectorAll('.showreel__ticker');
  if (!frame && !tickers.length) return;

  const intro = document.querySelector('.hero__showreel--top');
  const isIntroVideo = Boolean(frame && intro?.contains(frame));
  const isNativeVideo = frame?.tagName === 'VIDEO';
  const isYoutubeVideo = frame?.tagName === 'IFRAME' && frame.hasAttribute('data-youtube-id');
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);
  let playbackRequested = false;

  const requestVideoPlayback = () => {
    if (!frame) return false;
    playbackRequested = true;

    if (isNativeVideo) {
      const src = frame.getAttribute('data-src');
      if (!src) return false;

      if (frame.getAttribute('src') !== src) {
        frame.setAttribute('src', src);
        frame.setAttribute('preload', 'auto');
        if (typeof frame.load === 'function') {
          frame.load();
        }
      }

      if (typeof frame.play === 'function') {
        frame.play().catch(() => {});
      }

      return true;
    }

    if (isYoutubeVideo) {
      frame.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
        '*'
      );
      return true;
    }

    return false;
  };

  const requestVideoPause = () => {
    if (!frame) return;

    if (isNativeVideo && typeof frame.pause === 'function') {
      frame.pause();
      return;
    }

    if (isYoutubeVideo) {
      frame.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
        '*'
      );
    }
  };

  const restartVideo = () => {
    if (!frame) return;

    if (isNativeVideo) {
      frame.currentTime = 0;
      return;
    }

    if (isYoutubeVideo) {
      frame.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'seekTo', args: [0, true] }),
        '*'
      );
    }
  };

  const prepareYoutubePlayer = () => {
    if (!isYoutubeVideo) return;

    const src = frame.getAttribute('src');
    if (!src) return;

    frame.addEventListener('load', () => {
      if (playbackRequested) {
        requestVideoPlayback();
      } else {
        requestVideoPause();
        restartVideo();
      }
    }, { once: true });

    const url = new URL(src, window.location.href);
    if (!url.searchParams.has('origin')) {
      url.searchParams.set('origin', window.location.origin);
      frame.setAttribute('src', url.toString());
    }
  };

  prepareYoutubePlayer();

  const visibilityRatio = () => {
    if (!frame) return 0;
    const rect = frame.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    if (!rect.height || !viewportHeight) return 0;

    const visibleHeight = Math.max(
      0,
      Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
    );

    return visibleHeight / rect.height;
  };

  const syncIntroState = () => {
    if (!intro) return;

    const scrollRange = Math.max(1, intro.offsetHeight - window.innerHeight);
    const progress = clamp((window.scrollY - intro.offsetTop) / scrollRange, 0, 1);
    const morph = easeOutCubic(clamp(progress / 0.86, 0, 1));
    const isolation = clamp(1 - progress * 1.55, 0, 1);
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
    const contentSource = document.querySelector('.hero__container');
    const measuredContentWidth = contentSource?.getBoundingClientRect().width;
    const finalWidth = Math.min(
      measuredContentWidth || viewportWidth - 104,
      viewportWidth - 32
    );
    const finalHeight = Math.min(finalWidth * 9 / 16, viewportHeight - 48);
    const frameWidth = viewportWidth + (finalWidth - viewportWidth) * morph;
    const frameHeight = viewportHeight + (finalHeight - viewportHeight) * morph;
    const frameRadius = 34 * morph;

    intro.style.setProperty('--intro-progress', progress.toFixed(3));
    intro.style.setProperty('--intro-isolation', isolation.toFixed(3));
    intro.style.setProperty('--intro-frame-width', `${frameWidth.toFixed(1)}px`);
    intro.style.setProperty('--intro-frame-height', `${frameHeight.toFixed(1)}px`);
    intro.style.setProperty('--intro-frame-radius', `${frameRadius.toFixed(1)}px`);
    intro.style.setProperty('--intro-frame-border-alpha', (0.18 * morph).toFixed(3));
    intro.style.setProperty('--intro-frame-bg-alpha', (0.9 * morph).toFixed(3));
  };

  let rafId = 0;
  let loaded = false;
  let intervalId = 0;
  const check = () => {
    rafId = 0;
    syncIntroState();
    if (loaded || !frame) return;
    if (isIntroVideo) return;

    if (visibilityRatio() >= 0.15) {
      loaded = requestVideoPlayback();
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

  const startIntroVideo = () => {
    syncIntroState();
    if (!isIntroVideo) return;
    loaded = requestVideoPlayback();
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = 0;
    }
  };

  const startIntroVideoFromClick = () => {
    window.setTimeout(startIntroVideo, 0);
    if (isNativeVideo) {
      window.setTimeout(() => {
        if (frame?.paused) startIntroVideo();
      }, 160);
    }
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

  // YouTube loads eagerly. Playback with audio still waits for the first user
  // gesture: iframe click handled by YouTube, or scroll/touch/keyboard here.
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('wheel', startIntroVideo, { passive: true });
  window.addEventListener('touchstart', startIntroVideo, { passive: true });
  window.addEventListener('keydown', startIntroVideo, { passive: true });
  if (isIntroVideo) {
    intro.addEventListener('click', startIntroVideoFromClick, { passive: true, capture: true });
    if (isNativeVideo) {
      frame.addEventListener('play', () => {
        window.setTimeout(() => {
          intro.removeEventListener('click', startIntroVideoFromClick, true);
        }, 220);
      }, { once: true });
    }
  }
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', onScroll, { once: true });
  if (!isIntroVideo) {
    intervalId = window.setInterval(check, 200);
  }
  syncTickers();
  window.addEventListener('resize', syncTickers, { passive: true });
  onScroll();
})();
