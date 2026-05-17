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

    // (2) First scroll triggers slide-in
    const onFirstScroll = function () {
      toggle.setAttribute("data-toggle-shown", "true");
      window.removeEventListener("scroll", onFirstScroll);
    };
    window.addEventListener("scroll", onFirstScroll, { passive: true });

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
      const footer = document.querySelector("footer");
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

  /* ===== Sticky nav — show after scrolling past hero ===== */
  const nav = document.querySelector("[data-nav]");
  const hero = document.querySelector("[data-hero]");
  if (nav && hero) {
    const navObserver = new IntersectionObserver(function (entries) {
      const heroEntry = entries[0];
      // Show nav when hero is mostly out of view
      if (heroEntry.intersectionRatio < 0.15) {
        nav.classList.add("is-visible");
      } else {
        nav.classList.remove("is-visible");
      }
    }, { threshold: [0.15] });
    navObserver.observe(hero);
  }

  /* ===== Active section tracking — feeds both nav + tabbar ===== */
  const sections = Array.from(document.querySelectorAll("[data-section]"));
  const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
  const tabLinks = Array.from(document.querySelectorAll("[data-tab-link]"));

  function setActive(id) {
    navLinks.forEach(function (link) {
      const match = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", match);
      if (match) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
    tabLinks.forEach(function (link) {
      const match = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", match);
      if (match) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

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

  /* ===== Drawer overlay (Section 2 cards) =====
     One drawer at a time. Open via [data-card], close via Esc / scrim / close
     button / swipe-down (mobile). Locks body scroll while open. */
  const drawer = document.querySelector("[data-drawer]");
  const scrim = document.querySelector("[data-drawer-scrim]");
  const drawerHead = drawer && drawer.querySelector("[data-drawer-title]");
  const drawerEyebrow = drawer && drawer.querySelector("[data-drawer-eyebrow]");
  const drawerBody = drawer && drawer.querySelector("[data-drawer-body]");
  const drawerMedia = drawer && drawer.querySelector("[data-drawer-media]");
  const drawerHandle = drawer && drawer.querySelector("[data-drawer-handle]");

  if (drawer && scrim) {
    const CARD_TITLES = {
      brain: { eyebrow: "01 :: Card", title: "The Brain" },
      workflow: { eyebrow: "02 :: Card", title: "The Workflow" },
      agents: { eyebrow: "03 :: Card", title: "The Agents" },
      stack: { eyebrow: "04 :: Card", title: "The Tools" },
    };
    let activeCardEl = null;
    let lastScrollY = 0;

    function openDrawer(name, fromEl) {
      const tpl = document.querySelector('[data-drawer-tpl="' + name + '"]');
      if (!tpl) return;
      // Clone template into a fragment so we can split media from body
      const frag = tpl.content.cloneNode(true);
      const mediaWrap = frag.querySelector("[data-tpl-media]");
      // Place media (or hide slot)
      drawerMedia.innerHTML = "";
      if (mediaWrap) {
        // Move media's children into the slot, then remove the wrapper from body
        while (mediaWrap.firstChild) drawerMedia.appendChild(mediaWrap.firstChild);
        mediaWrap.parentNode.removeChild(mediaWrap);
      }
      // Place body
      drawerBody.innerHTML = "";
      drawerBody.appendChild(frag);
      // Init brain interaction if present
      const brain = drawerMedia.querySelector("[data-brain-3d]");
      if (brain) initBrainInteraction(brain);
      // Header
      const meta = CARD_TITLES[name] || { eyebrow: "", title: "" };
      drawerEyebrow.textContent = meta.eyebrow;
      drawerHead.textContent = meta.title;
      // Show
      drawer.hidden = false;
      scrim.hidden = false;
      // Force reflow so transition runs
      void drawer.offsetWidth;
      drawer.setAttribute("data-shown", "true");
      scrim.setAttribute("data-shown", "true");
      // Lock scroll
      lastScrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = "-" + lastScrollY + "px";
      document.body.style.left = "0";
      document.body.style.right = "0";
      // Aria
      activeCardEl = fromEl;
      if (fromEl) fromEl.setAttribute("aria-expanded", "true");
      // Focus close button after transition starts
      setTimeout(function () {
        const closeBtn = drawer.querySelector("[data-drawer-close]");
        if (closeBtn) closeBtn.focus();
      }, 50);
    }

    function closeDrawer() {
      if (drawer.hidden) return;
      drawer.removeAttribute("data-shown");
      scrim.removeAttribute("data-shown");
      // Unlock scroll
      const y = lastScrollY;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, y);
      // Aria + focus return
      if (activeCardEl) {
        activeCardEl.setAttribute("aria-expanded", "false");
        activeCardEl.focus();
        activeCardEl = null;
      }
      // Hide after transition completes
      setTimeout(function () {
        if (!drawer.hasAttribute("data-shown")) {
          drawer.hidden = true;
          scrim.hidden = true;
        }
      }, 320);
    }

    document.querySelectorAll("[data-card]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openDrawer(btn.getAttribute("data-card"), btn);
      });
    });
    scrim.addEventListener("click", closeDrawer);
    drawer.querySelector("[data-drawer-close]").addEventListener("click", closeDrawer);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !drawer.hidden && drawer.hasAttribute("data-shown")) closeDrawer();
    });
    // Drawer-internal anchor links should close drawer then jump
    drawer.addEventListener("click", function (e) {
      const a = e.target.closest("[data-drawer-jump]");
      if (!a) return;
      e.preventDefault();
      const href = a.getAttribute("href");
      closeDrawer();
      setTimeout(function () {
        const id = href.replace(/^#/, "");
        const target = document.getElementById(id);
        if (target) {
          const navH = window.matchMedia("(min-width: 768px)").matches ? 64 : 0;
          const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
          window.scrollTo({ top: top, behavior: "smooth" });
          history.pushState(null, "", href);
        }
      }, 320);
    });

    // Mobile: swipe down on handle to close
    if (drawerHandle) {
      let startY = null;
      let dy = 0;
      drawerHandle.addEventListener("touchstart", function (e) {
        startY = e.touches[0].clientY;
        dy = 0;
      }, { passive: true });
      drawerHandle.addEventListener("touchmove", function (e) {
        if (startY === null) return;
        dy = e.touches[0].clientY - startY;
        if (dy > 0) {
          drawer.style.transform = "translateY(" + dy + "px)";
          drawer.style.transition = "none";
        }
      }, { passive: true });
      drawerHandle.addEventListener("touchend", function () {
        drawer.style.transition = "";
        drawer.style.transform = "";
        if (dy > 80) closeDrawer();
        startY = null;
        dy = 0;
      });
    }
  }

  /* ===== Section 3 — Timeline / steps =====
     Multi-open inline expand. Click-based progress = Set<stepId>
     serialized to sessionStorage. Expand all / Collapse all controls. */
  const timeline = document.querySelector("[data-timeline]");
  if (timeline) {
    const STEPS_KEY = "ai-steps-expanded";
    const totalSteps = timeline.querySelectorAll("[data-step]").length;
    const countEl = timeline.querySelector("[data-progress-count]");
    const fillEl = timeline.querySelector("[data-progress-fill]");

    function readSet() {
      try {
        const raw = sessionStorage.getItem(STEPS_KEY);
        if (!raw) return new Set();
        return new Set(JSON.parse(raw));
      } catch (e) { return new Set(); }
    }
    function writeSet(s) {
      try { sessionStorage.setItem(STEPS_KEY, JSON.stringify(Array.from(s))); } catch (e) {}
    }

    let expanded = readSet();
    function updateProgress() {
      if (countEl) countEl.textContent = String(expanded.size);
      if (fillEl) fillEl.style.width = (expanded.size / totalSteps * 100) + "%";
    }

    function setStep(stepEl, open, persist) {
      const head = stepEl.querySelector(".step__head");
      const body = stepEl.querySelector(".step__body");
      if (!head || !body) return;
      head.setAttribute("aria-expanded", open ? "true" : "false");
      body.hidden = !open;
      const id = stepEl.getAttribute("data-step");
      if (open) expanded.add(id); else expanded.delete(id);
      if (persist !== false) writeSet(expanded);
      updateProgress();
    }

    // Restore from sessionStorage
    timeline.querySelectorAll("[data-step]").forEach(function (stepEl) {
      const id = stepEl.getAttribute("data-step");
      if (expanded.has(id)) setStep(stepEl, true, false);
    });
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

    const expandAll = timeline.querySelector("[data-expand-all]");
    const collapseAll = timeline.querySelector("[data-collapse-all]");
    if (expandAll) {
      expandAll.addEventListener("click", function () {
        timeline.querySelectorAll("[data-step]").forEach(function (s) { setStep(s, true, false); });
        writeSet(expanded);
      });
    }
    if (collapseAll) {
      collapseAll.addEventListener("click", function () {
        timeline.querySelectorAll("[data-step]").forEach(function (s) { setStep(s, false, false); });
        writeSet(expanded);
      });
    }
  }

  /* ===== Section 6 — Hiring tabs =====
     On Load: no tab selected, all panels hidden, CTA hidden.
     Tab click reveals its panel + the CTA. */
  const hiring = document.querySelector("[data-hiring]");
  if (hiring) {
    const tabs = Array.from(hiring.querySelectorAll("[data-hiring-tab]"));
    const panels = Array.from(hiring.querySelectorAll("[data-hiring-panel]"));
    const cta = hiring.querySelector("[data-hiring-cta]");
    const lede = hiring.parentElement && hiring.parentElement.querySelector(".section__lede");

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
      if (lede) lede.hidden = false;
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

})();
