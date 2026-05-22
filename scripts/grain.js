function initGrain() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.style.cssText = [
    'position: fixed',
    'inset: 0',
    'width: 100%',
    'height: 100%',
    'pointer-events: none',
    'z-index: 9999',
    'filter: blur(0.6px)',
  ].join(';');

  // Mobile breakpoint matches CSS @media (max-width: 767px). matchMedia
  // is live — re-applies opacity on resize so a desktop window narrowed
  // to a phone-sized viewport gets the mobile value too.
  const mqMobile = window.matchMedia('(max-width: 767px)');

  function applyColorMode() {
    const dark = document.documentElement.classList.contains('dark');
    canvas.style.mixBlendMode = dark ? 'screen' : 'soft-light';
    // Light mode: 0.10 on mobile, 0.12 on desktop. Dark locked at 0.01
    // per prior preservation note.
    const lightOpacity = mqMobile.matches ? '0.1' : '0.12';
    canvas.style.opacity = dark ? '0.01' : lightOpacity;
  }

  applyColorMode();

  // Watch for class changes on <html> (site toggle)
  new MutationObserver(applyColorMode).observe(
    document.documentElement,
    { attributes: true, attributeFilter: ['class'] }
  );
  // Re-apply on breakpoint cross.
  if (mqMobile.addEventListener) mqMobile.addEventListener('change', applyColorMode);
  else if (mqMobile.addListener) mqMobile.addListener(applyColorMode);

  document.body.appendChild(canvas);

  let frame = 0;
  const SCALE = 2;

  function resize() {
    canvas.width  = Math.ceil(window.innerWidth  / SCALE);
    canvas.height = Math.ceil(window.innerHeight / SCALE);
  }

  function drawGrain() {
    if (frame++ % 5 === 0) {
      const { width, height } = canvas;
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
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
