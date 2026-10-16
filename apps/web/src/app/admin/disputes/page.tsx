'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  IndianRupee,
  FileText,
  User,
  Phone,
  Car,
  Filter,
  Check,
  X,
  MessageSquare,
} from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { AdminNav } from '../../../components/AdminNav';

interface DisputeItem {
  id: string;
  bookingReference: string;
  vehicleId: string;
  vehicleModel: string;
  customerName: string;
  customerPhone: string;
  reason: 'FASTAG_MISMATCH' | 'PRE_EXISTING_SCRATCH' | 'FUEL_READING_INCORRECT' | 'CLEANING_FEE_CONTESTED' | 'OTHER';
  claimedRefundPaise: number;
  customerNotes: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'REFUND_APPROVED' | 'REJECTED';
  resolutionNotes?: string;
  approvedRefundPaise?: number;
  createdAt: string;
  resolvedAt?: string;
}

export default function AdminDisputesPage() {
  const [notification, setNotification] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('ALL');
  const [selectedDispute, setSelectedDispute] = useState<DisputeItem | null>(null);

  // Modal resolution form
  const [resolveAction, setResolveAction] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [refundAmountRupees, setRefundAmountRupees] = useState<number>(350);
  const [resolutionNotes, setResolutionNotes] = useState<string>('');

  const [disputes, setDisputes] = useState<DisputeItem[]>([
    {
      id: 'disp-demo-1',
      bookingReference: 'NL-PN-9R2D5X',
      vehicleId: 'veh-carens-pn',
      vehicleModel: 'Kia Carens Prestige',
      customerName: 'Neha Shinde',
      customerPhone: '+91 98220 11994',
      reason: 'FASTAG_MISMATCH',
      claimedRefundPaise: 35000, // ₹350
      customerNotes: 'Khed Shivapur toll plaza scanner double-debited Fastag due to barrier delay. Attached toll SMS screenshot.',
      status: 'OPEN',
      createdAt: 'Yesterday, 07:30 PM',
    },
    {
      id: 'disp-demo-2',
      bookingReference: 'NL-NS-4M8P2W',
      vehicleId: 'veh-scorpio-ns',
      vehicleModel: 'Mahindra Scorpio-N Z8',
      customerName: 'Rohit Deshmukh',
      customerPhone: '+91 97654 32109',
      reason: 'FUEL_READING_INCORRECT',
      claimedRefundPaise: 50000, // ₹500
      customerNotes: 'I refueled at Mumbai Naka HPCL bunk 2km before return. Gauge was at 95%, inspection marked 85%.',
      status: 'REFUND_APPROVED',
      approvedRefundPaise: 50000,
      resolutionNotes: 'Fuel receipt verified with timestamp. Secondary refund of ₹500 credited via UPI.',
      createdAt: '3 days ago',
      resolvedAt: '2 days ago',
    },
    {
      id: 'disp-demo-3',
      bookingReference: 'NL-PN-2B8V4K',
      vehicleId: 'veh-xuv700-pn',
      vehicleModel: 'Mahindra XUV700 AX7',
      customerName: 'Vikram Mehta',
      customerPhone: '+91 99887 76655',
      reason: 'PRE_EXISTING_SCRATCH',
      claimedRefundPaise: 100000, // ₹1,000
      customerNotes: 'Bumper scratch was already present during pickup at Pune Airport station.',
      status: 'REJECTED',
      approvedRefundPaise: 0,
      resolutionNotes: 'Starting handover high-res photos inspected; rear bumper was pristine at dispatch time.',
      createdAt: '5 days ago',
      resolvedAt: '4 days ago',
    },
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenResolveModal = (disp: DisputeItem) => {
    setSelectedDispute(disp);
    setResolveAction('APPROVE');
    setRefundAmountRupees(disp.claimedRefundPaise / 100);
    setResolutionNotes('');
  };

  const handleConfirmResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute) return;

    const approvedPaise = resolveAction === 'APPROVE' ? refundAmountRupees * 100 : 0;
    const finalNotes =
      resolutionNotes ||
      (resolveAction === 'APPROVE'
        ? 'Approved adjustment following operations review.'
        : 'Reviewed evidence; original deduction confirmed accurate.');

    const updated = disputes.map((d) => {
      if (d.id === selectedDispute.id) {
        return {
          ...d,
          status: resolveAction === 'APPROVE' ? ('REFUND_APPROVED' as const) : ('REJECTED' as const),
          approvedRefundPaise: approvedPaise,
          resolutionNotes: finalNotes,
          resolvedAt: 'Just now',
        };
      }
      return d;
    });

    setDisputes(updated);
    setSelectedDispute(null);
    showToast(
      resolveAction === 'APPROVE'
        ? `✓ Approved ₹${refundAmountRupees} refund adjustment for ${selectedDispute.customerName}`
        : `✓ Dispute marked as REJECTED for ${selectedDispute.customerName}`,
    );
  };

  const filtered = disputes.filter((d) => {
    if (filter === 'ALL') return true;
    return d.status === filter;
  });

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
              <ShieldAlert className="h-4 w-4" />
              <span>Escrow & Claims Resolution Desk</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
              Deposit Disputes & Deductions
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Customer claims on Fastag toll mismatches, fuel readings, and damage assessments with full audit trail.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6">
          <AdminNav />
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-5 backdrop-blur-xs">
            <span className="text-xs font-semibold text-slate-400">Total Disputes</span>
            <div className="mt-2 text-2xl font-black text-white">{disputes.length}</div>
            <span className="text-xs text-slate-500 mt-1 block">Lifetime raised claims</span>
          </div>

          <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5 backdrop-blur-xs">
            <span className="text-xs font-semibold text-amber-400">Open & Under Review</span>
            <div className="mt-2 text-2xl font-black text-amber-400">
              {disputes.filter((d) => d.status === 'OPEN').length}
            </div>
            <span className="text-xs text-amber-400/80 mt-1 block">Awaiting ops decision</span>
          </div>

          <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5 backdrop-blur-xs">
            <span className="text-xs font-semibold text-emerald-400">Refunds Re-Issued</span>
            <div className="mt-2 text-2xl font-black text-emerald-400">
              ₹
              {(
                disputes
                  .filter((d) => d.status === 'REFUND_APPROVED')
                  .reduce((sum, d) => sum + (d.approvedRefundPaise ?? 0), 0) / 100
              ).toLocaleString('en-IN')}
            </div>
            <span className="text-xs text-emerald-400/80 mt-1 block">Settled back to customers</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-5 backdrop-blur-xs">
            <span className="text-xs font-semibold text-slate-400">Avg Resolution SLA</span>
            <div className="mt-2 text-2xl font-black text-white">2.4 Hrs</div>
            <span className="text-xs text-slate-500 mt-1 block">100% within 24h target</span>
          </div>
        </div>

        {/* Dispute Claims Queue */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6 backdrop-blur-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                <span>Claims Queue & Counter-Evidence</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Review customer explanations, check toll transaction logs, and issue adjusted refunds.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
              {['ALL', 'OPEN', 'REFUND_APPROVED', 'REJECTED'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    filter === f
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-800/80 mt-2">
            {filtered.map((disp) => (
              <div key={disp.id} className="py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {disp.bookingReference}
                    </span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="font-semibold text-white text-sm">
                      {disp.vehicleModel}
                    </span>
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-300 font-medium">
                      {disp.reason.replace(/_/g, ' ')}
                    </span>
                    {disp.status === 'OPEN' && (
                      <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-400 animate-pulse">
                        OPEN REVIEW
                      </span>
                    )}
                    {disp.status === 'REFUND_APPROVED' && (
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                        REFUND APPROVED (₹{(disp.approvedRefundPaise ?? 0) / 100})
                      </span>
                    )}
                    {disp.status === 'REJECTED' && (
                      <span className="rounded-full bg-slate-700 px-2.5 py-0.5 text-xs font-bold text-slate-300">
                        CLAIM REJECTED
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-4">
                    <span className="flex items-center gap-1 text-slate-300">
                      <User className="h-3.5 w-3.5" />
                      {disp.customerName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {disp.customerPhone}
                    </span>
                    <span>Raised: {disp.createdAt}</span>
                  </div>

                  <div className="rounded-xl bg-slate-900/80 border border-slate-800/80 p-3 text-xs text-slate-300">
                    <span className="font-bold text-amber-400 block mb-1">Customer Claim Notes:</span>
                    "{disp.customerNotes}"
                  </div>

                  {disp.resolutionNotes && (
                    <div className="text-xs text-emerald-400/90 pl-3 border-l-2 border-emerald-500">
                      <strong>Ops Resolution:</strong> {disp.resolutionNotes}
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col items-end justify-between md:justify-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Claimed Amount</span>
                    <span className="text-xl font-black text-white">
                      ₹{(disp.claimedRefundPaise / 100).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {disp.status === 'OPEN' ? (
                    <button
                      onClick={() => handleOpenResolveModal(disp)}
                      className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-md transition-all cursor-pointer"
                    >
                      Resolve Claim
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500 font-semibold">
                      Resolved {disp.resolvedAt}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Resolve Dispute */}
        {selectedDispute && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white">Resolve Deposit Dispute</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedDispute.bookingReference} • {selectedDispute.customerName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDispute(null)}
                  className="rounded-lg p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleConfirmResolution} className="space-y-5 mt-5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-2">
                    Action Decision
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setResolveAction('APPROVE')}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        resolveAction === 'APPROVE'
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                          : 'bg-slate-800 border border-slate-700 text-slate-400'
                      }`}
                    >
                      ✓ Approve Refund Adjustment
                    </button>
                    <button
                      type="button"
                      onClick={() => setResolveAction('REJECT')}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        resolveAction === 'REJECT'
                          ? 'bg-rose-500 text-white font-black shadow-lg shadow-rose-500/20'
                          : 'bg-slate-800 border border-slate-700 text-slate-400'
                      }`}
                    >
                      ✕ Maintain Deduction (Reject)
                    </button>
                  </div>
                </div>

                {resolveAction === 'APPROVE' && (
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Approved Refund Amount (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={selectedDispute.claimedRefundPaise / 100}
                      value={refundAmountRupees}
                      onChange={(e) => setRefundAmountRupees(Number(e.target.value))}
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-hidden focus:border-amber-500"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Max claim allowed: ₹{(selectedDispute.claimedRefundPaise / 100).toLocaleString('en-IN')}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Internal Resolution Notes & Customer Audit Trail
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="e.g. Verified FASTAG transaction log, duplicate toll reversed via UPI."
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-xs text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedDispute(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-md cursor-pointer"
                  >
                    Confirm Resolution
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
