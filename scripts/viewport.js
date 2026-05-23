/* Shared viewport breakpoint helpers.
   Site has a single mobile boundary at 767/768: ≤767 is mobile, ≥768 is
   desktop. One MediaQueryList serves both directions — !isMobile() is the
   same as the (min-width: 768px) check the desktop-only call sites used.
   Exposed on window so the non-module IIFE scripts can share one MQL
   instead of each creating its own. Must load before app.js / grain.js /
   sheet.js / hover.js / tap.js. */
(function () {
  if (typeof window === "undefined" || !window.matchMedia) return;

  var mqlMobile = window.matchMedia("(max-width: 767px)");

  function isMobile() { return mqlMobile.matches; }
  function isDesktop() { return !mqlMobile.matches; }

  function onMobileChange(handler) {
    if (mqlMobile.addEventListener) mqlMobile.addEventListener("change", handler);
    else if (mqlMobile.addListener) mqlMobile.addListener(handler);
  }

  window.AiSiteViewport = {
    mqlMobile: mqlMobile,
    isMobile: isMobile,
    isDesktop: isDesktop,
    onMobileChange: onMobileChange,
  };
})();
