import * as React from 'react';

import { cn } from '@/lib/utils';
import { fieldClasses } from '@/components/ui/input';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea className={cn(fieldClasses, 'min-h-[140px] resize-y', className)} ref={ref} {...props} />
  ),
);
Textarea.displayName = 'Textarea';

export { Textarea };
