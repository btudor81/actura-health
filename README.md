# Actura Health website

Marketing site for Actura Health (independent correctional healthcare consulting). Astro static build, plain CSS, hosted on Netlify.

**Status: Stage 1.** Homepage only, awaiting approval. Other pages, Sanity CMS and integrations come in Stage 2.

## Commands

```sh
npm install
npm run dev        # http://localhost:4321
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
| `src/styles/global.css` | Base styles, buttons, focus ring, reveal on scroll |
| `src/layouts/Base.astro` | Head tags, SEO, JSON-LD, nav, footer |
| `src/components/` | One file per homepage section, plus `Icon`, `Scorecard`, `CapabilityLink` |
| `PRODUCT.md` | Audience, purpose, brand personality, design principles |

## Content rules

- Headlines: a `\n` in the JSON marks the desktop line break. Keep both rows near the same length.
- A fact the client has not confirmed is written as `[CONFIRM: what is missing]`. It renders as a red dashed chip. Never replace it with a guess.
- No em-dashes or en-dashes anywhere. Check with `grep -rc "—\|–" dist/index.html` (run it on its own, it exits 1 when the count is 0).
- Team is shown by role and credentials only. No names, no photos.

## Pending from the client

Set in `src/content/seed/site.json`:

- `bookingUrl`: Google appointment schedule link. Empty = "Book a conversation" scrolls to the contact form.
- `capabilityStatementUrl`: PDF. Empty = the download button shows a "Pending" chip and is not clickable.
- `linkedinUrl`: empty = LinkedIn links are hidden.

Logo: `public/img/logo-mark*.png` are cropped from the lockup on the current live site. Replace with the official files when supplied.

## Search visibility

The site is `noindex` until launch, in two places:

1. `src/layouts/Base.astro` adds the robots meta tag unless `PUBLIC_INDEXABLE=true`.
2. `netlify.toml` sends an `X-Robots-Tag` header on every response.

At launch: set `PUBLIC_INDEXABLE=true` in Netlify and remove the `X-Robots-Tag` line.

## Contact form

Plain HTML form handled by Netlify Forms (`data-netlify="true"`, honeypot field `bot-field`). Works with JavaScript off. Submissions redirect to `/contact/thanks/`. The notification email to connect@acturahealth.com is configured in the Netlify dashboard. The automatic confirmation to the sender is Stage 2.

## Browser support and accessibility

Build target: Chrome and Edge 90, Firefox 91, Safari 14. Every page renders fully with JavaScript off. WCAG 2.1 AA: axe reports zero violations on the homepage at desktop and mobile widths. Body text is 20px for an older audience.

## Look and visuals

Light, airy style: white page, pale blue tint panels (`--tint`, `--tint-2`, `--tint-3`), navy reserved for buttons, key marks and the Actura node in the diagram. Brand gold stays in the logo only (2.3:1 on white, so it cannot carry text or controls).

- Buttons are lit from above: inner highlight on the top edge, inner shade on the bottom edge, short tinted drop shadow. `.btn--primary` is the navy gradient, `.btn--ghost` the pale secondary.
- `.panel` is the pale rounded container, `.panel--rings` adds the soft concentric texture, `.mock` is the white card that reads as a piece of interface or a document.
- Custom visuals: `Arcs.astro` (hero and footer), `Scorecard.astro` (sample monitoring summary), the readiness checklist in the Accreditation panel, the commitments card, the three-party diagram in `About.astro`.
- One photo: `public/img/photo-about.*`, Unsplash `photo-1758691462814-485c3672e447` (free license), desaturated and cooled with PIL.

## Nav

The bar takes a color close to the ground under it. Every section is light today, so it is white glass. Each top-level section sets `data-nav="light"` (or `"dark"`, which switches the bar to navy glass); a new section must set it too. Without JavaScript the bar sits at the top of the page and does not follow the scroll.

## Icons

Tabler outline icons, read from `node_modules/@tabler/icons` at build time by `src/components/Icon.astro`. Use Tabler names (`<Icon name="scale" />`), stroke 1.5.
