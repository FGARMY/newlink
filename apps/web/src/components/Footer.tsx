import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, Clock, Award } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-onyx text-slate-400">
      {/* Trust Badges Bar */}
      <div className="border-b border-white/5 bg-midnight py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">100% Verified Fleet</h4>
                <p className="text-xs text-slate-400">Sanitized, insured & inspected</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">24/7 Roadside Assistance</h4>
                <p className="text-xs text-slate-400">Anywhere across Maharashtra</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Transparent Pricing</h4>
                <p className="text-xs text-slate-400">No hidden fees, instant invoice</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Pune & Nashik Hubs</h4>
                <p className="text-xs text-slate-400">Airports & central pickup bays</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" aria-label="Speion Cars home" className="inline-block">
              <BrandLogo width={190} forceWhite={true} className="h-auto" />
            </Link>
            <p className="mt-4 text-xs leading-relaxed text-slate-400 max-w-sm">
              Premium self-drive car rental platform built for seamless journeys across Pune,
              Nashik, and beyond. Book in under 2 minutes with guaranteed availability and
              transparent pricing.
            </p>
            <div className="mt-6 flex flex-col gap-2 text-xs">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-blue-400" />
                <span>+91 98765 43210 (24x7 Support)</span>
              </a>
              <a
                href="mailto:support@speioncars.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-blue-400" />
                <span>support@speioncars.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Pune Fleet</h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link
                  href="/cars?city=pune&category=SUV"
                  className="hover:text-white transition-colors"
                >
                  SUV Rentals in Pune
                </Link>
              </li>
              <li>
                <Link
                  href="/cars?city=pune&category=SEDAN"
                  className="hover:text-white transition-colors"
                >
                  Sedans in Pune
                </Link>
              </li>
              <li>
                <Link
                  href="/cars?city=pune&category=PREMIUM"
                  className="hover:text-white transition-colors"
                >
                  Luxury & Premium
                </Link>
              </li>
              <li>
                <Link
                  href="/cars?city=pune&location=loc-pn-airport"
                  className="hover:text-white transition-colors"
                >
                  Pune Airport Pickups
                </Link>
              </li>
              <li>
                <Link
                  href="/cars?city=pune&location=loc-pn-baner"
                  className="hover:text-white transition-colors"
                >
                  Baner High Street
                </Link>
              </li>
            </ul>
          </div>

          {/* Nashik Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Nashik Fleet</h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link
                  href="/cars?city=nashik&category=SUV"
                  className="hover:text-white transition-colors"
                >
                  SUV Rentals in Nashik
                </Link>
              </li>
              <li>
                <Link
                  href="/cars?city=nashik&category=LUXURY"
                  className="hover:text-white transition-colors"
                >
                  Toyota Fortuner Hire
                </Link>
              </li>
              <li>
                <Link
                  href="/cars?city=nashik&location=loc-ns-citycentre"
                  className="hover:text-white transition-colors"
                >
                  City Centre Mall
                </Link>
              </li>
              <li>
                <Link
                  href="/cars?city=nashik&location=loc-ns-mumbainaka"
                  className="hover:text-white transition-colors"
                >
                  Mumbai Naka Hub
                </Link>
              </li>
              <li>
                <Link href="/cars?city=nashik" className="hover:text-white transition-colors">
                  All Nashik Cars
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Policies</h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cancellation-policy" className="hover:text-white transition-colors">
                  Cancellation & Refunds
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Speion Cars. All rights reserved.</p>
          <p className="uppercase tracking-[0.35em] text-slate-500">Drive Your Way</p>
        </div>
      </div>
    </footer>
  );
}
