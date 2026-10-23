'use client';

import React from 'react';
import Link from 'next/link';
import {
  Car,
  FileCheck2,
  KeyRound,
  Compass,
  RotateCcw,
  ShieldCheck,
  Clock,
  Award,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Sparkles,
  Phone,
} from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

const STEPS = [
  {
    number: '01',
    title: 'Choose Your Car & Hub',
    subtitle: 'Browse 100% verified self-drive vehicles',
    description:
      'Select your city (Pune or Nashik), pickup hub (e.g. Pune Airport, Baner, or City Centre Mall), travel dates, and vehicle category. Filter easily by transmission (Automatic/Manual), fuel type (Petrol/Diesel), or seating capacity.',
    icon: Car,
    badge: 'Guaranteed Availability',
  },
  {
    number: '02',
    title: 'Instant 60-Second Digital KYC',
    subtitle: 'Fast, paperless document upload',
    description:
      'Upload your original Driving License and government ID proof (Aadhaar/Passport). Our automated compliance engine verifies your details in minutes, eliminating long queues or physical paperwork at the counter.',
    icon: FileCheck2,
    badge: 'Paperless & Secure',
  },
  {
    number: '03',
    title: 'Passcode Handover & 4-Angle Photo Check',
    subtitle: 'Contactless, transparent vehicle collection',
    description:
      'Arrive at your chosen hub, show your unique 4-digit pickup passcode from your account dashboard, and take 4 timestamped photos of the vehicle exterior. Record initial odometer & fuel level, receive your sanitized keys, and hit the road!',
    icon: KeyRound,
    badge: '4-Digit Unlocking',
  },
  {
    number: '04',
    title: 'Drive Your Way with Total Freedom',
    subtitle: 'Active FASTag & 24/7 Roadside Assistance',
    description:
      'Enjoy seamless highway cruising with pre-loaded FASTags on all toll corridors across Maharashtra. If you ever need help, our dedicated 24/7 Roadside Assistance team is a single tap away in your dashboard.',
    icon: Compass,
    badge: '24/7 Roadside Help',
  },
  {
    number: '05',
    title: 'Easy Return & 2-Hour Deposit Refund',
    subtitle: 'Transparent settlement with zero hidden costs',
    description:
      'Return the car to any authorized Speion Cars bay. Our team conducts a 60-second digital check-in. Any toll usage or fuel variance is calculated automatically, and your refundable security deposit is dispatched to your bank within 2 to 4 hours.',
    icon: RotateCcw,
    badge: 'Automated Refund',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-canvas text-slate-900 dark:text-white font-sans transition-colors duration-200">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-card/60 backdrop-blur-md py-12 sm:py-20 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>The Modern Self-Drive Experience</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            How Speion Cars Works
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Rent a premium, sanitized car in 5 seamless steps with zero paperwork, transparent pricing,
            and instant security deposit return.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/cars"
              className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all cursor-pointer"
            >
              <span>Browse Fleet &amp; Book</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/faq"
              className="flex items-center gap-2 rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-card px-6 py-3 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface transition-all cursor-pointer"
            >
              <span>Have Questions? Read FAQ</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <main className="mx-auto max-w-5xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-6 sm:p-10 shadow-xs hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  {/* Left: Step Number & Content */}
                  <div className="flex items-start gap-5">
                    <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-500/20 shadow-xs">
                      <Icon className="h-7 w-7" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-black text-blue-600 dark:text-blue-400">
                          STEP {step.number}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-surface px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/5">
                          {step.badge}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        {step.title}
                      </h2>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        {step.subtitle}
                      </p>
                      <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Value Proposition Grid */}
        <div className="mt-16 pt-12 border-t border-slate-200/80 dark:border-white/10">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Why Drive With Speion Cars?</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Built from the ground up for modern drivers who value transparency, reliability, and speed.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-3">Zero Hidden Fees</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                What you see is what you pay. Comprehensive insurance &amp; GST included upfront.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <Clock className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-3">2-Hour Deposit Refund</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Automated post-trip settlement directly back to your original bank account or UPI.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <Award className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-3">100% Verified Fleet</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                All vehicles undergo a 40-point mechanical inspection and sanitization before every booking.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                <MapPin className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-3">Airport &amp; City Hubs</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Dedicated pickup bays at Pune Airport, Baner, Viman Nagar, Hinjewadi, and Nashik City Centre.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-12 rounded-3xl bg-primary-gradient p-8 text-center text-white shadow-xl shadow-blue-600/20">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready for Your Next Road Trip?</h3>
          <p className="mt-2 text-xs sm:text-sm text-blue-100 max-w-xl mx-auto">
            Book top-rated SUVs, sedans, and luxury vehicles across Pune &amp; Nashik in under 2 minutes.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/cars"
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs sm:text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors shadow-md"
            >
              <span>Explore Available Fleet</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
