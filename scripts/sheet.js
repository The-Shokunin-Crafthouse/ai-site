/* Tier-3 bottom sheet — mobile only.
   MOBILE-UPDATE-SPEC §3.1 — definitive sheet spec from owner 2026-05-21.

   Behavior:
   - Triggered on mobile (matchMedia max-width: 767px) when a tier-2 element
     that would expand inline on desktop is tapped.
   - Slides up from translateY(100%) to initial snap (33vh from bottom) via
     popmotion spring({ stiffness: 300, damping: 30 }).
   - Drag the handle (or sheet body when not at max) to:
     - Snap up to max (85vh) if released with upward velocity past threshold.
     - Snap back to last stable position if released with low velocity.
     - Dismiss if released with downward velocity past threshold.
   - Tap overlay or drag-to-dismiss → spring out via translateY(100%) and
     remove from DOM.
   - Scroll inside the sheet only enabled at max snap.

   TODO(sheet-content): per-section sheet content templates not yet wired.
   This file handles the container + drag/snap physics only. When section
   frame IDs (148:7358–151:18015) land, hook each tier-2 trigger to its
   matching template via openSheet(trigger, contentHTML, title, stats).

   TODO(sheet-trigger): currently no element has data-sheet-trigger. Phase
   3 follow-up: wire it onto card buttons inside the open overview-row__open
   panel + onto workflow-step / brain-row / tools-row heads so tapping any
   tier-2/3 element on mobile fires openSheet().
*/
(function () {
  "use strict";

  if (typeof window === "undefined") return;

  /* Spec constants. */
  var SNAP_INITIAL_VH = 33; /* % of viewport from bottom. */
  var SNAP_MAX_VH = 85;
  var SPRING_OPEN = { stiffness: 300, damping: 30 };
  var SPRING_SNAP = { stiffness: 300, damping: 30 };
  var DISMISS_VELOCITY = 0.5; /* px/ms — release velocity threshold. */

  var mq = window.matchMedia("(max-width: 767px)");
  var pm = window.popmotion;

  if (!pm || !pm.animate) {
    /* Popmotion not loaded — sheet would fail to spring. Bail silently;
       desktop pattern (inline expansion) still works. */
    return;
  }

  var activeSheet = null;
  var activeOverlay = null;
  var activeAnim = null;
  var currentY = 0; /* px from bottom; 0 = fully shown at max snap. */
  var snapState = "initial"; /* "initial" | "max" | "closing" */
  var dragState = null;

  /* px values for the two snap points, computed at open time so they
     respect the current viewport height (vh != vvh in mobile Safari with
     URL bar). Stored as translateY values: 0 = top of sheet at top of
     its allowed range. Sheet's actual translateY = vh - snapPx. */
  var snapInitialPx = 0;
  var snapMaxPx = 0;

  function vh() { return window.innerHeight; }

  function computeSnaps() {
    snapInitialPx = Math.round(vh() * (SNAP_INITIAL_VH / 100));
    snapMaxPx = Math.round(vh() * (SNAP_MAX_VH / 100));
  }

  /* translateY value to render the sheet at a given visible height. */
  function translateForSnap(visibleHeightPx) {
    /* Sheet's natural origin is bottom of viewport; we set max-height to
       snap-max-vh via CSS. translateY(visibleHeightPx == max → 0).
       translateY(visibleHeightPx == 0   → snapMaxPx) (fully hidden). */
    return Math.max(0, snapMaxPx - visibleHeightPx);
  }

  function setSheetY(yPx) {
    if (!activeSheet) return;
    activeSheet.style.transform = "translateY(" + yPx + "px)";
    currentY = yPx;
  }

  function setSnapState(next) {
    if (!activeSheet) return;
    snapState = next;
    activeSheet.setAttribute("data-sheet-snap", next);
  }

  function springTo(targetY, onComplete) {
    if (activeAnim && activeAnim.stop) activeAnim.stop();
    activeAnim = pm.animate({
      from: currentY,
      to: targetY,
      type: "spring",
      stiffness: SPRING_SNAP.stiffness,
      damping: SPRING_SNAP.damping,
      onUpdate: function (v) { setSheetY(v); },
      onComplete: function () {
        activeAnim = null;
        if (onComplete) onComplete();
      },
    });
  }

  function inertiaDismiss(velocity) {
    if (activeAnim && activeAnim.stop) activeAnim.stop();
    activeAnim = pm.animate({
      from: currentY,
      to: snapMaxPx, /* fully off-screen */
      velocity: velocity * 1000, /* popmotion uses px/sec */
      type: "spring",
      stiffness: SPRING_SNAP.stiffness,
      damping: SPRING_SNAP.damping,
      onUpdate: function (v) { setSheetY(v); },
      onComplete: function () { activeAnim = null; closeSheet(); },
    });
  }

  function openSheet(opts) {
    if (!mq.matches) return; /* desktop ignores */
    if (activeSheet) closeSheet();

    opts = opts || {};
    var title = opts.title || "";
    var bodyHTML = opts.bodyHTML || "";
    var statsHTML = opts.statsHTML || "";

    /* Build markup. */
    var overlay = document.createElement("div");
    overlay.className = "sheet-overlay";
    overlay.setAttribute("data-sheet-overlay", "");
    document.body.appendChild(overlay);

    var sheet = document.createElement("aside");
    sheet.className = "sheet";
    sheet.setAttribute("role", "dialog");
    sheet.setAttribute("aria-modal", "true");
    if (title) sheet.setAttribute("aria-label", title);
    sheet.setAttribute("data-sheet", "");
    sheet.setAttribute("data-sheet-snap", "initial");

    var handleArea = document.createElement("div");
    handleArea.className = "sheet__handle-area";
    handleArea.setAttribute("data-sheet-handle", "");
    var handle = document.createElement("span");
    handle.className = "sheet__handle";
    handle.setAttribute("aria-hidden", "true");
    handleArea.appendChild(handle);
    sheet.appendChild(handleArea);

    if (title) {
      var h = document.createElement("h2");
      h.className = "sheet__title";
      h.textContent = title;
      sheet.appendChild(h);
    }

    if (bodyHTML) {
      var body = document.createElement("div");
      body.className = "sheet__body";
      body.innerHTML = bodyHTML;
      sheet.appendChild(body);
    }

    if (statsHTML) {
      var stats = document.createElement("ul");
      stats.className = "sheet__stats";
      stats.innerHTML = statsHTML;
      sheet.appendChild(stats);
    }

    document.body.appendChild(sheet);
    activeSheet = sheet;
    activeOverlay = overlay;

    computeSnaps();
    /* Start fully off-screen (translateY = snapMaxPx). */
    setSheetY(snapMaxPx);
    /* Force a paint then spring to initial snap. */
    requestAnimationFrame(function () {
      overlay.setAttribute("data-active", "true");
      activeAnim = pm.animate({
        from: snapMaxPx,
        to: translateForSnap(snapInitialPx),
        type: "spring",
        stiffness: SPRING_OPEN.stiffness,
        damping: SPRING_OPEN.damping,
        onUpdate: function (v) { setSheetY(v); },
        onComplete: function () { activeAnim = null; setSnapState("initial"); },
      });
    });

    document.body.style.overflow = "hidden";
    overlay.addEventListener("click", closeSheet);
    bindDrag(handleArea);
    bindDrag(sheet); /* drag from sheet body too, but only when not scrolled */
    document.addEventListener("keydown", onKey);
  }

  function closeSheet() {
    if (!activeSheet) return;
    setSnapState("closing");
    document.removeEventListener("keydown", onKey);
    /* Spring out then unmount. */
    if (activeAnim && activeAnim.stop) activeAnim.stop();
    activeAnim = pm.animate({
      from: currentY,
      to: snapMaxPx,
      type: "spring",
      stiffness: SPRING_SNAP.stiffness,
      damping: SPRING_SNAP.damping,
      onUpdate: function (v) { setSheetY(v); },
      onComplete: function () {
        if (activeOverlay) activeOverlay.remove();
        if (activeSheet) activeSheet.remove();
        activeSheet = null;
        activeOverlay = null;
        activeAnim = null;
        document.body.style.overflow = "";
      },
    });
  }

  function onKey(e) {
    if (e.key === "Escape") closeSheet();
  }

  /* Drag tracking — pointer events with velocity sample. */
  function bindDrag(el) {
    el.addEventListener("pointerdown", onPointerDown);
  }

  function onPointerDown(e) {
    if (!activeSheet) return;
    /* If at max snap and the user is touching sheet body (not handle),
       let native scroll handle it — only initiate drag from the handle. */
    if (snapState === "max" && e.currentTarget !== activeSheet.querySelector("[data-sheet-handle]")) {
      return;
    }
    if (activeAnim && activeAnim.stop) activeAnim.stop();
    activeAnim = null;
    e.preventDefault();
    var startY = e.clientY;
    var startTranslate = currentY;
    var lastY = startY;
    var lastT = e.timeStamp;
    var velocity = 0;

    function onMove(ev) {
      var dy = ev.clientY - startY;
      var nextY = startTranslate + dy;
      /* Clamp to [translateForSnap(snapMaxPx), snapMaxPx] — i.e. between
         fully-open and fully-hidden. */
      nextY = Math.max(translateForSnap(snapMaxPx), Math.min(snapMaxPx, nextY));
      setSheetY(nextY);
      var dt = ev.timeStamp - lastT;
      if (dt > 0) velocity = (ev.clientY - lastY) / dt; /* px/ms */
      lastY = ev.clientY;
      lastT = ev.timeStamp;
    }

    function onUp(ev) {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);

      /* Decide outcome based on velocity + position. */
      if (velocity > DISMISS_VELOCITY) {
        /* Fast downward release → dismiss. */
        inertiaDismiss(velocity);
        return;
      }
      if (velocity < -DISMISS_VELOCITY) {
        /* Fast upward release → snap to max. */
        springTo(translateForSnap(snapMaxPx), function () { setSnapState("max"); });
        return;
      }
      /* Low velocity — snap to whichever is closer. */
      var initialY = translateForSnap(snapInitialPx);
      var maxY = translateForSnap(snapMaxPx);
      var distInit = Math.abs(currentY - initialY);
      var distMax = Math.abs(currentY - maxY);
      var distHidden = Math.abs(currentY - snapMaxPx);
      if (distHidden < distInit && distHidden < distMax) {
        inertiaDismiss(0.6);
      } else if (distMax < distInit) {
        springTo(maxY, function () { setSnapState("max"); });
      } else {
        springTo(initialY, function () { setSnapState("initial"); });
      }
    }

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onUp);
  }

  /* Public API — opener function for other scripts to call. */
  window.AiSiteSheet = {
    open: openSheet,
    close: closeSheet,
  };

  /* Re-compute snaps on resize. */
  window.addEventListener("resize", function () {
    if (!activeSheet) return;
    computeSnaps();
  });
})();
