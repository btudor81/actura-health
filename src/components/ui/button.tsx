import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// shadcn Button, restyled to the Actura controls: lit from above, an inner highlight
// on the top edge, an inner shade on the bottom edge and a short tinted drop shadow.
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-[10px] border border-transparent text-base font-medium leading-tight no-underline transition-[filter,background-color,border-color,transform] duration-200 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-navy bg-gradient-to-b from-[#23189a] to-[#150a7a] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(4,0,40,0.25),0_1px_2px_rgba(15,0,104,0.25),0_8px_16px_-10px_rgba(15,0,104,0.5)] hover:brightness-[1.14]',
        outline:
          'border-[rgba(20,52,110,0.16)] bg-white text-ink shadow-control hover:border-[rgba(20,52,110,0.34)] hover:bg-tint',
        ghost: 'text-ink hover:bg-tint',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'min-h-[54px] px-6 py-3',
        sm: 'min-h-12 px-5 py-2.5',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
