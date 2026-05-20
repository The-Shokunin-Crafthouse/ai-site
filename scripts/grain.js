function initGrain() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  canvas.style.cssText = [
    'position: fixed',
    'inset: 0',
    'width: 100%',
    'height: 100%',
    'pointer-events: none',
    'z-index: 9999',
    'filter: blur(0.6px)',
  ].join(';');

  function applyColorMode() {
    const dark = mq.matches;
    canvas.style.mixBlendMode = dark ? 'screen' : 'multiply';
    canvas.style.opacity = dark ? '0.011' : '0.2';
  }

  applyColorMode();
  mq.addEventListener('change', applyColorMode);
  document.body.appendChild(canvas);

  let frame = 0;
  const SCALE = 2;

  function resize() {
    canvas.width  = Math.ceil(window.innerWidth  / SCALE);
    canvas.height = Math.ceil(window.innerHeight / SCALE);
  }

  function drawGrain() {
    if (frame++ % 2 === 0) {
      const { width, height } = canvas;
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      const dark = mq.matches;

      for (let i = 0; i < data.length; i += 4) {
        const v = dark
          ? (Math.random() * 255) | 0
          : (Math.random() * 80) | 0;
        data[i]     = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
    }

    requestAnimationFrame(drawGrain);
  }

  resize();
  window.addEventListener('resize', resize);
  drawGrain();
}

document.addEventListener('DOMContentLoaded', initGrain);
