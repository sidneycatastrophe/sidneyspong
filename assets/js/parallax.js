// Simple, performant parallax for .hero-banner-image
// Usage: include this file with <script src="/assets/js/parallax.js" defer></script>

document.addEventListener('DOMContentLoaded', function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Respect reduced motion preference
    return;
  }

  const img = document.querySelector('.hero-banner-image');
  if (!img) return;

  // Target the banner container so we can observe visibility
  const container = img.closest('.hero-banner') || img.parentElement;
  if (!container) return;

  // Tweak these values to change strength and scale
  const SPEED = 0.22;    // lower = subtler, higher = stronger
  const SCALE = 1.08;    // image scale to avoid empty edges at extremes

  img.style.willChange = 'transform';
  img.style.transform = `translateY(0px) scale(${SCALE})`;
  img.style.transition = 'transform 120ms linear'; // small smoothing when toggling

  let ticking = false;

  function update() {
    // Get container position relative to viewport
    const rect = container.getBoundingClientRect();
    const vh = window.innerHeight;

    // Only update when at least partially visible
    if (rect.bottom <= 0 || rect.top >= vh) {
      ticking = false;
      return;
    }

    // Compute how far the container's center is from the viewport center
    const containerCenter = rect.top + rect.height / 2;
    const viewportCenter = vh / 2;
    // offset in px (positive when container is above viewport center)
    const offset = viewportCenter - containerCenter;

    // Convert offset into translateY. Multiply by speed to control intensity.
    // We're using pixels here which keeps motion consistent across sizes.
    const translateY = Math.round(offset * SPEED);

    img.style.transform = `translateY(${translateY}px) scale(${SCALE})`;

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  // Only run the scroll listener while the banner is in view
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Start listening to scroll (passive for performance)
        window.addEventListener('scroll', onScroll, { passive: true });
        // Do at least one update right away
        onScroll();
      } else {
        window.removeEventListener('scroll', onScroll);
        // Reset transform so it doesn't stay stuck off-center
        img.style.transform = `translateY(0px) scale(${SCALE})`;
      }
    });
  }, { threshold: 0 });

  io.observe(container);

  // Also update on resize because rect calculations change
  window.addEventListener('resize', onScroll, { passive: true });
});
