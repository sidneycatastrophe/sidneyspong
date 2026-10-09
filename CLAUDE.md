# sidneyspong.com

Static single-page site: `index.html` + `assets/`. No build step.

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
