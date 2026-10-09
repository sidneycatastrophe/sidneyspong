# sidneyspong.com

Static single-page site, no build step:
- `index.html`: all content
- `assets/css/site.css`: styles (mobile-first, design tokens on `:root`)
- `assets/js/site.js`: menu, scroll reveals, crayon scribble drawing, contact form
- `assets/images/photos/`: web-sized `.webp` photos (make new ones ~720/1280px wide, quality ~74)
- `assets/fonts/`: self-hosted Geist + Caveat Brush (no Google Fonts requests)

Design: off-white paper, near-black ink, ONE accent (crayon cobalt `#2747d0`). Hand-drawn
"crayon" scribbles are inline SVGs using the shared `#crayon-boil` filter; strokes with
`pathLength="1"` are drawn on by site.js when scrolled into view.

Contact form: set `WEB3FORMS_ACCESS_KEY` at the top of `assets/js/site.js` to deliver messages
by email. While empty, submitting opens the visitor's email app with the message pre-filled.

Reviews: copy a `<figure class="review">` block in the `#reviews` section; the first stays featured.

Video: `#watch` shows a poster image and only loads YouTube (nocookie) when pressed; the video ID
lives in `data-video`. Lessons: each `[data-lesson]` row has an inline photo (mobile) and a matching
`.lesson-stage img[data-for]` (desktop sticky crossfade); keep them in sync.

Hosting/email: domain is on Cloudflare; info@sidneyspong.uk is meant to forward to the owner's
Gmail via Cloudflare Email Routing.

## Design skills (`.claude/skills/`, pinned in `skills-lock.json`)
- `redesign-existing-projects`, `design-taste-frontend`, `high-end-visual-design` (Leonxlnx/taste-skill)
- `web-design-guidelines` (vercel-labs/agent-skills): audit against Vercel's Web Interface Guidelines
- `playwright-cli` (microsoft/playwright-cli): drive a browser to screenshot/check the site

Restore or update with `npx skills experimental_install` / `npx skills update`.

## Previewing with playwright-cli
`file://` URLs are blocked, so serve the site first: `python3 -m http.server 8765`, then
`playwright-cli open http://localhost:8765/`. Install the CLI with `npm i -g @playwright/cli`.
In Claude cloud containers there's no Google Chrome; pass `--config` pointing at a JSON file with
`{"browser":{"browserName":"chromium","launchOptions":{"executablePath":"/opt/pw-browsers/chromium"}}}`.

## Design references
VoltAgent/awesome-design-md (https://github.com/VoltAgent/awesome-design-md) has DESIGN.md
breakdowns of ~70 brands (Vercel, Linear, Stripe, Apple, Spotify…). Fetch one as a reference when
picking a direction; don't vendor the whole catalog.
