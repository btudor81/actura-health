// Ten services in the order of the v6 capability statement (client change list
// 2026-10-19). The filter tabs and their counts are gone, and so are the photos:
// the generic hospital stock was rejected and the icon system carries the cards
// until licensed correctional photos are approved. Static, never hydrates.
// Stage 2: each card becomes a link to /services/[slug].
import { Html } from '@/components/ui/html';
import { Icon } from '@/lib/icons';
import type { Homepage } from '@/lib/content';
import { flag, headline } from '@/lib/text';

export function ServicesSection({ services }: { services: Homepage['services'] }) {
  return (
    <section id="services" className="section" aria-labelledby="services-title">
      <div className="wrap">
        <div className="mb-[clamp(32px,4vw,48px)] flex flex-col items-start gap-5">
          <p className="eyebrow">
            <span>{services.eyebrow}</span>
          </p>
          <Html as="h2" id="services-title" html={headline(services.headline)} />
          {/* No capability statement button here (client round 2): hero and contact only. */}
          <Html as="p" className="lead" html={flag(services.sub)} />
        </div>

        {/* Phone: one row that swipes sideways, the next card peeking in (Filip 2026-10-27).
            Full bleed to the screen edge, cards snap to the gutter. */}
        <ul className="slider grid grid-cols-1 gap-5 md:grid-cols-2 max-md:-mx-[var(--gutter)] max-md:flex max-md:snap-x max-md:snap-mandatory max-md:gap-3 max-md:overflow-x-auto max-md:overscroll-x-contain max-md:px-[var(--gutter)] max-md:scroll-px-[var(--gutter)]">
          {services.items.map((item, index) => (
            <li
              key={item.slug}
              className="reveal grid content-start gap-5 rounded-2xl border border-border bg-card px-6 py-7 max-md:shrink-0 max-md:basis-[85%] max-md:snap-start md:grid-cols-[auto_minmax(0,1fr)] md:gap-y-0 md:px-7"
              style={{ ['--i' as string]: index % 2 }}
            >
              <span className="tile">
                <Icon name={item.icon} />
              </span>
              <div className="flex flex-col gap-2.5 pt-0.5">
                <h3 className="text-lg">{item.title}</h3>
                <Html as="p" className="text-muted-foreground" html={flag(item.text)} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ServicesSection;
