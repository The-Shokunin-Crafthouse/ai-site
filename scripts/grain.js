function initGrain() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  // Tag the canvas so CSS can target it (sheet open/dismiss path hides
  // the grain to avoid the GPU-compositing artifact that flashes a much
  // heavier noise layer mid-transition behind the sheet's backdrop blur).
  canvas.setAttribute('data-grain', '');

  canvas.style.cssText = [
    'position: fixed',
    'inset: 0',
    'width: 100%',
    'height: 100%',
    'pointer-events: none',
    'z-index: 9999',
    'filter: blur(0.6px)',
  ].join(';');

  // Mobile breakpoint via shared viewport helper. matchMedia is live —
  // re-applies opacity on resize so a desktop window narrowed to a phone-
  // sized viewport gets the mobile value too.
  const viewport = window.AiSiteViewport;

  function applyColorMode() {
    const dark = document.documentElement.classList.contains('dark');
    canvas.style.mixBlendMode = dark ? 'screen' : 'soft-light';
    // Light mode: 0.10 on mobile, 0.12 on desktop. Dark locked at 0.01
    // per prior preservation note.
    const lightOpacity = viewport && viewport.isMobile() ? '0.1' : '0.12';
    canvas.style.opacity = dark ? '0.01' : lightOpacity;
  }

  applyColorMode();

  // Watch for class changes on <html> (site toggle)
  new MutationObserver(applyColorMode).observe(
    document.documentElement,
    { attributes: true, attributeFilter: ['class'] }
  );
  // Re-apply on breakpoint cross.
  if (viewport) viewport.onMobileChange(applyColorMode);

  document.body.appendChild(canvas);

  let frame = 0;
  let imageData = null;
  let data = null;
  const SCALE = 2;

  function resize() {
    canvas.width  = Math.ceil(window.innerWidth  / SCALE);
    canvas.height = Math.ceil(window.innerHeight / SCALE);
    // Allocate the noise buffer once per resize. The per-frame draw loop
    // re-randomizes the channels in place — no per-frame allocation.
    imageData = ctx.createImageData(canvas.width, canvas.height);
    data = imageData.data;
    // Pre-fill alpha=255 so the per-frame loop only has to touch RGB.
    for (let i = 3; i < data.length; i += 4) data[i] = 255;
  }

  function drawGrain() {
    if (frame++ % 5 === 0 && data) {
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i]     = v;
        data[i + 1] = v;
        data[i + 2] = v;
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
