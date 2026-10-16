'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Phone, ArrowRight, ShieldCheck, CheckCircle2, ChevronLeft, Sparkles } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import type { CustomerProfile } from '@newlink/contracts';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/account';

  const { login } = useAuth();

  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [otp, setOtp] = useState('');
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!/^\d{10}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    // Simulate or call /api/v1/auth/otp/request
    setTimeout(() => {
      setIsLoading(false);
      setStep('OTP');
      // For instant local DX demonstration, generate test code 123456
      setDemoCode('123456');
    }, 400);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp.trim().length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    if (demoCode && otp.trim() !== demoCode && otp.trim() !== '123456') {
      setError('Incorrect OTP. Try entering 123456');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const customer: CustomerProfile = {
        id: `cust-${Date.now().toString(36)}`,
        phone: `+91 ${phone}`,
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        kycStatus: 'PENDING_REVIEW',
        createdAt: new Date().toISOString(),
      };
      login(customer, `jwt-token-${Date.now()}`);
      router.push(nextUrl);
    }, 400);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF8] text-slate-900 font-sans">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 font-bold text-lg">
                NL
              </div>
              <h1 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
                {step === 'PHONE' ? 'Sign in to Newlink' : 'Enter Verification Code'}
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                {step === 'PHONE'
                  ? 'Enter your mobile number to view bookings and manage your KYC'
                  : `Enter the 6-digit code sent to +91 ${phone}`}
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
                {error}
              </div>
            )}

            {/* Step 1: Phone input */}
            {step === 'PHONE' ? (
              <form onSubmit={handleRequestOtp} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Mobile Number</label>
                  <div className="mt-1.5 flex rounded-xl border border-slate-300 shadow-xs focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-600/20">
                    <span className="flex items-center px-3.5 text-xs font-bold text-slate-500 bg-slate-50 border-r border-slate-200 rounded-l-xl">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-r-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-50"
                >
                  <span>{isLoading ? 'Sending OTP...' : 'Continue with OTP'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            ) : (
              /* Step 2: OTP input */
              <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
                {demoCode && (
                  <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200">
                    <span className="font-bold">Demo OTP Code:</span> {demoCode}
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700">6-Digit Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-center text-lg font-mono font-bold tracking-widest text-slate-900 shadow-xs focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('PHONE');
                      setOtp('');
                    }}
                    className="flex items-center gap-1 font-semibold text-slate-500 hover:text-slate-800"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Change Number</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDemoCode('123456')}
                    className="font-bold text-amber-600 hover:underline"
                  >
                    Resend Code
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-md hover:bg-amber-600 transition-all cursor-pointer disabled:opacity-50"
                >
                  <span>{isLoading ? 'Verifying...' : 'Verify & Continue'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {/* Trust footer */}
            <div className="mt-6 border-t border-slate-100 pt-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Protected by Newlink 256-bit encrypted authentication</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-semibold">Loading sign in...</div>}>
      <LoginContent />
    </Suspense>
  );
}

