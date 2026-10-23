'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Car,
  Sun,
  Moon,
  Menu,
  X,
  HelpCircle,
  KeyRound,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BrandLockup } from './BrandLogo';
import { BecomeHostModal } from './BecomeHostModal';

interface NavbarProps {
  selectedCity?: string;
  onCityChange?: (city: string) => void;
}

export function Navbar({ selectedCity, onCityChange }: NavbarProps = {}) {
  const { customer } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [howToBookOpen, setHowToBookOpen] = useState(false);
  const [becomeHostOpen, setBecomeHostOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-canvas/95 backdrop-blur-xl transition-colors duration-200">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Hamburger & Brand */}
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="group flex items-center" aria-label="Speion Cars home">
              <BrandLockup />
            </Link>
          </div>

          {/* Center Nav Links */}
          <div className="hidden lg:flex items-center gap-7 text-[13px] font-semibold text-slate-700 dark:text-slate-300">
            <button
              onClick={() => setHowToBookOpen(true)}
              className="hover:text-blue-600 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              How to book?
            </button>

            <Link
              href="/cars"
              className="hover:text-blue-600 dark:hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Car className="h-3.5 w-3.5 text-slate-400" />
              Browse Fleet
            </Link>

            <button
              onClick={() => {
                setBecomeHostOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <KeyRound className="h-3.5 w-3.5 text-emerald-500" />
              Become a Host
            </button>
          </div>

          {/* Right Controls: Theme Toggle & Sign In */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-surface text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle light/dark theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </button>

            {/* Login / Account Button */}
            {customer ? (
              <Link
                href="/account"
                className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-surface px-4 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                {customer.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={customer.avatarUrl}
                    alt={customer.name || 'User avatar'}
                    className="h-5 w-5 rounded-full object-cover ring-1 ring-white/20"
                  />
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-gradient text-[10px] font-bold text-white">
                    {customer.name ? customer.name[0]?.toUpperCase() : (customer.email ? customer.email[0]?.toUpperCase() : 'U')}
                  </div>
                )}
                <span className="max-w-[120px] truncate">{customer.name || customer.email || customer.phone || 'Account'}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-emerald-600 dark:bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition-all cursor-pointer hover:shadow-md"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-white/10 bg-white dark:bg-canvas p-4 space-y-3">
            <button
              onClick={() => {
                setHowToBookOpen(true);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              How to book?
            </button>
            <Link
              href="/cars"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              Browse Fleet
            </Link>
            <button
              onClick={() => {
                setBecomeHostOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full text-left py-2 text-sm font-bold text-emerald-600 dark:text-emerald-400"
            >
              <KeyRound className="h-4 w-4" />
              Become a Host
            </button>
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-500">Theme</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-surface text-slate-800 dark:text-white"
              >
                {theme === 'dark' ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* How to Book Modal */}
      {howToBookOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-card p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white animate-fade-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-bold">How to Book with Speion Cars</h3>
              </div>
              <button
                onClick={() => setHowToBookOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs">
                  1
                </div>
                <div>
                  <h4 className="font-bold">Select Dates & Pickup Hub</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                    Choose Pune or Nashik and enter your start and return schedule.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs">
                  2
                </div>
                <div>
                  <h4 className="font-bold">Pick Your Exact Car</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                    Browse real photos, verified fuel and transmission specs, and live rates.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs">
                  3
                </div>
                <div>
                  <h4 className="font-bold">Quick KYC & Instant Confirmation</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                    Upload your driving license. Your selected vehicle is locked atomically.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs">
                  4
                </div>
                <div>
                  <h4 className="font-bold">Drive Your Way</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                    Collect keys at the designated parking bay with a 3-minute photo checklist.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 text-center">
              <button
                onClick={() => setHowToBookOpen(false)}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Got It, Let&apos;s Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Become a Host Modal */}
      <BecomeHostModal isOpen={becomeHostOpen} onClose={() => setBecomeHostOpen(false)} />
    </>
  );
}
