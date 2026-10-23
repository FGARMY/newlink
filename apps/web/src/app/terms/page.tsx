'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  FileText,
  AlertCircle,
  Clock,
  Car,
  Fuel,
  CreditCard,
  Scale,
  ChevronRight,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export default function TermsPage() {
  const lastUpdated = 'October 23, 2026';

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-canvas text-slate-900 dark:text-white font-sans transition-colors duration-200">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-card/60 backdrop-blur-md py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <Scale className="h-4 w-4" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Terms of Service & Rental Agreement
          </h1>
          <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Welcome to Speion Cars. These Terms of Service govern your access to our self-drive car rental platform,
            mobile applications, and vehicle handover services across Pune, Nashik, and Maharashtra. By booking a
            vehicle, you agree to comply with these terms.
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span>Last Updated: {lastUpdated}</span>
            <span>•</span>
            <span>Version 2.4</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Jurisdiction: Pune, India</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sticky Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Contents
              </h3>
              <nav className="space-y-1.5 text-xs font-medium">
                <a href="#eligibility" className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 py-1">
                  1. Renter Eligibility
                </a>
                <a href="#booking-payment" className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 py-1">
                  2. Booking & Payments
                </a>
                <a href="#security-deposit" className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 py-1">
                  3. Security Deposit
                </a>
                <a href="#handover-return" className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 py-1">
                  4. Handover & Return
                </a>
                <a href="#fuel-toll" className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 py-1">
                  5. Fuel & Toll Charges
                </a>
                <a href="#prohibited-uses" className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 py-1">
                  6. Prohibited Vehicle Uses
                </a>
                <a href="#damage-liability" className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 py-1">
                  7. Accidents & Insurance
                </a>
                <a href="#cancellation" className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 py-1">
                  8. Cancellation Policy
                </a>
                <a href="#dispute" className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 py-1">
                  9. Dispute Resolution
                </a>
              </nav>
            </div>
          </aside>

          {/* Legal Clauses Body */}
          <div className="lg:col-span-3 space-y-10 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {/* Section 1 */}
            <section id="eligibility" className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20 text-xs text-blue-600 dark:text-blue-400 font-bold">1</span>
                <h2>Renter Eligibility & Documentation</h2>
              </div>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                To rent and operate a self-drive vehicle from Speion Cars, you must meet the following mandatory criteria:
              </p>
              <ul className="mt-3 space-y-2 list-disc list-inside text-slate-700 dark:text-slate-300">
                <li><strong>Minimum Age:</strong> You must be at least 21 years of age at the time of vehicle pickup.</li>
                <li><strong>Valid Driving License:</strong> You must hold an active, original Light Motor Vehicle (LMV) driving license with at least 1 year of driving validity. Learner licenses are strictly invalid.</li>
                <li><strong>Identity Proof:</strong> A government-approved identity card (Aadhaar Card, Passport, or Voter ID) must be uploaded via our digital KYC portal prior to trip commencement.</li>
                <li><strong>Sole Driver Responsibility:</strong> Only the verified customer registered on the booking is authorized to drive the car. Allowing non-verified individuals to operate the vehicle voids comprehensive insurance.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section id="booking-payment" className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20 text-xs text-blue-600 dark:text-blue-400 font-bold">2</span>
                <h2>Booking, Pricing & Payment Terms</h2>
              </div>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                Bookings are confirmed only upon successful pre-authorization or payment of the estimated rental fees:
              </p>
              <ul className="mt-3 space-y-2 list-disc list-inside text-slate-700 dark:text-slate-300">
                <li><strong>Transparent Rates:</strong> Displayed rates include base vehicle rent and statutory Goods and Services Tax (GST 18%).</li>
                <li><strong>Included Kilometers:</strong> Each rental plan includes a daily free kilometer allowance (typically 250 km/day). Any excess distance traveled will be billed at standard extra km rates (₹12 to ₹18/km depending on vehicle category).</li>
                <li><strong>Billing Cycle:</strong> Rental duration is calculated in 24-hour cycles from the scheduled start time. Late returns exceeding the 30-minute grace period will incur hourly late penalty charges.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="security-deposit" className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20 text-xs text-blue-600 dark:text-blue-400 font-bold">3</span>
                <h2>Refundable Security Deposit</h2>
              </div>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                A refundable security deposit (ranging from ₹3,000 for hatchbacks/sedans to ₹10,000 for luxury SUVs) is held to cover incidental liabilities:
              </p>
              <div className="mt-4 rounded-xl bg-slate-50 dark:bg-surface p-4 border border-slate-200/80 dark:border-white/10 text-xs space-y-2">
                <p><strong>Automated Return:</strong> Once the vehicle is returned and the digital check-in inspection is finalized, the deposit is processed back to the original payment source within 2 to 4 hours.</p>
                <p><strong>Permitted Deductions:</strong> Speion Cars reserves the right to deduct pending toll charges (FASTag), fuel level shortages, extra kilometers, speeding penalties, or interior cleaning fees from this deposit.</p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="handover-return" className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20 text-xs text-blue-600 dark:text-blue-400 font-bold">4</span>
                <h2>Vehicle Handover & Return Protocol</h2>
              </div>
              <ul className="mt-3 space-y-2 list-disc list-inside text-slate-700 dark:text-slate-300">
                <li><strong>4-Angle Inspection:</strong> Both at pickup and drop-off, the customer and hub representative take 4 timestamped exterior photos and record odometer & fuel gauge readings.</li>
                <li><strong>Passcode Unlocking:</strong> You will receive a unique 4-digit pickup passcode in your account dashboard to authorize key handover.</li>
                <li><strong>Cleanliness:</strong> Vehicles are delivered fully sanitized. If a returned vehicle has severe food spills, mud, pet hair, or smoking odors, a professional detailing charge (₹750 to ₹1,500) will apply.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="fuel-toll" className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20 text-xs text-blue-600 dark:text-blue-400 font-bold">5</span>
                <h2>Fuel & FASTag Toll Policy</h2>
              </div>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                All vehicles operate on a <strong>Level-to-Level Fuel Policy</strong>:
              </p>
              <ul className="mt-3 space-y-2 list-disc list-inside text-slate-700 dark:text-slate-300">
                <li>Vehicles are handed over with a noted fuel level (usually full tank or marked percentage). You are expected to return the vehicle with the equivalent fuel level.</li>
                <li>If returned with less fuel, shortage is calculated at ₹25 per 1% fuel variance (or prevailing retail fuel price + 10% refuel surcharge).</li>
                <li><strong>FASTag:</strong> Every Speion Cars vehicle has an active FASTag. Toll plaza deductions are logged digitally and settled from the security deposit upon check-in.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="prohibited-uses" className="rounded-2xl border border-red-200/80 dark:border-red-500/20 bg-red-50/30 dark:bg-red-500/5 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-base font-bold text-red-700 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                <h2>Prohibited Vehicle Uses</h2>
              </div>
              <p className="mt-3 text-xs text-red-600 dark:text-red-300">
                Any violation of the following terms will result in immediate vehicle impoundment, forfeiture of deposit, and legal prosecution under the Indian Motor Vehicles Act:
              </p>
              <ul className="mt-3 space-y-2 list-disc list-inside text-xs text-slate-700 dark:text-slate-300">
                <li>Driving under the influence of alcohol, narcotics, or prescription drugs impairing reflexes.</li>
                <li>Using the vehicle for racing, speed trials, stunts, off-roading, or driving through water-logged areas.</li>
                <li>Carrying flammable, hazardous, prohibited, or contraband substances.</li>
                <li>Sub-renting, pledging, transferring, or using the car as a taxi/commercial transport for fare-paying passengers.</li>
                <li>Exceeding the legal speed limit (120 km/h on expressways, 80 km/h on national highways). Over-speeding triggers audio alerts and fine deductions.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="damage-liability" className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20 text-xs text-blue-600 dark:text-blue-400 font-bold">7</span>
                <h2>Accidents, Damage & Insurance Coverage</h2>
              </div>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                All Speion Cars are protected with comprehensive commercial motor insurance:
              </p>
              <ul className="mt-3 space-y-2 list-disc list-inside text-slate-700 dark:text-slate-300">
                <li><strong>Maximum Customer Liability:</strong> In the event of an accidental damage occurring during normal, legal driving, your maximum liability is capped at the security deposit amount (standard insurance deductible).</li>
                <li><strong>Immediate Reporting:</strong> In case of an accident or collision, you must immediately notify our 24/7 Roadside Assistance desk (+91 98765 43210) and assist with filing the necessary Police FIR if required.</li>
                <li><strong>Exceptions:</strong> Insurance claims are not accepted for drunk driving, deliberate damage, or unlicensed driving; in such events, the renter bears 100% of damage and legal costs.</li>
              </ul>
            </section>

            {/* Section 8 & 9 */}
            <section id="dispute" className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20 text-xs text-blue-600 dark:text-blue-400 font-bold">8</span>
                <h2>Governing Law & Contact Information</h2>
              </div>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                These terms are governed by the laws of India. Any legal dispute or claim arising out of your rental
                shall be subject to the exclusive jurisdiction of the competent courts in <strong>Pune, Maharashtra</strong>.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Speion Cars Private Limited</p>
                  <p className="text-slate-500">Lohegaon Airport Road, Pune, Maharashtra 411032</p>
                </div>
                <div className="flex items-center gap-3">
                  <a href="mailto:legal@speioncars.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                    legal@speioncars.com
                  </a>
                  <span>•</span>
                  <Link href="/cancellation-policy" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Cancellation Policy
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
