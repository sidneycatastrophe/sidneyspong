// Parallax for .hero-banner-image
// Only runs on non-touch, wide (>= 900px) screens and respects prefers-reduced-motion.

(function () {
  // tiny helper to detect touch devices (we'll disable parallax for them)
  const isTouchDevice = () => {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  };

  // respect prefers-reduced-motion
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // helper: only run parallax on wide viewports (desktop-ish)
  const MIN_WIDTH = 900;
  const isWideEnough = () => window.innerWidth >= MIN_WIDTH;

  // Only enable on non-touch desktop devices, wide viewports, and no reduced motion
  if (isTouchDevice() || prefersReducedMotion || !isWideEnough()) {
    return;
  }

  const img = document.querySelector(".hero-banner-image");
  const banner = document.querySelector(".hero-banner");

  if (!img || !banner) {
    // nothing to do
    console.warn("Parallax: .hero-banner-image or .hero-banner not found.");
    return;
  }

  // config: strength of parallax (0 = none, 1 = 1:1 movement)
  const strength = 0.25; // 0.1..0.4 is usually nice; adjust to taste

  let bannerRect = null;
  let ticking = false;

  function updateRects() {
    bannerRect = banner.getBoundingClientRect();
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        applyParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  function applyParallax() {
    // If viewport is no longer wide enough, disable effect and reset transform
    if (!isWideEnough()) {
      img.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    // re-read rect if necessary
    if (!bannerRect) updateRects();

    const viewportHeight = window.innerHeight;
    const bannerTop = bannerRect.top;
    const bannerHeight = bannerRect.height;

    // If banner completely outside viewport, nothing to do
    if (bannerTop > viewportHeight || bannerTop + bannerHeight < 0) {
      return;
    }

    // How far the banner's center is from viewport center (range negative..positive)
    const bannerCenter = bannerTop + bannerHeight / 2;
    const viewportCenter = viewportHeight / 2;
    const distanceFromCenter = bannerCenter - viewportCenter;

    // Compute translate amount: distanceFromCenter scaled by strength
    const translateY = -distanceFromCenter * strength;

    // Apply transform — use translate3d for GPU
    img.style.transform = `translate3d(0, ${translateY}px, 0)`;
  }

  // update on resize (recalc banner rect / disable under 900px)
  window.addEventListener("resize", () => {
    if (!isWideEnough()) {
      // turn effect off on smaller screens
      img.style.transform = "translate3d(0, 0, 0)";
      bannerRect = null;
      return;
    }
    updateRects();
    applyParallax();
  });

  // update rect once images have loaded (in case of slow network)
  if (!img.complete) {
    img.addEventListener("load", () => {
      updateRects();
      applyParallax();
    });
  }

  // initial measurement and hook scroll
  updateRects();
  applyParallax();
  window.addEventListener("scroll", onScroll, { passive: true });
})();
