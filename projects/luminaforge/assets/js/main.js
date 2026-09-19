/* ==========================================================================
   LuminaForge — behaviour & rendering
   Renders content from window.LUMINAFORGE (config.js) and wires interactions.
   ========================================================================== */
(function () {
  'use strict';
  var CFG = window.LUMINAFORGE || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };

  /* ---- Inline icon set (no icon-font dependency) ----------------------- */
  var ICONS = {
    layout: '<path d="M3 5h18v14H3zM3 9h18M9 9v10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    store:  '<path d="M4 9l1-4h14l1 4M4 9h16v10H4zM4 9a3 3 0 006 0 3 3 0 006 0 3 3 0 004 0" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    gauge:  '<path d="M12 13l4-3M5.5 18a9 9 0 1113 0" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    sparkle:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    user:   '<path d="M4 20a8 8 0 0116 0M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    code:   '<path d="M9 8l-5 4 5 4M15 8l5 4-5 4M13 5l-2 14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    phone:  '<path d="M7 4h4l1 5-2 1a11 11 0 004 4l1-2 5 1v4a2 2 0 01-2 2A16 16 0 015 6a2 2 0 012-2z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    check:  '<path d="M4 12l5 5L20 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
    mail:   '<path d="M3 6h18v12H3zM3 7l9 6 9-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    whatsapp:'<path d="M12 3a9 9 0 00-7.7 13.6L3 21l4.6-1.2A9 9 0 1012 3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8.8 8.4c-.2 0-.5.1-.7.4-.2.3-.8.9-.8 2 0 1.2.9 2.4 1 2.5.1.2 1.7 2.7 4.2 3.7 2 .8 2.4.7 2.9.6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1 .1-1.2l-1.7-.8c-.2-.1-.5-.2-.7.1l-.6.7c-.1.2-.3.2-.5.1-.7-.3-1.3-.6-2-1.4-.5-.6-.8-1.2-.9-1.4-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3 0-.5l-.7-1.6c-.2-.3-.4-.3-.5-.3z" fill="currentColor" stroke="none"/>',
    github: '<path d="M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.3 9.3 0 015 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.8-2.4 4.6-4.6 4.9.3.3.6.9.6 1.8v2.7c0 .3.2.6.7.5A10 10 0 0012 2z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>',
    linkedin:'<path d="M4.5 9H8v11H4.5zM6.2 4.5a1.8 1.8 0 100 3.6 1.8 1.8 0 000-3.6zM11 9h3.3v1.6c.5-.9 1.6-1.9 3.4-1.9 2.6 0 3.8 1.7 3.8 4.6V20h-3.5v-5.4c0-1.3-.5-2.2-1.7-2.2-1 0-1.5.7-1.8 1.3-.1.3-.1.6-.1 1V20H11z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>',
    x:      '<path d="M4 4l16 16M20 4L4 20" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
    dribbble:'<path d="M12 3a9 9 0 100 18 9 9 0 000-18zM4 9c5 .3 10-.6 13-3M3.5 13c6-1.4 10 .5 12.5 4M9 4c3 4 4.5 9 4.5 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
    arrow:  '<path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    ext:    '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>'
  };
  function icon(name) { return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' + (ICONS[name] || '') + '</svg>'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]; }); }
  function initials(s) { return String(s || '').trim().split(/\s+/).map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase() || 'LF'; }

  /* ---- Services -------------------------------------------------------- */
  function renderServices() {
    var grid = $('#servicesGrid'); if (!grid) return;
    grid.innerHTML = (CFG.services || []).map(function (s, i) {
      return '<article class="card reveal" data-delay="' + (i % 3) + '">' +
        '<span class="service-num">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<div class="card-icon">' + icon(s.icon) + '</div>' +
        '<h3>' + esc(s.title) + '</h3>' +
        '<p>' + esc(s.body) + '</p>' +
        '</article>';
    }).join('');
  }

  /* ---- Portfolio ------------------------------------------------------- */
  function renderProjects() {
    var grid = $('#portfolioGrid'); if (!grid) return;
    var list = CFG.projects || [];
    if (!list.length) {
      grid.insertAdjacentHTML('beforeend',
        '<p style="color:var(--ink-mute)">Projects are on the way — <a href="#contact" style="color:var(--violet-lo)">get in touch</a> for a walkthrough of recent work.</p>');
      return;
    }
    list.forEach(function (p, i) {
      var el = document.createElement('article');
      el.className = 'project reveal';
      el.setAttribute('data-delay', String(i % 2));
      if (p.accent) el.style.setProperty('--proj-accent', p.accent);

      var links = '';
      if (p.liveUrl) links += '<a class="btn btn-primary btn-sm" href="' + esc(p.liveUrl) + '" target="_blank" rel="noopener">View live demo ' + icon('ext') + '</a>';
      if (p.caseUrl) links += '<a class="btn btn-ghost btn-sm" href="' + esc(p.caseUrl) + '" target="_blank" rel="noopener">View project</a>';

      var overlay = links ? '<div class="project-overlay">' + links + '</div>' : '';

      el.innerHTML =
        '<div class="project-media">' +
          '<img src="' + esc(p.image) + '" alt="Screenshot of the ' + esc(p.name) + ' website" loading="lazy" decoding="async" />' +
          overlay +
        '</div>' +
        '<div class="project-body">' +
          '<span class="project-tag">' + esc(p.type) + '</span>' +
          '<h3>' + esc(p.name) + '</h3>' +
          '<p>' + esc(p.description) + '</p>' +
          '<ul class="project-features">' + (p.features || []).map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
          (links ? '<div class="project-links">' + links + '</div>' : '') +
        '</div>';

      // Graceful placeholder if the screenshot is missing / fails to load
      var img = el.querySelector('img');
      img.addEventListener('error', function () {
        var media = el.querySelector('.project-media');
        img.remove();
        var ph = document.createElement('div');
        ph.className = 'project-placeholder';
        ph.innerHTML = '<span class="ph-mark">' + esc(initials(p.name)) + '</span>' +
                       '<span class="ph-note">add screenshot: ' + esc(p.image || '') + '</span>';
        media.insertBefore(ph, media.firstChild);
      });

      grid.appendChild(el);
    });
    enableTilt();
  }

  /* ---- Process --------------------------------------------------------- */
  function renderProcess() {
    var el = $('#processList'); if (!el) return;
    el.innerHTML = (CFG.process || []).map(function (p, i) {
      return '<div class="process-item reveal" data-delay="' + (i % 3) + '">' +
        '<span class="process-num">' + esc(p.step) + '</span>' +
        '<div><h3>' + esc(p.title) + '</h3><p>' + esc(p.body) + '</p></div>' +
        '</div>';
    }).join('');
  }

  /* ---- Reasons --------------------------------------------------------- */
  function renderReasons() {
    var grid = $('#reasonsGrid'); if (!grid) return;
    grid.innerHTML = (CFG.reasons || []).map(function (r, i) {
      return '<article class="card reveal" data-delay="' + (i % 3) + '">' +
        '<div class="card-icon">' + icon(r.icon) + '</div>' +
        '<h3>' + esc(r.title) + '</h3><p>' + esc(r.body) + '</p></article>';
    }).join('');
  }

  /* ---- Testimonials ---------------------------------------------------- */
  function renderTestimonials() {
    var grid = $('#testimonialsGrid'); if (!grid) return;
    var list = CFG.testimonials || [];
    if (!list.length) { grid.innerHTML = '<p style="color:var(--ink-mute)">Client stories coming soon.</p>'; return; }
    grid.innerHTML = list.map(function (t, i) {
      return '<figure class="quote reveal" data-delay="' + (i % 2) + '">' +
        (t.sample ? '<span class="sample-tag">Sample</span>' : '') +
        '<span class="q-mark" aria-hidden="true">&ldquo;</span>' +
        '<blockquote>' + esc(t.quote) + '</blockquote>' +
        '<figcaption>' +
          '<span class="avatar" aria-hidden="true">' + esc(initials(t.name)) + '</span>' +
          '<span class="who"><strong>' + esc(t.name) + '</strong><span>' + esc(t.role) + '</span></span>' +
        '</figcaption></figure>';
    }).join('');
  }

  /* ---- Contact (actions, list, socials, form) -------------------------- */
  function waLink(num) { return 'https://wa.me/' + String(num).replace(/[^0-9]/g, ''); }

  function renderContact() {
    var c = CFG.contact || {};
    var actions = $('#contactActions');
    var list = $('#contactList');

    var actionHtml = '';
    if (c.email) actionHtml += '<a class="btn btn-primary" href="mailto:' + esc(c.email) + '?subject=Website%20enquiry">' + icon('mail') + 'Email me</a>';
    if (c.whatsapp) actionHtml += '<a class="btn btn-ghost" href="' + waLink(c.whatsapp) + '" target="_blank" rel="noopener">' + icon('whatsapp') + 'WhatsApp</a>';
    if (actions) actions.innerHTML = actionHtml;

    var items = '';
    if (c.email) items += '<li><a href="mailto:' + esc(c.email) + '"><span class="ci">' + icon('mail') + '</span><span class="ct"><strong>Email</strong><span>' + esc(c.email) + '</span></span></a></li>';
    if (c.whatsapp) items += '<li><a href="' + waLink(c.whatsapp) + '" target="_blank" rel="noopener"><span class="ci">' + icon('whatsapp') + '</span><span class="ct"><strong>WhatsApp</strong><span>Message me directly</span></span></a></li>';
    var socials = c.socials || {};
    var socialKeys = ['github', 'linkedin', 'x', 'dribbble'];
    socialKeys.forEach(function (k) {
      if (socials[k]) items += '<li><a href="' + esc(socials[k]) + '" target="_blank" rel="noopener"><span class="ci">' + icon(k) + '</span><span class="ct"><strong>' + (k === 'x' ? 'X / Twitter' : k.charAt(0).toUpperCase() + k.slice(1)) + '</strong><span>Follow the work</span></span></a></li>';
    });
    if (!items) items = '<li><a href="mailto:siakhan7575@gmail.com"><span class="ci">' + icon('mail') + '</span><span class="ct"><strong>Email</strong><span>Get in touch</span></span></a></li>';
    if (list) list.innerHTML = items;

    // Footer socials
    var fs = $('#footerSocials');
    if (fs) {
      var f = '';
      socialKeys.forEach(function (k) { if (socials[k]) f += '<a href="' + esc(socials[k]) + '" target="_blank" rel="noopener" aria-label="' + esc(k) + '">' + icon(k) + '</a>'; });
      fs.innerHTML = f;
    }
  }

  /* ---- Contact / lead form --------------------------------------------
     Captures the client's details. If contact.formEndpoint is set, the
     lead is POSTed there (e.g. Formspree); otherwise it falls back to a
     pre-filled email to your inbox. Loading / success / error states are
     shown inline.
     ---------------------------------------------------------------------- */
  function wireForm() {
    var form = $('#contactForm'); if (!form) return;
    var status = $('#cf-status');
    var submit = $('#cf-submit');
    var val = function (id) { var el = $(id); return el ? el.value.trim() : ''; };

    function mailtoFallback(lead) {
      var to = (CFG.contact && CFG.contact.email) || 'siakhan7575@gmail.com';
      var lines = [
        'Name: ' + lead.name,
        'Email: ' + lead.email,
        lead.phone ? 'Phone / WhatsApp: ' + lead.phone : '',
        lead.business ? 'Business type: ' + lead.business : '',
        '',
        lead.message
      ].filter(Boolean).join('\n');
      var subject = encodeURIComponent('Website enquiry from ' + lead.name);
      window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + encodeURIComponent(lines);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status';
      var lead = {
        name: val('#cf-name'), email: val('#cf-email'), phone: val('#cf-phone'),
        business: val('#cf-business'), message: val('#cf-msg')
      };
      if (!lead.name || !lead.email || !lead.message) {
        status.textContent = 'Please fill in your name, email and a short message.'; status.classList.add('err'); return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email)) {
        status.textContent = 'That email doesn\'t look right — mind checking it?'; status.classList.add('err'); return;
      }

      submit.classList.add('is-loading');
      var endpoint = CFG.contact && CFG.contact.formEndpoint;
      var done = function (ok) {
        submit.classList.remove('is-loading');
        if (ok) {
          status.textContent = 'Thanks, ' + lead.name.split(' ')[0] + '! Your message is on its way — I\'ll be in touch soon.';
          status.classList.add('ok'); form.reset();
        } else {
          status.textContent = 'Something went wrong sending that. Please email me directly and I\'ll get right back to you.';
          status.classList.add('err');
        }
      };

      if (endpoint) {
        fetch(endpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(lead)
        }).then(function (r) { done(r.ok); }).catch(function () { done(false); });
      } else {
        // No endpoint configured — hand off to the visitor's email app.
        setTimeout(function () {
          status.textContent = 'Thanks, ' + lead.name.split(' ')[0] + '! Opening your email app to send…';
          status.classList.add('ok');
          mailtoFallback(lead);
          submit.classList.remove('is-loading');
          form.reset();
        }, 500);
      }
    });
  }

  /* ---- Pricing / Packages ---------------------------------------------- */
  function renderPackages() {
    var grid = $('#packagesGrid'); if (!grid) return;
    var list = CFG.packages || [];
    grid.innerHTML = list.map(function (p, i) {
      var feats = (p.features || []).map(function (f) {
        return '<li>' + icon('check') + '<span>' + esc(f) + '</span></li>';
      }).join('');
      return '<article class="package' + (p.featured ? ' is-featured' : '') + ' reveal" data-delay="' + (i % 3) + '">' +
        (p.featured ? '<span class="pkg-badge">Most popular</span>' : '') +
        '<h3>' + esc(p.name) + '</h3>' +
        '<p class="pkg-blurb">' + esc(p.blurb) + '</p>' +
        (p.price ? '<div class="pkg-price">' + esc(p.price) + '</div>' : '<div class="pkg-price pkg-quote">Contact for quote</div>') +
        '<ul class="pkg-feats">' + feats + '</ul>' +
        '<a class="btn ' + (p.featured ? 'btn-primary' : 'btn-ghost') + '" href="#contact">Get a quote</a>' +
        '</article>';
    }).join('');
  }

  /* ---- FAQ (native <details> accordion) -------------------------------- */
  function renderFaq() {
    var wrap = $('#faqList'); if (!wrap) return;
    wrap.innerHTML = (CFG.faq || []).map(function (f, i) {
      return '<details class="faq-item reveal" data-delay="' + (i % 3) + '"' + (i === 0 ? ' open' : '') + '>' +
        '<summary><span>' + esc(f.q) + '</span>' +
        '<svg class="faq-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</summary><div class="faq-a"><p>' + esc(f.a) + '</p></div></details>';
    }).join('');
  }

  /* ---- 3D tilt on project cards (respects reduced motion) -------------- */
  function enableTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;
    document.querySelectorAll('.project').forEach(function (card) {
      var raf = null;
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          card.style.transform = 'perspective(900px) rotateY(' + (px * 4.5).toFixed(2) + 'deg) rotateX(' + (-py * 4.5).toFixed(2) + 'deg) translateY(-4px)';
        });
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* ---- Scroll reveal --------------------------------------------------- */
  function wireReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- Header + mobile nav -------------------------------------------- */
  function wireHeader() {
    var header = $('#siteHeader');
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 12); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

    var toggle = $('#navToggle'), links = $('#navLinks');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = document.body.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          document.body.classList.remove('nav-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /* ---- Misc ------------------------------------------------------------ */
  function fillMeta() {
    var year = new Date().getFullYear();
    var owner = (CFG.brand && CFG.brand.owner) || 'LuminaForge';
    var fl = $('#footerLegal'); if (fl) fl.textContent = '© ' + year + ' ' + owner + '. Crafted with care.';
    // Duplicate marquee track for a seamless loop
    var mq = $('#marquee'); if (mq) mq.innerHTML += mq.innerHTML;
  }

  /* ---- Boot ------------------------------------------------------------ */
  function init() {
    if (!window.LUMINAFORGE) { console.warn('LuminaForge config missing'); }
    renderServices();
    renderProjects();
    renderProcess();
    renderReasons();
    renderPackages();
    renderTestimonials();
    renderFaq();
    renderContact();
    wireForm();
    wireHeader();
    fillMeta();
    wireReveal();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
