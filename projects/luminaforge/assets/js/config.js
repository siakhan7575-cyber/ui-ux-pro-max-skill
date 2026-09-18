/* ==========================================================================
   LuminaForge — Site configuration  (EDIT THIS FILE TO UPDATE THE SITE)
   --------------------------------------------------------------------------
   Everything a non-developer would want to change lives here:
   your contact details, your services, your projects and your testimonials.
   Nothing below requires touching the HTML or CSS.
   ========================================================================== */

window.LUMINAFORGE = {

  /* ---- Brand & contact -------------------------------------------------- */
  brand: {
    name: 'LuminaForge',
    tagline: 'Websites that win clients.',
    // Shown in the footer / copyright line.
    owner: 'LuminaForge',
  },

  contact: {
    // Your business email. Used by the "Email me" buttons (mailto:).
    email: 'siakhan7575@gmail.com',

    // WhatsApp number in FULL international format, digits only, no "+".
    // Example: '15551234567'. Leave empty ('') to hide the WhatsApp button.
    whatsapp: '',

    // Optional social links. Leave a value empty ('') to hide that icon.
    socials: {
      github: '',
      linkedin: '',
      x: '',
      dribbble: '',
    },
  },

  /* ---- Services you offer ---------------------------------------------- */
  services: [
    {
      icon: 'layout',
      title: 'Business & Marketing Websites',
      body: 'Fast, responsive sites that turn visitors into enquiries — built to load quickly and read clearly on every device.',
    },
    {
      icon: 'store',
      title: 'Landing Pages & Launches',
      body: 'High-converting single pages for a product, campaign or booking flow, with the copy and layout working together.',
    },
    {
      icon: 'gauge',
      title: 'Web Apps & Dashboards',
      body: 'Interactive interfaces, dashboards and internal tools with clean, maintainable code and real data in mind.',
    },
    {
      icon: 'sparkle',
      title: 'Redesigns & Rescue',
      body: 'A tired or slow site rebuilt into something modern, accessible and easy for you to keep updated.',
    },
  ],

  /* ---- Portfolio projects ----------------------------------------------
     To add a project: copy one { ... } block and change the fields.
     image:  path to a screenshot in assets/img/projects/ .
             If the file is missing, a clean branded placeholder is shown
             automatically — so you can add the picture later without
             touching anything else.
     liveUrl / caseUrl: use '' to hide that button.
     ---------------------------------------------------------------------- */
  projects: [
    {
      name: 'HealthView',
      type: 'Healthcare · Analytics Dashboard',
      image: 'assets/img/projects/healthcare-dashboard.jpg',
      description: 'A clinical analytics dashboard that makes dense hospital data calm and readable at a glance.',
      features: ['Live charts & KPIs', 'Responsive data tables', 'Accessible colour system'],
      liveUrl: '../healthcare-dashboard/index.html',
      caseUrl: '../healthcare-dashboard/index.html',
      accent: '#3B82F6',
    },
    {
      name: 'SaaSify',
      type: 'SaaS · Product Landing Page',
      image: 'assets/img/projects/saas-landing.jpg',
      description: 'A conversion-focused landing page for a productivity SaaS, built around one clear call to action.',
      features: ['Above-the-fold CTA', 'Social proof section', 'Optimised for speed'],
      liveUrl: '../saas-landing/index.html',
      caseUrl: '../saas-landing/index.html',
      accent: '#8B5CF6',
    },
    {
      name: 'Alex Chen — Portfolio',
      type: 'Personal Brand · Portfolio',
      image: 'assets/img/projects/portfolio-dark.jpg',
      description: 'A dark, confident personal portfolio that puts the work first and reads beautifully on mobile.',
      features: ['Bold editorial layout', 'Interactive project grid', 'Dark-mode native'],
      liveUrl: '../portfolio-dark/index.html',
      caseUrl: '../portfolio-dark/index.html',
      accent: '#A855F7',
    },
    /* --- Add your salon website (or any new demo) like this ---------------
    {
      name: 'Your Salon Name',
      type: 'Beauty & Salon · Business Website',
      image: 'assets/img/projects/salon.jpg',   // drop the screenshot here
      description: 'A short, human sentence about what the site does for the business.',
      features: ['Online booking', 'Gallery', 'Mobile-first'],
      liveUrl: 'https://your-live-demo-url.com',
      caseUrl: '',
      accent: '#C084FC',
    },
    ---------------------------------------------------------------------- */
  ],

  /* ---- How you work ----------------------------------------------------- */
  process: [
    { step: '01', title: 'Understand', body: 'We talk through your business, your customers and what a "win" actually looks like for you.' },
    { step: '02', title: 'Design', body: 'I map the structure and craft a look that fits your brand — you see it before a line of code is written.' },
    { step: '03', title: 'Build', body: 'Clean, fast, accessible code. Responsive from day one and easy to extend later.' },
    { step: '04', title: 'Launch & support', body: 'We go live, I walk you through everything, and I stay reachable when you need changes.' },
  ],

  /* ---- Why work with me (honest, no invented stats) --------------------- */
  reasons: [
    { icon: 'user', title: 'You work with me directly', body: 'No account managers or hand-offs. The person you brief is the person who builds your site.' },
    { icon: 'code', title: 'Real code, not page builders', body: 'Hand-written, standards-based front-end that stays fast and doesn\'t lock you into a platform.' },
    { icon: 'phone', title: 'Mobile-first, always', body: 'Every layout is designed for the phone first, then scaled up — because that\'s where your visitors are.' },
    { icon: 'check', title: 'Accessible & SEO-ready', body: 'Semantic markup, sensible metadata and keyboard-friendly interactions come as standard.' },
  ],

  /* ---- Testimonials -----------------------------------------------------
     These are SAMPLE placeholders so the section looks complete. Each one is
     marked `sample: true`, which shows a small "Sample" tag on the card so
     nothing is presented as a real client quote. Replace them with genuine
     quotes and set `sample: false` (or delete the flag) to remove the tag.
     ---------------------------------------------------------------------- */
  testimonials: [
    { quote: 'Add a real client quote here once you have one — how the project felt to work on and the result it delivered.', name: 'Client name', role: 'Business type', sample: true },
    { quote: 'A second short, specific quote works best: one concrete outcome beats five vague compliments.', name: 'Client name', role: 'Business type', sample: true },
    { quote: 'Keep them honest and human. Two or three strong quotes are more convincing than a wall of them.', name: 'Client name', role: 'Business type', sample: true },
  ],
};
