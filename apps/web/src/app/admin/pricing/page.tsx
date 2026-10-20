'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap,
  Tag,
  Plus,
  Percent,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  IndianRupee,
  Copy,
  Check,
  Calculator,
} from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { AdminNav } from '../../../components/AdminNav';

interface PriceRule {
  id: string;
  name: string;
  kind: 'SEASON' | 'HOLIDAY' | 'PROMO';
  startDate: string;
  endDate: string;
  mode: 'MULTIPLIER' | 'OVERRIDE_DAILY';
  value: number; // e.g. 11500 = 1.15x
  priority: number;
  cityId?: string;
  isActive: boolean;
}

interface CouponItem {
  id: string;
  code: string;
  type: 'PERCENT' | 'FIXED';
  value: number;
  description: string;
  maxDiscountPaise?: number;
  minBookingAmountPaise?: number;
  validFrom: string;
  validTo: string;
  totalUsageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export default function AdminPricingPage() {
  const [notification, setNotification] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Dynamic Rules State
  const [rules, setRules] = useState<PriceRule[]>([
    {
      id: 'adj-weekend-surge',
      name: 'Weekend Peak Demand Surge',
      kind: 'SEASON',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      mode: 'MULTIPLIER',
      value: 11500, // 1.15x
      priority: 1,
      isActive: true,
    },
    {
      id: 'adj-diwali-surge',
      name: 'Diwali & Festive Season Surge',
      kind: 'HOLIDAY',
      startDate: '2026-10-15',
      endDate: '2026-11-15',
      mode: 'MULTIPLIER',
      value: 12500, // 1.25x
      priority: 2,
      isActive: true,
    },
    {
      id: 'adj-nashik-wine-season',
      name: 'Nashik Wine Tour Harvest Multiplier',
      kind: 'SEASON',
      startDate: '2026-08-01',
      endDate: '2026-12-31',
      mode: 'MULTIPLIER',
      value: 12000, // 1.20x
      priority: 2,
      cityId: 'city-nashik',
      isActive: true,
    },
  ]);

  // Coupons State
  const [coupons, setCoupons] = useState<CouponItem[]>([
    {
      id: 'coup-firstdrive',
      code: 'FIRSTDRIVE',
      type: 'PERCENT',
      value: 1500, // 15%
      description: 'Flat 15% off on first self-drive booking',
      maxDiscountPaise: 150000,
      minBookingAmountPaise: 300000,
      validFrom: '2026-01-01',
      validTo: '2027-01-01',
      totalUsageLimit: 1000,
      usedCount: 42,
      isActive: true,
    },
    {
      id: 'coup-pune10',
      code: 'PUNE10',
      type: 'PERCENT',
      value: 1000, // 10%
      description: 'Exclusive 10% off for all Pune city bookings',
      maxDiscountPaise: 100000,
      minBookingAmountPaise: 250000,
      validFrom: '2026-01-01',
      validTo: '2027-01-01',
      totalUsageLimit: 500,
      usedCount: 88,
      isActive: true,
    },
    {
      id: 'coup-wineweekend',
      code: 'WINEWEEKEND',
      type: 'FIXED',
      value: 50000, // ₹500
      description: 'Flat ₹500 off on Nashik vineyard weekend drive',
      minBookingAmountPaise: 400000,
      validFrom: '2026-01-01',
      validTo: '2027-01-01',
      totalUsageLimit: 300,
      usedCount: 19,
      isActive: true,
    },
    {
      id: 'coup-monsoon20',
      code: 'MONSOON20',
      type: 'PERCENT',
      value: 2000, // 20%
      description: 'Sahyadri Ghats monsoon road trip special',
      maxDiscountPaise: 200000,
      minBookingAmountPaise: 500000,
      validFrom: '2026-06-01',
      validTo: '2026-10-31',
      totalUsageLimit: 250,
      usedCount: 64,
      isActive: true,
    },
  ]);

  // Modals
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  // New Rule Form
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleKind, setNewRuleKind] = useState<'SEASON' | 'HOLIDAY' | 'PROMO'>('SEASON');
  const [newRuleMultiplierPercent, setNewRuleMultiplierPercent] = useState('15');
  const [newRuleStartDate, setNewRuleStartDate] = useState('2026-11-01');
  const [newRuleEndDate, setNewRuleEndDate] = useState('2026-11-30');
  const [newRuleCity, setNewRuleCity] = useState('ALL');

