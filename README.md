# Actura Health website, 21st.dev variant

A copy of `../website/` (the approved-look build, port 4321) with the homepage rebuilt from 21st.dev components, for side-by-side comparison. Same copy, same content files, same photos. Nothing here is deployed and the folder has no git history of its own.

Marketing site for Actura Health (independent correctional healthcare consulting). Astro static build with React components and Tailwind 3.4.

**Status: main build** (Filip 2026-10-19). Homepage only. `../website/` is an old backup, not maintained. Hero trial: the homepage shows two heroes stacked, "Hero option A" (with the closed-loop card) and "Hero option B" (copy only), for the client to compare. Once one is picked, delete the other `Hero02` in `Home.astro` and both `label` props. Sections live in `src/components/Home.astro`.

## Preview link for the client

https://actura-health-preview.vercel.app (Vercel project `actura-health-preview`, team `hromisfilip`). Unlisted and `noindex`. It is a static upload of `dist/`, so it only changes when someone redeploys:

```sh
npm run build
cd dist && vercel --prod --yes --scope hromisfilip --name actura-health-preview
```

Run both every time: the build empties `dist/`, including the Vercel link inside it, and `--name` reconnects it to the same project.

The contact form does not submit on this link (Vercel answers 405). It is built for Netlify Forms and works once the site is on Netlify. Everything else works, including the capability statement download.

## Commands

```sh
npm install
npm run dev        # http://localhost:4322 (the original keeps 4321)
npm run build      # static output in dist/
npm run preview    # serve dist/
```

Node 22.12 or newer.

## Where things live

| Path | What |
|---|---|
| `src/content/seed/homepage.json` | All homepage copy. Edit text here. |
| `src/content/seed/site.json` | Site settings: nav, contact email, booking URL, capability statement URL, LinkedIn URL |
| `src/lib/content.ts` | Content source. Reads the seed files now, Sanity in Stage 2 (seed stays as fallback) |
| `src/lib/text.ts` | `[CONFIRM: ...]` chip rendering and headline line breaks |
| `src/styles/tokens.css` | Colors, type scale, spacing, radii. Contrast ratio noted beside every text color |
| `src/styles/global.css` | Tailwind entry, base styles, shared classes (`.wrap`, `.panel`, `.inset`, `.mock`, `.tile`, `.tick`, `.eyebrow`), reveal on scroll |
| `tailwind.config.mjs` | Tailwind theme mapped to the tokens. Font scale is remapped: `text-xs` and `text-sm` are 16px, `text-base` is 20px |
| `src/layouts/Base.astro` | Head tags, SEO, JSON-LD, header, footer |
| `src/components/ui/` | Every component: shadcn primitives and the adapted 21st.dev blocks (table below) |
| `src/lib/icons.tsx` | Tabler icon map. A new icon name in the content must be added here |
| `public/files/` | Capability statement PDF |
| `public/img/service-[slug].*` | One photo per service card (880x1100, webp + jpg) |
| `PRODUCT.md` | Audience, purpose, brand personality, design principles |

## 21st.dev components

Pulled through the 21st.dev MCP server (`mcp__21st__search`, `mcp__21st__get_component`), then adapted: brand tokens, 20px body, Tabler icons in place of lucide and remix, no hover effects on blocks that lead nowhere, entrance motion that does not hide content when JavaScript is off.

| Section | File | 21st.dev source |
|---|---|---|
| Header | `../Nav.astro` | Not 21st.dev: the original floating glass navbar from `../website/`, kept as is (Filip 2026-10-12) |
| Hero | `hero-02.tsx`, `dashboard-demo.tsx` | Hero with Dashboard Mockup, `felipemenezes098/hero-02` |
| Problem | `feature-rails.tsx` | Feature Grid Spotlight Cards, `mohammadshehadeh/feature-08` |
| Services | `filter-grid.tsx`, `services-section.tsx` | Filter Grid, `ddoemonn/filter-grid` |
| Benefits | `feature-bento.tsx` | Feature Section with Bento Grid, `tommyjepsen/feature-section-with-bento-grid` |
| About | `split-content.tsx` | Split Content Section, `felipemenezes098/content-06` |
| Contact | `contact-form.tsx` | Contact Form, `kevingirelli/contact-form` |
| Footer | `footer-01.tsx` | Footer With Newsletter, `balick/footer-01` (newsletter and status dot removed) |
| Trust bar, Team | `trust-bar.tsx`, `team-list.tsx` | shadcn primitives only (Badge). Team keeps the ruled list |

