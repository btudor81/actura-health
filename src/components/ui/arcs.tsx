// Nested arcs rising from the bottom edge. Echoes the orbit in the logo mark.
import { cn } from '@/lib/utils';

interface ArcsProps {
  className?: string;
  /** Outer, middle and inner arc. Defaults to the pale tints used on a white page. */
  fills?: [string, string, string];
}

export function Arcs({ className, fills = ['var(--tint-2)', 'var(--tint-3)', 'var(--tint-4)'] }: ArcsProps) {
  return (
    <svg
      className={cn('pointer-events-none block w-full', className)}
      viewBox="0 0 1440 400"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="720" cy="560" rx="1280" ry="470" fill={fills[0]} />
      <ellipse cx="720" cy="590" rx="1060" ry="400" fill={fills[1]} />
      <ellipse cx="720" cy="620" rx="860" ry="330" fill={fills[2]} />
    </svg>
  );
}
