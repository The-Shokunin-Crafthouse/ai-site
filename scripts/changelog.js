/* Changelog overlay — footer-triggered, lazy-loaded.

   Data: data/changelog.json (curated months → entries; appended by the
   weekly ai-site-update skill).

   Two surfaces, one data source:
   - Desktop / tablet: a centered overlay panel (role=dialog) with a
     clip-path entrance and per-entry staggered rise on month expand
     (cinematic recipes #1 + #3, discrete variants — no scroll scrub).
   - Mobile: reuses the tier-3 bottom sheet via window.AiSiteSheet with
     native <details> month accordions inside the sheet body.

   Reduced motion: overlay appears in final state (CSS kills transitions);
   JS skips the stagger choreography entirely.

   Cognitive-load rules: months are accordions, newest month open by
   default, one line of detail per entry, PR numbers as quiet mono
   metadata — scannable first, readable second. */
(function () {
  "use strict";

  if (typeof window === "undefined") return;

  var DATA_URL = "./data/changelog.json";
  var viewport = window.AiSiteViewport;

  var dataCache = null;
  var overlayEl = null;
  var panelEl = null;
  var lastFocus = null;
  var prevOverflow = "";
  var lockedScrollY = 0;

  function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function loadData() {
    if (dataCache) return Promise.resolve(dataCache);
    return fetch(DATA_URL)
      .then(function (r) {
        if (!r.ok) throw new Error("changelog fetch " + r.status);
        return r.json();
      })
      .then(function (json) {
        dataCache = json;
        return json;
      });
  }

  /* ---------- shared markup builders ---------- */

  function fmtDate(iso) {
    /* "2026-07-21" → "Jul 21". String split, not new Date() — bare
       numbers and TZ shifts both bite (studio learning #48). */
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!m) return iso;
    var names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return names[parseInt(m[2], 10) - 1] + " " + parseInt(m[3], 10);
  }

  function prLine(prs) {
    if (!prs || !prs.length) return "";
    return "<p class=\"clog-entry__prs\">" +
      prs.map(function (n) { return "#" + n; }).join(" · ") +
      "</p>";
  }

  function entryHTML(entry) {
    return "<li class=\"clog-entry\">" +
      "<time class=\"clog-entry__date\" datetime=\"" + entry.date + "\">" +
        fmtDate(entry.date) + "</time>" +
      "<div class=\"clog-entry__main\">" +
        "<p class=\"clog-entry__title\">" + entry.title + "</p>" +
        "<p class=\"clog-entry__detail\">" + entry.detail + "</p>" +
        prLine(entry.prs) +
      "</div>" +
    "</li>";
  }

  function entriesHTML(month) {
    return "<ol class=\"clog-entries\">" +
      month.entries.map(entryHTML).join("") +
    "</ol>";
  }

  /* ---------- mobile: bottom sheet ---------- */

  function sheetBodyHTML(data) {
    /* Native <details> accordions — the sheet already owns the modal
       chrome, drag physics, and scroll; keep the inner structure inert. */
    return data.months.map(function (month, i) {
      return "<details class=\"clog-sheet-month\"" + (i === 0 ? " open" : "") + ">" +
        "<summary class=\"clog-sheet-month__head\">" +
          "<span class=\"clog-sheet-month__label\">" + month.label + "</span>" +
          "<span class=\"clog-sheet-month__count\">" + month.entries.length + "</span>" +
        "</summary>" +
        entriesHTML(month) +
      "</details>";
    }).join("");
  }

  /* ---------- desktop: overlay panel ---------- */

  function monthSection(month, openByDefault) {
    var section = document.createElement("section");
    section.className = "clog-month";
    var bodyId = "clog-m-" + month.id;

    var h = document.createElement("h3");
    h.className = "clog-month__heading";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "clog-month__head";
    btn.setAttribute("aria-expanded", openByDefault ? "true" : "false");
    btn.setAttribute("aria-controls", bodyId);
    btn.innerHTML =
      "<span class=\"clog-month__label\">" + month.label + "</span>" +
      "<span class=\"clog-month__count\">" + month.entries.length + "</span>" +
      "<span class=\"clog-month__mark\" aria-hidden=\"true\"></span>";
    h.appendChild(btn);
    section.appendChild(h);

    var body = document.createElement("div");
    body.className = "clog-month__body";
    body.id = bodyId;
    body.innerHTML = entriesHTML(month);
    if (!openByDefault) body.setAttribute("data-collapsed", "true");
    section.appendChild(body);

    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (expanded) {
        collapse(body);
      } else {
        expand(body);
        staggerEntries(body);
      }
    });

    return section;
  }

  /* max-height accordion — same idiom as the section rows in app.css
     (--ease-collapse glide, no layout-property animation beyond the
     collapsing box itself). */
  function expand(body) {
    body.removeAttribute("data-collapsed");
    if (reducedMotion()) return;
    body.style.maxHeight = "0px";
    /* force style flush so the transition has a start value */
    void body.offsetHeight;
    body.style.maxHeight = body.scrollHeight + "px";
    body.addEventListener("transitionend", function onEnd(e) {
      if (e.propertyName !== "max-height") return;
      body.style.maxHeight = "";
      body.removeEventListener("transitionend", onEnd);
    });
  }

  function collapse(body) {
    if (reducedMotion()) {
      body.setAttribute("data-collapsed", "true");
      return;
    }
    body.style.maxHeight = body.scrollHeight + "px";
    void body.offsetHeight;
    body.style.maxHeight = "0px";
    body.addEventListener("transitionend", function onEnd(e) {
      if (e.propertyName !== "max-height") return;
      body.setAttribute("data-collapsed", "true");
      body.style.maxHeight = "";
      body.removeEventListener("transitionend", onEnd);
    });
  }

  /* Per-entry staggered rise — stagger implies hierarchy: the reveal
     order IS the reading order (newest first). Skipped under reduced
     motion (entries are already in final state via CSS). */
  function staggerEntries(scope) {
    if (reducedMotion()) return;
    var items = scope.querySelectorAll(".clog-entry");
    Array.prototype.forEach.call(items, function (li, i) {
      li.classList.remove("clog-entry--in");
      li.classList.add("clog-entry--pre");
      li.style.transitionDelay = Math.min(i * 48, 384) + "ms";
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        Array.prototype.forEach.call(items, function (li) {
          li.classList.add("clog-entry--in");
          li.classList.remove("clog-entry--pre");
        });
      });
    });
    scope.addEventListener("transitionend", function clear(e) {
      if (!e.target.classList || !e.target.classList.contains("clog-entry")) return;
      e.target.style.transitionDelay = "";
    });
  }

  function focusables() {
    if (!panelEl) return [];
    return panelEl.querySelectorAll(
      "button, [href], [tabindex]:not([tabindex=\"-1\"])"
    );
  }

  function onKeydown(e) {
    if (e.key === "Escape") { closeOverlay(); return; }
    if (e.key !== "Tab") return;
    var els = focusables();
    if (!els.length) return;
    var first = els[0];
    var last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function openOverlay(data) {
    if (overlayEl) return;
    lastFocus = document.activeElement;

    overlayEl = document.createElement("div");
    overlayEl.className = "clog-overlay";
    overlayEl.setAttribute("data-clog-overlay", "");

    panelEl = document.createElement("aside");
    panelEl.className = "clog";
    panelEl.setAttribute("role", "dialog");
    panelEl.setAttribute("aria-modal", "true");
    panelEl.setAttribute("aria-label", "Changelog");

    var head = document.createElement("header");
    head.className = "clog__head";
    head.innerHTML =
      "<div class=\"clog__head-text\">" +
        "<p class=\"clog__eyebrow\">Changelog</p>" +
        "<p class=\"clog__lede\">What changed on this site, and when. Curated from merged pull requests.</p>" +
      "</div>";
    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "clog__close";
    closeBtn.setAttribute("aria-label", "Close changelog");
    closeBtn.innerHTML = "<span aria-hidden=\"true\">×</span>";
    closeBtn.addEventListener("click", closeOverlay);
    head.appendChild(closeBtn);
    panelEl.appendChild(head);

    var months = document.createElement("div");
    months.className = "clog__months";
    data.months.forEach(function (month, i) {
      months.appendChild(monthSection(month, i === 0));
    });
    panelEl.appendChild(months);

    overlayEl.appendChild(panelEl);
    document.body.appendChild(overlayEl);

    /* Scroll lock — overflow:hidden on the root resets scrollTop, so
       remember the position and restore it on close. */
    lockedScrollY = window.scrollY;
    prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    /* Entrance: scrim fades, panel reveals via clip-path + rise.
       Forced style flush (not rAF — throttled in hidden tabs) so the
       transition has a committed start state before data-open flips.
       Newest month's entries ride in on the same beat, staggered. */
    void overlayEl.offsetHeight;
    overlayEl.setAttribute("data-open", "true");
    var firstBody = panelEl.querySelector(".clog-month__body:not([data-collapsed])");
    if (firstBody) staggerEntries(firstBody);

    document.addEventListener("keydown", onKeydown);
    overlayEl.addEventListener("click", function (e) {
      if (!panelEl.contains(e.target)) closeOverlay();
    });
    closeBtn.focus();
  }

  function closeOverlay() {
    if (!overlayEl) return;
    var el = overlayEl;
    overlayEl = null;
    document.removeEventListener("keydown", onKeydown);
    document.documentElement.style.overflow = prevOverflow;
    window.scrollTo(0, lockedScrollY);

    if (reducedMotion()) {
      el.remove();
    } else {
      el.removeAttribute("data-open");
      var done = false;
      function finish() { if (!done) { done = true; el.remove(); } }
      el.addEventListener("transitionend", function (e) {
        if (e.target === el) finish();
      });
      /* Fallback — never strand a dead overlay if transitionend is lost. */
      setTimeout(finish, 600);
    }
    panelEl = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    lastFocus = null;
  }

  /* ---------- trigger ---------- */

  function onTrigger(e) {
    e.preventDefault();
    var trigger = e.currentTarget;
    trigger.setAttribute("data-loading", "true");
    loadData()
      .then(function (data) {
        trigger.removeAttribute("data-loading");
        if (viewport && viewport.isMobile() && window.AiSiteSheet) {
          window.AiSiteSheet.open({
            title: "Changelog",
            bodyHTML: sheetBodyHTML(data),
          });
        } else {
          openOverlay(data);
        }
      })
      .catch(function () {
        trigger.removeAttribute("data-loading");
        /* Fail quiet but honest — the link is a footer affordance, not a
           critical path. Tooltip-less inline fallback. */
        trigger.setAttribute("data-error", "true");
        trigger.textContent = "Changelog unavailable";
      });
  }

  var triggers = document.querySelectorAll("[data-changelog-open]");
  Array.prototype.forEach.call(triggers, function (t) {
    t.addEventListener("click", onTrigger);
  });
})();
