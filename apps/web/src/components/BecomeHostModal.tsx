'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  KeyRound,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Car,
  FileCheck2,
  Building,
  CreditCard,
  Lock,
  ArrowRight,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface BecomeHostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CAR_EARNING_PRESETS = [
  { id: 'creta', name: 'Hyundai Creta', category: 'SUV', dailyHostShare: 2400 },
  { id: 'thar', name: 'Mahindra Thar 4x4', category: 'LUXURY', dailyHostShare: 2800 },
  { id: 'innova', name: 'Toyota Innova Crysta', category: 'PREMIUM', dailyHostShare: 3200 },
  { id: 'swift', name: 'Maruti Suzuki Swift', category: 'HATCHBACK', dailyHostShare: 1400 },
  { id: 'xuv700', name: 'Mahindra XUV700', category: 'PREMIUM', dailyHostShare: 3000 },
];

export function BecomeHostModal({ isOpen, onClose }: BecomeHostModalProps) {
  const [selectedCarId, setSelectedCarId] = useState('creta');
  const [sharingDays, setSharingDays] = useState(18); // Default 18 days/month

  // Registration step
  const [regStep, setRegStep] = useState<'CALCULATOR' | 'RC_VERIFY' | 'BANK_DETAILS' | 'CONFIRMED'>('CALCULATOR');

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

  const currentPreset = CAR_EARNING_PRESETS.find((c) => c.id === selectedCarId) || CAR_EARNING_PRESETS[0];
  const monthlyEarnings = currentPreset.dailyHostShare * sharingDays;
  const annualEarnings = monthlyEarnings * 12;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in text-white">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-surface/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 font-bold">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Speion Host Partner Network
                <span className="rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold">
                  Pune &amp; Nashik
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Monetize your idle car with ₹10 Lakh insurance &amp; verified guests
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
          {/* STEP 1: CALCULATOR */}
          {regStep === 'CALCULATOR' && (
            <div className="space-y-6">
              {/* Earnings Calculator Card */}
              <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-card to-card p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4" />
                    Host Earnings Estimator
                  </span>
                  <span className="text-xs text-slate-400">Weekly Direct Bank Payouts</span>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/5 pb-4">
                  <div>
                    <span className="text-xs text-slate-400">Estimated Monthly Income</span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-white mt-0.5">
                      ₹{monthlyEarnings.toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-slate-400 ml-1.5">/month</span>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-xs text-slate-400">Annual Earning Potential</span>
                    <div className="text-lg font-bold text-emerald-400">
                      ₹{annualEarnings.toLocaleString('en-IN')}/year
                    </div>
                  </div>
                </div>

                {/* Car Selector */}
                <div className="mt-5">
                  <label className="text-xs font-bold text-slate-300 block mb-2">
                    Select Your Car Model
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CAR_EARNING_PRESETS.map((car) => (
                      <button
                        key={car.id}
                        type="button"
                        onClick={() => setSelectedCarId(car.id)}
                        className={`rounded-xl p-2.5 text-xs text-left transition-all border cursor-pointer ${
                          selectedCarId === car.id
                            ? 'border-emerald-500 bg-emerald-500/15 text-white font-bold shadow-xs'
                            : 'border-white/5 bg-surface/50 text-slate-300 hover:border-white/15'
                        }`}
                      >
                        <div className="truncate">{car.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                          ~₹{car.dailyHostShare}/day share
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Days/Month Slider */}
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                    <span>How many days per month will you share?</span>
                    <span className="text-emerald-400 font-extrabold text-sm">{sharingDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="25"
                    step="1"
                    value={sharingDays}
                    onChange={(e) => setSharingDays(Number(e.target.value))}
                    className="mt-2 w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>10 Days (Weekend side-income)</span>
                    <span>18 Days (Recommended)</span>
                    <span>25 Days (Full Fleet Hosting)</span>
                  </div>
                </div>
              </div>

              {/* Three Trust Safeguards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded-2xl border border-white/5 bg-surface/40 p-4">
                  <ShieldCheck className="h-5 w-5 text-emerald-400 mb-2" />
                  <div className="font-bold text-white">₹10 Lakh Host Cover</div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Accidental damage, total loss, and third-party liabilities covered by insurer.
                  </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-surface/40 p-4">
                  <Lock className="h-5 w-5 text-blue-400 mb-2" />
                  <div className="font-bold text-white">Free GPS Security Device</div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Complimentary tamper-proof OBD-II GPS tracking &amp; speed monitoring installed.
                  </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-surface/40 p-4">
                  <FileCheck2 className="h-5 w-5 text-teal-400 mb-2" />
                  <div className="font-bold text-white">DigiLocker KYC Guests</div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Only guests with verified Driving License &amp; Aadhaar can unlock your vehicle.
                  </div>
                </div>
              </div>

              {/* Start Onboarding CTA */}
              <button
                type="button"
                onClick={() => setRegStep('RC_VERIFY')}
                className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-500 py-3.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed to 2-Step Host Registration</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 2: DIGILOCKER RC VERIFICATION */}
          {regStep === 'RC_VERIFY' && (
            <form onSubmit={handleVerifyDigiLockerRc} className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    Step 1 of 2
                  </span>
                  <h4 className="text-base font-bold text-white">Vehicle RC Verification</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setRegStep('CALCULATOR')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Back to Calculator
                </button>
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
                  <span className="text-slate-400">Expected Monthly Share</span>
                  <span className="font-bold text-emerald-400">
                    ₹{monthlyEarnings.toLocaleString('en-IN')}/month
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
