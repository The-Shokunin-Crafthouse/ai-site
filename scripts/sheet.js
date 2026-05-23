/* Tier-3 bottom sheet — mobile only.
   MOBILE-UPDATE-SPEC §3.1 — definitive sheet spec + resolution log
   from owner 2026-05-21.

   Snap values (absolute px from bottom of viewport — Figma reference
   viewport 844px tall):
   - initial: 282px visible (top:562 on 844)
   - max:    660px visible (top:184 on 844 — hard max)

   Physics:
   - Open / snap: spring({ stiffness: 300, damping: 30 }) on translateY.
   - Drag-to-dismiss: release velocity > 0.5 px/ms → spring out + unmount.
   - Snap-to-max on upward release velocity > 0.5 px/ms.
   - .sheet--expanded class toggled at max snap; CSS swaps body font
     16/24 → 13/19.5 with 150ms ease-out.

   No overlay (no scrim in Figma). Outside-tap closes via a transparent
   document click listener.

   Trigger interception (mobile only — capture-phase click listener):
   - .card[data-card]            → template[data-drawer-tpl="<card>"]
   - .step__head                 → sibling .step__body innerHTML
   - .brain-row__head            → sibling .brain-row__body innerHTML
   - .tools-row__head            → sibling .tools-row__body innerHTML

   Public API: window.AiSiteSheet.open({ title, bodyHTML, statsHTML }).
*/
(function () {
  "use strict";

  if (typeof window === "undefined") return;

  /* Helpers to read px tokens from :root so we stay in lockstep with CSS. */
  function readPxToken(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    var n = parseFloat(v);
    return Number.isFinite(n) ? n : fallback;
  }

  function snapInitialPx() { return readPxToken("--sheet-snap-initial", 282); }
  function snapMaxPx()     { return readPxToken("--sheet-snap-max",     660); }

  /* Per-sheet effective max — capped by the natural content height so a
     short sheet doesn't leave empty space below the content at max snap.
     Measured once in openSheet, reset in finalizeClose. */
  var activeSheetMaxPx = null;
  function effectiveMaxPx() {
    return activeSheetMaxPx != null ? activeSheetMaxPx : snapMaxPx();
  }
  function effectiveInitialPx() {
    return Math.min(snapInitialPx(), effectiveMaxPx());
  }

  var SPRING_OPEN = { stiffness: 300, damping: 30 };
  var SPRING_SNAP = { stiffness: 300, damping: 30 };
  var DISMISS_VELOCITY = 0.5; /* px/ms */

  var mq = window.matchMedia("(max-width: 767px)");
  var pm = window.popmotion;
  if (!pm || !pm.animate) return;

  var activeSheet = null;
  var activeOverlay = null;
  var activeAnim = null;
  var currentY = 0;
  var snapState = "initial";
  var lockedScrollY = 0;
  /* Card-trigger element gets .is-open while its sheet is mounted. Cleared
     in finalizeClose. Resolution log 2026-05-21 §4.6 correction. */
  var activeTriggerCard = null;

  function setSheetY(yPx) {
    if (!activeSheet) return;
    activeSheet.style.transform = "translateY(" + yPx + "px)";
    currentY = yPx;
  }

  function setSnapState(next) {
    if (!activeSheet) return;
    snapState = next;
    activeSheet.setAttribute("data-sheet-snap", next);
    /* .sheet--expanded triggers body font swap (13/19.5) + scroll unlock. */
    if (next === "max") activeSheet.classList.add("sheet--expanded");
    else activeSheet.classList.remove("sheet--expanded");
  }

  /* translateY for a given visible height (sheet anchored to bottom of viewport,
     max-height = effective max). 0 visible → translateY(max). max visible → 0. */
  function translateFor(visibleHeightPx) {
    return Math.max(0, effectiveMaxPx() - visibleHeightPx);
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

  function dismissWith(velocity) {
    if (activeAnim && activeAnim.stop) activeAnim.stop();
    // Start the overlay fade-out the moment dismissal begins (covers
    // both drag-to-dismiss and closeSheet paths). 120ms transition vs
    // the sheet's longer spring travel.
    if (activeOverlay) activeOverlay.removeAttribute("data-active");
    activeAnim = pm.animate({
      from: currentY,
      to: effectiveMaxPx(),
      velocity: (velocity || 0) * 1000, /* popmotion uses px/sec */
      type: "spring",
      stiffness: SPRING_SNAP.stiffness,
      damping: SPRING_SNAP.damping,
      onUpdate: function (v) { setSheetY(v); },
      onComplete: function () { activeAnim = null; finalizeClose(); },
    });
  }

  function finalizeClose() {
    if (activeSheet) activeSheet.remove();
    if (activeOverlay) activeOverlay.remove();
    activeSheet = null;
    activeOverlay = null;
    activeAnim = null;
    if (activeTriggerCard) {
      activeTriggerCard.classList.remove("is-open");
      activeTriggerCard = null;
    }
    /* Restore scroll lock — clear all the pinning styles and re-anchor
       scrollY where the user was before the sheet opened. */
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, lockedScrollY);
    document.removeEventListener("keydown", onKey);
    document.removeEventListener("click", onOutsideClick, true);
    /* Sheet is fully gone — let the grain canvas paint again. */
    document.documentElement.removeAttribute("data-sheet-open");
    activeSheetMaxPx = null;
  }

  function onKey(e) { if (e.key === "Escape") closeSheet(); }

  function onOutsideClick(e) {
    if (!activeSheet) return;
    if (e.target === activeSheet || activeSheet.contains(e.target)) return;
    closeSheet();
  }

  function openSheet(opts) {
    if (!mq.matches) return;
    if (activeSheet) closeSheet();

    opts = opts || {};
    var title = opts.title || "";
    var bodyHTML = opts.bodyHTML || "";
    var statsHTML = opts.statsHTML || "";
    var iconHTML = opts.iconHTML || "";

    /* Full-viewport scrim under the sheet — site bg at 80% + 12px blur.
       Created first so it sits below the sheet in DOM order; z-index in
       CSS still establishes stacking. Activated next frame so the
       opacity transition runs from 0 → 1. */
    var overlay = document.createElement("div");
    overlay.className = "sheet-overlay";
    overlay.setAttribute("data-sheet-overlay", "");
    document.body.appendChild(overlay);
    activeOverlay = overlay;
    requestAnimationFrame(function () {
      if (activeOverlay) activeOverlay.setAttribute("data-active", "true");
    });
    overlay.addEventListener("click", closeSheet);

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
      /* Title row holds either icon + heading (card sheet) or step
         number + heading (step sheet, no icon, no divider). Number is
         passed via opts.numberText — Figma 150:13513 / 150:13975. */
      var titleRow = document.createElement("div");
      titleRow.className = "sheet__title-row";
      var numberText = opts.numberText || "";
      if (numberText) titleRow.classList.add("sheet__title-row--with-num");
      if (iconHTML) {
        var iconWrap = document.createElement("span");
        iconWrap.className = "sheet__title-icon";
        iconWrap.setAttribute("aria-hidden", "true");
        iconWrap.innerHTML = iconHTML;
        titleRow.appendChild(iconWrap);
      }
      if (numberText) {
        var num = document.createElement("span");
        num.className = "sheet__num";
        num.setAttribute("aria-hidden", "true");
        num.textContent = numberText;
        titleRow.appendChild(num);
      }
      var h = document.createElement("h2");
      h.className = "sheet__title";
      h.textContent = title;
      titleRow.appendChild(h);
      sheet.appendChild(titleRow);
    }

    /* Body + stats grouped under .sheet__body-section per Figma
       148:8260 / 148:7766. Section gap = 32 (Figma --space-8). Stats
       sub-group gets only a top divider — Figma shows top + bottom but
       owner direction 2026-05-22 removes the bottom horizontal line. */
    if (bodyHTML || statsHTML) {
      var section = document.createElement("div");
      section.className = "sheet__body-section";

      if (bodyHTML) {
        var body = document.createElement("div");
        body.className = "sheet__body";
        body.innerHTML = bodyHTML;
        section.appendChild(body);
      }

      if (statsHTML) {
        var statsGroup = document.createElement("div");
        statsGroup.className = "sheet__stats-group";
        var stats = document.createElement("ul");
        stats.className = "sheet__stats";
        stats.innerHTML = statsHTML;
        statsGroup.appendChild(stats);
        section.appendChild(statsGroup);
      }

      sheet.appendChild(section);
    }

    document.body.appendChild(sheet);
    activeSheet = sheet;

    /* Cap the sheet's height at its natural content height when that
       comes in under the token max. Lets the sheet hug short content at
       max snap instead of leaving blank space below.

       Measure by summing children offsetHeights + flex gap + sheet's own
       vertical padding. Avoids the prior temporary height:auto swap,
       which let long unwrapped <pre> content stretch the sheet wider
       than 100vw during the measurement frame and corrupted the
       horizontal padding. */
    var tokenMax = snapMaxPx();
    var gap = readPxToken("--sheet-gap", 24);
    var padT = readPxToken("--sheet-pad-top", 12);
    var padB = readPxToken("--sheet-pad-bottom", 32);
    var sumChildren = 0;
    var n = 0;
    Array.prototype.forEach.call(sheet.children, function (c) {
      sumChildren += c.offsetHeight;
      n++;
    });
    var natural = sumChildren + Math.max(0, n - 1) * gap + padT + padB;
    activeSheetMaxPx = Math.min(natural, tokenMax);
    sheet.style.height = activeSheetMaxPx + "px";
    sheet.style.maxHeight = activeSheetMaxPx + "px";

    var maxPx = effectiveMaxPx();
    var initPx = effectiveInitialPx();

    /* Start fully hidden. */
    setSheetY(maxPx);

    requestAnimationFrame(function () {
      activeAnim = pm.animate({
        from: maxPx,
        to: translateFor(initPx),
        type: "spring",
        stiffness: SPRING_OPEN.stiffness,
        damping: SPRING_OPEN.damping,
        onUpdate: function (v) { setSheetY(v); },
        onComplete: function () { activeAnim = null; setSnapState("initial"); },
      });
    });

    /* Tell the rest of the page a sheet is mounted so the grain canvas
       (and anything else that would mis-render behind the sheet's
       backdrop blur) can opt out of painting until the sheet is fully
       gone. Cleared in finalizeClose. */
    document.documentElement.setAttribute("data-sheet-open", "true");

    /* Lock background scroll while the sheet is open. iOS Safari ignores
       body { overflow: hidden } in many cases, so also pin position +
       preserve scrollTop so the page doesn't jump to 0 on lock. */
    lockedScrollY = window.scrollY;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = -lockedScrollY + "px";
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    bindDrag(handleArea);
    bindDrag(sheet);
    document.addEventListener("keydown", onKey);
    /* Defer outside-click binding by one frame so the trigger click that
       opened the sheet doesn't immediately close it. */
    requestAnimationFrame(function () {
      document.addEventListener("click", onOutsideClick, true);
    });
  }

  function closeSheet() {
    if (!activeSheet) return;
    setSnapState("closing");
    // Flip the overlay's data-active immediately so the scrim + blur
    // start clearing on the close-side transition (var(--dur-micro)
    // 120ms) without waiting for the sheet's spring to finish.
    if (activeOverlay) activeOverlay.removeAttribute("data-active");
    dismissWith(0);
  }

  /* Drag tracking. */
  function bindDrag(el) {
    el.addEventListener("pointerdown", onPointerDown);
  }

  function onPointerDown(e) {
    if (!activeSheet) return;
    /* If expanded and the user touches the body (not the handle), let
       native scroll handle the gesture. */
    var handleArea = activeSheet.querySelector("[data-sheet-handle]");
    if (snapState === "max" && e.currentTarget !== handleArea) return;

    if (activeAnim && activeAnim.stop) activeAnim.stop();
    activeAnim = null;
    e.preventDefault();
    var startY = e.clientY;
    var startTranslate = currentY;
    var lastY = startY;
    var lastT = e.timeStamp;
    var velocity = 0;
    var maxPx = effectiveMaxPx();

    function onMove(ev) {
      var dy = ev.clientY - startY;
      var nextY = startTranslate + dy;
      nextY = Math.max(0, Math.min(maxPx, nextY));
      setSheetY(nextY);
      var dt = ev.timeStamp - lastT;
      if (dt > 0) velocity = (ev.clientY - lastY) / dt;
      lastY = ev.clientY;
      lastT = ev.timeStamp;
    }

    function onUp() {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);

      var initY = translateFor(effectiveInitialPx());
      var maxY  = translateFor(maxPx);
      var hidden = maxPx;

      if (velocity > DISMISS_VELOCITY)  { dismissWith(velocity); return; }
      if (velocity < -DISMISS_VELOCITY) {
        springTo(maxY, function () { setSnapState("max"); });
        return;
      }
      /* Low-velocity release — snap to nearest stable. */
      var dInit = Math.abs(currentY - initY);
      var dMax  = Math.abs(currentY - maxY);
      var dHide = Math.abs(currentY - hidden);
      if (dHide < dInit && dHide < dMax) { dismissWith(0.6); return; }
      if (dMax < dInit) springTo(maxY,  function () { setSnapState("max"); });
      else              springTo(initY, function () { setSnapState("initial"); });
    }

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onUp);
  }

  /* ======================== Trigger interception ========================
     Mobile-only capture-phase click listener that maps tier-2/3 elements
     to openSheet calls and stops the default inline expansion. */

  /* Sheet title icon mapping — mirrors app.js CARD_ICONS so mobile sheet
     and desktop inline-panel render the same phosphor symbol per card.
     Drives the 32×32 icon shown left of the title in Figma 148:7762 /
     150:11123. Color comes from CSS (--fg-icon-sheet). */
  var SHEET_CARD_ICONS = {
    brain:    "ph-brain",
    workflow: "ph-kanban",
    agents:   "ph-claudecode",
    stack:    "ph-briefcase"
  };

  function extractCardSheet(cardBtn) {
    var key = cardBtn.getAttribute("data-card");
    var titleEl = cardBtn.querySelector(".card__title");
    var tpl = document.querySelector('template[data-drawer-tpl="' + key + '"]');
    if (!tpl) return null;
    /* Clone template contents into a scratch wrapper to extract pieces. */
    var scratch = document.createElement("div");
    scratch.appendChild(tpl.content.cloneNode(true));
    /* Stats live inside .drawer__stats — extract + remove from body. */
    var statsList = scratch.querySelector(".drawer__stats");
    var statsHTML = "";
    if (statsList) {
      /* Re-skin drawer stats into sheet-stats markup. */
      Array.prototype.forEach.call(statsList.children, function (li) {
        var num = li.querySelector(".drawer__stat-num");
        var lbl = li.querySelector(".drawer__stat-label");
        statsHTML += "<li>" +
          (num ? '<span class="sheet__stat-num">' + num.textContent + "</span>" : "") +
          (lbl ? '<span class="sheet__stat-label">' + lbl.textContent + "</span>" : "") +
          "</li>";
      });
      statsList.remove();
    }
    /* Drop the d-media block — sheet title uses the same phosphor icon as
       the desktop inline panel, NOT the large 3D card illustration. */
    var media = scratch.querySelector("[data-tpl-media]");
    if (media) media.remove();
    var iconId = SHEET_CARD_ICONS[key];
    var iconHTML = iconId
      ? '<svg viewBox="0 0 256 256" aria-hidden="true"><use href="#' + iconId + '"/></svg>'
      : "";
    return {
      title: titleEl ? titleEl.textContent.trim() : "",
      bodyHTML: scratch.innerHTML.trim(),
      statsHTML: statsHTML,
      iconHTML: iconHTML,
    };
  }

  function extractRowSheet(headBtn, bodySelector, titleSelector, numberSelector) {
    var titleEl = headBtn.querySelector(titleSelector);
    var numberEl = numberSelector ? headBtn.querySelector(numberSelector) : null;
    var body = headBtn.nextElementSibling;
    /* Walk forward to find the matching body element if it's not directly
       next (some markups insert a divider between head and body). */
    while (body && !body.matches(bodySelector)) body = body.nextElementSibling;
    return {
      title: titleEl ? titleEl.textContent.trim() : "",
      numberText: numberEl ? numberEl.textContent.trim() : "",
      bodyHTML: body ? body.innerHTML : "",
      statsHTML: "",
    };
  }

  function findTrigger(target) {
    /* Walk up — return the nearest matching trigger element or null. */
    var el = target;
    while (el && el !== document.body) {
      if (el.matches) {
        if (el.matches(".card[data-card]"))     return { type: "card",  el: el };
        if (el.matches(".step__head"))          return { type: "step",  el: el };
        if (el.matches(".brain-row__head"))     return { type: "brain", el: el };
        if (el.matches(".tools-row__head"))     return { type: "tools", el: el };
      }
      el = el.parentElement;
    }
    return null;
  }

  function onCapturedClick(e) {
    if (!mq.matches) return;
    /* Don't intercept clicks inside an open sheet. */
    if (activeSheet && activeSheet.contains(e.target)) return;

    var trig = findTrigger(e.target);
    if (!trig) return;

    var payload = null;
    if      (trig.type === "card")  payload = extractCardSheet(trig.el);
    else if (trig.type === "step")  payload = extractRowSheet(trig.el, ".step__body",       ".step__title",       ".step__num");
    else if (trig.type === "brain") payload = extractRowSheet(trig.el, ".brain-row__body",  ".brain-row__title",  ".brain-row__num");
    else if (trig.type === "tools") payload = extractRowSheet(trig.el, ".tools-row__body",  ".tools-row__title",  ".tools-row__num");

    if (!payload || !payload.bodyHTML) return;

    e.preventDefault();
    e.stopPropagation();
    /* Track the triggering card so it can flip .is-open while the sheet
     is mounted (Sheet2-correction state machine). Only cards carry this
     state — step/brain/tools heads do not. */
    if (trig.type === "card") {
      activeTriggerCard = trig.el;
      trig.el.classList.add("is-open");
    }
    /* Mobile sheet bypasses the inline step expand path, so the timeline
       counter never sees it. Hand the step id off so the explored set in
       app.js still increments. Same semantics as desktop. */
    if (trig.type === "step" && window.AiSiteTimeline && window.AiSiteTimeline.markExplored) {
      var stepLi = trig.el.closest("[data-step]");
      if (stepLi) window.AiSiteTimeline.markExplored(stepLi.getAttribute("data-step"));
    }
    openSheet(payload);
  }

  /* Capture-phase so the interception fires before the desktop inline
     expansion handlers in scripts/app.js. */
  document.addEventListener("click", onCapturedClick, true);

  /* Public API. */
  window.AiSiteSheet = {
    open: openSheet,
    close: closeSheet,
  };
})();
