import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils.js';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-slate-900 text-white',
        secondary: 'border-transparent bg-slate-100 text-slate-900',
        brand: 'border-transparent bg-amber-100 text-amber-900',
        emerald: 'border-transparent bg-emerald-100 text-emerald-800',
        outline: 'border border-slate-300 text-slate-700',
        success: 'border-transparent bg-green-100 text-green-800',
        warning: 'border-transparent bg-orange-100 text-orange-800',
        error: 'border-transparent bg-red-100 text-red-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
