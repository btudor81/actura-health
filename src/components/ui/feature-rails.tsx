// Adapted from 21st.dev "Feature Grid Spotlight Cards" (mohammadshehadeh/feature-08):
// cards on hairline rails with a survey mark on two corners. The pointer-follow
// spotlight is left out: these cards lead nowhere, so they do not react to hover.
import { Button } from '@/components/ui/button';
import { Html } from '@/components/ui/html';
import { Icon } from '@/lib/icons';
import { cn } from '@/lib/utils';
import type { Homepage, Site } from '@/lib/content';
import { flag, headline } from '@/lib/text';

/** Corner crosshair, drawn half outside the card edge like a survey mark. */
function CrossDecor({ position }: { position: 'top-start' | 'bottom-end' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      className={cn(
        'pointer-events-none absolute z-10 h-4 w-4 text-[#8582a6]',
        position === 'top-start' && 'left-0 top-0 -translate-x-1/2 -translate-y-1/2',
        position === 'bottom-end' && 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
      )}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

// Five challenge tiles (the challenge as the title, how we help below it), then a
// full-width closing band with the CTA (client change list 2026-10-19), solid navy
// since round 2, so its button is the white one. On a wide
// screen the tiles sit three over two on a six column grid, so no cell is empty.
const SPAN = ['lg:col-span-2', 'lg:col-span-2', 'lg:col-span-2', 'lg:col-span-3', 'lg:col-span-3 md:col-span-2'];

export function FeatureRails({ problem, site }: { problem: Homepage['problem']; site: Site }) {
  return (
    <section className="section section--tint overflow-x-clip" aria-labelledby="problem-title">
      <div className="wrap">
        <div className="mb-[clamp(40px,5vw,64px)] grid gap-5 lg:grid-cols-2 lg:items-start lg:gap-16">
          <Html as="h2" id="problem-title" html={headline(problem.headline)} />
          {/* "Sound familiar" sits under the paragraph, in the right column (Filip 2026-10-27). */}
          <div className="flex flex-col gap-6 lg:justify-self-end">
            <Html as="p" className="lead" html={flag(problem.sub)} />
            <Html as="p" className="max-w-[600px] text-base text-ink [text-wrap:balance]" html={flag(problem.lead)} />
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
          {problem.items.map((item, index) => (
            <li key={item.title} className={cn('rail-card reveal', SPAN[index])} style={{ ['--i' as string]: index % 3 }}>
              <span className="rail-x" aria-hidden="true" />
              <CrossDecor position="top-start" />
              <CrossDecor position="bottom-end" />
              <span className="tile">
                <Icon name={item.icon} />
              </span>
              <div className="flex flex-col gap-2.5">
                <h3 className="text-lg">{item.title}</h3>
                <p className="mt-1 text-sm font-medium text-navy">{problem.helpLabel}</p>
                <Html as="p" className="max-w-[60ch] text-sm text-muted-foreground" html={flag(item.text)} />
              </div>
            </li>
          ))}

          <li className="rail-card rail-card--turn reveal gap-6 md:col-span-2 md:flex-row md:items-center lg:col-span-6">
            <span className="rail-x" aria-hidden="true" />
            <CrossDecor position="top-start" />
            <CrossDecor position="bottom-end" />
            <div className="flex items-center gap-5">
              <span className="tick !h-[52px] !w-[52px] !rounded-[10px]">
                <Icon name="arrow-narrow-right" />
              </span>
              <h3 className="text-xl">{problem.transition}</h3>
            </div>
            <Button asChild variant="outline" className="self-start md:ml-auto md:self-auto">
              <a href={site.bookingUrl || '#contact'} data-event="booking_click">
                {site.primaryCta}
              </a>
            </Button>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default FeatureRails;
