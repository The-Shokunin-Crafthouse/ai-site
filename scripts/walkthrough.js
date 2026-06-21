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
  /* v2: recompressed to a tight ~30s, five ~6s beats. Markers/labels stay 5;
     only their times compress. Everything downstream (clock, ticks, ARIA,
     reduced-motion step-through) derives from these, so nothing else changes. */
  var DURATION = 30;
  var MARKERS = [
    { t: 0,  n: "1", name: "The Brain",          settle: 5 },
    { t: 6,  n: "2", name: "The Workflow",       settle: 11 },
    { t: 12, n: "3", name: "The Agents",         settle: 17 },
    { t: 18, n: "4", name: "The Tools",          settle: 23 },
    { t: 24, n: "L", name: "The working system", settle: 30, lockup: true }
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

  /* v2 uses GSAP's native expressive eases (power4/expo/back/elastic/sine) —
     each a deterministic function of progress, fully scrubbable. The v1
     token-bezier ease solver was retired with the slow crossfades it served. */

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

    var SVGNS = "http://www.w3.org/2000/svg";
    function mk(tag, attrs, parent) {
      var el = document.createElementNS(SVGNS, tag);
      for (var k in attrs) el.setAttribute(k, attrs[k]);
      (parent || svg).appendChild(el);
      return el;
    }

    /* ---- ambient background: dot-grid + scan bar. CSS-animated (infinite),
       independent of the timeline — keeps the frame alive even while paused or
       scrubbing, and reduced-motion disables the CSS animation. Inserted BEHIND
       the scene groups. Filled dots, not stroked lines (no outline-stroke tell). */
    var grid = document.createElementNS(SVGNS, "g");
    grid.setAttribute("data-bg-grid", "");
    for (var gy = 38; gy < 675; gy += 62) {
      for (var gx = 40; gx < 1200; gx += 62) {
        mk("circle", { cx: gx, cy: gy, r: 1.6, fill: "var(--film-fg-quiet)", opacity: 0.45 }, grid);
      }
    }
    svg.insertBefore(grid, scenes.brain);
    var scan = mk("rect", { x: -170, y: 0, width: 170, height: 675, fill: "var(--accent-primary)" });
    scan.setAttribute("data-bg-scan", "");
    svg.insertBefore(scan, scenes.brain);

    /* ---- cut flash: full-stage lime, on TOP of the scenes, fired on every
       hard cut to punctuate the edit ---- */
    var flashEl = mk("rect", { x: 0, y: 0, width: 1200, height: 675, fill: "var(--accent-primary)", opacity: 0, "data-cut-flash": "" });

    /* ---- 13 workflow ticks + 4 human gates ---- */
    var ticksG = $("[data-wf-ticks]");
    var gatesG = $("[data-wf-gates]");
    var GATE_AT = { 2: 1, 5: 1, 8: 1, 11: 1 };
    var wfTicks = [], wfGates = [];
    for (var i = 0; i < 13; i++) {
      var x = 190 + i * (820 / 12);
      wfTicks.push(mk("rect", { x: x - 3, y: 323, width: 6, height: 28, rx: 3, fill: "var(--film-fg-quiet)" }, ticksG));
      if (GATE_AT[i]) wfGates.push(mk("rect", { x: x - 30, y: 274, width: 60, height: 38, rx: 10, fill: "var(--fg-accent)" }, gatesG));
    }

    /* ---- impact rings: transient FX (animated scale + fade), NOT structural
       outline borders. Parented to a scene so each hides with its beat. ---- */
    function ring(parent, cx, cy, color) {
      return mk("circle", { cx: cx, cy: cy, r: 44, fill: "none", stroke: color, "stroke-width": 3, opacity: 0 }, parent);
    }
    var ringNext = ring(scenes.brain, 874, 359, "var(--accent-primary)");
    var ringMerge = ring(scenes.agents, 903, 332, "var(--accent-primary)");
    var ringTools = [
      ring(scenes.tools, 340, 260, "var(--accent-primary)"),
      ring(scenes.tools, 600, 260, "var(--hover-mint)"),
      ring(scenes.tools, 860, 260, "var(--accent-primary)")
    ];
    var ringLock = ring(scenes.lockup, 600, 337, "var(--accent-primary)");
    var gateRings = wfGates.map(function (g) {
      return ring(scenes.workflow, parseFloat(g.getAttribute("x")) + 30, 293, "var(--fg-accent)");
    });

    /* ---- brain data-tick stream (filled marks flowing into the core) ---- */
    var streams = [];
    for (var s = 0; s < 5; s++) streams.push(mk("rect", { x: 980, y: 330 + s * 8, width: 22, height: 4, rx: 2, fill: "var(--hover-mint)", opacity: 0 }, scenes.brain));

    /* ---- agents work-token motion trail + lock-up accent sweep ---- */
    var trail = mk("rect", { x: 540, y: 226, width: 40, height: 32, rx: 8, fill: "var(--accent-primary)", opacity: 0 }, scenes.agents);
    var sweep = mk("rect", { x: 300, y: 150, width: 96, height: 360, fill: "var(--accent-primary)", opacity: 0 }, scenes.lockup);

    /* ---- initial states (so scrubbing back to 0 restores exactly). Display
       words are full-opacity events that SLAM in — no ghost. Mono notes stay
       visible with their scene (no fade). ---- */
    gsap.set(scenes.brain, { opacity: 1 });
    gsap.set([scenes.workflow, scenes.agents, scenes.tools, scenes.lockup], { opacity: 0 });
    gsap.set(flashEl, { opacity: 0 });

    gsap.set($("[data-brain-word]"), { transformOrigin: "center center", scale: 1.3, opacity: 0 });
    gsap.set($("[data-brain-core]"), { transformOrigin: "center center", scale: 0.5, opacity: 0 });
    gsap.set($$("[data-brain-layer]"), { transformOrigin: "center center", scaleX: 0.5, y: 10, opacity: 0 });
    gsap.set($("[data-brain-next]"), { transformOrigin: "center center", scale: 0.6, opacity: 0 });

    gsap.set($("[data-wf-word]"), { x: -70, opacity: 0 });
    gsap.set($("[data-wf-track]"), { transformOrigin: "left center", scaleX: 0 });
    gsap.set(wfTicks, { transformOrigin: "center center", scale: 0, opacity: 0 });
    gsap.set(wfGates, { transformOrigin: "center bottom", y: 18, opacity: 0 });

    gsap.set($("[data-agent-word]"), { transformOrigin: "center center", scale: 1.3, opacity: 0 });
    gsap.set($$("[data-agent-lane]"), { x: -44, opacity: 0 });
    gsap.set($("[data-agent-token]"), { x: 0, y: 0, opacity: 0 });
    gsap.set($("[data-agent-human-dot]"), { transformOrigin: "center center" });
    gsap.set($("[data-agent-merge-dot]"), { transformOrigin: "center center", opacity: 0 });

    gsap.set($("[data-tools-word]"), { x: 70, opacity: 0 });
    gsap.set($("[data-tools-track]"), { transformOrigin: "left center", scaleX: 0 });
    gsap.set($$("[data-tool]"), { transformOrigin: "center center", y: -54, opacity: 0 });

    gsap.set($$("[data-lockup-cell]"), { transformOrigin: "center center", scale: 0.4, opacity: 0 });
    gsap.set($("[data-lockup-word]"), { transformOrigin: "center center", scale: 0.7, opacity: 0 });

    gsap.set([ringNext, ringMerge, ringLock].concat(ringTools, gateRings), { transformOrigin: "center center", scale: 0.3, opacity: 0 });

    var master = gsap.timeline({ paused: true, onUpdate: render });

    /* hard-cut helpers: 60ms scene swap on the beat + a lime flash to punctuate
       the edit. Short eased tweens — deterministic + scrubbable, no physics. */
    function cut(at, prev) {
      if (prev) master.to(prev, { opacity: 0, duration: 0.06, ease: "none" }, at);
      master.fromTo(flashEl, { opacity: 0.5 }, { opacity: 0, duration: 0.22, ease: "power2.out" }, at);
    }
    function show(at, scene) { master.to(scene, { opacity: 1, duration: 0.06, ease: "none" }, at); }
    function ringHit(t, el, at, toScale, dur) {
      t.fromTo(el, { scale: 0.3, opacity: 0.9 }, { scale: toScale || 2.4, opacity: 0, duration: dur || 0.42, ease: "power2.out" }, at);
    }

    /* ===== 01 The Brain (0–6) — core punch, fast layer accrete, stream, ignite ===== */
    master.addLabel(LABELS[0], 0);
    cut(0, null);
    var brain = gsap.timeline();
    brain.to($("[data-brain-word]"), { scale: 1, opacity: 1, duration: 0.22, ease: "back.out(1.7)" }, 0.04);
    brain.to($("[data-brain-core]"), { scale: 1, opacity: 1, duration: 0.2, ease: "back.out(1.7)" }, 0.1);
    brain.to($$("[data-brain-layer]"), { scaleX: 1, y: 0, opacity: 1, duration: 0.16, ease: "back.out(2)", stagger: 0.04 }, 0.3);
    brain.set(streams, { opacity: 0.7 }, 0.6);
    brain.fromTo(streams, { x: 980 }, { x: 700, duration: 0.6, ease: "power1.in", stagger: 0.1, repeat: 6 }, 0.6);
    brain.to(streams, { opacity: 0, duration: 0.2 }, 4.7);
    brain.to($("[data-brain-core]"), { scale: 1.03, duration: 0.7, ease: "sine.inOut", yoyo: true, repeat: 5 }, 0.45); // breathing — held-alive
    brain.to($("[data-brain-next]"), { scale: 1, opacity: 1, duration: 0.24, ease: "back.out(2.2)" }, 4.7);
    ringHit(brain, ringNext, 4.78, 2.6, 0.5);
    master.add(brain, 0);

    /* ===== 02 The Workflow (6–12) — track draw, 13-tick wave, 4 gate slams ===== */
    master.addLabel(LABELS[1], 6);
    cut(6, scenes.brain); show(6, scenes.workflow);
    var wf = gsap.timeline();
    wf.fromTo($("[data-wf-word]"), { x: -70, opacity: 0 }, { x: 0, opacity: 1, duration: 0.2, ease: "power4.out" }, 0.04);
    wf.to($("[data-wf-track]"), { scaleX: 1, duration: 0.3, ease: "power4.out" }, 0.08);
    wf.to(wfTicks, { scale: 1, opacity: 1, duration: 0.14, ease: "back.out(2)", stagger: 0.03 }, 0.4);
    [1.0, 1.4, 1.8, 2.2].forEach(function (at, gi) {
      wf.to(wfGates[gi], { y: 0, opacity: 1, duration: 0.18, ease: "back.out(2.6)" }, at);
      wf.to(wfGates[gi], { x: "+=2", duration: 0.05, ease: "none", yoyo: true, repeat: 3 }, at + 0.18); // shake
      ringHit(wf, gateRings[gi], at + 0.08, 1.9, 0.34);
    });
    wf.to(wfGates, { y: "-=3", duration: 0.7, ease: "sine.inOut", yoyo: true, repeat: 3 }, 2.7); // held-alive
    master.add(wf, 6);

    /* ===== 03 The Agents (12–18) — lanes drive in, token whips + trail, merge ===== */
    master.addLabel(LABELS[2], 12);
    cut(12, scenes.workflow); show(12, scenes.agents);
    var ag = gsap.timeline();
    var dot = $("[data-agent-human-dot]"), mergeDot = $("[data-agent-merge-dot]");
    ag.to($("[data-agent-word]"), { scale: 1, opacity: 1, duration: 0.2, ease: "expo.out" }, 0.04);
    ag.to($$("[data-agent-lane]"), { x: 0, opacity: 1, duration: 0.18, ease: "back.out(1.7)", stagger: 0.05 }, 0.1);
    ag.to($("[data-agent-token]"), { opacity: 1, duration: 0.1 }, 0.5);
    function whip(at, x, y) {
      ag.to($("[data-agent-token]"), { x: x, y: y, duration: 0.2, ease: "power4.out" }, at);
      ag.to(trail, { x: x, y: y, duration: 0.34, ease: "power2.out" }, at); // lags the token = trail
      ag.fromTo(trail, { opacity: 0.45 }, { opacity: 0, duration: 0.36, ease: "power1.out" }, at);
      ag.to(dot, { scale: 1.5, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1 }, at + 0.16); // review pulse
    }
    whip(0.7, 60, 90);
    whip(1.3, 0, 180);
    whip(1.9, 300, 90);
    ag.to(dot, { opacity: 0, duration: 0.18 }, 3.4);
    ag.to(mergeDot, { opacity: 1, scale: 1.6, duration: 0.18, ease: "back.out(2)" }, 3.4); // merge = lime burst
    ag.to(mergeDot, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" }, 3.6);
    ringHit(ag, ringMerge, 3.46, 2.6, 0.5);
    ag.to($$("[data-agent-lane]"), { x: "+=5", duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: 2, stagger: 0.08 }, 4.3); // held-alive
    master.add(ag, 12);

    /* ===== 04 The Tools (18–24) — track returns, glyphs drop + dock w/ rings ===== */
    master.addLabel(LABELS[3], 18);
    cut(18, scenes.agents); show(18, scenes.tools);
    var tools = gsap.timeline();
    tools.fromTo($("[data-tools-word]"), { x: 70, opacity: 0 }, { x: 0, opacity: 1, duration: 0.2, ease: "power4.out" }, 0.04);
    tools.to($("[data-tools-track]"), { scaleX: 1, duration: 0.25, ease: "power4.out" }, 0.08); // continuity rhyme
    tools.to($$("[data-tool]"), { y: 0, opacity: 1, duration: 0.22, ease: "back.out(2.2)", stagger: 0.08 }, 0.4); // drop + dock + bounce
    ringTools.forEach(function (rg, ri) { ringHit(tools, rg, 0.56 + ri * 0.08, 1.7, 0.36); });
    tools.to($$("[data-tool]"), { y: "-=4", duration: 0.7, ease: "sine.inOut", yoyo: true, repeat: 3, stagger: 0.06 }, 1.3); // held-alive
    master.add(tools, 18);

    /* ===== Lock-up (24–30) — slam into the 2×2 lattice, sweep, title stamp ===== */
    master.addLabel(LABELS[4], 24);
    cut(24, scenes.tools); show(24, scenes.lockup);
    var lock = gsap.timeline();
    lock.to($$("[data-lockup-cell]"), { scale: 1, opacity: 1, duration: 0.22, ease: "expo.out", stagger: 0.05 }, 0.1);
    ringHit(lock, ringLock, 0.14, 3.2, 0.55); // shockwave from center
    lock.fromTo(sweep, { x: 0, opacity: 0.5 }, { x: 560, opacity: 0, duration: 0.5, ease: "power2.inOut" }, 0.5); // accent sweep
    lock.to($("[data-lockup-word]"), { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" }, 1.4); // title stamp
    master.add(lock, 24);

    // pin total duration to exactly 30s so the clock reads 0:30 (empty-tween
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
