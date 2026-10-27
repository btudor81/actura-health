// Grid from 21st.dev "Feature Section with Bento Grid" (tommyjepsen), four cells of
// the same size, two by two (Filip 2026-10-12: no wide / narrow mix).
// The card itself is the one from ../website (Filip 2026-10-12: "same style assets
// card as on the original redesign"): a pale stage with faint vertical hairlines
// holding a small coded illustration, then the benefit in words on white.
// Styles: .benefit-card, .benefit-stage, .benefit-copy in global.css.
// Below it, the commitments block, its disclaimer as a light note at the end.
import { BenefitVisual } from '@/components/ui/benefit-visual';
import { Html } from '@/components/ui/html';
import { Icon } from '@/lib/icons';
import type { Homepage } from '@/lib/content';
import { flag, headline } from '@/lib/text';

export function FeatureBento({ benefits }: { benefits: Homepage['benefits'] }) {
  const { commitments } = benefits;

  return (
    <section className="section section--tint" aria-labelledby="benefits-title">
      <div className="wrap">
        <div className="section__head section__head--center">
          <Html as="h2" id="benefits-title" html={headline(benefits.headline)} />
          <Html as="p" className="lead" html={flag(benefits.sub)} />
        </div>

        <ul className="grid grid-cols-1 gap-5 md:auto-rows-fr md:grid-cols-2">
          {benefits.items.map((item, index) => (
            <li key={item.title} className="benefit-card reveal" style={{ ['--i' as string]: index % 2 }}>
              <div className="benefit-stage">
                <BenefitVisual kind={item.visual} />
              </div>
              <div className="benefit-copy">
                <h3 className="text-lg">{item.title}</h3>
                <Html as="p" className="max-w-[44ch] text-muted-foreground" html={flag(item.text)} />
              </div>
            </li>
          ))}
        </ul>

        {/* Block inside a block: plain .panel outside, .inset glass inside (same as Contact). */}
        <div className="panel mt-5 grid items-center gap-x-[clamp(32px,5vw,72px)] gap-y-8 p-[clamp(28px,4vw,56px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <h3 id="commit-title" className="text-2xl">
            {commitments.title}
          </h3>

          <ul className="inset reveal px-[clamp(20px,2.4vw,32px)] py-2" aria-labelledby="commit-title">
            {commitments.items.map((item) => (
              <li
                key={item.title}
                className="grid grid-cols-1 items-start gap-x-5 gap-y-4 border-t border-border py-6 first:border-t-0 md:grid-cols-[auto_1fr_auto]"
              >
                <span className="tile">
                  <Icon name={item.icon} />
                </span>
                <div>
                  <h4>{item.title}</h4>
                  <Html as="p" className="mt-1.5 text-muted-foreground" html={flag(item.text)} />
                </div>
                <span className="tick mt-1 max-md:hidden">
                  <Icon name="check" size={16} stroke={2.5} />
                </span>
              </li>
            ))}
          </ul>

          {/* Disclaimer closes the block, smaller and lighter (client change list 2026-10-19). */}
          <Html
            as="p"
            className="max-w-[80ch] text-sm text-muted-foreground [text-wrap:balance] lg:col-span-2"
            html={flag(commitments.note)}
          />
        </div>
      </div>
    </section>
  );
}

export default FeatureBento;
