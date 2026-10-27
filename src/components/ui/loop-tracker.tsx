// The card that floats at the foot of the hero, in the mock-UI style of the old
// monitoring summary. Client change list 2026-10-19: the vendor report vs.
// independent review comparison is gone, and nothing on the site may compare the
// vendor's numbers with the records. This shows the neutral closed loop instead:
// Standard, Finding, Corrective action (owner and date), Re-review, Verified, then
// a few sample items at different points of that loop.
// Client round 2 (2026-10-22): the loop reads as Plan-Do-Study-Act. A line under the
// title names the cycle and each step carries its phase tag (PdsaTag). The first
// Evidence card (benefit-visual.tsx, "read") signals it the same way.
// Static: no state, rendered to HTML at build time, never hydrates.
import { Icon } from '@/lib/icons';
import { cn } from '@/lib/utils';
import type { Homepage } from '@/lib/content';

type Loop = Homepage['hero']['loop'];

/** PDSA phase of a loop step. Shared with the Evidence card so both read the same. */
export function PdsaTag({ phase, className }: { phase: string; className?: string }) {
  return <span className={cn('pdsa', className)}>{phase}</span>;
}

export function LoopTracker({ loop }: { loop: Loop }) {
  const last = loop.steps.length - 1;

  return (
    <div className="mock w-full p-5 text-sm leading-snug shadow-float sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div>
          <p className="text-lg font-medium tracking-[-0.03em] text-ink">{loop.title}</p>
          <p className="mt-0.5 text-muted-foreground">{loop.cycle}</p>
        </div>
        <span className="rounded-lg border border-border px-3 py-1 text-muted-foreground">{loop.tag}</span>
      </div>

      <ol className="mt-5 grid gap-3 rounded-xl border border-border bg-tint p-4 md:grid-cols-5 md:gap-4 md:p-5">
        {loop.steps.map((step, index) => (
          <li
            key={step.label}
            className="relative grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3.5 md:grid-cols-1 md:content-start md:items-start md:gap-y-3"
          >
            {/* Connector to the next step: down the left on a phone, across on wider screens. */}
            {index < last ? (
              <span
                aria-hidden="true"
                className="absolute -bottom-3 left-[21.5px] top-11 w-px bg-[#8582a6] opacity-50 md:-right-4 md:bottom-auto md:left-14 md:top-[21.5px] md:h-px md:w-auto"
              />
            ) : null}
            <span className="tile relative !h-11 !w-11">
              <Icon name={step.icon} size={24} />
            </span>
            <p>
              <strong className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base font-medium leading-tight tracking-[-0.03em] text-ink">
                {step.label}
                <PdsaTag phase={step.phase} />
              </strong>
              <span className="block text-muted-foreground">{step.note}</span>
            </p>
          </li>
        ))}
      </ol>

      <ul className="mt-3 flex flex-col rounded-xl border border-border bg-white px-5 py-0.5">
        {loop.rows.map((row) => {
          const done = row.stage === last;
          return (
            <li
              key={row.item}
              className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border py-3 text-ink first:border-t-0"
            >
              {row.item}
              <span className="flex items-center gap-4">
                <span aria-hidden="true" className="flex gap-1">
                  {loop.steps.map((step, index) => (
                    <i key={step.label} className={cn('h-2 w-6 rounded-full', index <= row.stage ? 'bg-gold' : 'bg-tint-3')} />
                  ))}
                </span>
                <span className="inline-flex w-[9.5em] items-center gap-1.5 whitespace-nowrap font-medium">
                  {done ? <Icon name="check" size={18} stroke={2} /> : null}
                  {loop.steps[row.stage].label}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default LoopTracker;
