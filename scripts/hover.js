/**
 * Hover comet system.
 * Spec from Figma proto 57:10951 (Hover 1, start) → 57:11158 (Hover 2, end).
 *
 * - Dividers: 4×4 glow dot + 200px gradient trail travels left → right at 240 px/s linear.
 *   Loops on right-edge cross. On mouseleave: opacity fades, motion continues.
 *   Re-enter starts a fresh comet from off-canvas left.
 * - Buttons: same dot+trail traces clockwise around the button's rounded rect perimeter.
 *
 * Tokens: --hover-comet-head (px), --hover-comet-glow (drop-shadow). Speed +
 * trail lengths live as constants below — the divider/button comets share the
 * same SPEED but use different trail lengths (TRAIL_ROW / TRAIL_BTN).
 * Honors prefers-reduced-motion (skips the comet entirely).
 */
(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;
  /* Touch-only devices never fire mouseenter/mouseleave usefully — skip the
     boot scan and DOM mounts entirely. Mirrors tap.js's hover-capability
     gate so the two scripts cover disjoint pointer types. */
  if (window.matchMedia("(hover: none)").matches) return;

  const SPEED = 192;           // px/s, linear — slowed 20% from 240 per fix #3d (rows + buttons)
  const TRAIL_ROW = 200;       // px — Hover 1 measurement for dividers
  const TRAIL_BTN = 120;       // px — shorter tail on buttons, grow-in same as divider
  const HEAD = 4;              // px — dot dimension
  const FADE_MS = 1000;        // longer fade so the comet lingers after mouseleave

  // ============================================================
  // Shared rAF lifecycle for divider + button comets. Owns the loop,
  // fade end-of-life, and active/fading state machine. Callers provide
  // `tick(dt)` (advance + paint) plus `onStart` / `onLeave` for whatever
  // per-setup attribute writes need to happen on each transition.
  // ============================================================
  function makeCometLoop({ fadeEl, tick, onStart, onLeave }) {
    let raf = null;
    let lastT = 0;
    let active = false;
    let fading = false;
    let fadeStart = 0;

    function frame(t) {
      if (!raf) return;
      const dt = lastT ? (t - lastT) / 1000 : 0;
      lastT = t;
      tick(dt);
      if (fading && t - fadeStart >= FADE_MS) {
        fadeEl.dataset.active = "false";
        fadeEl.style.opacity = "";
        fading = false;
        stop();
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    function start() {
      active = true;
      fading = false;
      if (onStart) onStart();
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
      if (onLeave) onLeave();
      fadeEl.style.transition = `opacity ${FADE_MS}ms var(--ease-out-strong)`;
      fadeEl.dataset.active = "false";
    }

    return { start, stop, leave, isActive: () => active };
  }

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
    let anchorX = 0;            // host-local x of the number column's left edge
    let wrapX = 0;              // host-local x of off-viewport-left (full-tail loop point)
    let endX = 0;               // host-local x past viewport right
    let headX = 0;              // host-local x of head's left edge
    let isFirstLap = true;      // first lap after hover grows the tail from 0 → TRAIL_ROW

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

    const loop = makeCometLoop({
      fadeEl: trace.el,
      onStart: () => {
        measure();
        // Every (re-)hover starts fresh at the numbers anchor with the tail at 0 —
        // instant visual feedback. Pre-paint before activating opacity to avoid the
        // default-position flash.
        headX = anchorX;
        isFirstLap = true;
        paint();
        trace.el.style.opacity = "";
        trace.el.dataset.active = "true";
      },
      tick: (dt) => {
        headX += SPEED * dt;
        // Wrap when comet has fully exited viewport right → back to off-viewport-left
        // with the tail already at full length (first-lap grow is over).
        if (headX > endX) {
          headX = wrapX;
          isFirstLap = false;
        }
        paint();
      },
    });

    // Track hover separately from loop.isActive() — `active` flips to false
    // on leave (during fade-out), but we still want to restart on viewport
    // re-entry only if the pointer is genuinely still over the host.
    let isHovering = false;
    host.addEventListener("mouseenter", () => {
      isHovering = true;
      loop.start();
    });
    host.addEventListener("mouseleave", () => {
      isHovering = false;
      loop.leave(performance.now());
    });

    // Pause off-screen; resume when scrolled back in while still hovered.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) loop.stop();
        else if (isHovering) loop.start();
      });
    }, { rootMargin: "200px" });
    io.observe(host);
  }

  // ============================================================
  // BUTTONS — clockwise perimeter orbit. Pinhead starts at the button's
  // top-left rounded corner. Tail grows 0 → TRAIL_BTN on the first quarter-lap;
  // then loops indefinitely around the border. On mouseleave the comet keeps
  // moving while opacity fades to 0 over FADE_MS.
  // Implemented with an SVG path traced via stroke-dasharray + stroke-dashoffset,
  // with a separate <circle> head positioned via path.getPointAtLength().
  // ============================================================
  const SVG_NS = "http://www.w3.org/2000/svg";
  let _orbitUid = 0;

  function mountButtonOrbit(host) {
    _orbitUid++;
    const uid = "orbit-" + _orbitUid;
    const wrap = document.createElement("div");
    wrap.className = "hover-trace hover-trace--button-orbit";

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "orbit-svg");
    svg.setAttribute("preserveAspectRatio", "none");

    // Radial mask centered on the head. Stops: opaque at head, transparent
    // at radius=TRAIL_BTN. Multiplied with the stroke so the visible trail
    // segment fades out toward its tail end — same look as the divider's
    // linear-gradient tail, just projected onto a curved perimeter.
    const defs = document.createElementNS(SVG_NS, "defs");
    const grad = document.createElementNS(SVG_NS, "radialGradient");
    grad.id = uid + "-grad";
    grad.setAttribute("gradientUnits", "userSpaceOnUse");
    grad.setAttribute("r", String(TRAIL_BTN));
    const s0 = document.createElementNS(SVG_NS, "stop");
    s0.setAttribute("offset", "0%");
    s0.setAttribute("stop-color", "white");
    s0.setAttribute("stop-opacity", "1");
    const s1 = document.createElementNS(SVG_NS, "stop");
    s1.setAttribute("offset", "100%");
    s1.setAttribute("stop-color", "white");
    s1.setAttribute("stop-opacity", "0");
    grad.appendChild(s0);
    grad.appendChild(s1);

    const mask = document.createElementNS(SVG_NS, "mask");
    mask.id = uid + "-mask";
    mask.setAttribute("maskUnits", "userSpaceOnUse");
    // Explicit bounds (default -10%/120% would clip the mask circle since it
    // extends TRAIL_BTN above/below the button rect). Generous box around any
    // realistic button size keeps the radial fade fully painted.
    mask.setAttribute("x", String(-TRAIL_BTN * 2));
    mask.setAttribute("y", String(-TRAIL_BTN * 2));
    mask.setAttribute("width", String(TRAIL_BTN * 6));
    mask.setAttribute("height", String(TRAIL_BTN * 6));
    const maskCircle = document.createElementNS(SVG_NS, "circle");
    maskCircle.setAttribute("r", String(TRAIL_BTN));
    maskCircle.setAttribute("fill", "url(#" + uid + "-grad)");
    mask.appendChild(maskCircle);

    defs.appendChild(grad);
    defs.appendChild(mask);

    const trail = document.createElementNS(SVG_NS, "path");
    trail.setAttribute("class", "orbit-trail");
    trail.setAttribute("fill", "none");
    trail.setAttribute("stroke", "var(--accent-primary)");
    trail.setAttribute("stroke-width", "1.5");
    trail.setAttribute("stroke-linecap", "round");
    trail.setAttribute("mask", "url(#" + uid + "-mask)");

    const head = document.createElementNS(SVG_NS, "circle");
    head.setAttribute("class", "orbit-head");
    head.setAttribute("r", "2");
    head.setAttribute("fill", "var(--accent-primary)");

    svg.appendChild(defs);
    svg.appendChild(trail);
    svg.appendChild(head);
    wrap.appendChild(svg);
    host.appendChild(wrap);
    return { wrap, svg, trail, head, maskCircle, grad };
  }

  function setupButton(host) {
    const orbit = mountButtonOrbit(host);
    let perim = 0;
    let headDist = 0;
    let firstLap = true;

    function measure() {
      const rect = host.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cs = window.getComputedStyle(host);
      let rx = parseFloat(cs.borderTopLeftRadius) || 0;
      rx = Math.min(rx, w / 2, h / 2);

      orbit.svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      // Clockwise from top-left corner end-of-arc, around the perimeter.
      const d = rx > 0
        ? `M ${rx} 0 L ${w - rx} 0` +
          ` A ${rx} ${rx} 0 0 1 ${w} ${rx}` +
          ` L ${w} ${h - rx}` +
          ` A ${rx} ${rx} 0 0 1 ${w - rx} ${h}` +
          ` L ${rx} ${h}` +
          ` A ${rx} ${rx} 0 0 1 0 ${h - rx}` +
          ` L 0 ${rx}` +
          ` A ${rx} ${rx} 0 0 1 ${rx} 0 Z`
        : `M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`;
      orbit.trail.setAttribute("d", d);
      perim = orbit.trail.getTotalLength();
    }

    function paint() {
      if (!perim) return;
      const tailLen = Math.min(
        firstLap ? Math.max(0, headDist) : TRAIL_BTN,
        TRAIL_BTN,
        perim
      );
      // Pattern length MUST equal perim so the dash tiles seamlessly around
      // the closed path. Using `perim + tailLen` made the pattern length and
      // path length incommensurate, producing a visible jump at the path's
      // join when the trail wrapped from end → start.
      orbit.trail.setAttribute("stroke-dasharray", `${tailLen} ${perim - tailLen}`);
      orbit.trail.setAttribute("stroke-dashoffset", String(tailLen - headDist));

      const wrapped = ((headDist % perim) + perim) % perim;
      const p = orbit.trail.getPointAtLength(wrapped);
      orbit.head.setAttribute("cx", p.x);
      orbit.head.setAttribute("cy", p.y);
      // Mask circle and its radial gradient ride with the head — opaque at
      // the head, fading to transparent at radius = TRAIL_BTN. Gives the same
      // tail fade as the divider's linear-gradient line.
      orbit.maskCircle.setAttribute("cx", p.x);
      orbit.maskCircle.setAttribute("cy", p.y);
      orbit.grad.setAttribute("cx", p.x);
      orbit.grad.setAttribute("cy", p.y);
      orbit.grad.setAttribute("fx", p.x);
      orbit.grad.setAttribute("fy", p.y);
    }

    const loop = makeCometLoop({
      fadeEl: orbit.wrap,
      onStart: () => {
        measure();
        headDist = 0;
        firstLap = true;
        paint();
        host.dataset.btnState = "hot";
        orbit.wrap.style.opacity = "";
        orbit.wrap.style.transition = "";
        orbit.wrap.dataset.active = "true";
      },
      onLeave: () => {
        host.dataset.btnState = "";
      },
      tick: (dt) => {
        headDist += SPEED * dt;
        if (headDist >= perim) {
          headDist -= perim;
          firstLap = false;
        }
        paint();
      },
    });

    host.addEventListener("mouseenter", loop.start);
    host.addEventListener("mouseleave", () => loop.leave(performance.now()));
    if ("ResizeObserver" in window) {
      new ResizeObserver(() => { if (loop.isActive()) measure(); }).observe(host);
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
})();
