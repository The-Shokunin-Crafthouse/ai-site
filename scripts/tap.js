/* Tap-scale spring + yellow tap-flash — mobile / touch only.
   MOBILE-UPDATE-SPEC §3.1 + §3.2 + §3.4.

   Spring: stiffness 400, damping 25 on scale 1 → 0.92 → 1.
   Duration ceiling 220ms (clamp via animate stop).
   Yellow flash: 120ms ease-out on background overlay (CSS-driven).

   Targets: all interactive tier elements per owner spec — "any element that
   receives a tap/click and currently has a hover scale on desktop gets the
   spring on mobile." We include the union:
   - .overview-row buttons
   - .card buttons (inside the overview tier-2 panel)
   - .step__head buttons
   - .brain-row__head buttons
   - .tools-row__head buttons
   - .hiring__tab buttons
   - .hero__skip CTA
   - .hiring__cta-link
   - [data-tap-scale] opt-in

   If new tier elements appear later, add data-tap-scale to opt them in
   without modifying this selector list. */
(function () {
  "use strict";
  if (typeof window === "undefined") return;
  if (!window.matchMedia) return;

  var mqTouch = window.matchMedia("(hover: none) and (pointer: coarse)");

  /* Don't run on hover-capable pointers — desktop hover-comet handles those. */
  if (!mqTouch.matches) return;

  var pm = window.popmotion;
  if (!pm || !pm.animate) return;

  /* Buttons get a subtle scale + 2px yellow border on tap. Rows get only
     a number-color flash (no scale, no border) — handled via CSS rule
     against [data-tap-active="true"]. */
  var BUTTON_SELECTORS = [
    ".card",
    ".hero__skip",
    ".timeline__btn",
    ".timeline__show-all",
    ".hiring__tab",
    ".hiring__cta-link",
    "[data-tap-scale]",
  ];
  var ROW_SELECTORS = [
    ".overview-row",
    ".step__head",
    ".brain-row__head",
    ".tools-row__head",
  ];
  var SELECTOR = BUTTON_SELECTORS.concat(ROW_SELECTORS).join(",");
  var BUTTON_SELECTOR = BUTTON_SELECTORS.join(",");

  var SPRING = { stiffness: 400, damping: 25 };
  /* Scale halved from 0.92 → 0.96 per owner feedback — prior value read as
     cartoony. Rows skip scale entirely (handled in onPointerDown). */
  var SCALE_TAP = 0.96;
  var SCALE_REST = 1;
  var DURATION_CAP_MS = 220;

  /* Track active animations per element so retap cancels cleanly. */
  var activeAnims = new WeakMap();

  function springScale(el, from, to, onComplete) {
    var prev = activeAnims.get(el);
    if (prev && prev.stop) prev.stop();
    var startTime = performance.now();
    var capTimer = null;

    var anim = pm.animate({
      from: from,
      to: to,
      type: "spring",
      stiffness: SPRING.stiffness,
      damping: SPRING.damping,
      onUpdate: function (v) {
        el.style.transform = "scale(" + v + ")";
        if (performance.now() - startTime >= DURATION_CAP_MS) {
          /* Clamp — settle to target immediately if not resolved. */
          el.style.transform = "scale(" + to + ")";
          if (anim && anim.stop) anim.stop();
          activeAnims.delete(el);
          if (onComplete) onComplete();
        }
      },
      onComplete: function () {
        activeAnims.delete(el);
        if (capTimer) clearTimeout(capTimer);
        if (onComplete) onComplete();
      },
    });

    activeAnims.set(el, anim);
  }

  function onPointerDown(e) {
    var el = e.currentTarget;
    if (!el) return;
    var isButton = el.matches(BUTTON_SELECTOR);
    /* Press scale via spring (buttons only — rows stay still). */
    if (isButton) {
      springScale(el, SCALE_REST, SCALE_TAP);
    }
    el.setAttribute("data-tap-active", "true");

    function release() {
      el.removeEventListener("pointerup", release);
      el.removeEventListener("pointercancel", release);
      el.removeEventListener("pointerleave", release);
      el.removeAttribute("data-tap-active");
      if (isButton) {
        springScale(el, SCALE_TAP, SCALE_REST);
      }
    }

    el.addEventListener("pointerup", release);
    el.addEventListener("pointercancel", release);
    el.addEventListener("pointerleave", release);
  }

  function bindAll() {
    var nodes = document.querySelectorAll(SELECTOR);
    nodes.forEach(function (el) {
      if (el.__tapBound) return;
      el.__tapBound = true;
      el.addEventListener("pointerdown", onPointerDown);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindAll);
  } else {
    bindAll();
  }

  /* Re-bind after structural fold-in (app.js moves nodes around). */
  window.addEventListener("load", bindAll);
})();
