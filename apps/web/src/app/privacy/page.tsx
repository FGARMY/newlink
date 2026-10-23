'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileCheck2,
  Database,
  UserCheck,
  Server,
  Mail,
  Scale,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export default function PrivacyPolicyPage() {
  const lastUpdated = 'October 23, 2026';

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-canvas text-slate-900 dark:text-white font-sans transition-colors duration-200">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-card/60 backdrop-blur-md py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <Lock className="h-4 w-4" />
            <span>Privacy & Data Protection</span>
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            At Speion Cars, we respect your privacy and are committed to safeguarding your personal information,
            identity documents, and location data with modern 256-bit TLS encryption and strict access controls.
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span>Last Updated: {lastUpdated}</span>
            <span>•</span>
            <span>Compliant with DPDP Act & IT Act 2000</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-5xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {/* Section 1 */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
              <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2>1. Information We Collect</h2>
            </div>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              To operate our self-drive car rental service and comply with road transport regulations in India, we collect:
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 dark:bg-surface p-4 border border-slate-200/80 dark:border-white/5">
                <h3 className="font-bold text-xs text-slate-900 dark:text-white mb-1">Personal & Account Information</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Full name, email address, mobile number, Google profile information (name, email, avatar image), and password hashes.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-surface p-4 border border-slate-200/80 dark:border-white/5">
                <h3 className="font-bold text-xs text-slate-900 dark:text-white mb-1">Identity & KYC Documents</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Driving License number, expiration date, front & back photos, and Aadhaar/Passport identification for identity verification.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-surface p-4 border border-slate-200/80 dark:border-white/5">
                <h3 className="font-bold text-xs text-slate-900 dark:text-white mb-1">Booking & Payment Details</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Pickup/drop-off locations, rental timestamps, transaction identifiers, FASTag toll logs, and security deposit records.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-surface p-4 border border-slate-200/80 dark:border-white/5">
                <h3 className="font-bold text-xs text-slate-900 dark:text-white mb-1">Vehicle Telematics & Safety Data</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Real-time GPS coordinates, vehicle speed, odometer metrics, and fuel telemetry during active trips to provide emergency assistance.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
              <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2>2. How We Use Your Data</h2>
            </div>
            <ul className="mt-3 space-y-2 list-disc list-inside text-slate-700 dark:text-slate-300">
              <li><strong>Rental Fulfillment:</strong> To confirm reservations, issue digital passcodes for vehicle unlocking, and record vehicle check-in/return.</li>
              <li><strong>KYC & Regulatory Compliance:</strong> To verify driver eligibility and protect the platform against fraud, unlicensed driving, and unauthorized access.</li>
              <li><strong>Emergency & Roadside Assistance:</strong> To dispatch 24/7 mechanics or emergency response teams to your exact GPS coordinates in case of a breakdown or accident.</li>
              <li><strong>FASTag & Fuel Settlement:</strong> To accurately calculate toll deductions and fuel variance for your automated security deposit refund.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h2>3. Data Protection, Encryption & Storage</h2>
            </div>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Your security is our core priority:
            </p>
            <div className="mt-4 rounded-xl bg-slate-50 dark:bg-surface p-4 border border-slate-200/80 dark:border-white/10 space-y-2 text-xs">
              <p><strong>Cloud Database Encryption:</strong> Customer profiles, bookings, and hashes are stored in Neon PostgreSQL cloud servers with TLS 1.3 encryption in transit and AES-256 encryption at rest.</p>
              <p><strong>Password Security:</strong> Passwords are never stored in plaintext. We utilize cryptographic <code>scrypt</code> hashing with unique cryptographic salts.</p>
              <p><strong>No Selling of Personal Data:</strong> Speion Cars does not sell, rent, or trade your personal information or contact details to third-party marketing companies.</p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
              <FileCheck2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2>4. Cookies & Client-Side Storage</h2>
            </div>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              We use browser <code>localStorage</code> and essential cookies strictly to maintain user sessions (keeping you logged in),
              preserve your theme preferences (light/dark mode), and retain your active booking passcode during live trips. We do not use
              third-party tracking cookies or invasive ad networks.
            </p>
          </div>

          {/* Section 5 */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h2>5. Your Rights & Grievance Redressal</h2>
            </div>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              You have the right to inspect, update, or request the deletion of your account and uploaded documents once all active
              rentals and liabilities are fully settled.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-white/10 text-xs">
              <p className="font-bold text-slate-900 dark:text-white">Data Protection & Grievance Officer</p>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Speion Cars Private Limited, Pune, Maharashtra - 411032</p>
              <p className="text-slate-600 dark:text-slate-400">
                Email: <a href="mailto:privacy@speioncars.com" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@speioncars.com</a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
