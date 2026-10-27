// Copies a value (the contact email) to the clipboard, shows a check for a moment
// and tells assistive tech. Used in the contact block and in the footer.
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Icon } from '@/lib/icons';

export function CopyButton({ value, label = 'Copy email address' }: { value: string; label?: string }) {
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  // Needs the clipboard, so it only appears once the page is interactive.
  useEffect(() => {
    setReady(true);
    return () => window.clearTimeout(timer.current);
  }, []);

  if (!ready) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button type="button" variant="outline" size="icon" className="h-10 w-10 shrink-0" onClick={copy} aria-label={label}>
        <Icon name={copied ? 'check' : 'copy'} size={20} stroke={copied ? 2 : 1.5} />
      </Button>
      <span className="sr-only" role="status">
        {copied ? 'Email address copied' : ''}
      </span>
    </>
  );
}

export default CopyButton;
