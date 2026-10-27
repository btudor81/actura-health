// Adapted from 21st.dev "Filter Grid" (ddoemonn/filter-grid): segmented radio chips
// with live counts above a grid whose cells reflow as the selection changes.
// Changes: the grid takes its columns from a class (responsive) and grows with its
// content instead of scrolling inside a fixed box; chips use the site controls.
import { useCallback, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';

const CELL = { type: 'spring', stiffness: 520, damping: 34, mass: 0.45 } as const;
const MOVE = { type: 'spring', stiffness: 260, damping: 34, mass: 0.8 } as const;
const EASE = [0.23, 1, 0.32, 1] as const;
const LEAVE = { duration: 0.14, ease: [0.4, 0, 1, 1] } as const;
const INSTANT = { duration: 0 } as const;

export type FilterDefinition<T> = {
  id: string;
  label: string;
  match: (item: T) => boolean;
};

export type FilterGridProps<T> = {
  items: readonly T[];
  filters: readonly FilterDefinition<T>[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  /** Names the chip group for assistive tech. */
  label: string;
  defaultValue?: string;
  /** Grid columns and gap, e.g. "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5". */
  gridClassName?: string;
  itemClassName?: string;
  className?: string;
};

export function FilterGrid<T>({
  items,
  filters,
  getKey,
  renderItem,
  label,
  defaultValue,
  gridClassName = 'grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3',
  itemClassName,
  className,
}: FilterGridProps<T>) {
  const uid = useId();
  const gridId = `${uid}-grid`;
  const reduced = useReducedMotion();
  const [active, setActive] = useState(() => defaultValue ?? filters[0]?.id ?? '');

  const chips = useRef<(HTMLButtonElement | null)[]>([]);
  const index = Math.max(
    0,
    filters.findIndex((filter) => filter.id === active),
  );
  const current = filters[index];

  const counts = useMemo(() => {
    const next: Record<string, number> = {};
    for (const filter of filters) next[filter.id] = items.filter((item) => filter.match(item)).length;
    return next;
  }, [filters, items]);

  const visible = useMemo(() => (current ? items.filter((item) => current.match(item)) : [...items]), [current, items]);

  const go = useCallback(
    (i: number) => {
      const at = (i + filters.length) % filters.length;
      const next = filters[at];
      if (!next) return;
      chips.current[at]?.focus();
      setActive(next.id);
    },
    [filters],
  );

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      go(i + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      go(i - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      go(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      go(filters.length - 1);
    }
  };

  const swap = reduced ? INSTANT : CELL;
  const step = reduced ? INSTANT : { layout: MOVE, duration: 0.2, ease: EASE };
  const leave = reduced ? INSTANT : LEAVE;

  return (
    <div className={cn('w-full', className)}>
      <div role="radiogroup" aria-label={label} aria-controls={gridId} className="flex flex-wrap items-center gap-2">
        {filters.map((filter, i) => {
          const on = i === index;
          return (
            <button
              key={filter.id}
              ref={(node) => {
                chips.current[i] = node;
              }}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(filter.id)}
              onKeyDown={(event) => onKeyDown(event, i)}
              className="relative inline-grid min-h-12 select-none place-items-center rounded-[10px] px-4"
              style={{ touchAction: 'manipulation' }}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute inset-0 rounded-[10px] border transition-colors duration-200',
                  on ? 'border-transparent' : 'border-[rgba(20,52,110,0.16)] bg-white shadow-control',
                )}
              />
              {on ? (
                <motion.span
                  aria-hidden="true"
                  layoutId={reduced ? undefined : `${uid}-thumb`}
                  transition={CELL}
                  className="absolute inset-0 rounded-[10px] bg-navy"
                />
              ) : null}

              <span className="relative col-start-1 row-start-1 inline-grid">
                <motion.span
                  aria-hidden="true"
                  initial={false}
                  animate={{ opacity: on ? 0 : 1 }}
                  transition={swap}
                  className="col-start-1 row-start-1 inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-ink"
                >
                  {filter.label}
                  <span className="tabular-nums text-muted-foreground">{counts[filter.id]}</span>
                </motion.span>
                <motion.span
                  aria-hidden="true"
                  initial={false}
                  animate={{ opacity: on ? 1 : 0 }}
                  transition={swap}
                  className="col-start-1 row-start-1 inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-white"
                >
                  {filter.label}
                  <span className="tabular-nums opacity-70">{counts[filter.id]}</span>
                </motion.span>
                <span className="sr-only">
                  {filter.label}, {counts[filter.id]} of {items.length}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <ul id={gridId} className={cn('relative mt-8 grid', gridClassName)}>
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((item) => (
            <motion.li
              key={getKey(item)}
              layout={reduced ? false : 'position'}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, transition: leave }}
              transition={step}
              className={cn('min-w-0', itemClassName)}
            >
              {renderItem(item)}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <p aria-live="polite" className="sr-only">
        {current?.label}: {visible.length} of {items.length} shown
      </p>
    </div>
  );
}

export default FilterGrid;
