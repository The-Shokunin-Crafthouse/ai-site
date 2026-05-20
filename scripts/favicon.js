(() => {
  'use strict';

  const YELLOW = [0xda, 0xff, 0x60];
  const MINT = [0x58, 0xf5, 0xd2];
  const HOLD_MS = 3000;
  const TRANSITION_MS = 4000;
  const CYCLE_MS = 2 * (HOLD_MS + TRANSITION_MS);
  const FRAME_INTERVAL_MS = 83;
  const SIZE = 64;

  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function lerp(a, b, t) {
    return Math.round(a + (b - a) * t);
  }

  function colorAt(elapsed) {
    const t = elapsed % CYCLE_MS;
    if (t < HOLD_MS) return YELLOW;
    if (t < HOLD_MS + TRANSITION_MS) {
      const p = easeInOut((t - HOLD_MS) / TRANSITION_MS);
      return [
        lerp(YELLOW[0], MINT[0], p),
        lerp(YELLOW[1], MINT[1], p),
        lerp(YELLOW[2], MINT[2], p),
      ];
    }
    if (t < HOLD_MS + TRANSITION_MS + HOLD_MS) return MINT;
    const p = easeInOut((t - HOLD_MS - TRANSITION_MS - HOLD_MS) / TRANSITION_MS);
    return [
      lerp(MINT[0], YELLOW[0], p),
      lerp(MINT[1], YELLOW[1], p),
      lerp(MINT[2], YELLOW[2], p),
    ];
  }

  function init() {
    const canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    function paint(rgb) {
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      ctx.beginPath();
      ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 4, 0, Math.PI * 2);
      ctx.fill();
      link.href = canvas.toDataURL('image/png');
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      paint(MINT);
      return;
    }

    const start = performance.now();
    let lastFrameMs = -Infinity;
    let lastPhase = 'init';
    let raf = 0;

    function tick(now) {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      const elapsed = (now - start) % CYCLE_MS;
      let phase;
      if (elapsed < HOLD_MS) phase = 'yellow';
      else if (elapsed < HOLD_MS + TRANSITION_MS) phase = 'transition';
      else if (elapsed < HOLD_MS + TRANSITION_MS + HOLD_MS) phase = 'mint';
      else phase = 'transition';

      if (phase === 'yellow') {
        if (lastPhase !== 'yellow') {
          paint(YELLOW);
          lastPhase = 'yellow';
        }
        return;
      }
      if (phase === 'mint') {
        if (lastPhase !== 'mint') {
          paint(MINT);
          lastPhase = 'mint';
        }
        return;
      }
      if (now - lastFrameMs < FRAME_INTERVAL_MS) return;
      lastFrameMs = now;
      lastPhase = 'transition';
      paint(colorAt(now - start));
    }

    raf = requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
