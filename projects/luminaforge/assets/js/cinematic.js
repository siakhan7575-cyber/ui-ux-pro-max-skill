/* ==========================================================================
   LuminaForge — cinematic layer
   A short film-style intro reveal, a scroll-progress line, and subtle
   scroll parallax. All tasteful, dependency-free, and reduced-motion aware.
   ========================================================================== */
(function () {
  'use strict';
  var doc = document;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Intro reveal ---------------------------------------------------- */
  function runIntro() {
    var intro = doc.getElementById('intro');
    if (!intro) return;

    var seen = false;
    try { seen = sessionStorage.getItem('lf_intro') === '1'; } catch (e) {}

    // Skip the curtain for return visits (this session) or reduced motion.
    if (seen || reduce) {
      intro.parentNode && intro.parentNode.removeChild(intro);
      doc.body.classList.add('is-ready');
      return;
    }

    doc.body.classList.add('intro-active');
    try { sessionStorage.setItem('lf_intro', '1'); } catch (e) {}

    var lift = function () {
      if (intro.classList.contains('is-done')) return;
      intro.classList.add('is-done');
      doc.body.classList.remove('intro-active');
      doc.body.classList.add('is-ready');
      window.setTimeout(function () { intro.parentNode && intro.parentNode.removeChild(intro); }, 1100);
    };

    // Keep the curtain up for a minimum beat, and until the brand font is
    // ready (capped) so the wordmark never flashes a fallback — then lift.
    var minShow = 1600, start = (window.performance && performance.now()) || Date.now();
    var timer;
    var scheduleLift = function () {
      var elapsed = ((window.performance && performance.now()) || Date.now()) - start;
      timer = window.setTimeout(lift, Math.max(0, minShow - elapsed));
    };
    if (doc.fonts && doc.fonts.ready) {
      Promise.race([doc.fonts.ready, new Promise(function (r) { window.setTimeout(r, 1200); })]).then(scheduleLift);
    } else { scheduleLift(); }
    var skip = function () { window.clearTimeout(timer); lift(); };
    intro.addEventListener('click', skip);
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.key === 'Enter') skip(); }, { once: true });
    window.addEventListener('wheel', skip, { once: true, passive: true });
    window.addEventListener('touchstart', skip, { once: true, passive: true });
  }

  /* ---- Scroll progress line ------------------------------------------- */
  function scrollProgress() {
    var bar = doc.getElementById('scrollProgress');
    if (!bar) return;
    var ticking = false;
    var update = function () {
      var h = doc.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? (h.scrollTop || window.pageYOffset) / max : 0;
      bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, p)).toFixed(4) + ')';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---- Subtle scroll parallax ----------------------------------------- */
  function parallax() {
    if (reduce) return;
    var els = [].slice.call(doc.querySelectorAll('[data-parallax]'));
    if (!els.length) return;
    var ticking = false;
    var update = function () {
      var y = window.pageYOffset || doc.documentElement.scrollTop;
      for (var i = 0; i < els.length; i++) {
        var speed = parseFloat(els[i].getAttribute('data-parallax')) || 0;
        els[i].style.transform = 'translate3d(0,' + (-y * speed).toFixed(1) + 'px,0)';
      }
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  function init() { runIntro(); scrollProgress(); parallax(); }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();
})();
