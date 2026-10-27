// "Download our capability statement (one-page overview, PDF)" button: saves the
// v6 PDF from public/files. The part in brackets goes on a second, smaller line under
// the label, so the button stays short (Filip 2026-10-19).
// With no file set it renders as a flagged, non-clickable state so a dead link cannot ship.
import { Button, buttonVariants } from '@/components/ui/button';
import { Icon } from '@/lib/icons';
import { cn } from '@/lib/utils';
import type { Site } from '@/lib/content';

function Label({ text }: { text: string }) {
  const at = text.indexOf(' (');
  if (at < 0) return <>{text}</>;
  return (
    <span className="flex flex-col items-start text-left">
      {text.slice(0, at)} <span className="text-sm font-normal leading-snug text-muted-foreground">{text.slice(at + 1)}</span>
    </span>
  );
}

export function CapabilityLink({ site, className }: { site: Site; className?: string }) {
  if (!site.capabilityStatementUrl) {
    return (
      <span className={cn(buttonVariants({ variant: 'outline' }), 'cursor-default flex-wrap gap-y-1.5', className)}>
        <Icon name="download" size={22} />
        <Label text={site.secondaryCta} />
        <mark className="confirm">Pending</mark>
      </span>
    );
  }

  // Phone: 16px label and a tighter inset, so the label holds one row and the PDF note
  // the second (at 20px it broke into three, Filip 2026-10-27).
  return (
    <Button asChild variant="outline" className={cn('max-sm:gap-2 max-sm:px-3.5 max-sm:text-sm', className)}>
      <a href={site.capabilityStatementUrl} download="Actura-Health-Capability-Statement.pdf" data-event="capability_download">
        <Icon name="download" size={22} className="max-sm:h-5 max-sm:w-5" />
        <Label text={site.secondaryCta} />
      </a>
    </Button>
  );
}
