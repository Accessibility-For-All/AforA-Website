// effects.js — scroll-reveal for Accessibility For All
(function () {
  function revealAll(list) {
    list.forEach(function (el) { el.classList.add('revealed'); });
  }
  function init() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) { revealAll(items); return; }

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

    items.forEach(function (el) { io.observe(el); });
  }

  // Wait for full load so images have laid out — prevents every section
  // from being counted as "in view" at once.
  if (document.readyState === 'complete') { init(); }
  else { window.addEventListener('load', init); }
})();
