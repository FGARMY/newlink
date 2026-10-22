import React from 'react';
import Image from 'next/image';

interface BrandMarkProps {
  /** Rendered height/width in px (the mark is ~square). */
  size?: number;
  className?: string;
  forceWhite?: boolean;
}

export function BrandMark({ size = 32, className = '', forceWhite = false }: BrandMarkProps) {
  return (
    <Image
      src="/brand/speion-mark.png"
      alt="Speion Cars"
      width={size}
      height={Math.round(size * (597 / 640))}
      className={`${forceWhite ? '' : 'invert dark:invert-0'} ${className}`}
      priority
    />
  );
}

interface BrandLogoProps {
  /** Rendered width in px of the full horizontal lockup (mark + wordmark + tagline). */
  width?: number;
  className?: string;
  forceWhite?: boolean;
}

export function BrandLogo({ width = 200, className = '', forceWhite = false }: BrandLogoProps) {
  return (
    <Image
      src="/brand/speion-logo.png"
      alt="Speion Cars — Drive Your Way"
      width={width}
      height={Math.round(width * (337 / 1041))}
      className={`${forceWhite ? '' : 'invert dark:invert-0'} ${className}`}
    />
  );
}

interface BrandLockupProps {
  /** Small caption under the wordmark (defaults to the brand descriptor). */
  caption?: string;
  className?: string;
  forceWhite?: boolean;
}

/** Compact horizontal lockup for navbars: mark + "Speion" wordmark + "CARS". */
export function BrandLockup({ caption = 'Cars', className = '', forceWhite = false }: BrandLockupProps) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <BrandMark
        size={34}
        forceWhite={forceWhite}
        className="h-8 w-auto transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3"
      />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[22px] font-bold tracking-tight ${
            forceWhite ? 'text-white' : 'text-slate-900 dark:text-white'
          }`}
        >
          Speion
        </span>
        <span
          className={`mt-1 text-[9px] font-semibold uppercase tracking-[0.55em] ${
            forceWhite ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {caption}
        </span>
      </span>
    </span>
  );
}
