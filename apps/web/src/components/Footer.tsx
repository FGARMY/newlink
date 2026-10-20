import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, Clock, Award } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-400">
      {/* Trust Badges Bar */}
      <div className="border-b border-slate-900 bg-slate-900/50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">100% Verified Fleet</h4>
                <p className="text-xs text-slate-400">Sanitized, insured & inspected</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">24/7 Roadside Assistance</h4>
                <p className="text-xs text-slate-400">Anywhere across Maharashtra</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Transparent Pricing</h4>
                <p className="text-xs text-slate-400">No hidden fees, instant invoice</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
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
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-bold text-sm">
                NL
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                New<span className="text-amber-500">link</span>
              </span>
            </div>
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
                <Phone className="h-3.5 w-3.5 text-amber-500" />
                <span>+91 98765 43210 (24x7 Support)</span>
              </a>
              <a
                href="mailto:support@newlinkcars.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-amber-500" />
                <span>support@newlinkcars.com</span>
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
        <div className="mt-12 border-t border-slate-900 pt-6 text-center text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Newlink Mobility Technologies Pvt. Ltd. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
