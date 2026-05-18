/**
 * Hover comet system.
 * Spec from Figma proto 57:10951 (Hover 1, start) → 57:11158 (Hover 2, end).
 *
 * - Dividers: 4×4 glow dot + 200px gradient trail travels left → right at 240 px/s linear.
 *   Loops on right-edge cross. On mouseleave: opacity fades, motion continues.
 *   Re-enter starts a fresh comet from off-canvas left.
 * - Buttons: same dot+trail traces clockwise around the button's rounded rect perimeter.
 *
 * Tokens: --hover-comet-speed (px/s), --hover-comet-trail (px), --hover-comet-head (px)
 * Honors prefers-reduced-motion (skips the comet entirely).
 */
(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const SPEED = 192;           // px/s, linear — slowed 20% from 240 per fix #3d (rows + buttons)
  const TRAIL_ROW = 200;       // px — Hover 1 measurement for dividers
  const TRAIL_BTN = 120;       // px — shorter tail on buttons, grow-in same as divider
  const HEAD = 4;              // px — dot dimension
  const FADE_MS = 1000;        // longer fade so the comet lingers after mouseleave

  // ============================================================
  // DIVIDERS — top border of any element with [data-hover="divider"]
  // ============================================================
  function mountDividerTrace(host) {
    const trace = document.createElement("div");
    trace.className = "hover-trace hover-trace--divider";
    trace.innerHTML =
      '<span class="hover-trace__line"></span>' +
      '<span class="hover-trace__head"></span>';
    host.appendChild(trace);
    return {
      el: trace,
      line: trace.querySelector(".hover-trace__line"),
      head: trace.querySelector(".hover-trace__head"),
    };
  }

  function setupDivider(host) {
    const trace = mountDividerTrace(host);
    let raf = null;
    let lastT = 0;
    let anchorX = 0;            // host-local x of the number column's left edge
    let wrapX = 0;              // host-local x of off-viewport-left (full-tail loop point)
    let endX = 0;               // host-local x past viewport right
    let headX = 0;              // host-local x of head's left edge
    let isFirstLap = true;      // first lap after hover grows the tail from 0 → TRAIL_ROW
    let active = false;
    let fading = false;
    let fadeStart = 0;

    function measure() {
      const rect = host.getBoundingClientRect();
      const vw = window.innerWidth;
      // Numbers anchor: left edge of the number column (e.g. .overview-row__index, .step__num).
      const num = host.querySelector(".overview-row__index, .step__num, .brain-row__num, .tools-row__num");
      if (num) {
        anchorX = num.getBoundingClientRect().left - rect.left;
      } else {
        // Fallback to the host's left padding if no number column found
        const cs = window.getComputedStyle(host);
        anchorX = parseFloat(cs.paddingLeft) || 0;
      }
      wrapX = -rect.left - TRAIL_ROW;        // off-viewport-left (full tail in place at wrap)
      endX = (vw - rect.left) + TRAIL_ROW;   // head past viewport right
    }

    function paint() {
      // Tail grows from 0 → TRAIL_ROW on the first lap as the head moves right
      // from the numbers anchor. Subsequent laps wrap to off-viewport-left with
      // the tail already at full length.
      const tailLength = isFirstLap
        ? Math.max(0, Math.min(headX - anchorX, TRAIL_ROW))
        : TRAIL_ROW;
      trace.head.style.transform = `translateX(${headX}px)`;
      trace.line.style.width = tailLength + "px";
      trace.line.style.transform = `translateX(${headX - tailLength}px)`;
    }

    function frame(t) {
      if (!raf) return;
      const dt = lastT ? (t - lastT) / 1000 : 0;
      lastT = t;
      headX += SPEED * dt;

      // Wrap when comet has fully exited viewport right → back to off-viewport-left
      // with the tail already at full length (first-lap grow is over).
      if (headX > endX) {
        headX = wrapX;
        isFirstLap = false;
      }

      paint();

      if (fading) {
        if (t - fadeStart >= FADE_MS) {
          trace.el.dataset.active = "false";
          trace.el.style.opacity = "";
          fading = false;
          stop();
          return;
        }
      }

      raf = requestAnimationFrame(frame);
    }

    function start() {
      measure();
      // Every (re-)hover starts fresh at the numbers anchor with the tail at 0 —
      // instant visual feedback. Pre-paint before activating opacity to avoid the
      // default-position flash.
      headX = anchorX;
      isFirstLap = true;
      paint();
      active = true;
      fading = false;
      trace.el.style.opacity = "";
      trace.el.dataset.active = "true";
      if (!raf) {
        lastT = 0;
        raf = requestAnimationFrame(frame);
      }
    }

    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      lastT = 0;
    }

    function leave(t) {
      if (!active) return;
      active = false;
      fading = true;
      fadeStart = t || performance.now();
      // Apply CSS-driven opacity fade while RAF keeps position updating
      trace.el.style.transition = `opacity ${FADE_MS}ms var(--ease-out-strong)`;
      trace.el.dataset.active = "false";
    }

    host.addEventListener("mouseenter", start);
    host.addEventListener("mouseleave", () => leave(performance.now()));

    // Pause off-screen
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting && raf) stop();
      });
    }, { rootMargin: "200px" });
    io.observe(host);
  }

  // ============================================================
  // BUTTONS — linear top-edge comet, same grow-from-anchor pattern as dividers.
  // Pinhead anchors at the button's top-left corner; tail grows 0→TRAIL_BTN on the
  // first lap as the head moves right; subsequent laps wrap to just-off-button-left
  // with the tail already at full length. Scoped to the button (not viewport-wide).
  // ============================================================
  function mountButtonTrace(host) {
    const trace = document.createElement("div");
    trace.className = "hover-trace hover-trace--button-line";
    trace.innerHTML =
      '<span class="hover-trace__line"></span>' +
      '<span class="hover-trace__head"></span>';
    host.appendChild(trace);
    return {
      el: trace,
      line: trace.querySelector(".hover-trace__line"),
      head: trace.querySelector(".hover-trace__head"),
    };
  }

  function setupButton(host) {
    const trace = mountButtonTrace(host);
    let raf = null;
    let lastT = 0;
    let anchorX = 0;
    let wrapX = 0;
    let endX = 0;
    let headX = 0;
    let isFirstLap = true;
    let active = false;
    let fading = false;
    let fadeStart = 0;

    function measure() {
      const rect = host.getBoundingClientRect();
      anchorX = 0;                       // button's top-left corner
      wrapX = -TRAIL_BTN;                // off-button-left, full tail in place at wrap
      endX = rect.width + TRAIL_BTN;     // head past button's right edge
    }

    function paint() {
      const tailLength = isFirstLap
        ? Math.max(0, Math.min(headX - anchorX, TRAIL_BTN))
        : TRAIL_BTN;
      trace.head.style.transform = `translateX(${headX}px)`;
      trace.line.style.width = tailLength + "px";
      trace.line.style.transform = `translateX(${headX - tailLength}px)`;
    }

    function frame(t) {
      if (!raf) return;
      const dt = lastT ? (t - lastT) / 1000 : 0;
      lastT = t;
      headX += SPEED * dt;
      if (headX > endX) {
        headX = wrapX;
        isFirstLap = false;
      }
      paint();

      if (fading && t - fadeStart >= FADE_MS) {
        trace.el.dataset.active = "false";
        trace.el.style.opacity = "";
        fading = false;
        stop();
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    function start() {
      measure();
      headX = anchorX;
      isFirstLap = true;
      paint();
      active = true;
      fading = false;
      host.dataset.btnState = "hot";
      trace.el.style.opacity = "";
      trace.el.dataset.active = "true";
      if (!raf) {
        lastT = 0;
        raf = requestAnimationFrame(frame);
      }
    }

    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      lastT = 0;
    }

    function leave(t) {
      if (!active) return;
      active = false;
      fading = true;
      fadeStart = t || performance.now();
      host.dataset.btnState = "";
      trace.el.style.transition = `opacity ${FADE_MS}ms var(--ease-out-strong)`;
      trace.el.dataset.active = "false";
    }

    host.addEventListener("mouseenter", start);
    host.addEventListener("mouseleave", () => leave(performance.now()));
    if ("ResizeObserver" in window) {
      new ResizeObserver(() => { if (active) measure(); }).observe(host);
    }
  }

  // ============================================================
  // Row hover — drive [data-row-state="hot"] for color fade
  // Independent of comet so it can attach to non-button rows.
  // ============================================================
  function setupRow(host) {
    host.addEventListener("mouseenter", () => { host.dataset.rowState = "hot"; });
    host.addEventListener("mouseleave", () => { host.dataset.rowState = ""; });
  }

  // ============================================================
  // Boot
  // ============================================================
  function boot() {
    document.querySelectorAll('[data-hover="divider"]').forEach(setupDivider);
    document.querySelectorAll('[data-hover="button"]').forEach(setupButton);
    document.querySelectorAll('[data-row-hover]').forEach(setupRow);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  // Expose for late-mounted DOM (cards inserted after page load)
  window.__hoverTrace = { setupDivider, setupButton, setupRow };
})();
