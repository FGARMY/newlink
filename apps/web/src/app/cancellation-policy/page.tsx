'use client';

import React from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export default function CancellationPolicyPage() {
  const lastUpdated = 'October 23, 2026';

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-canvas text-slate-900 dark:text-white font-sans transition-colors duration-200">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-card/60 backdrop-blur-md py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <RotateCcw className="h-4 w-4" />
            <span>Customer Protection</span>
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Cancellation &amp; Refund Policy
          </h1>
          <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            We understand plans change. Speion Cars provides industry-leading flexibility with free cancellations
            up to 6 hours before pickup and automated security deposit refunds within 2 to 4 hours.
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span>Last Updated: {lastUpdated}</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Transparent Deductions</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl flex-1 px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        {/* Tiered Cancellation Table */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Cancellation Timeline &amp; Refund Matrix</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Refunds are credited directly to your original payment method (UPI, Debit/Credit Card, Net Banking).
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/10">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-surface font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200/80 dark:border-white/10">
                <tr>
                  <th className="p-3.5 sm:p-4">Time Prior to Scheduled Pickup</th>
                  <th className="p-3.5 sm:p-4">Rental Fee Refund</th>
                  <th className="p-3.5 sm:p-4">Security Deposit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-white/5 text-slate-600 dark:text-slate-300">
                <tr className="bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>More than 6 hours</span>
                  </td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-600 dark:text-emerald-400">
                    100% Full Refund (Zero fee)
                  </td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-600 dark:text-emerald-400">
                    100% Refund
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-slate-900 dark:text-white">
                    Between 2 to 6 hours
                  </td>
                  <td className="p-3.5 sm:p-4 text-amber-600 dark:text-amber-400 font-semibold">
                    50% Refund of base rental
                  </td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-600 dark:text-emerald-400">
                    100% Refund
                  </td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-slate-900 dark:text-white">
                    Less than 2 hours or No-show
                  </td>
                  <td className="p-3.5 sm:p-4 text-red-600 dark:text-red-400 font-semibold">
                    1st day rental deducted; balance refunded
                  </td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-600 dark:text-emerald-400">
                    100% Refund
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Deposit Policy */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2>Security Deposit Return Timeline</h2>
          </div>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Unlike traditional car rentals that hold your money for weeks, Speion Cars utilizes automated settlement:
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-2xl bg-slate-50 dark:bg-surface p-4 border border-slate-200/80 dark:border-white/10">
              <span className="font-bold text-blue-600 dark:text-blue-400">Step 1: Check-in Inspection</span>
              <p className="mt-1 text-slate-600 dark:text-slate-400">Odometer and fuel levels are recorded at the return hub.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-surface p-4 border border-slate-200/80 dark:border-white/10">
              <span className="font-bold text-blue-600 dark:text-blue-400">Step 2: Auto FASTag Sync</span>
              <p className="mt-1 text-slate-600 dark:text-slate-400">Toll deductions and any fuel adjustments are calculated instantly.</p>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-surface p-4 border border-slate-200/80 dark:border-white/10">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Step 3: Instant Refund</span>
              <p className="mt-1 text-slate-600 dark:text-slate-400">Balance is dispatched back to your bank within 2 to 4 hours.</p>
            </div>
          </div>
        </div>

        {/* Extensions & Modifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-6 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Trip Modifications &amp; Extensions</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Want to keep the car longer? You can extend your trip directly from your active booking dashboard up to 2 hours
              before scheduled return, provided the vehicle has no subsequent reservation. Extension is billed at standard hourly rates.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-6 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Vehicle Breakdown Replacement Guarantee</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              In the rare event of a mechanical failure not caused by driver negligence, our 24/7 Roadside Assistance team
              will deliver an equivalent replacement vehicle within 90 minutes across Pune &amp; Nashik, or issue a 100% prorated refund.
            </p>
          </div>
        </div>

        {/* Help Banner */}
        <div className="rounded-2xl bg-blue-600 p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm">Need help cancelling or rescheduling?</h4>
            <p className="text-xs text-blue-100 mt-0.5">Our support team is available 24/7 to assist with your booking.</p>
          </div>
          <Link
            href="/account"
            className="rounded-xl bg-white text-blue-600 font-bold px-4 py-2 text-xs hover:bg-blue-50 transition-colors shadow-sm shrink-0"
          >
            Manage Active Booking
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
