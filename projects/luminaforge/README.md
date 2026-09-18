# LuminaForge — Portfolio Website

A fast, dependency-free portfolio site for the **LuminaForge** web-development
business. Dark violet luxury aesthetic, a hand-built 3D hero, and a portfolio
gallery that showcases real website demos as screenshots.

No build step, no frameworks, no external JS libraries. Just open `index.html`.

## Quick start

```bash
# from the repo root
python3 -m http.server 8080
# then visit http://localhost:8080/projects/luminaforge/
```

Serving over HTTP (rather than opening the file directly) makes the
"View live demo" links to the neighbouring demo sites resolve correctly.

## File map

```
projects/luminaforge/
├── index.html                 # semantic markup + SEO/OG metadata
├── assets/
│   ├── css/styles.css         # design system + all styles
│   ├── js/
│   │   ├── config.js          # ← EDIT THIS: projects, contact, services…
│   │   ├── main.js            # rendering + interactions
│   │   └── hero3d.js          # canvas 3D hero (no dependencies)
│   └── img/
│       ├── favicon.svg
│       ├── og-cover.jpg       # social share image
│       └── projects/          # portfolio screenshots (*.jpg)
└── README.md
```

## Updating the site — everything lives in `assets/js/config.js`

You almost never need to touch the HTML or CSS.

### Add / change a portfolio project
Copy a block inside `projects: [ … ]` and edit the fields:

```js
{
  name: 'Your Salon Name',
  type: 'Beauty & Salon · Business Website',
  image: 'assets/img/projects/salon.jpg',   // drop the screenshot here
  description: 'One human sentence about what the site does.',
  features: ['Online booking', 'Gallery', 'Mobile-first'],
  liveUrl: 'https://your-live-demo.com',     // '' hides the button
  caseUrl: '',                                // '' hides the button
  accent: '#C084FC',
}
```

### Add a screenshot
1. Take a screenshot of the website (1440×900 works well).
2. Save it into `assets/img/projects/` (e.g. `salon.jpg`).
3. Point the project's `image:` field at it.

**Missing the screenshot?** No problem — the card automatically shows a clean
branded placeholder (the project's initials) until you add the file. Nothing
breaks and the layout stays intact.

### Contact details
In `config.js → contact`:
- `email` — used by the "Email me" buttons.
- `whatsapp` — full international number, digits only (e.g. `'15551234567'`).
  Leave empty to hide the WhatsApp button.
- `socials` — GitHub / LinkedIn / X / Dribbble. Empty values are hidden.

### Testimonials
Sample quotes are marked `sample: true`, which shows a small **Sample** tag so
nothing is passed off as a real client quote. Replace them with genuine quotes
and remove the flag.

## Regenerating the demo screenshots (optional)

The three portfolio images were captured from the sibling demos in
`projects/` (`portfolio-dark`, `healthcare-dashboard`, `saas-landing`). To
refresh them, screenshot each demo at 1440×900 and save over the matching file
in `assets/img/projects/`.

## What's included

- **Sections:** Hero, Services, Portfolio, About, Process, Why work with me,
  Testimonials, Contact.
- **3D hero:** a rotating point-cloud sphere rendered on `<canvas>` with real
  perspective projection and pointer parallax — no Three.js, ~4 KB.
- **Accessibility:** semantic landmarks, skip link, keyboard-visible focus,
  `aria` on the mobile nav, and full `prefers-reduced-motion` support.
- **Performance:** no framework, lazy-loaded images, optimised JPEGs, system
  of subtle CSS animations instead of heavy libraries.
- **SEO:** descriptive title/meta, Open Graph + Twitter cards, JSON-LD
  structured data, canonical link, favicon.
- **States:** loading spinner + inline validation on the contact form, a
  graceful placeholder for missing screenshots, and empty-state copy for
  projects/testimonials.

## Notes

- The contact form validates client-side and then opens the visitor's email
  app with a pre-filled message to your inbox. To collect submissions on a
  server instead, wire the `#contactForm` submit handler in `main.js` to your
  form endpoint (Formspree, Netlify Forms, your own API, etc.).
- Fonts (Fraunces, Inter, Space Mono) load from Google Fonts.
