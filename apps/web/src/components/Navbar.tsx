'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, ShieldCheck, MapPin, Car } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  selectedCity?: string;
  onCityChange?: (city: string) => void;
}

export function Navbar({ selectedCity = 'pune', onCityChange }: NavbarProps) {
  const { customer } = useAuth();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-bold tracking-tight shadow-sm transition-transform group-hover:scale-105">
              NL
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                New<span className="text-amber-600">link</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mt-1">
                Self-Drive Rentals
              </span>
            </div>
          </Link>

          {/* City Selector Pill */}
          <div className="hidden sm:flex items-center rounded-full bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => onCityChange?.('pune')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-all ${
                selectedCity === 'pune'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="h-3.5 w-3.5 text-amber-600" />
              Pune
            </button>
            <button
              onClick={() => onCityChange?.('nashik')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-all ${
                selectedCity === 'nashik'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="h-3.5 w-3.5 text-amber-600" />
              Nashik
            </button>
          </div>
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-3 sm:gap-6">
          <a
            href="tel:+919876543210"
            className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Phone className="h-3.5 w-3.5 text-amber-600" />
            +91 98765 43210
          </a>

          <Link
            href="/cars"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            <Car className="h-3.5 w-3.5 text-slate-500" />
            Browse Fleet
          </Link>

          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 hover:bg-amber-100 transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
            Admin Hub
          </Link>

          {customer ? (
            <Link
              href="/account"
              className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-200 transition-all border border-slate-200"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                {customer.name ? customer.name[0]?.toUpperCase() : 'U'}
              </div>
              <span>{customer.name || customer.phone}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-600 transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