shadcn primitives in use: Button, Badge, Input, Textarea, Label, Separator, Tabs.

Rendering: every section is rendered to static HTML at build time. Four parts hydrate: the hero dashboard (tabs), the services filter, the contact block (copy button) and the copy button in the footer. With JavaScript off the page still shows all content; the tabs show the independent review and the filter shows all nine services.

Hero dashboard tabs: both views stay mounted in one grid cell, so the card keeps the height of the taller view and nothing moves when the tab changes. Do not go back to mounting only the active view.

Tailwind is 3.4 on purpose. Version 4 needs Chrome 111 or newer and the audience runs older county browsers.

What differs from `../website/`:

- Hero: a blue field with the arcs, left-aligned copy, the three promises beside it, then the monitoring summary floating at the foot and melting into the white section below. The original is centered copy over nested circles on a pale tint.
- Problem: six cells on hairline rails, the sixth carries the transition line and a button. The monitoring summary moved from here to the hero.
- Services: a 3 column grid of photo cards with a filter by service group, in place of the full-bleed slider. Photo on top, copy on white below, so no scrim.
- Benefits: same card as the original, four equal cells two by two.
- Eyebrow: outline chip, no fill.
- Team: same ruled list, credentials as chips, heading pinned on the left.
- About: photo on the left.
- The font preload tag is removed (it stalls headless screenshots; `font-display: swap` covers it).

## Settled design decisions

Settled on this variant with Filip, 2026-10-12. Do not reopen without him:

- Hero is the color hero: the whole section is a blue field in the tint family with the arcs, and the color runs behind the navbar. The section after it (trust bar) is white. Rejected: white hero with the dashboard in a pale panel and the color moved to the second section.
- Hero is one screen tall (100dvh) from 1024px up, with a 760px floor. The dashboard shows up to 334px and gives way first on a short window; spare height on a tall window goes around the copy. Below 1024px the copy alone nearly fills a screen, so the hero grows and shows a 340px slice of the card.
- The hero asset runs past the end of the section, so no padding sits between the dashboard and the next section. The gradient is inside the card and white (`.asset-fade` in `global.css`): it covers the foot of the card, so the card melts into the white section below. Rejected: a hard cut, and fading the whole card out to the blue.
- Navbar is the original floating glass bar. Rejected: the 21st.dev header.
- Benefit cards are four equal cells in the card style of `../website/`: pale stage with faint vertical hairlines holding the illustration, copy on white below. Rejected: wide and narrow mix, fully tinted cells.
- Footer is a blue field in the hero's color family, with the oversized wordmark fading out at the foot and a copy button beside the email. Rejected: arcs / circles in the footer.
- Dashboard tabs do not move the layout when switched.
- Eyebrow is an outline chip with no fill. This one is a trial, not final.

The list below was settled on `../website/`. This variant follows it wherever the same element exists (eyebrow chip, white secondary controls, panel plus inset, no texture on the hero, no all caps except the logo wordmark, no helper micro-text).

Nothing is under review on the page. Decided with Filip on 2026-10-12, do not reopen without him:

- Hero background: nested circles. Rejected: grain texture, plain gradient, animated fields, vertical rails, dot grid.
- Team: ruled list. Rejected: both slider layouts.
- Benefit illustrations: a few very faint vertical hairlines behind them. Rejected: photo behind, rings and guides, app window, dot grid, an empty stage.
- Service cards: scrim is a color gradient, near black with a trace of blue. Rejected: blur layer, ink-blue scrim.
- Eyebrow: squared chip in the brand blue, label with a subtle bottom-to-top gradient. Rejected: white pill, tracked caps with a gold rule.
- Secondary controls: white with a hairline edge. Rejected: grey fill, see-through ink wash.
- Block inside a block (commitments, contact form): plain `.panel` outside, `.inset` glass inside, the same in both places.

