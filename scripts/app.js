/* ai.levibahn.com — Sprint 1: nav, tab bar, theme toggle, hero schematic. */
(function () {
  "use strict";

  const root = document.documentElement;
  const STORAGE_KEY = "color-scheme";
  const DARK_CLASS = "dark";

  /* ===== Dark mode toggle — replicates DarkModeToggle from levibahn.com.
     Five behaviors:
       1. Initial aria-checked from class state
       2. First scroll → data-toggle-shown=true (slides in from left)
       3. scrollY > innerHeight → data-toggle-label-hidden=true
       4. Footer-aware bottom: max(24, innerHeight - footerTop + 24)
       5. Measure label width, write --label-width + --label-shift CSS vars */
  const toggle = document.querySelector("[data-toggle-container]");
  if (toggle) {
    const labelEl = toggle.querySelector('[data-toggle-slide="label"]');

    // (1) Sync aria-checked to current theme state (pre-paint already set class)
    toggle.setAttribute("aria-checked", root.classList.contains(DARK_CLASS) ? "true" : "false");

    // (5) Measure label width and set CSS vars. Must wait for fonts.ready —
    // Inter from Google Fonts loads after first paint, and the fallback
    // (system-ui) renders "Dark Mode" ~2px narrower. Measuring early locks in
    // the smaller width and clips the text once Inter resolves.
    if (labelEl) {
      const measure = function () {
        const w = labelEl.offsetWidth;
        if (w > 0) {
          toggle.style.setProperty("--label-width", w + "px");
          toggle.style.setProperty("--label-shift", (w + 8) + "px");
        }
      };
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(measure);
      } else {
        measure();
      }
    }

    // (2) Slide in 2.2s after load — last beat in the page-load cascade.
    // Mirrors --load-toggle-delay in styles/tokens.css; keep in sync.
    window.setTimeout(function () {
      toggle.setAttribute("data-toggle-shown", "true");
    }, 2200);

    // (3) Past one viewport: collapse the "Dark Mode" label (pill slides over)
    let labelHidden = false;
    const onScrollLabel = function () {
      if (labelHidden) return;
      if (window.scrollY > window.innerHeight) {
        labelHidden = true;
        toggle.setAttribute("data-toggle-label-hidden", "true");
        window.removeEventListener("scroll", onScrollLabel);
      }
    };
    window.addEventListener("scroll", onScrollLabel, { passive: true });

    // (4) Footer-aware bottom positioning. Mobile baseline lifts above the
    // bottom tab bar (live site has no tab bar; ai-site mobile does).
    let rafId = 0;
    const getBase = function () {
      return window.matchMedia("(max-width: 767px)").matches ? 88 : 24;
    };
    const updateBottom = function () {
      rafId = 0;
      const base = getBase();
      // Target the page footer specifically. A plain `footer` selector grabs
      // the first <footer> in the DOM — which is the hidden `.hiring__cta`
      // footer, whose rect is (0,0). That zero-top makes the math here lift
      // the toggle far above the viewport.
      const footer = document.querySelector(".page-footer");
      if (!footer) {
        toggle.style.bottom = base + "px";
        return;
      }
      const rect = footer.getBoundingClientRect();
      toggle.style.bottom = Math.max(base, window.innerHeight - rect.top + base) + "px";
    };
    const requestUpdate = function () {
      if (!rafId) rafId = window.requestAnimationFrame(updateBottom);
    };
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    updateBottom();

    // Click handler — toggle class on documentElement, write color-scheme to localStorage
    toggle.addEventListener("click", function () {
      const next = !root.classList.contains(DARK_CLASS);
      root.classList.toggle(DARK_CLASS, next);
      toggle.setAttribute("aria-checked", next ? "true" : "false");
      try { localStorage.setItem(STORAGE_KEY, next ? "dark" : "light"); } catch (e) {}
    });

    // System preference changes — honor only when no manual choice stored
    if (window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const onSystemChange = function (e) {
        let stored = null;
        try { stored = localStorage.getItem(STORAGE_KEY); } catch (err) {}
        if (stored) return;
        root.classList.toggle(DARK_CLASS, e.matches);
        toggle.setAttribute("aria-checked", e.matches ? "true" : "false");
      };
      if (mq.addEventListener) mq.addEventListener("change", onSystemChange);
      else if (mq.addListener) mq.addListener(onSystemChange);
    }
  }

  /* ===== Sticky nav — visible on load (CSS handles fixed positioning). ===== */

  /* ===== Active section tracking — feeds both nav + tabbar ===== */
  const sections = Array.from(document.querySelectorAll("[data-section]"));
  const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
  const tabLinks = Array.from(document.querySelectorAll("[data-tab-link]"));

  function clearActive() {
    // Nav links are no longer auto-highlighted on scroll. Hover is the only
    // way they turn yellow. Mobile tab bar still tracks active section.
    tabLinks.forEach(function (link) {
      link.classList.remove("is-active");
      link.removeAttribute("aria-current");
    });
  }

  function setActive(id) {
    if (window.scrollY === 0) {
      clearActive();
      return;
    }
    tabLinks.forEach(function (link) {
      const match = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", match);
      if (match) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  // Scroll back to the top → clear all nav highlights (observer may not fire
  // again once we're already at 0, so we listen explicitly).
  window.addEventListener("scroll", function () {
    if (window.scrollY === 0) clearActive();
  }, { passive: true });

  if (sections.length) {
    let visible = new Map();
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio);
        else visible.delete(e.target.id);
      });
      if (visible.size) {
        let bestId = null, bestRatio = -1;
        visible.forEach(function (ratio, id) {
          if (ratio > bestRatio) { bestRatio = ratio; bestId = id; }
        });
        if (bestId) setActive(bestId);
      }
    }, { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] });
    sections.forEach(function (s) { sectionObserver.observe(s); });
    // Expose so the structural fold-in (later in this IIFE) can re-observe the
    // <li> nodes that inherited the folded sections' ids.
    window.__sectionObserver = sectionObserver;
  }

  /* ===== Bottom tab bar — hide on scroll-down past 200, reveal on scroll-up ===== */
  const tabbar = document.querySelector("[data-tabbar]");
  if (tabbar) {
    let lastY = window.scrollY;
    let ticking = false;
    function onScroll() {
      const y = window.scrollY;
      if (y > 200 && y > lastY + 4) tabbar.classList.add("is-hidden");
      else if (y < lastY - 4 || y <= 200) tabbar.classList.remove("is-hidden");
      lastY = y;
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ===== Drawer brain — auto-rotate, drag to play, resume on release ===== */
  function initBrainInteraction(el) {
    const svg = el.querySelector(".d-media__svg");
    if (!svg) return;
    let dragging = false;
    let startX = 0, startY = 0;
    let curY = 20, curX = 8;
    let resumeTimer = 0;

    function onDown(e) {
      if (e.button !== undefined && e.button !== 0) return;
      dragging = true;
      el.setAttribute("data-dragging", "true");
      startX = e.clientX;
      startY = e.clientY;
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
      if (resumeTimer) { clearTimeout(resumeTimer); resumeTimer = 0; }
    }
    function onMove(e) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      curY += dx * 0.6;
      curX = Math.max(-30, Math.min(30, curX - dy * 0.4));
      startX = e.clientX;
      startY = e.clientY;
      svg.style.transform = "rotateY(" + curY + "deg) rotateX(" + curX + "deg)";
    }
    function onUp() {
      if (!dragging) return;
      dragging = false;
      el.removeAttribute("data-dragging");
      // Brief hold, then clear inline transform so the CSS animation picks back up
      resumeTimer = setTimeout(function () {
        svg.style.transform = "";
        resumeTimer = 0;
      }, 600);
    }

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("pointerleave", onUp);
  }

  /* ===== Structural fold-in =====
     Lift the workflow/brain/tools sections out of the page and into their
     respective .overview row's expanded slot. This matches Figma 55:9949 / 55:9391 /
     55:9840 where each section is a row in the same accordion. */
  function foldSectionIntoRow(rowKey, sectionSelector, slotId) {
    const rowBtn = document.querySelector('[data-overview-row="' + rowKey + '"]');
    const section = document.querySelector(sectionSelector);
    if (!rowBtn || !section) return;
    const li = rowBtn.closest("li");
    if (!li) return;

    let openDiv = li.querySelector(".overview-row__open");
    if (!openDiv) {
      openDiv = document.createElement("div");
      openDiv.className = "overview-row__open";
      openDiv.id = slotId;
      li.appendChild(openDiv);
    }
    rowBtn.setAttribute("aria-controls", openDiv.id);

    const container = section.querySelector(".container") || section;

    // section__header gets discarded: crumbs are hardcoded in the row button now,
    // the h2 duplicates the row title, only the lede is worth keeping.
    const sectionHeader = container.querySelector(".section__header");
    if (sectionHeader) {
      const lede = sectionHeader.querySelector(".section__lede");
      if (lede) {
        lede.classList.remove("section__lede");
        lede.classList.add("overview-row__lede");
        openDiv.appendChild(lede);
      }
      sectionHeader.remove();
    }

    // Move the remaining .container in as a single block to preserve max-width.
    // If there was no .container (defensive), move the loose children instead.
    if (container !== section && container.parentNode) {
      openDiv.appendChild(container);
    } else {
      while (container.firstChild) {
        openDiv.appendChild(container.firstChild);
      }
    }

    // Carry over the section's id (e.g. #workflow) to the li so nav anchors still work
    if (section.id) {
      const oldId = section.id;
      section.removeAttribute("id");
      if (!li.id) li.id = oldId;
    }
    // Mark the li as a tracked section so scroll-spy continues to work
    li.setAttribute("data-section", "");
    if (window.__sectionObserver) {
      window.__sectionObserver.observe(li);
    }
    section.remove();

    // Enable + collapse the row (row 01 stays expanded; folded rows ship collapsed)
    rowBtn.removeAttribute("disabled");
    if (!rowBtn.hasAttribute("aria-expanded")) {
      rowBtn.setAttribute("aria-expanded", "false");
    } else if (rowBtn.getAttribute("aria-expanded") !== "true") {
      rowBtn.setAttribute("aria-expanded", "false");
    }
  }

  foldSectionIntoRow("workflow", ".section--workflow", "overview-row-2-body");
  foldSectionIntoRow("brain",    ".section--brain",    "overview-row-3-body");
  foldSectionIntoRow("tools",    ".section--tools",    "overview-row-4-body");

  /* ===== Section 1 — Overview row toggle =====
     Click .overview-row → toggle aria-expanded. Close is two-phase: fade
     eyebrow + lede + cards (FADE_MS) → then drop drawer (DRAWER_CLOSE_MS).
     `.is-closing` class on the li drives the phase-1 fade via CSS so the
     button can stay in aria-expanded="true" until the fade is done. */
  /* Drawer + title slide-up + eyebrow/lede/cards fade all start on click —
     no sequencing. .is-closing keeps crumbs/lede in layout (display still
     set) so they can animate height alongside the drawer rather than
     snapping to display:none. CLOSE_MS covers the longest transition. */
  const CLOSE_MS = 520; // matches the global --ease-collapse close duration in CSS
  const OPEN_MS = 760;
  /* Match the CSS --ease-collapse token. Softer ease-out than --ease-out-strong
     so the visible collapse decelerates into rest instead of snapping. */
  const CLOSE_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
  /* Freeze scrollY for the duration of the toggle. The rAF anchor was
     causing micro-stutter when paired with the close transition (browser
     auto-correct + rAF re-correct fight each other every frame). A flat
     scrollY freeze is sticky and silent — content can grow above without
     shoving the row, and the doc shrinking on close can't yank scrollY up. */
  function lockRowToViewport(btn, durationMs) {
    const startY = window.scrollY;
    function holdOnScroll() {
      if (window.scrollY !== startY) window.scrollTo(0, startY);
    }
    window.addEventListener("scroll", holdOnScroll, { passive: true });
    setTimeout(function () {
      window.removeEventListener("scroll", holdOnScroll);
    }, durationMs);
  }

  document.querySelectorAll(".overview-row").forEach(function (btn) {
    if (btn.hasAttribute("disabled")) return;
    btn.addEventListener("click", function () {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      const li = btn.closest("li");
      const openEl = li && li.querySelector(".overview-row__open");
      if (isOpen) {
        /* Anchor the close transition to the actual content height so the
           ease-out curve plays across visible pixels (not the empty buffer
           up to the 20000px max-height cap). Step 1: freeze the current
           height with transitions disabled. Step 2: switch aria off and
           kick a new transition down to 0 with an explicit ease-out curve. */
        if (openEl) {
          const h = openEl.scrollHeight;
          openEl.style.transition = "none";
          openEl.style.maxHeight = h + "px";
          void openEl.offsetHeight;
          // Restore transition explicitly so the next style write animates.
          openEl.style.transition =
            "max-height " + CLOSE_MS + "ms " + CLOSE_EASE + ", " +
            "padding " + CLOSE_MS + "ms " + CLOSE_EASE;
          void openEl.offsetHeight;
        }
        lockRowToViewport(btn, CLOSE_MS);
        if (li) li.classList.add("is-closing");
        btn.setAttribute("aria-expanded", "false");
        if (openEl) openEl.style.maxHeight = "0px";
        setTimeout(function () {
          if (li) li.classList.remove("is-closing");
          if (openEl) {
            openEl.style.maxHeight = "";
            openEl.style.transition = "";
          }
        }, CLOSE_MS);
      } else {
        if (openEl) openEl.style.maxHeight = ""; // clear any leftover from a previous close
        lockRowToViewport(btn, OPEN_MS);
        if (li) li.classList.remove("is-closing");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* Sticky-nav anchor links auto-expand the matching row. Targets can be either
     the overview LI itself (e.g. #workflow) or a deep element inside a folded
     section (e.g. #gates inside the workflow row body) — walk up to the LI in
     either case. */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      let rowBtn = target.querySelector(":scope > .overview-row");
      if (!rowBtn) {
        const rowLi = target.closest(".overview > li");
        rowBtn = rowLi && rowLi.querySelector(":scope > .overview-row");
      }
      if (rowBtn && rowBtn.getAttribute("aria-expanded") === "false") {
        rowBtn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ===== Section 1 — Card click → inline panel swap (Figma 57:10767) =====
     Click a card → clone its template into [data-card-panel], swap active state,
     hide panel if same card is clicked again. */
  const cardPanel = document.querySelector("[data-card-panel]");
  if (cardPanel) {
    const CARD_TITLES = {
      brain: "The Brain",
      workflow: "The Workflow",
      agents: "The Agents",
      stack: "The Tools",
    };
    const CARD_ICONS = {
      brain: "ph-brain",
      workflow: "ph-kanban",
      agents: "ph-claudecode",
      stack: "ph-briefcase",
    };
    let activeCard = null;

    function closeCard() {
      if (activeCard) activeCard.setAttribute("aria-expanded", "false");
      activeCard = null;
      cardPanel.hidden = true;
      cardPanel.innerHTML = "";
    }

    function openCard(name, btn) {
      const tpl = document.querySelector('[data-drawer-tpl="' + name + '"]');
      if (!tpl) return;
      // Clear prior state on all cards
      document.querySelectorAll("[data-card]").forEach(function (c) {
        c.setAttribute("aria-expanded", "false");
      });
      // Mount new content. Strip media wrapper — Figma frame 57:10767 shows no media slot.
      const frag = tpl.content.cloneNode(true);
      const mediaWrap = frag.querySelector("[data-tpl-media]");
      if (mediaWrap) mediaWrap.parentNode.removeChild(mediaWrap);
      // Wrap content with title + structured layout
      cardPanel.innerHTML = "";
      const svgNS = "http://www.w3.org/2000/svg";
      const wrap = document.createElement("div");
      wrap.className = "overview-row__panel-inner";

      // Header: icon + title (Figma 57:10767 nodes 57:10923–10926).
      const header = document.createElement("div");
      header.className = "overview-row__panel-header";
      const iconId = CARD_ICONS[name];
      if (iconId) {
        const icon = document.createElementNS(svgNS, "svg");
        icon.setAttribute("class", "overview-row__panel-icon");
        icon.setAttribute("aria-hidden", "true");
        const use = document.createElementNS(svgNS, "use");
        use.setAttribute("href", "#" + iconId);
        icon.appendChild(use);
        header.appendChild(icon);
      }
      const title = document.createElement("h3");
      title.className = "overview-row__panel-title";
      title.textContent = CARD_TITLES[name] || "";
      header.appendChild(title);
      wrap.appendChild(header);

      // Divider below header (Figma node 57:10927).
      const divTop = document.createElement("div");
      divTop.className = "overview-row__panel-divider";
      wrap.appendChild(divTop);

      // Two-column grid: body (left) + side stats (right).
      const grid = document.createElement("div");
      grid.className = "overview-row__panel-grid";

      const body = document.createElement("div");
      body.className = "overview-row__panel-body";
      body.appendChild(frag);

      // Drop the .drawer__link bottom CTA — per spec, no link in expanded card.
      const linkWrap = body.querySelector(".drawer__link");
      if (linkWrap) linkWrap.parentNode.removeChild(linkWrap);

      grid.appendChild(body);

      // Side column: top divider + stats + bottom divider (Figma 57:10929–10950).
      const side = document.createElement("div");
      side.className = "overview-row__panel-side";
      const stats = body.querySelector(".drawer__stats");
      if (stats) {
        const sideTop = document.createElement("div");
        sideTop.className = "overview-row__panel-divider";
        side.appendChild(sideTop);
        stats.classList.add("overview-row__panel-stats");
        stats.classList.remove("drawer__stats");
        stats.querySelectorAll(".drawer__stat-num").forEach(function (n) {
          n.classList.remove("drawer__stat-num");
          n.classList.add("overview-row__panel-stat-num");
        });
        stats.querySelectorAll(".drawer__stat-label").forEach(function (l) {
          l.classList.remove("drawer__stat-label");
          l.classList.add("overview-row__panel-stat-label");
        });
        side.appendChild(stats);
        const sideBot = document.createElement("div");
        sideBot.className = "overview-row__panel-divider";
        side.appendChild(sideBot);
      }
      grid.appendChild(side);

      wrap.appendChild(grid);
      cardPanel.appendChild(wrap);

      // Show panel
      cardPanel.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      activeCard = btn;
    }

    document.querySelectorAll("[data-card]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const name = btn.getAttribute("data-card");
        if (activeCard === btn) closeCard();
        else openCard(name, btn);
      });
    });
  }

  /* ===== Section 3 — Timeline / steps =====
     Multi-open inline expand. Click-based progress = Set<stepId>
     serialized to sessionStorage. Expand all / Collapse all controls. */
  const timeline = document.querySelector("[data-timeline]");
  if (timeline) {
    const STEPS_KEY = "ai-steps-expanded";
    const EXPLORED_KEY = "ai-steps-explored";
    const totalSteps = timeline.querySelectorAll("[data-step]").length;
    const countEl = timeline.querySelector("[data-progress-count]");
    const fillEl = timeline.querySelector("[data-progress-fill]");

    function readSet(key) {
      try {
        const raw = sessionStorage.getItem(key);
        if (!raw) return new Set();
        return new Set(JSON.parse(raw));
      } catch (e) { return new Set(); }
    }
    function writeSet(key, s) {
      try { sessionStorage.setItem(key, JSON.stringify(Array.from(s))); } catch (e) {}
    }

    /* Two sets, two semantics:
       - `expanded` reflects which step bodies are currently open (drives DOM).
       - `explored` is a monotonic union of every step id ever opened. Counter
         reads from `explored`; closing or re-opening never moves the number. */
    let expanded = readSet(STEPS_KEY);
    let explored = readSet(EXPLORED_KEY);
    function updateProgress() {
      if (countEl) countEl.textContent = String(explored.size);
      if (fillEl) fillEl.style.width = (explored.size / totalSteps * 100) + "%";
    }

    /* Match prompt panel height to the left description column at 768+.
       Driven by a ResizeObserver on every step__body-text so the panel updates
       on initial open, window resize, and font-load reflows. The observer
       attaches once per step on init; the observer callback no-ops on
       sub-768px viewports (mobile stacks the two columns). */
    function syncPromptHeight(text) {
      const step = text.closest("[data-step]");
      if (!step) return;
      const prompt = step.querySelector(".step__prompt:not(.step__prompt--empty)");
      if (!prompt) return;
      if (!window.matchMedia("(min-width: 768px)").matches) {
        prompt.style.removeProperty("--prompt-max-h");
        return;
      }
      if (step.offsetParent === null) return;
      const h = text.getBoundingClientRect().height;
      if (h > 0) prompt.style.setProperty("--prompt-max-h", h + "px");
    }
    const ro = ("ResizeObserver" in window)
      ? new ResizeObserver(function (entries) {
          entries.forEach(function (entry) { syncPromptHeight(entry.target); });
        })
      : null;
    if (ro) {
      timeline.querySelectorAll(".step__body-text").forEach(function (t) { ro.observe(t); });
    }

    function setStep(stepEl, open, persist) {
      const head = stepEl.querySelector(".step__head");
      const body = stepEl.querySelector(".step__body");
      if (!head || !body) return;
      head.setAttribute("aria-expanded", open ? "true" : "false");
      body.hidden = !open;
      const id = stepEl.getAttribute("data-step");
      if (open) {
        expanded.add(id);
        explored.add(id);
      } else {
        expanded.delete(id);
      }
      if (persist !== false) {
        writeSet(STEPS_KEY, expanded);
        writeSet(EXPLORED_KEY, explored);
      }
      updateProgress();
      if (open) {
        const text = stepEl.querySelector(".step__body-text");
        if (text) syncPromptHeight(text);
      }
    }

    // All steps start closed on every load. Persistence still tracks the
    // explored set so the progress counter survives refresh, but no step body
    // is restored to open — visitors land on a fresh, collapsed timeline.
    expanded.clear();
    writeSet(STEPS_KEY, expanded);
    updateProgress();

    // Click delegate
    timeline.addEventListener("click", function (e) {
      const head = e.target.closest(".step__head");
      if (!head) return;
      const stepEl = head.closest("[data-step]");
      if (!stepEl) return;
      const isOpen = head.getAttribute("aria-expanded") === "true";
      setStep(stepEl, !isOpen);
    });

    /* Forward-declared so Expand all / Collapse all can flip show-all alongside
       the per-row open state. Defined when the show-all button is wired. */
    let setShowAll = function () {};

    const expandAll = timeline.querySelector("[data-expand-all]");
    const collapseAll = timeline.querySelector("[data-collapse-all]");
    if (expandAll) {
      expandAll.addEventListener("click", function () {
        setShowAll(true);
        timeline.querySelectorAll("[data-step]").forEach(function (s) { setStep(s, true, false); });
        writeSet(STEPS_KEY, expanded);
        writeSet(EXPLORED_KEY, explored);
      });
    }
    if (collapseAll) {
      collapseAll.addEventListener("click", function () {
        timeline.querySelectorAll("[data-step]").forEach(function (s) { setStep(s, false, false); });
        writeSet(STEPS_KEY, expanded);
        writeSet(EXPLORED_KEY, explored);
        setShowAll(false);
      });
    }

    /* Show all 13 toggle. Always starts collapsed on load — persistence
       drives only per-row expanded body state, never visibility of rows 4–13. */
    const showAllBtn = timeline.querySelector("[data-show-all]");
    if (showAllBtn) {
      const labelEl = showAllBtn.querySelector("[data-show-all-label]");
      setShowAll = function (state) {
        timeline.setAttribute("data-show-all", state ? "true" : "false");
        showAllBtn.setAttribute("aria-expanded", state ? "true" : "false");
        if (labelEl) labelEl.textContent = state ? "Collapse rows" : "Show all 13";
        if (state) {
          timeline.querySelectorAll(".step__head[aria-expanded=\"true\"]").forEach(function (h) {
            const s = h.closest("[data-step]");
            const t = s && s.querySelector(".step__body-text");
            if (t) syncPromptHeight(t);
          });
        }
      };
      timeline.setAttribute("data-show-all", "false");
      showAllBtn.addEventListener("click", function () {
        const next = showAllBtn.getAttribute("aria-expanded") !== "true";
        setShowAll(next);
      });
    }

    /* Re-sync any open row's prompt height when viewport reflows. */
    window.addEventListener("resize", function () {
      timeline.querySelectorAll(".step__head[aria-expanded=\"true\"]").forEach(function (h) {
        const s = h.closest("[data-step]");
        const t = s && s.querySelector(".step__body-text");
        if (t) syncPromptHeight(t);
      });
    });
  }

  /* ===== Section 3 — Studio Brain row accordion =====
     Delegated click on .brain-row__head toggles aria-expanded + body[hidden].
     Section 3 folds into the overview accordion via foldSectionIntoRow, so this
     handler scans the whole document (the [data-brain-list] node has moved). */
  document.addEventListener("click", function (e) {
    const head = e.target.closest(".brain-row__head");
    if (!head) return;
    const row = head.closest(".brain-row");
    if (!row) return;
    const body = row.querySelector(".brain-row__body");
    if (!body) return;
    const isOpen = head.getAttribute("aria-expanded") === "true";
    head.setAttribute("aria-expanded", isOpen ? "false" : "true");
    body.hidden = isOpen;
  });

  /* ===== Section 4 — Tools row accordion =====
     Multi-open: each row toggles independently. Opening one leaves others
     untouched. Clicking the open row closes it. */
  document.addEventListener("click", function (e) {
    const head = e.target.closest(".tools-row__head");
    if (!head) return;
    const row = head.closest(".tools-row");
    if (!row || !row.closest("[data-tools-list]")) return;
    const body = row.querySelector(".tools-row__body");
    if (!body) return;
    const isOpen = head.getAttribute("aria-expanded") === "true";
    head.setAttribute("aria-expanded", isOpen ? "false" : "true");
    body.hidden = isOpen;
  });

  /* ===== Section 6 — Hiring tabs =====
     On Load: no tab selected, all panels hidden, CTA hidden.
     Tab click reveals its panel + the CTA. */
  const hiring = document.querySelector("[data-hiring]");
  if (hiring) {
    const tabs = Array.from(hiring.querySelectorAll("[data-hiring-tab]"));
    const panels = Array.from(hiring.querySelectorAll("[data-hiring-panel]"));
    const cta = hiring.querySelector("[data-hiring-cta]");

    function selectTab(name, focusTab) {
      tabs.forEach(function (t) {
        const match = t.getAttribute("data-hiring-tab") === name;
        t.setAttribute("aria-selected", match ? "true" : "false");
        t.tabIndex = match ? 0 : -1;
        if (match && focusTab) t.focus();
      });
      panels.forEach(function (p) {
        const match = p.getAttribute("data-hiring-panel") === name;
        p.hidden = !match;
      });
      if (cta) cta.hidden = false;
      hiring.setAttribute("data-hiring-state", "expanded");
    }

    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        selectTab(t.getAttribute("data-hiring-tab"), false);
      });
    });

    // Arrow key navigation per APG tabs pattern
    hiring.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Home" && e.key !== "End") return;
      const idx = tabs.findIndex(function (t) { return t === document.activeElement; });
      if (idx === -1) return;
      e.preventDefault();
      let next = idx;
      if (e.key === "ArrowLeft") next = (idx - 1 + tabs.length) % tabs.length;
      else if (e.key === "ArrowRight") next = (idx + 1) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;
      selectTab(tabs[next].getAttribute("data-hiring-tab"), true);
    });

    // Preserve the current light/dark mode when crossing to levibahn.com.
    // Appends ?mode=light|dark to the link href just before navigation, so
    // levibahn.com can read the param on load and match the visitor's state.
    const ctaLink = hiring.querySelector("[data-hiring-cta-link]");
    if (ctaLink) {
      ctaLink.addEventListener("click", function () {
        try {
          const url = new URL(ctaLink.href);
          const mode = document.documentElement.classList.contains("dark") ? "dark" : "light";
          url.searchParams.set("mode", mode);
          ctaLink.href = url.toString();
        } catch (_) { /* malformed href — let the browser navigate as-is */ }
      });
    }
  }

  /* ===== Back to top ===== */
  const backTop = document.querySelector("[data-back-to-top]");
  if (backTop) {
    let ticking = false;
    function onScroll() {
      const show = window.scrollY > window.innerHeight * 0.6;
      backTop.setAttribute("data-shown", show ? "true" : "false");
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ===== Smooth scroll for in-page anchors (manual to account for nav offset) ===== */
  document.addEventListener("click", function (e) {
    const link = e.target.closest("a[href^=\"#\"]");
    if (!link) return;
    const id = link.getAttribute("href").slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const navH = window.matchMedia("(min-width: 768px)").matches ? 64 : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
    window.scrollTo({ top: top, behavior: "smooth" });
    // Update hash without jumping
    history.pushState(null, "", "#" + id);
  });

  /* ===== Copy-to-clipboard for [data-copy] buttons.
     Reads the textContent of #[data-copy-target] and writes it to the clipboard.
     Swaps the icon + label to a "Copied" affordance for 1.6s. */
  const copyButtons = document.querySelectorAll("[data-copy]");
  copyButtons.forEach(function (btn) {
    const targetId = btn.getAttribute("data-copy-target");
    const labelEl = btn.querySelector("[data-copy-label]");
    const iconUse = btn.querySelector(".icon use");
    let resetTimer = null;

    btn.addEventListener("click", async function () {
      const target = document.getElementById(targetId);
      if (!target) return;
      const text = target.textContent;
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        // Fallback for non-secure contexts
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (_) {}
        document.body.removeChild(ta);
      }
      btn.setAttribute("data-copy-state", "copied");
      if (labelEl) labelEl.textContent = "Copied";
      if (iconUse) iconUse.setAttribute("href", "#ph-check");
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        btn.removeAttribute("data-copy-state");
        if (labelEl) labelEl.textContent = "Copy";
        if (iconUse) iconUse.setAttribute("href", "#ph-copy");
        resetTimer = null;
      }, 1600);
    });
  });

  /* ===== Drop .reveal class after animation completes so Chrome dismantles
     the compositor layer it created for the transform animation. Persistent
     compositor layers at near-black drift ~1 LSB on P3 displays. */
  document.querySelectorAll(".reveal").forEach(function (el) {
    el.addEventListener("animationend", function (e) {
      if (e.animationName === "reveal-in") {
        el.classList.remove("reveal");
      }
    }, { once: true });
  });

})();
