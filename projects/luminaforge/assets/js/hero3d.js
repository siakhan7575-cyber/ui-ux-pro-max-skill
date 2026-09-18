/* ==========================================================================
   LuminaForge — hero 3D  ·  "forged light"
   A dependency-free, organically-breathing point-cloud orb rendered on
   <canvas>. Real 3D projection + depth sorting + a curated multi-hue palette
   + warm embers drifting up from the forge. Pointer parallax + a gentle
   autonomous sway so it feels alive even when the cursor is still.

   Degrades gracefully: without canvas the CSS ring/label still read well;
   animation pauses off-screen and renders a single static frame when the
   viewer prefers reduced motion.
   ========================================================================== */
(function () {
  'use strict';
  var canvas = document.getElementById('heroCanvas');
  var stage = document.getElementById('heroStage');
  if (!canvas || !stage) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fract = function (x) { return x - Math.floor(x); };
  var rand = function (i) { return fract(Math.sin(i * 12.9898 + 4.13) * 43758.5453); };

  /* ---- Points on a Fibonacci sphere, each given a stable hue ---------- */
  var N = 156;
  var pts = [];
  var golden = Math.PI * (3 - Math.sqrt(5));
  for (var i = 0; i < N; i++) {
    var y = 1 - (i / (N - 1)) * 2;
    var r = Math.sqrt(1 - y * y);
    var t = golden * i;
    // Purple family: deep violet through lilac, with a touch of purple-magenta.
    // Tonal variety keeps it rich without leaving the brand colour.
    var roll = rand(i);
    var hue = 256 + roll * 46;                       // ~256–302 (violet→purple-magenta)
    pts.push({ x: Math.cos(t) * r, y: y, z: Math.sin(t) * r, hue: hue, seed: rand(i + 7) });
  }

  /* ---- A few nearest-neighbour edges (the "constellation") ------------ */
  var edges = [];
  for (var a = 0; a < N; a++) {
    var ds = [];
    for (var b = 0; b < N; b++) {
      if (a === b) continue;
      var dx = pts[a].x - pts[b].x, dy = pts[a].y - pts[b].y, dz = pts[a].z - pts[b].z;
      ds.push({ b: b, d: dx * dx + dy * dy + dz * dz });
    }
    ds.sort(function (m, n) { return m.d - n.d; });
    for (var k = 0; k < 3; k++) { if (a < ds[k].b) edges.push([a, ds[k].b]); }
  }

  /* ---- Embers: warm motes that rise from the forge -------------------- */
  var EMBERS = reduce ? 0 : 22;
  var embers = [];
  function spawnEmber(fresh) {
    return {
      x: 0.5 + (Math.random() - 0.5) * 0.55,      // normalised stage coords
      y: fresh ? 0.62 + Math.random() * 0.3 : 1.05 + Math.random() * 0.2,
      vx: (Math.random() - 0.5) * 0.0006,
      vy: -(0.0012 + Math.random() * 0.0018),
      life: fresh ? Math.random() : 0,
      size: 0.7 + Math.random() * 1.8,
      hue: [268, 286, 258, 300][Math.floor(Math.random() * 4)] + (Math.random() * 12 - 6),
      sway: Math.random() * Math.PI * 2
    };
  }
  for (var e0 = 0; e0 < EMBERS; e0++) embers.push(spawnEmber(true));

  /* ---- Sizing (DPR-aware) --------------------------------------------- */
  var W = 0, H = 0, DPR = 1, R = 0, cx = 0, cy = 0;
  function resize() {
    var rect = stage.getBoundingClientRect();
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, Math.round(rect.width));
    H = Math.max(1, Math.round(rect.height));
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    R = Math.min(W, H) * 0.33;
    cx = W / 2; cy = H / 2;
  }
  resize();
  window.addEventListener('resize', resize);

  /* ---- Pointer parallax ----------------------------------------------- */
  var tx = 0, ty = 0, mx = 0, my = 0;
  if (!reduce) {
    stage.addEventListener('pointermove', function (ev) {
      var rect = stage.getBoundingClientRect();
      tx = ((ev.clientX - rect.left) / rect.width - 0.5) * 0.7;
      ty = ((ev.clientY - rect.top) / rect.height - 0.5) * 0.7;
    });
    stage.addEventListener('pointerleave', function () { tx = 0; ty = 0; });
  }

  /* ---- Visibility gate ------------------------------------------------ */
  var visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) loop(); },
      { threshold: 0.05 }).observe(stage);
  }

  /* ---- Projection with organic breathing displacement ----------------- */
  var ry = 0, rx = -0.32, running = false, T = 0;
  function project() {
    mx += (tx - mx) * 0.06; my += (ty - my) * 0.06;
    // gentle autonomous sway so it lives without a cursor
    var swayX = Math.sin(T * 0.34) * 0.12, swayY = Math.cos(T * 0.27) * 0.09;
    var ay = ry + mx + swayX, ax = rx + my + swayY;
    var cosY = Math.cos(ay), sinY = Math.sin(ay), cosX = Math.cos(ax), sinX = Math.sin(ax);
    var out = new Array(N);
    for (var i = 0; i < N; i++) {
      var p = pts[i];
      // breathing ripple — layered sines give a smooth, hand-made undulation
      var disp = 0.10 * Math.sin(2.2 * p.y + T * 0.9)
               + 0.07 * Math.sin(3.0 * p.x + T * 1.2 + p.seed * 6.28)
               + 0.06 * Math.sin(2.6 * p.z + T * 0.7);
      var rr = 1 + disp;
      var X = p.x * rr, Y = p.y * rr, Z = p.z * rr;
      var x1 = X * cosY - Z * sinY;
      var z1 = X * sinY + Z * cosY;
      var y1 = Y * cosX - z1 * sinX;
      var z2 = Y * sinX + z1 * cosX;
      var persp = 3 / (3 + z2);
      out[i] = { sx: cx + x1 * R * persp, sy: cy + y1 * R * persp, z: z2, s: persp, hue: p.hue, seed: p.seed };
    }
    return out;
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);

    // breathing core glow (two offset hues -> richer, warmer centre)
    var pulse = 0.82 + 0.18 * Math.sin(T * 0.8);
    var hShift = 14 * Math.sin(T * 0.3);
    var g1 = ctx.createRadialGradient(cx - R * 0.12, cy, 0, cx, cy, R * 1.5 * pulse);
    g1.addColorStop(0, 'hsla(' + (288 + hShift) + ',90%,64%,0.30)');
    g1.addColorStop(0.5, 'hsla(' + (258 + hShift) + ',85%,55%,0.10)');
    g1.addColorStop(1, 'hsla(258,85%,55%,0)');
    ctx.fillStyle = g1;
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.5, 0, Math.PI * 2); ctx.fill();
    var g2 = ctx.createRadialGradient(cx + R * 0.25, cy + R * 0.15, 0, cx, cy, R * 1.1 * pulse);
    g2.addColorStop(0, 'hsla(' + (282 + hShift) + ',96%,74%,0.14)');
    g2.addColorStop(1, 'hsla(282,96%,72%,0)');
    ctx.fillStyle = g2;
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.2, 0, Math.PI * 2); ctx.fill();

    var pr = project();

    // additive blending makes the light feel forged / luminous
    ctx.globalCompositeOperation = 'lighter';

    // edges
    ctx.lineWidth = 1;
    for (var e = 0; e < edges.length; e++) {
      var A = pr[edges[e][0]], B = pr[edges[e][1]];
      var depth = (A.z + B.z) / 2;
      var alpha = 0.04 + (depth + 1) * 0.09;
      var h = (A.hue + B.hue) / 2 + hShift;
      ctx.strokeStyle = 'hsla(' + h + ',80%,62%,' + alpha.toFixed(3) + ')';
      ctx.beginPath(); ctx.moveTo(A.sx, A.sy); ctx.lineTo(B.sx, B.sy); ctx.stroke();
    }

    // points, far-to-near
    var order = pr.map(function (p, i) { return i; }).sort(function (m, n) { return pr[m].z - pr[n].z; });
    for (var o = 0; o < order.length; o++) {
      var p = pr[order[o]];
      var d = (p.z + 1) / 2;                         // 0 back .. 1 front
      var h2 = p.hue + hShift + Math.sin(T * 0.5 + p.seed * 6.28) * 6;
      var rad = (0.8 + d * 2.3) * p.s;
      var glow = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, rad * 3.2);
      glow.addColorStop(0, 'hsla(' + h2 + ',95%,' + (60 + d * 16) + '%,' + (0.30 + d * 0.5).toFixed(2) + ')');
      glow.addColorStop(1, 'hsla(' + h2 + ',95%,60%,0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(p.sx, p.sy, rad * 3.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'hsla(' + h2 + ',100%,' + (78 + d * 14) + '%,' + (0.55 + d * 0.45).toFixed(2) + ')';
      ctx.beginPath(); ctx.arc(p.sx, p.sy, rad, 0, Math.PI * 2); ctx.fill();
    }

    // embers rising from the forge
    for (var m = 0; m < embers.length; m++) {
      var em = embers[m];
      var ex = (em.x + Math.sin(em.sway + T * 0.9) * 0.02) * W;
      var ey = em.y * H;
      var fade = Math.sin(Math.min(em.life, 1) * Math.PI);   // fade in then out
      var er = em.size * (0.6 + fade);
      var eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, er * 4);
      eg.addColorStop(0, 'hsla(' + em.hue + ',95%,70%,' + (0.5 * fade).toFixed(2) + ')');
      eg.addColorStop(1, 'hsla(' + em.hue + ',95%,60%,0)');
      ctx.fillStyle = eg;
      ctx.beginPath(); ctx.arc(ex, ey, er * 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'hsla(' + em.hue + ',100%,85%,' + (0.7 * fade).toFixed(2) + ')';
      ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2); ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  function step() {
    for (var m = 0; m < embers.length; m++) {
      var em = embers[m];
      em.x += em.vx; em.y += em.vy; em.life += 0.006;
      if (em.y < -0.1 || em.life > 1.6) embers[m] = spawnEmber(false);
    }
  }

  function loop() {
    if (running) return;
    running = true;
    (function tick() {
      if (!visible) { running = false; return; }
      T += 0.016; ry += 0.0028;
      step();
      frame();
      requestAnimationFrame(tick);
    })();
  }

  if (reduce) { T = 1.4; frame(); }   // one composed, colourful static frame
  else { loop(); }
})();
