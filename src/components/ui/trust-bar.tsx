// White on purpose: the hero above carries the color (settled 2026-10-12, see hero-02.tsx).
import { Html } from '@/components/ui/html';
import { Icon } from '@/lib/icons';
import type { Homepage } from '@/lib/content';
import { cn } from '@/lib/utils';
import { rows } from '@/lib/text';

// Phone: every label in two rows. "Former CCHCS Deputy" needs 164px at 16px, more than
// half of a 360px screen, so the right column is wider, that item moves into it (CSS
// order, after "Hospital C-suite") and labels drop to 16px. Indexes follow homepage.json.
const PHONE_ORDER: Record<number, string> = { 2: 'max-md:order-1', 4: 'max-md:order-2' };

export function TrustBar({ trust }: { trust: Homepage['trust'] }) {
  return (
    <section className="border-b border-border py-12" aria-labelledby="trust-label">
      <div className="wrap">
        <p id="trust-label" className="mb-8 text-center text-sm text-muted-foreground">
          {trust.label}
        </p>
        <ul className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-y-9 md:grid-cols-3 xl:grid-cols-[repeat(5,minmax(max-content,1fr))] xl:divide-x xl:divide-border">
          {trust.items.map((item, index) => (
            <li
              key={item.text}
              className={cn(
                'flex flex-col items-center gap-3.5 px-3 text-center leading-[1.3] text-ink max-md:px-1 max-md:text-sm max-xl:last:col-span-2',
                PHONE_ORDER[index],
              )}
            >
              <Icon name={item.icon} size={30} className="text-gold" />
              <Html html={rows(item.text)} className="max-md:whitespace-nowrap xl:whitespace-nowrap" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default TrustBar;
