import type { ElementType, HTMLAttributes } from 'react';

interface HtmlProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  /** Markup from src/lib/text.ts (flag, headline, rows): escaped there, safe to set here. */
  html: string;
}

export function Html({ as: Tag = 'span', html, ...props }: HtmlProps) {
  return <Tag {...props} dangerouslySetInnerHTML={{ __html: html }} />;
}
