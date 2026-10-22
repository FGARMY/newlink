'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  Check,
  Fuel,
  Users,
  Gauge,
  Shield,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import type { VehicleCard as VehicleCardType } from '@newlink/contracts';

interface CompareVehiclesModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: VehicleCardType[];
  onRemoveVehicle: (id: string) => void;
  searchParams?: string;
}

export function CompareVehiclesModal({
  isOpen,
  onClose,
  vehicles,
  onRemoveVehicle,
  searchParams = '',
}: CompareVehiclesModalProps) {
  if (!isOpen || vehicles.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl bg-card border border-white/10 shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-surface/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Vehicle Side-by-Side Comparison
                <span className="rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold">
                  {vehicles.length} of 3 Selected
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Compare specs, comfort, seating, and daily rates to choose the right drive
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

        {/* Comparison Matrix (Table / Grid) */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-6">
          <div className="min-w-[650px] grid grid-cols-4 gap-4">
            {/* Row 0: Labels column */}
            <div className="space-y-6 pt-36 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <div className="h-9 flex items-center border-b border-white/5 pb-2">Daily Rate</div>
              <div className="h-9 flex items-center border-b border-white/5 pb-2">Refundable Deposit</div>
              <div className="h-9 flex items-center border-b border-white/5 pb-2">Seating &amp; Space</div>
              <div className="h-9 flex items-center border-b border-white/5 pb-2">Transmission</div>
              <div className="h-9 flex items-center border-b border-white/5 pb-2">Fuel Engine</div>
              <div className="h-9 flex items-center border-b border-white/5 pb-2">Category</div>
              <div className="h-20 flex items-center border-b border-white/5 pb-2">Key Features</div>
              <div className="h-10 flex items-center pt-2">Action</div>
            </div>

            {/* Vehicle Columns */}
            {vehicles.map((v) => {
              const dailyRate = Math.round(v.dailyRatePaise / 100);
              const deposit = Math.round(v.securityDepositPaise / 100);
              const bookUrl = searchParams ? `/cars/${v.id}?${searchParams}` : `/cars/${v.id}`;

              return (
                <div
                  key={v.id}
                  className="rounded-2xl border border-white/10 bg-surface/30 p-4 flex flex-col relative space-y-6"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveVehicle(v.id)}
                    className="absolute top-2 right-2 rounded-full bg-black/60 hover:bg-rose-500/80 p-1 text-slate-300 hover:text-white transition-colors z-10"
                    title="Remove from comparison"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  {/* Vehicle Card Header */}
                  <div className="h-28">
                    <div className="relative h-16 w-full rounded-xl overflow-hidden bg-surface">
                      <Image
                        src={v.primaryImageUrl}
                        alt={v.model}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-2">
                      <span className="text-[10px] font-bold uppercase text-blue-400">
                        {v.brand}
                      </span>
                      <h4 className="text-sm font-bold text-white truncate">{v.model}</h4>
                    </div>
                  </div>

                  {/* Daily Rate */}
                  <div className="h-9 flex items-center border-b border-white/5 pb-2">
                    <span className="text-base font-extrabold text-white">
                      ₹{dailyRate.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">/day</span>
                  </div>

                  {/* Security Deposit */}
                  <div className="h-9 flex items-center border-b border-white/5 pb-2 text-xs font-semibold text-slate-300">
                    ₹{deposit.toLocaleString('en-IN')}
                  </div>

                  {/* Seats */}
                  <div className="h-9 flex items-center gap-1.5 border-b border-white/5 pb-2 text-xs font-semibold text-slate-200">
                    <Users className="h-3.5 w-3.5 text-blue-400" />
                    <span>{v.seats} Seats</span>
                  </div>

                  {/* Transmission */}
                  <div className="h-9 flex items-center gap-1.5 border-b border-white/5 pb-2 text-xs font-semibold text-slate-200">
                    <Gauge className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{v.transmission}</span>
                  </div>

                  {/* Fuel */}
                  <div className="h-9 flex items-center gap-1.5 border-b border-white/5 pb-2 text-xs font-semibold text-slate-200">
                    <Fuel className="h-3.5 w-3.5 text-amber-400" />
                    <span>{v.fuel}</span>
                  </div>

                  {/* Category */}
                  <div className="h-9 flex items-center border-b border-white/5 pb-2 text-xs font-bold text-blue-300">
                    {v.category}
                  </div>

                  {/* Key Features */}
                  <div className="h-20 flex flex-col justify-center border-b border-white/5 pb-2 text-[11px] text-slate-300 space-y-1">
                    {v.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center gap-1 truncate">
                        <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="h-10 flex items-center pt-2">
                    <Link
                      href={bookUrl}
                      onClick={onClose}
                      className="w-full rounded-xl bg-primary hover:bg-primary-light py-2 text-center text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Book {v.model}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* Empty Slot Placeholder if < 3 */}
            {vehicles.length < 3 && (
              <div className="rounded-2xl border border-dashed border-white/10 bg-surface/10 p-6 flex flex-col items-center justify-center text-center text-slate-400">
                <Sparkles className="h-8 w-8 text-slate-600 mb-2" />
                <span className="text-xs font-bold text-slate-300">Add Another Car</span>
                <span className="text-[11px] text-slate-500 mt-1">
                  Click 'Compare' on any vehicle card to add up to 3 cars
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