## Content rules

- Headlines: a `\n` in the JSON marks the desktop line break. Keep both rows near the same length.
- A fact the client has not confirmed is written as `[CONFIRM: what is missing]`. It renders as a red dashed chip. Never replace it with a guess.
- No em-dashes or en-dashes anywhere. Check with `grep -rc "—\|–" dist/index.html` (run it on its own, it exits 1 when the count is 0).
- Team is shown by role and credentials only. No names, no photos.

## Pending from the client

Set in `src/content/seed/site.json`:

- `bookingUrl`: Google appointment schedule link. Empty = "Book a conversation" scrolls to the contact form.
- `linkedinUrl`: empty = LinkedIn link in the contact block is hidden. The footer never shows LinkedIn (Filip 2026-10-19).

Set already: `capabilityStatementUrl` = `/files/actura-health-capability-statement.pdf` (v6, supplied 2026-10-12). To replace it, overwrite that file. `/capability-statement` redirects to it on Netlify. Empty value = the button shows a "Pending" chip and is not clickable.

Logo: `public/img/logo-mark*.png` are cropped from the lockup on the current live site. Replace with the official files when supplied.

## Search visibility

The site is `noindex` until launch, in two places:

1. `src/layouts/Base.astro` adds the robots meta tag unless `PUBLIC_INDEXABLE=true`.
2. `netlify.toml` sends an `X-Robots-Tag` header on every response.

At launch: set `PUBLIC_INDEXABLE=true` in Netlify and remove the `X-Robots-Tag` line.

## Contact form

Plain HTML form handled by Netlify Forms (`data-netlify="true"`, honeypot field `bot-field`). Works with JavaScript off. Submissions redirect to `/contact/thanks/`. The notification email to connect@acturahealth.com is configured in the Netlify dashboard. The automatic confirmation to the sender is Stage 2.

## Browser support and accessibility

Build target: Chrome and Edge 90, Firefox 91, Safari 14. Every page shows all content with JavaScript off. WCAG 2.1 AA is the target; axe has not been run on this variant yet. Body text is 20px for an older audience.

## Look and visuals

Light, airy style: white page, pale blue tint panels (`--tint`, `--tint-2`, `--tint-3`), navy reserved for buttons, key marks and the Actura node in the diagram. Brand gold stays in the logo only (2.3:1 on white, so it cannot carry text or controls).

- Buttons are lit from above: inner highlight on the top edge, inner shade on the bottom edge, short tinted drop shadow. `.btn--primary` is a soft navy gradient, `.btn--ghost` is the flat grey secondary.
- `.panel` is the pale rounded container, `.panel--rings` adds the soft concentric texture (scorecard panel only), `.mock` is the white card that reads as a piece of interface or a document.
- Custom visuals: `arcs.tsx` (hero media panel), `dashboard-demo.tsx` (sample monitoring summary), `benefit-visual.tsx` (four coded illustrations), the commitments card.
- About photo: `public/img/photo-about.*`, Unsplash `photo-1758691462814-485c3672e447` (free license), desaturated and cooled with PIL.
- Service card photos: `public/img/service-[slug].*`, Pexels (free license), cropped 4:5 and lightly cooled with PIL. One photo per service, never reused. Pexels IDs: quality-assurance 7578799, continuous-quality-improvement 5452193, contract-performance-monitoring 5327916, behavioral-health 14797769, ncchc-accreditation 6129111, rfp-procurement 8470836, medicaid-1115-calaim 7579831, ehr-advisory 8376152, interim-leadership 6129507. Source URL: `https://images.pexels.com/photos/<id>/pexels-photo-<id>.jpeg`.

## Header

`src/components/Nav.astro`, the same floating glass bar as `../website/` (white glass, fixed 14px from the top with JavaScript, absolute without). The first section on a page must leave room for it: `Hero02` does it with `underHeader`.

## Icons

Tabler outline icons through `@tabler/icons-react`, mapped by name in `src/lib/icons.tsx`. Use Tabler names (`<Icon name="scale" />`), stroke 1.5. `Nav.astro` uses `Icon.astro`, which reads the same set from `@tabler/icons` at build time.
