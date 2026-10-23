'use client';

import React, { useState } from 'react';
import {
  X,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  FileCheck2,
  Lock,
} from 'lucide-react';

interface BecomeHostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BecomeHostModal({ isOpen, onClose }: BecomeHostModalProps) {
  // Registration step (Direct Onboarding without calculator)
  const [regStep, setRegStep] = useState<'RC_VERIFY' | 'BANK_DETAILS' | 'CONFIRMED'>('RC_VERIFY');

  // Form states
  const [vehicleNumber, setVehicleNumber] = useState('MH 12 AB 8899');
  const [city, setCity] = useState<'Pune' | 'Nashik'>('Pune');
  const [isVerifyingRc, setIsVerifyingRc] = useState(false);
  const [rcVerified, setRcVerified] = useState(false);

  const [hostName, setHostName] = useState('Sanjay Deshmukh');
  const [hostPhone, setHostPhone] = useState('+91 98220 54321');
  const [accountNumber, setAccountNumber] = useState('50100234918231');
  const [ifscCode, setIfscCode] = useState('HDFC0001024');
  const [upiId, setUpiId] = useState('sanjay@okhdfcbank');

  if (!isOpen) return null;

  const handleVerifyDigiLockerRc = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifyingRc(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsVerifyingRc(false);
    setRcVerified(true);
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setRegStep('CONFIRMED');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-card text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 px-6 py-4 bg-slate-50 dark:bg-surface/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Speion Host Partner Onboarding
                <span className="rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold">
                  Pune &amp; Nashik
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                List your vehicle with ₹10 Lakh host insurance &amp; verified guest KYC
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Trust Safeguards Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-2xl border border-white/5 bg-surface/40 p-3.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400 mb-1.5" />
              <div className="font-bold text-white text-[11px]">₹10 Lakh Insurance Cover</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                Comprehensive damage &amp; third-party policy coverage.
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-surface/40 p-3.5">
              <Lock className="h-4 w-4 text-blue-400 mb-1.5" />
              <div className="font-bold text-white text-[11px]">Free GPS Security Device</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                Tamper-proof OBD-II tracking &amp; speed monitoring installed.
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-surface/40 p-3.5">
              <FileCheck2 className="h-4 w-4 text-teal-400 mb-1.5" />
              <div className="font-bold text-white text-[11px]">DigiLocker KYC Guests</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                Only verified drivers with verified DL can rent your car.
              </div>
            </div>
          </div>

          {/* STEP 1: DIGILOCKER RC VERIFICATION */}
          {regStep === 'RC_VERIFY' && (
            <form onSubmit={handleVerifyDigiLockerRc} className="space-y-5">
              <div className="pb-3 border-b border-white/5">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  Step 1 of 2
                </span>
                <h4 className="text-base font-bold text-white">Vehicle RC Verification</h4>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Car Registration Number (as per RC)
                </label>
                <input
                  type="text"
                  required
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. MH 12 AB 8899"
                  className="w-full rounded-xl border border-white/15 bg-surface/60 px-3.5 py-2.5 font-mono text-sm font-bold text-white uppercase focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">City of Operation</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value as any)}
                    className="w-full rounded-xl border border-white/15 bg-surface/60 px-3.5 py-2.5 text-xs font-medium text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Pune">Pune</option>
                    <option value="Nashik">Nashik</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Year of Manufacture</label>
                  <select
                    defaultValue="2023"
                    className="w-full rounded-xl border border-white/15 bg-surface/60 px-3.5 py-2.5 text-xs font-medium text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="2024">2024 (Brand New)</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 flex items-start gap-3">
                <FileCheck2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <div className="font-bold text-white">Instant DigiLocker Integration</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    We securely verify ownership details directly against VAHAN &amp; DigiLocker records.
                    No manual paperwork needed.
                  </div>
                </div>
              </div>

              {rcVerified ? (
                <div className="rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-3 flex items-center justify-between text-xs font-bold text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    RC Verified: Active Ownership Validated
                  </span>
                  <button
                    type="button"
                    onClick={() => setRegStep('BANK_DETAILS')}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
                  >
                    Next: Bank Details →
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isVerifyingRc}
                  className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isVerifyingRc ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying with VAHAN / DigiLocker...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>Verify RC via DigiLocker</span>
                    </>
                  )}
                </button>
              )}
            </form>
          )}

          {/* STEP 3: BANK DETAILS FOR WEEKLY PAYOUTS */}
          {regStep === 'BANK_DETAILS' && (
            <form onSubmit={handleCompleteRegistration} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    Step 2 of 2
                  </span>
                  <h4 className="text-base font-bold text-white">Host Payout Information</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setRegStep('RC_VERIFY')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Back to RC
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Host Name</label>
                  <input
                    type="text"
                    required
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-surface/60 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Phone (for OTP &amp; Alerts)</label>
                  <input
                    type="tel"
                    required
                    value={hostPhone}
                    onChange={(e) => setHostPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-surface/60 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Bank Account Number (Weekly Direct Deposit)
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-surface/60 px-3 py-2 font-mono text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Bank IFSC Code</label>
                  <input
                    type="text"
                    required
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    className="w-full rounded-xl border border-white/15 bg-surface/60 px-3 py-2 font-mono text-xs uppercase text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">UPI ID (Optional)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-surface/60 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-surface/50 p-3 border border-white/5 text-[11px] text-slate-400">
                🔒 Payouts are transferred automatically every Monday morning for completed trips. Zero hidden platform commission for the first 3 months.
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Submit &amp; Schedule Free GPS Installation</span>
              </button>
            </form>
          )}

          {/* STEP 4: REGISTRATION CONFIRMED */}
          {regStep === 'CONFIRMED' && (
            <div className="py-6 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 shadow-md">
                <CheckCircle2 className="h-10 w-10 stroke-2" />
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
                Host Partner Application Approved
              </div>

              <h3 className="text-2xl font-black text-white">Welcome to the Speion Host Network!</h3>

              <div className="rounded-2xl border border-white/10 bg-surface/40 p-4 text-left space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Host Partner ID</span>
                  <span className="font-mono font-bold text-emerald-400">
                    HST-PN-{Math.floor(1000 + Math.random() * 9000)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-2">
                  <span className="text-slate-400">Vehicle Number</span>
                  <span className="font-mono font-bold text-white">{vehicleNumber}</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-2">
                  <span className="text-slate-400">Payout Schedule</span>
                  <span className="font-bold text-emerald-400">
                    Weekly Direct Deposit (Every Monday)
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                Our Fleet Operations executive will contact <strong>{hostPhone}</strong> to schedule your free doorstep OBD-II device installation and vehicle sanitization handover.
              </p>

              <button
                onClick={onClose}
                className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
