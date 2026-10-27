// Adapted from 21st.dev "Footer With Newsletter" (balick/footer-01): brand block,
// link columns, a base line and an oversized wordmark at the foot.
// The newsletter form and the status indicator are left out: the site has neither.
// Color (Filip 2026-10-12): the footer is a blue field in the same family as the
// hero, so the page opens and closes on color. Never navy. No arcs / circles here
// (rejected the same day): the foot is only the oversized wordmark fading out.
// No LinkedIn link here (Filip 2026-10-19), even once the URL exists.
import type { ReactNode } from 'react';

import { Icon } from '@/lib/icons';
import type { Site } from '@/lib/content';

interface Footer01Props {
  site: Site;
  year: number;
  /** Copy-email button. Passed in from Base.astro so it can hydrate on its own. */
  copy?: ReactNode;
}

export function Footer01({ site, year, copy }: Footer01Props) {
  const linkClass =
    'inline-flex min-h-11 items-center gap-2.5 text-foreground transition-colors hover:text-ink hover:underline hover:underline-offset-4';

  return (
    <footer className="footer-color relative isolate overflow-hidden">
      <div className="wrap pt-16 sm:pt-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div className="flex max-w-sm flex-col gap-5">
            <a href="/" aria-label={`${site.name}, home`} className="flex items-center gap-3">
              <img src="/img/logo-mark.png" alt="" width={183} height={192} loading="lazy" className="h-12 w-auto" />
              <span className="text-base font-semibold uppercase tracking-[0.01em] text-navy">{site.name}</span>
            </a>
            <p className="max-w-[30ch] text-lg font-medium leading-snug tracking-[-0.02em] text-ink">{site.tagline}</p>
            <p className="max-w-[30ch] text-foreground">{site.positioning}</p>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:justify-items-end">
            <nav aria-label="Footer">
              <h3 className="text-base font-medium tracking-normal">{site.footerNavTitle}</h3>
              <ul className="mt-3 flex flex-col">
                {site.nav.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className={linkClass}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <h3 className="text-base font-medium tracking-normal">{site.footerContactTitle}</h3>
              <ul className="mt-3 flex flex-col">
                <li className="flex flex-wrap items-center gap-x-3">
                  <a href={`mailto:${site.contactEmail}`} className={`${linkClass} [overflow-wrap:anywhere]`}>
                    <Icon name="mail" size={22} />
                    {site.contactEmail}
                  </a>
                  {copy}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-x-8 gap-y-2 border-t border-[rgba(20,52,110,0.18)] py-7 text-sm text-foreground sm:flex-row sm:items-center">
          <span>
            © {year} {site.name}
          </span>
          <span>{site.disclaimer}</span>
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
        <p className="-mb-[0.2em] whitespace-nowrap bg-gradient-to-b from-[rgba(15,0,104,0.16)] to-transparent bg-clip-text text-center text-[clamp(3.25rem,13.4vw,13rem)] font-semibold leading-none tracking-[-0.04em] text-transparent">
          {site.name}
        </p>
      </div>
    </footer>
  );
}

export default Footer01;
