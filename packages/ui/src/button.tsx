import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils.js';

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/20 focus-visible:ring-blue-600',
        brand: 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/20 focus-visible:ring-blue-600',
        emerald:
          'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm focus-visible:ring-emerald-600',
        secondary: 'bg-surface text-slate-100 hover:bg-slate-700 focus-visible:ring-slate-400',
        outline:
          'border border-white/15 bg-card text-white hover:bg-surface focus-visible:ring-blue-500',
        ghost:
          'text-slate-300 hover:bg-surface hover:text-white focus-visible:ring-blue-500',
        link: 'text-blue-400 underline-offset-4 hover:underline focus-visible:ring-blue-400',
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
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';
