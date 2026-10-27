// Adapted from 21st.dev "Hero with Dashboard Mockup" (felipemenezes098/hero-02):
// left-aligned copy, then a dashboard floating on a wash. The entrance uses the
// site's JS-gated .reveal instead of motion, so the hero renders in full with
// JavaScript off.
//
// Settled with Filip 2026-10-12, do not reopen without him:
// - Color hero: the whole section is a blue field in the tint family with the arcs.
//   The section after it (trust bar) is white. Rejected: white hero with the
//   dashboard in a pale panel and the color moved to the second section.
// - The hero is one screen tall (100dvh) from 1024px up: copy on top, the dashboard
//   takes whatever height is left and runs past the end of the section, so there is
//   no dead padding between it and the next section. Below 1024px the copy alone
//   nearly fills a screen, so the hero grows and shows a fixed slice of the card.
// - Inside the card a white gradient covers its foot (.asset-fade), so the card
//   melts into the white section below. Rejected: a hard cut, and fading the card
//   itself out to the blue.
// Layout rules for all of this are in global.css (.hero, .hero__inner, .asset-fade).
import type { ReactNode } from 'react';

import { Arcs } from '@/components/ui/arcs';
import { Button } from '@/components/ui/button';
import { CapabilityLink } from '@/components/ui/capability-link';
import { Html } from '@/components/ui/html';
import { Icon } from '@/lib/icons';
import type { Homepage, Site } from '@/lib/content';
import { flag, headline } from '@/lib/text';

interface Hero02Props {
  hero: Homepage['hero'];
  site: Site;
  id?: string;
  /** The card that floats at the foot of the hero (LoopTracker). */
  children?: ReactNode;
}

export function Hero02({ hero, site, id = 'hero', children }: Hero02Props) {
  const ctaHref = site.bookingUrl || '#contact';

  return (
    // Top padding leaves room for the floating navbar, which sits on the hero color.
    <section
      className="hero hero-color relative isolate w-full overflow-hidden pt-[calc(var(--nav-h)+14px)]"
      aria-labelledby={`${id}-title`}
    >
      <Arcs className="absolute inset-x-0 bottom-0 -z-10 h-[52%]" fills={['#c3dafa', '#b3cff7', '#a3c4f4']} />

      <div className="hero__inner wrap gap-10 pt-10 lg:gap-12 lg:pt-12">
        <div className="hero__copy grid grid-cols-1 items-end gap-x-12 gap-y-10 min-[1400px]:grid-cols-[minmax(0,1fr)_auto]">
          <div className="reveal flex min-w-0 flex-col items-start">
            <p className="eyebrow">
              <span>{hero.eyebrow}</span>
            </p>
            <Html as="h1" id={`${id}-title`} className="mt-6" html={headline(hero.headline)} />
            {/* Tagline sits directly under the headline (client change list 2026-10-19). */}
            <p className="mt-5 text-lg font-medium tracking-[-0.02em] text-navy">{hero.tagline}</p>
            <Html as="p" className="mt-5 max-w-[60ch] text-foreground" html={flag(hero.sub)} />
            <div className="mt-9 flex w-full flex-wrap gap-3 max-sm:[&>*]:w-full">
              <Button asChild>
                <a href={ctaHref} data-event="booking_click">
                  {site.primaryCta}
                </a>
              </Button>
              <CapabilityLink site={site} className="max-sm:whitespace-normal" />
            </div>
          </div>

          <ul className="reveal flex flex-wrap gap-x-9 gap-y-3 min-[1400px]:max-w-[19rem] min-[1400px]:flex-col min-[1400px]:gap-y-4" style={{ ['--i' as string]: 1 }}>
            {hero.chips.map((chip) => (
              <li key={chip.text} className="flex items-center gap-3 leading-snug text-ink">
                <span className="tile !h-10 !w-10">
                  <Icon name={chip.icon} size={22} />
                </span>
                {chip.text}
              </li>
            ))}
          </ul>
        </div>

        {children ? (
          <div className="asset-fade reveal" style={{ ['--i' as string]: 2 }}>
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default Hero02;
