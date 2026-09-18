/* ==========================================================================
   LuminaForge — hero 3D
   A dependency-free rotating point-cloud sphere rendered on <canvas>.
   Real 3D projection + depth sorting + constellation edges + pointer parallax.
   Degrades gracefully: if canvas/2d is unavailable the stage still looks good
   (ring + label from CSS), and animation pauses off-screen / on reduced motion.
   ========================================================================== */
(function () {
  'use strict';
  var canvas = document.getElementById('heroCanvas');
  var stage = document.getElementById('heroStage');
  if (!canvas || !stage) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Build points on a Fibonacci sphere (even distribution) --------- */
  var N = 150;
  var pts = [];
  var golden = Math.PI * (3 - Math.sqrt(5));
  for (var i = 0; i < N; i++) {
    var y = 1 - (i / (N - 1)) * 2;
    var r = Math.sqrt(1 - y * y);
    var t = golden * i;
    pts.push({ x: Math.cos(t) * r, y: y, z: Math.sin(t) * r });
  }

  /* ---- Precompute a handful of nearest-neighbour edges ---------------- */
  var edges = [];
  for (var a = 0; a < N; a++) {
    var dists = [];
    for (var b = 0; b < N; b++) {
      if (a === b) continue;
      var dx = pts[a].x - pts[b].x, dy = pts[a].y - pts[b].y, dz = pts[a].z - pts[b].z;
      dists.push({ b: b, d: dx * dx + dy * dy + dz * dz });
    }
    dists.sort(function (m, n) { return m.d - n.d; });
    for (var k = 0; k < 3; k++) { if (a < dists[k].b) edges.push([a, dists[k].b]); }
  }

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
    R = Math.min(W, H) * 0.34;
    cx = W / 2; cy = H / 2;
  }
  resize();
  window.addEventListener('resize', resize);

  /* ---- Pointer parallax ----------------------------------------------- */
  var tx = 0, ty = 0, mx = 0, my = 0;
  if (!reduce) {
    stage.addEventListener('pointermove', function (e) {
      var rect = stage.getBoundingClientRect();
      tx = ((e.clientX - rect.left) / rect.width - 0.5) * 0.6;
      ty = ((e.clientY - rect.top) / rect.height - 0.5) * 0.6;
    });
    stage.addEventListener('pointerleave', function () { tx = 0; ty = 0; });
  }

  /* ---- Visibility gate: don't animate off-screen ---------------------- */
  var visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) loop(); },
      { threshold: 0.05 }).observe(stage);
  }

  /* ---- Render --------------------------------------------------------- */
  var ry = 0, rx = -0.35, running = false;
  function project() {
    mx += (tx - mx) * 0.06; my += (ty - my) * 0.06;
    var ay = ry + mx, ax = rx + my;
    var cosY = Math.cos(ay), sinY = Math.sin(ay);
    var cosX = Math.cos(ax), sinX = Math.sin(ax);
    var out = new Array(N);
    for (var i = 0; i < N; i++) {
      var p = pts[i];
      // rotate Y then X
      var x1 = p.x * cosY - p.z * sinY;
      var z1 = p.x * sinY + p.z * cosY;
      var y1 = p.y * cosX - z1 * sinX;
      var z2 = p.y * sinX + z1 * cosX;
      var persp = 3 / (3 + z2); // simple perspective (z2 in [-1,1])
      out[i] = { sx: cx + x1 * R * persp, sy: cy + y1 * R * persp, z: z2, s: persp };
    }
    return out;
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    var pr = project();

    // edges (behind points), fade by average depth
    ctx.lineWidth = 1;
    for (var e = 0; e < edges.length; e++) {
      var A = pr[edges[e][0]], B = pr[edges[e][1]];
      var depth = (A.z + B.z) / 2;             // -1 (back) .. 1 (front)
      var alpha = 0.06 + (depth + 1) * 0.10;   // 0.06 .. 0.26
      ctx.strokeStyle = 'rgba(168,85,247,' + alpha.toFixed(3) + ')';
      ctx.beginPath(); ctx.moveTo(A.sx, A.sy); ctx.lineTo(B.sx, B.sy); ctx.stroke();
    }

    // points, painter's algorithm (far first)
    var order = pr.map(function (p, i) { return i; }).sort(function (m, n) { return pr[m].z - pr[n].z; });
    for (var o = 0; o < order.length; o++) {
      var p = pr[order[o]];
      var d = (p.z + 1) / 2;                    // 0 back .. 1 front
      var rad = (0.8 + d * 2.2) * p.s;
      var g = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, rad * 3);
      var core = 150 + Math.round(d * 90);      // violet -> light violet
      g.addColorStop(0, 'rgba(' + (168 + Math.round(d * 60)) + ',' + core + ',255,' + (0.35 + d * 0.55).toFixed(2) + ')');
      g.addColorStop(1, 'rgba(139,92,246,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.sx, p.sy, rad * 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(' + (200 + Math.round(d * 40)) + ',' + (185 + Math.round(d * 50)) + ',255,' + (0.5 + d * 0.5).toFixed(2) + ')';
      ctx.beginPath(); ctx.arc(p.sx, p.sy, rad, 0, Math.PI * 2); ctx.fill();
    }
  }

  function loop() {
    if (running) return;
    running = true;
    (function tick() {
      if (!visible) { running = false; return; }
      ry += 0.0032;
      frame();
      requestAnimationFrame(tick);
    })();
  }

  if (reduce) { frame(); }   // one static, well-composed frame
  else { loop(); }
})();