  // New Coupon Form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'PERCENT' | 'FIXED'>('PERCENT');
  const [newCouponVal, setNewCouponVal] = useState('10');
  const [newCouponMaxDisc, setNewCouponMaxDisc] = useState('1000');
  const [newCouponMinBooking, setNewCouponMinBooking] = useState('2500');
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Simulator State
  const [simCarRate, setSimCarRate] = useState<number>(2400); // Hyundai Creta ₹2,400/day
  const [simCarName, setSimCarName] = useState('Hyundai Creta Turbo');
  const [simDays, setSimDays] = useState<number>(2);
  const [simCouponCode, setSimCouponCode] = useState<string>('PUNE10');
  const [simIsWeekend, setSimIsWeekend] = useState<boolean>(true);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`✓ Copied coupon code "${code}" to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = !r.isActive;
          showToast(`Rule "${r.name}" is now ${updated ? 'ACTIVE' : 'INACTIVE'}`);
          return { ...r, isActive: updated };
        }
        return r;
      }),
    );
  };

  const toggleCoupon = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = !c.isActive;
          showToast(`Coupon "${c.code}" is now ${updated ? 'ACTIVE' : 'INACTIVE'}`);
          return { ...c, isActive: updated };
        }
        return c;
      }),
    );
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    const multiplierBps = Math.round((1 + Number(newRuleMultiplierPercent) / 100) * 10000);
    const newRule: PriceRule = {
      id: `adj-${Date.now().toString(36)}`,
      name: newRuleName,
      kind: newRuleKind,
      startDate: newRuleStartDate,
      endDate: newRuleEndDate,
      mode: 'MULTIPLIER',
      value: multiplierBps,
      priority: 2,
      cityId: newRuleCity === 'ALL' ? undefined : newRuleCity,
      isActive: true,
    };
    setRules([newRule, ...rules]);
    setIsRuleModalOpen(false);
    setNewRuleName('');
    showToast(`✓ Created dynamic surge rule "${newRule.name}"`);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = newCouponCode.trim().toUpperCase();
    if (!code) return;

    const valueNum =
      newCouponType === 'PERCENT'
        ? Math.round(Number(newCouponVal) * 100) // 10% -> 1000 bps
        : Math.round(Number(newCouponVal) * 100); // ₹500 -> 50,000 paise

    const newCoup: CouponItem = {
      id: `coup-${Date.now().toString(36)}`,
      code,
      type: newCouponType,
      value: valueNum,
      description: newCouponDesc || `Promo discount code ${code}`,
      maxDiscountPaise: newCouponMaxDisc ? Number(newCouponMaxDisc) * 100 : undefined,
      minBookingAmountPaise: newCouponMinBooking ? Number(newCouponMinBooking) * 100 : undefined,
      validFrom: '2026-01-01',
      validTo: '2027-01-01',
      totalUsageLimit: 500,
      usedCount: 0,
      isActive: true,
    };

    setCoupons([newCoup, ...coupons]);
    setIsCouponModalOpen(false);
    setNewCouponCode('');
    setNewCouponDesc('');
    showToast(`✓ Published new coupon promo code "${code}"`);
  };

  // Simulator Calculations
  const baseRental = simCarRate * simDays;
  let activeSurgePercent = 0;
  if (simIsWeekend) {
    const weekendRule = rules.find((r) => r.id === 'adj-weekend-surge' && r.isActive);
    if (weekendRule) {
      activeSurgePercent = 15;
    }
  }

  const surgeAmount = Math.round((baseRental * activeSurgePercent) / 100);
  const rentalWithSurge = baseRental + surgeAmount;

  // Coupon discount in simulator
  let simDiscount = 0;
  const appliedCoupon = coupons.find(
    (c) => c.code === simCouponCode.trim().toUpperCase() && c.isActive,
  );

  if (appliedCoupon) {
    const minRequired = (appliedCoupon.minBookingAmountPaise ?? 0) / 100;
    if (rentalWithSurge >= minRequired) {
      if (appliedCoupon.type === 'PERCENT') {
        const rawDisc = Math.round((rentalWithSurge * (appliedCoupon.value / 100)) / 100);
        const maxCap = appliedCoupon.maxDiscountPaise
          ? appliedCoupon.maxDiscountPaise / 100
          : 999999;
        simDiscount = Math.min(rawDisc, maxCap);
      } else {
        simDiscount = Math.min(appliedCoupon.value / 100, rentalWithSurge);
      }
    }
  }

  const taxableValue = Math.max(0, rentalWithSurge - simDiscount);
  const gstTax = Math.round(taxableValue * 0.18);
  const securityDeposit = 5000;
  const totalPayable = taxableValue + gstTax + securityDeposit;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <Navbar />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-3 font-semibold text-slate-950 shadow-2xl transition-all">
          <CheckCircle2 className="h-5 w-5" />
          <span>{notification}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Zap className="h-4 w-4" />
              <span>Yield & Promotion Management</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
              Dynamic Pricing & Promotions
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Automated weekend demand multipliers, seasonal surge calendars, and promo code
              campaigns.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRuleModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4 text-amber-400" />
              <span>Add Surge Rule</span>
            </button>
            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all cursor-pointer"
            >
              <Tag className="h-4 w-4" />
              <span>Create Coupon</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6">
          <AdminNav />
        </div>

        {/* Main Grid: Rules & Coupons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Dynamic Surge Multipliers */}
          <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6 backdrop-blur-xs flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white">Demand Surge & Holiday Multipliers</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {rules.filter((r) => r.isActive).length} Active Rules
              </span>
            </div>

            <div className="divide-y divide-slate-800/70 mt-4 flex-1">
              {rules.map((rule) => {
                const multiplier = (rule.value / 10000).toFixed(2);
                const percentBonus = Math.round((rule.value / 10000 - 1) * 100);

                return (
                  <div key={rule.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{rule.name}</span>
                        {rule.cityId && (
                          <span className="rounded-md bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-400">
                            Nashik Only
                          </span>
                        )}
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            rule.kind === 'HOLIDAY'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {rule.kind}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-3">
                        <span>
                          Dates: {rule.startDate} to {rule.endDate}
                        </span>
                        <span>•</span>
                        <span className="text-amber-400 font-bold">
                          {multiplier}x (+{percentBonus}%)
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        rule.isActive
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
                          : 'bg-slate-800 border border-slate-700 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {rule.isActive ? 'ACTIVE' : 'DISABLED'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Promotional Coupons */}
          <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6 backdrop-blur-xs flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white">Active Promotional Coupons</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {coupons.filter((c) => c.isActive).length} Coupons Live
              </span>
            </div>

            <div className="divide-y divide-slate-800/70 mt-4 flex-1">
              {coupons.map((c) => (
                <div key={c.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-amber-400 text-sm tracking-wider bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
                        {c.code}
                      </span>
                      <button
                        onClick={() => handleCopyCode(c.code)}
                        className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                        title="Copy code"
                      >
                        {copiedCode === c.code ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <span className="text-xs font-semibold text-slate-300">
                        {c.type === 'PERCENT' ? `${c.value / 100}% OFF` : `₹${c.value / 100} FLAT`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{c.description}</p>
                    <div className="text-[11px] text-slate-500 flex items-center gap-3">
                      <span>Min: ₹{(c.minBookingAmountPaise ?? 0) / 100}</span>
                      {c.maxDiscountPaise && <span>• Max cap: ₹{c.maxDiscountPaise / 100}</span>}
                      <span>• Used: {c.usedCount} times</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleCoupon(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      c.isActive
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
                        : 'bg-slate-800 border border-slate-700 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {c.isActive ? 'ACTIVE' : 'PAUSED'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Dynamic Pricing & Promo Simulator */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6 backdrop-blur-xs">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Calculator className="h-5 w-5 text-amber-400" />
                <span>Interactive Quote Simulator (PRD Transparent Billing)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Preview exact price calculation pipeline under current surge multipliers and coupon
                rules.
              </p>
            </div>
            <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400">
              Live Engine Preview
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
            {/* Input Controls */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Select Vehicle Model
                </label>
                <select
                  value={simCarRate}
                  onChange={(e) => {
                    const rate = Number(e.target.value);
                    setSimCarRate(rate);
                    if (rate === 2400) setSimCarName('Hyundai Creta Turbo');
                    if (rate === 2800) setSimCarName('Kia Carens Prestige');
                    if (rate === 3800) setSimCarName('Mahindra XUV700 AX7');
                    if (rate === 1600) setSimCarName('Maruti Dzire ZXi');
                    if (rate === 3000) setSimCarName('Mahindra Scorpio-N');
                  }}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-hidden focus:border-amber-500"
                >
                  <option value={2400}>Hyundai Creta Turbo (₹2,400/day)</option>
                  <option value={2800}>Kia Carens Prestige (₹2,800/day)</option>
                  <option value={3800}>Mahindra XUV700 AX7 (₹3,800/day)</option>
                  <option value={1600}>Maruti Dzire ZXi (₹1,600/day)</option>
                  <option value={3000}>Mahindra Scorpio-N (₹3,000/day)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Rental Duration (Days)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 5].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSimDays(d)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        simDays === d
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      {d} Day{d > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Weekend Surge Applied?
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSimIsWeekend(true)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      simIsWeekend
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                        : 'bg-slate-900 border border-slate-700 text-slate-400'
                    }`}
                  >
                    Yes (Weekend Surge +15%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimIsWeekend(false)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      !simIsWeekend
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                        : 'bg-slate-900 border border-slate-700 text-slate-400'
                    }`}
                  >
                    No (Standard Weekday)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Test Promo / Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={simCouponCode}
                    onChange={(e) => setSimCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. PUNE10, FIRSTDRIVE"
                    className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm font-mono uppercase text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                {appliedCoupon ? (
                  <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 inline" />
                    Valid code: {appliedCoupon.description}
                  </p>
                ) : simCouponCode ? (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <XCircle className="h-3 w-3 inline" />
                    Coupon code not recognized or inactive
                  </p>
                ) : null}
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                Itemized Billing Breakdown
              </h3>

              <div className="flex justify-between text-xs text-slate-300">
                <span>
                  Base Rental ({simDays} days @ ₹{simCarRate}/day)
                </span>
                <span className="font-semibold">₹{baseRental.toLocaleString('en-IN')}</span>
              </div>

              {surgeAmount > 0 && (
                <div className="flex justify-between text-xs text-amber-400">
                  <span>Weekend Surge (+15%)</span>
                  <span className="font-semibold">+₹{surgeAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {simDiscount > 0 && (
                <div className="flex justify-between text-xs text-emerald-400">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span className="font-semibold">-₹{simDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-300">
                <span>Taxable Value</span>
                <span className="font-semibold">₹{taxableValue.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-xs text-slate-400">
                <span>GST (18% on Taxable Value)</span>
                <span>+₹{gstTax.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-xs text-slate-400">
                <span>Refundable Security Deposit</span>
                <span>+₹{securityDeposit.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Total Payable Summary Card */}
            <div className="rounded-xl bg-gradient-to-br from-amber-500/10 via-slate-800 to-slate-900 border border-amber-500/20 p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  Simulated Customer Payable
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">
                    ₹{totalPayable.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Includes ₹{taxableValue + gstTax} net rental charge + ₹5,000 refundable security
                  deposit.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>100% Transparent Price Match</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>Instant coupon validation logic verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Add Surge Rule */}
        {isRuleModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Add Dynamic Surge Rule</h3>
              <form onSubmit={handleCreateRule} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Rule Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    placeholder="e.g. New Year Eve Rush"
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Kind</label>
                    <select
                      value={newRuleKind}
                      onChange={(e: any) => setNewRuleKind(e.target.value)}
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white"
                    >
                      <option value="SEASON">Season</option>
                      <option value="HOLIDAY">Holiday</option>
                      <option value="PROMO">Promo</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Surge Percentage (%)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      value={newRuleMultiplierPercent}
                      onChange={(e) => setNewRuleMultiplierPercent(e.target.value)}
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newRuleStartDate}
                      onChange={(e) => setNewRuleStartDate(e.target.value)}
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newRuleEndDate}
                      onChange={(e) => setNewRuleEndDate(e.target.value)}
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsRuleModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-sm font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all"
                  >
                    Save Rule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Create Coupon */}
        {isCouponModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Create Promo Coupon</h3>
              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SUMMER25"
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm font-mono uppercase text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Discount Type
                    </label>
                    <select
                      value={newCouponType}
                      onChange={(e: any) => setNewCouponType(e.target.value)}
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white"
                    >
                      <option value="PERCENT">Percentage (%)</option>
                      <option value="FIXED">Flat (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Value {newCouponType === 'PERCENT' ? '(%)' : '(₹)'}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newCouponVal}
                      onChange={(e) => setNewCouponVal(e.target.value)}
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Max Discount (₹)
                    </label>
                    <input
                      type="number"
                      value={newCouponMaxDisc}
                      onChange={(e) => setNewCouponMaxDisc(e.target.value)}
                      placeholder="e.g. 1000"
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Min Booking (₹)
                    </label>
                    <input
                      type="number"
                      value={newCouponMinBooking}
                      onChange={(e) => setNewCouponMinBooking(e.target.value)}
                      placeholder="e.g. 2500"
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Public Description
                  </label>
                  <input
                    type="text"
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                    placeholder="e.g. Flat 15% off up to ₹1,000 on luxury rentals"
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCouponModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-sm font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all"
                  >
                    Publish Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
