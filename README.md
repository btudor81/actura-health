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

## Icons

Tabler outline icons, read from `node_modules/@tabler/icons` at build time by `src/components/Icon.astro`. Use Tabler names (`<Icon name="scale" />`), stroke 1.5.
