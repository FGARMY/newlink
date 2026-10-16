import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils.js';

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-slate-900 text-white hover:bg-slate-800 shadow-sm focus-visible:ring-slate-950',
        brand:
          'bg-amber-600 text-white hover:bg-amber-700 shadow-sm focus-visible:ring-amber-600',
        emerald:
          'bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm focus-visible:ring-emerald-700',
        secondary:
          'bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-400',
        outline:
          'border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus-visible:ring-slate-400',
        ghost:
          'text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400',
        link: 'text-amber-600 underline-offset-4 hover:underline focus-visible:ring-amber-600',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base font-semibold',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
