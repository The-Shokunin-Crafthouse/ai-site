/* ai.levibahn.com — walkthrough film engine.

   A silent, scrubbable ~90-second SVG systems diagram (Brain → Workflow →
   Agents → Tools → lock-up). One gsap.timeline({paused:true}) is BOTH the
   single source of truth and the clock: scrub = tl.seek(), chapter jump =
   tl.seek(label), clock + scrub fill + captions + ARIA all derive from
   tl.time(). Eased tweens only (no spring/inertia) so every point is
   deterministically reachable forward or back.

   Load model: classic deferred script (matches the other scripts/*.js).
   GSAP CORE is lazy dynamic-import()ed via the head import map only when the
   section nears the viewport — never on first paint. If the import fails
   (old browser / no network), the static poster stays: a functional path,
   never a blank box. Breakpoints reuse window.AiSiteViewport.

   ADR 2026-06-20 (decisions/decisions.md) covers the GSAP-engine decision. */
(function () {
  "use strict";
  if (typeof window === "undefined" || typeof document === "undefined") return;

  var section = document.querySelector("[data-film]");
  if (!section) return;

  /* ---- refs ---- */
  var stageEl = section.querySelector("[data-film-stage]");
  var svg = section.querySelector("[data-film-svg]");
  var captionEls = Array.prototype.slice.call(section.querySelectorAll("[data-film-caption]"));
  var playBtn = section.querySelector("[data-film-play]");
  var clockEl = section.querySelector("[data-film-clock]");
  var scrub = section.querySelector("[data-film-scrub]");
  var track = section.querySelector("[data-film-track]");
  var fill = section.querySelector("[data-film-fill]");
  var thumb = section.querySelector("[data-film-thumb]");
  var tip = section.querySelector("[data-film-tip]");
  if (!stageEl || !svg || !scrub || !track) return;

  /* ---- constants ---- */
  var DURATION = 90;
  var MARKERS = [
    { t: 0,  n: "1", name: "The Brain",          settle: 20 },
    { t: 21, n: "2", name: "The Workflow",       settle: 42 },
    { t: 43, n: "3", name: "The Agents",         settle: 64 },
    { t: 65, n: "4", name: "The Tools",          settle: 83 },
    { t: 84, n: "L", name: "The working system", settle: 90, lockup: true }
  ];
  var LABELS = ["chapter1", "chapter2", "chapter3", "chapter4", "lockup"];

  var prefersReduced = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  /* ---- small helpers ---- */
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function pad2(n) { return n < 10 ? "0" + n : "" + n; }
  function fmt(sec) {
    sec = clamp(Math.floor(sec), 0, DURATION);
    return Math.floor(sec / 60) + ":" + pad2(sec % 60);
  }
  function chapterIndexAt(time) {
    var idx = 0;
    for (var i = 0; i < MARKERS.length; i++) if (MARKERS[i].t <= time + 1e-4) idx = i;
    return idx;
  }
  function chapterLabel(i) {
    var m = MARKERS[i];
    return m.lockup ? "Lock-up: " + m.name : "Chapter " + m.n + ": " + m.name;
  }

  /* cubic-bezier(x1,y1,x2,y2) -> ease(progress)->value, matching CSS. Pure
     core (no GSAP plugin), so the timeline reproduces the studio ease tokens
     exactly while staying deterministically scrubbable. */
  function cubicBezier(x1, y1, x2, y2) {
    var A = function (a, b) { return 1 - 3 * b + 3 * a; };
    var B = function (a, b) { return 3 * b - 6 * a; };
    var C = function (a) { return 3 * a; };
    var calc = function (t, a, b) { return ((A(a, b) * t + B(a, b)) * t + C(a)) * t; };
    var slope = function (t, a, b) { return 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a); };
    function solveX(x) {
      var t = x;
      for (var i = 0; i < 5; i++) {
        var s = slope(t, x1, x2);
        if (s === 0) break;
        t -= (calc(t, x1, x2) - x) / s;
      }
      return t;
    }
    return function (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      return calc(solveX(x), y1, y2);
    };
  }
  function easeFromToken(name, fallback) {
    var raw = "";
    try { raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim(); } catch (e) {}
    var m = raw.match(/cubic-bezier\(([^)]+)\)/);
    if (m) {
      var p = m[1].split(",").map(function (s) { return parseFloat(s); });
      if (p.length === 4 && p.every(function (v) { return !isNaN(v); })) {
        return cubicBezier(p[0], p[1], p[2], p[3]);
      }
    }
    return cubicBezier(fallback[0], fallback[1], fallback[2], fallback[3]);
  }
  var easeOut = easeFromToken("--ease-out-strong", [0.23, 1, 0.32, 1]);
  var easeInOut = easeFromToken("--ease-in-out-strong", [0.77, 0, 0.175, 1]);

  /* ---- build chapter ticks (presentational marks, mouse-clickable) ----
     Kept OUT of the role=slider's accessibility tree (the slider stays a clean
     leaf widget); keyboard users reach chapters via the slider's ↑/↓/[ ] keys,
     which announce via aria-valuetext. Mouse users click a tick. */
  var ticks = [];
  MARKERS.forEach(function (m, i) {
    var el = document.createElement("div");
    el.className = "film__tick";
    el.setAttribute("aria-hidden", "true");
    el.style.setProperty("--at", (m.t / DURATION * 100) + "%");
    el.setAttribute("data-i", i);
    // insert before the tooltip so the tip paints on top
    scrub.insertBefore(el, tip || null);
    ticks.push(el);
  });

  /* ---- transport state ---- */
  var tl = null;
  var ready = false;
  var userPaused = false;
  var scrubbing = false;
  var idleTimer = 0;

  function setPlaying(on) {
    section.setAttribute("data-playing", on ? "true" : "false");
    if (playBtn) playBtn.setAttribute("aria-label", on ? "Pause" : "Play");
  }
  function markReady() {
    if (ready) return;
    ready = true;
    section.setAttribute("data-film-ready", "true");
  }

  function showTip(i) {
    if (!tip) return;
    tip.textContent = chapterLabel(i);
    tip.style.setProperty("--at", (MARKERS[i].t / DURATION * 100) + "%");
    tip.setAttribute("data-shown", "true");
  }
  function hideTip() { if (tip) tip.removeAttribute("data-shown"); }

  /* ---- single render from tl.time() ---- */
  var lastChapter = -1;
  function render() {
    if (!tl) return;
    var time = tl.time();
    var pct = (time / DURATION) * 100;
    if (fill) fill.style.width = pct + "%";
    if (thumb) thumb.style.left = pct + "%";
    if (clockEl) clockEl.textContent = fmt(time) + " / " + fmt(DURATION);

    var ci = chapterIndexAt(time);
    scrub.setAttribute("aria-valuenow", Math.round(time));
    scrub.setAttribute("aria-valuetext", fmt(time) + " of " + fmt(DURATION) + ", " + chapterLabel(ci));

    for (var i = 0; i < ticks.length; i++) {
      if (MARKERS[i].t <= time + 1e-4) ticks[i].setAttribute("data-passed", "true");
      else ticks[i].removeAttribute("data-passed");
    }
    if (ci !== lastChapter) {
      lastChapter = ci;
      for (var c = 0; c < captionEls.length; c++) {
        captionEls[c].setAttribute("data-active", c === ci ? "true" : "false");
      }
    }
  }

  /* ---- seek / play / pause ---- */
  function seekTo(time) { if (tl) { tl.pause(); setPlaying(false); tl.seek(clamp(time, 0, DURATION)); render(); } }
  function doPlay() {
    if (!tl || prefersReduced) return;
    markReady();
    userPaused = false;
    if (tl.time() >= DURATION - 1e-3) tl.seek(0);
    tl.play();
    setPlaying(true);
    armIdle();
  }
  function doPause(manual) {
    if (!tl) return;
    tl.pause();
    setPlaying(false);
    if (manual) userPaused = true;
    clearHide();
  }
  function togglePlay() {
    if (!tl) return;
    if (section.getAttribute("data-playing") === "true") doPause(true);
    else doPlay();
  }

  function gotoChapter(i, autoplay) {
    i = clamp(i, 0, MARKERS.length - 1);
    if (prefersReduced) { markReady(); seekTo(MARKERS[i].settle); return; }
    var wasPlaying = section.getAttribute("data-playing") === "true" || autoplay;
    seekTo(MARKERS[i].t);
    if (wasPlaying) doPlay();
  }

  /* ---- auto-hide transport while playing + idle ---- */
  function armIdle() {
    clearHide();
    if (section.getAttribute("data-playing") !== "true") return;
    idleTimer = window.setTimeout(function () {
      if (section.getAttribute("data-playing") === "true" && !section.contains(document.activeElement)) {
        section.setAttribute("data-controls", "hidden");
      }
    }, 2500);
  }
  function clearHide() {
    if (idleTimer) { window.clearTimeout(idleTimer); idleTimer = 0; }
    section.removeAttribute("data-controls");
  }
  section.addEventListener("pointermove", function () { clearHide(); armIdle(); }, { passive: true });
  section.addEventListener("focusin", clearHide);

  /* ---- scrub: drag-to-seek anywhere on the track ---- */
  function ratioFromX(clientX) {
    var r = track.getBoundingClientRect();
    return r.width ? clamp((clientX - r.left) / r.width, 0, 1) : 0;
  }
  var resumeAfterScrub = false;
  scrub.addEventListener("pointerdown", function (e) {
    if (!tl) return;
    var tickEl = e.target.closest ? e.target.closest(".film__tick") : null;
    if (tickEl) { gotoChapter(parseInt(tickEl.getAttribute("data-i"), 10), false); return; }
    if (prefersReduced) return; // no continuous scrub under reduced motion
    scrubbing = true;
    resumeAfterScrub = section.getAttribute("data-playing") === "true";
    section.setAttribute("data-scrubbing", "true");
    try { scrub.setPointerCapture(e.pointerId); } catch (_) {}
    seekTo(ratioFromX(e.clientX) * DURATION);
  });
  scrub.addEventListener("pointermove", function (e) {
    if (!scrubbing) return;
    seekTo(ratioFromX(e.clientX) * DURATION);
  });
  function endScrub(e) {
    if (!scrubbing) return;
    scrubbing = false;
    section.removeAttribute("data-scrubbing");
    try { scrub.releasePointerCapture(e.pointerId); } catch (_) {}
    if (resumeAfterScrub) doPlay();
  }
  scrub.addEventListener("pointerup", endScrub);
  scrub.addEventListener("pointercancel", endScrub);

  /* tick tooltip on hover; current-chapter tip while the slider is focused */
  ticks.forEach(function (el, i) {
    el.addEventListener("pointerenter", function () { showTip(i); });
    el.addEventListener("pointerleave", hideTip);
  });
  scrub.addEventListener("focus", function () { if (tl) showTip(chapterIndexAt(tl.time())); });
  scrub.addEventListener("blur", hideTip);

  /* ---- keyboard map on the slider ---- */
  scrub.addEventListener("keydown", function (e) {
    if (!tl) return;
    var t = tl.time();
    var ci = chapterIndexAt(t);
    var handled = true;
    switch (e.key) {
      case " ": case "Spacebar": case "k": togglePlay(); break;
      case "ArrowLeft":
        if (prefersReduced) gotoChapter(ci - 1, false); else seekTo(t - 5);
        break;
      case "ArrowRight":
        if (prefersReduced) gotoChapter(ci + 1, false); else seekTo(t + 5);
        break;
      case "ArrowUp": case "[": gotoChapter(ci - 1, false); break;
      case "ArrowDown": case "]": gotoChapter(ci + 1, false); break;
      case "Home": gotoChapter(0, false); break;
      case "End": gotoChapter(MARKERS.length - 1, false); break;
      default: handled = false;
    }
    if (handled) { e.preventDefault(); showTip(chapterIndexAt(tl.time())); }
  });

  if (playBtn) playBtn.addEventListener("click", togglePlay);

  /* ============================================================
     Timeline build — runs once GSAP is loaded.
     ============================================================ */
  function buildTimeline(gsap) {
    var $ = function (sel) { return svg.querySelector(sel); };
    var $$ = function (sel) { return Array.prototype.slice.call(svg.querySelectorAll(sel)); };
    var scenes = {
      brain: $('[data-scene="brain"]'),
      workflow: $('[data-scene="workflow"]'),
      agents: $('[data-scene="agents"]'),
      tools: $('[data-scene="tools"]'),
      lockup: $('[data-scene="lockup"]')
    };

    /* generate the 13 workflow ticks + 4 human gates into the SVG so positions
       are exact and GSAP can target them (kept out of markup to stay lean). */
    var SVGNS = "http://www.w3.org/2000/svg";
    var ticksG = $("[data-wf-ticks]");
    var gatesG = $("[data-wf-gates]");
    var GATE_AT = { 2: 1, 5: 1, 8: 1, 11: 1 };
    var wfTicks = [], wfGates = [];
    for (var i = 0; i < 13; i++) {
      var x = 190 + i * (820 / 12);
      var r = document.createElementNS(SVGNS, "rect");
      r.setAttribute("x", x - 3); r.setAttribute("y", 323);
      r.setAttribute("width", 6); r.setAttribute("height", 28); r.setAttribute("rx", 3);
      r.setAttribute("fill", "var(--film-fg-quiet)");
      ticksG.appendChild(r); wfTicks.push(r);
      if (GATE_AT[i]) {
        var g = document.createElementNS(SVGNS, "rect");
        g.setAttribute("x", x - 30); g.setAttribute("y", 274);
        g.setAttribute("width", 60); g.setAttribute("height", 38); g.setAttribute("rx", 10);
        g.setAttribute("fill", "var(--fg-accent)");
        gatesG.appendChild(g); wfGates.push(g);
      }
    }

    /* ---- initial states (so scrubbing back to 0 restores exactly) ---- */
    gsap.set(scenes.brain, { opacity: 1 });
    gsap.set([scenes.workflow, scenes.agents, scenes.tools, scenes.lockup], { opacity: 0 });

    gsap.set($("[data-brain-core]"), { transformOrigin: "center center", scale: 0.6, opacity: 0 });
    gsap.set($$("[data-brain-layer]"), { opacity: 0, y: 16 });
    gsap.set($("[data-brain-next]"), { opacity: 0, x: -12 });
    gsap.set($("[data-brain-note]"), { opacity: 0 });

    gsap.set($("[data-wf-track]"), { transformOrigin: "left center", scaleX: 0 });
    gsap.set(wfTicks, { transformOrigin: "center center", scale: 0, opacity: 0 });
    gsap.set(wfGates, { transformOrigin: "center bottom", opacity: 0, y: 16 });
    gsap.set($("[data-wf-note]"), { opacity: 0 });
    gsap.set($("[data-wf-word]"), { opacity: 0 });

    gsap.set($$("[data-agent-lane]"), { opacity: 0, x: -28 });
    gsap.set($("[data-agent-token]"), { x: 0, y: 0, opacity: 0 });
    gsap.set($("[data-agent-human-dot]"), { transformOrigin: "center center" });
    gsap.set($("[data-agent-merge-dot]"), { transformOrigin: "center center", opacity: 0 });
    gsap.set($("[data-agent-note]"), { opacity: 0 });
    gsap.set($("[data-agent-word]"), { opacity: 0 });

    gsap.set($("[data-tools-track]"), { transformOrigin: "left center", scaleX: 0 });
    gsap.set($$("[data-tool]"), { opacity: 0, y: -40 });
    gsap.set($("[data-tools-note]"), { opacity: 0 });
    gsap.set($("[data-tools-word]"), { opacity: 0 });

    gsap.set($$("[data-lockup-cell]"), { transformOrigin: "center center", scale: 0.6, opacity: 0 });
    gsap.set($("[data-lockup-word]"), { opacity: 0, y: 12 });

    var master = gsap.timeline({ paused: true, onUpdate: render });

    /* ===== 01 The Brain (0–21) ===== */
    var brain = gsap.timeline();
    brain.to($("[data-brain-core]"), { scale: 1, opacity: 1, duration: 0.6, ease: easeOut }, 0);
    brain.to($("[data-brain-note]"), { opacity: 1, duration: 0.6, ease: easeOut }, 1.2);
    brain.to($$("[data-brain-layer]"), { opacity: 1, y: 0, duration: 0.7, ease: easeOut, stagger: 2.4 }, 1.6);
    brain.to($("[data-brain-next]"), { opacity: 1, x: 0, duration: 0.7, ease: easeOut }, 16.5);
    brain.to($("[data-brain-next]"), { scale: 1.04, transformOrigin: "center center", duration: 0.45, ease: easeOut, yoyo: true, repeat: 1 }, 18.4);
    master.addLabel(LABELS[0], 0);
    master.add(brain, 0);

    /* ===== 02 The Workflow (21–43) — track + 13 ticks + 4 human-gate HOLDs ===== */
    master.to(scenes.brain, { opacity: 0, duration: 0.7, ease: easeOut }, 21);
    master.to(scenes.workflow, { opacity: 1, duration: 0.7, ease: easeOut }, 21);
    var wf = gsap.timeline();
    wf.to($("[data-wf-word]"), { opacity: 0.16, duration: 0.8, ease: easeOut }, 0);
    wf.to($("[data-wf-track]"), { scaleX: 1, duration: 1.6, ease: easeOut }, 0.2);
    wf.to($("[data-wf-note]"), { opacity: 1, duration: 0.6, ease: easeOut }, 0.8);
    wf.to(wfTicks, { scale: 1, opacity: 1, duration: 0.45, ease: easeOut, stagger: 0.5 }, 1.4);
    // gates lift in warm-red with a HOLD between each — motion IS the gate
    wfGates.forEach(function (g, gi) {
      wf.to(g, { opacity: 1, y: 0, duration: 0.55, ease: easeOut }, 9 + gi * 2.6);
    });
    master.addLabel(LABELS[1], 21);
    master.add(wf, 21);

    /* ===== 03 The Agents (43–65) — lanes + work token handoff ===== */
    master.to(scenes.workflow, { opacity: 0, duration: 0.7, ease: easeOut }, 43);
    master.to(scenes.agents, { opacity: 1, duration: 0.7, ease: easeOut }, 43);
    var ag = gsap.timeline();
    ag.to($("[data-agent-word]"), { opacity: 0.16, duration: 0.8, ease: easeOut }, 0);
    ag.to($$("[data-agent-lane]"), { opacity: 1, x: 0, duration: 0.6, ease: easeOut, stagger: 0.45 }, 0.4);
    ag.to($("[data-agent-token]"), { opacity: 1, duration: 0.4, ease: easeOut }, 2.0);
    ag.to($("[data-agent-note]"), { opacity: 1, duration: 0.6, ease: easeOut }, 2.0);
    // token hands off lane→lane (eased arcs), human dot pulses mint at reviews
    var dot = $("[data-agent-human-dot]");
    ag.to($("[data-agent-token]"), { x: 60, y: 90, duration: 1.4, ease: easeInOut }, 3.2);
    ag.to(dot, { scale: 1.4, duration: 0.4, ease: easeOut, yoyo: true, repeat: 1 }, 4.6);
    ag.to($("[data-agent-token]"), { x: 0, y: 180, duration: 1.4, ease: easeInOut }, 6.0);
    ag.to(dot, { scale: 1.4, duration: 0.4, ease: easeOut, yoyo: true, repeat: 1 }, 7.4);
    ag.to($("[data-agent-token]"), { x: 300, y: 90, duration: 1.6, ease: easeInOut }, 9.0);
    // merge — mint review dot cross-fades to the lime merge dot (opacity is
    // deterministically scrubbable; a var() color can't be tweened by attr).
    var mergeDot = $("[data-agent-merge-dot]");
    ag.to(dot, { opacity: 0, duration: 0.4, ease: easeOut }, 11.0);
    ag.to(mergeDot, { opacity: 1, duration: 0.4, ease: easeOut }, 11.0);
    ag.to(mergeDot, { scale: 1.5, duration: 0.5, ease: easeOut, yoyo: true, repeat: 1 }, 11.0);
    master.addLabel(LABELS[2], 43);
    master.add(ag, 43);

    /* ===== 04 The Tools (65–84) — workflow track returns; tools dock ===== */
    master.to(scenes.agents, { opacity: 0, duration: 0.7, ease: easeOut }, 65);
    master.to(scenes.tools, { opacity: 1, duration: 0.7, ease: easeOut }, 65);
    var tools = gsap.timeline();
    tools.to($("[data-tools-word]"), { opacity: 0.16, duration: 0.8, ease: easeOut }, 0);
    tools.to($("[data-tools-track]"), { scaleX: 1, duration: 1.4, ease: easeOut }, 0.3); // continuity rhyme with ch02
    tools.to($("[data-tools-note]"), { opacity: 1, duration: 0.6, ease: easeOut }, 0.8);
    tools.to($$("[data-tool]"), { opacity: 1, y: 0, duration: 0.7, ease: easeOut, stagger: 0.7 }, 1.4); // slide down + dock
    master.addLabel(LABELS[3], 65);
    master.add(tools, 65);

    /* ===== Lock-up (84–90) — four motifs seat into the 2×2 lattice ===== */
    master.to(scenes.tools, { opacity: 0, duration: 0.7, ease: easeOut }, 84);
    master.to(scenes.lockup, { opacity: 1, duration: 0.7, ease: easeOut }, 84);
    var lock = gsap.timeline();
    lock.to($$("[data-lockup-cell]"), { scale: 1, opacity: 1, duration: 0.8, ease: easeOut, stagger: 0.45 }, 0.2);
    lock.to($("[data-lockup-word]"), { opacity: 1, y: 0, duration: 0.9, ease: easeOut }, 2.6);
    master.addLabel(LABELS[4], 84);
    master.add(lock, 84);

    // pin total duration to exactly 90s so the clock reads 1:30 (empty-tween
    // spacer is GSAP's standard way to extend a timeline to a fixed length)
    master.to({}, { duration: 0.001 }, DURATION - 0.001);

    master.eventCallback("onComplete", function () { setPlaying(false); clearHide(); });
    return master;
  }

  /* ============================================================
     Lazy init — load GSAP only when the section nears the viewport.
     ============================================================ */
  var loaded = false;
  function init() {
    if (loaded) return;
    loaded = true;
    import("gsap").then(function (ns) {
      var gsap = ns && (ns.gsap || ns.default);
      if (!gsap) return; // poster stays
      try {
        tl = buildTimeline(gsap);
      } catch (err) {
        tl = null;
        return; // poster stays — never a blank box
      }
      render();
      if (prefersReduced) {
        // static, captioned step-through: show first key-frame, no autoplay
        markReady();
        if (playBtn) playBtn.disabled = true;
        seekTo(MARKERS[0].settle);
      } else {
        watchVisibility();
      }
    }).catch(function () { /* import failed (old browser / offline) — poster stays */ });
  }

  /* play on scroll-in, pause on scroll-out (respects a manual pause).
     Observe the STAGE box (~16:9), not the tall section — a section taller
     than the viewport can't reach a high intersectionRatio, so it would never
     register as "scrolled away". Hysteresis (play >=0.6, pause <=0.3, hold the
     state between) avoids flapping mid-scroll. */
  function watchVisibility() {
    var box = stageEl.closest(".film__stage-wrap") || section;
    if (!("IntersectionObserver" in window)) { doPlay(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var r = en.intersectionRatio;
        if (r >= 0.6) {
          if (!userPaused) doPlay();
        } else if (r <= 0.3) {
          if (section.getAttribute("data-playing") === "true") doPause(false);
        }
      });
    }, { threshold: [0, 0.3, 0.6, 1] });
    io.observe(box);
  }

  // loader observer — fire ~one viewport early so GSAP is ready on arrival
  if ("IntersectionObserver" in window) {
    var loader = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { loader.disconnect(); init(); }
    }, { rootMargin: "300px 0px" });
    loader.observe(section);
  } else {
    init();
  }
})();
