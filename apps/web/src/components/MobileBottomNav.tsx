'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Compass, KeyRound, MessageSquare, Car } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenHostModal?: () => void;
}

export function MobileBottomNav({ onOpenHostModal }: MobileBottomNavProps) {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-card/95 backdrop-blur-xl md:hidden py-2 px-3 safe-area-bottom">
      <div className="grid grid-cols-4 items-center justify-around text-center">
        {/* Search */}
        <Link
          href="/cars"
          className={`flex flex-col items-center gap-1 py-1 transition-colors ${
            pathname.startsWith('/cars')
              ? 'text-primary font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Search className="h-5 w-5" />
          <span className="text-[10px] font-medium">Search</span>
        </Link>

        {/* My Trips */}
        <Link
          href="/account"
          className={`flex flex-col items-center gap-1 py-1 transition-colors ${
            pathname === '/account'
              ? 'text-primary font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <KeyRound className="h-5 w-5" />
          <span className="text-[10px] font-medium">My Trips</span>
        </Link>

        {/* Host & Earn */}
        <button
          onClick={onOpenHostModal}
          className="flex flex-col items-center gap-1 py-1 text-slate-500 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <div className="relative">
            <Car className="h-5 w-5 text-emerald-500" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Host & Earn</span>
        </button>

        {/* WhatsApp Support */}
        <button
          onClick={() => {
            window.open('https://wa.me/919823011000?text=Hello%20Speion%20Cars!%20I%20need%20assistance.', '_blank');
          }}
          className="flex flex-col items-center gap-1 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="text-[10px] font-medium">Support</span>
        </button>
      </div>
    </div>
  );
}
