import * as React from 'react';

import { cn } from '@/lib/utils';

export const fieldClasses =
  'w-full rounded-[10px] border-[1.5px] border-input bg-white px-4 py-3.5 text-base text-foreground shadow-[inset_0_2px_3px_rgba(21,19,74,0.05)] transition-colors hover:border-navy focus-visible:border-navy focus-visible:outline-offset-2 [&:user-invalid]:border-bad [&:user-invalid]:bg-[#fff4f2]';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input type={type} className={cn(fieldClasses, 'min-h-14', className)} ref={ref} {...props} />
  ),
);
Input.displayName = 'Input';

export { Input };
