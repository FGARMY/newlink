'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Users, Fuel, Gauge, MapPin, Shield } from 'lucide-react';
import type { VehicleCard as VehicleCardType } from '@newlink/contracts';

interface VehicleCardProps {
  vehicle: VehicleCardType;
  searchParams?: string;
}

export function VehicleCard({ vehicle, searchParams }: VehicleCardProps) {
  const dailyPriceRupees = Math.round(vehicle.dailyRatePaise / 100);
  const depositRupees = Math.round(vehicle.securityDepositPaise / 100);

  const detailUrl = searchParams
    ? `/cars/${vehicle.id}?${searchParams}`
    : `/cars/${vehicle.id}`;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
      {/* Image & Badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <Image
          src={vehicle.primaryImageUrl}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-xs">
          <span>{vehicle.category}</span>
        </div>

        {/* Rating Pill */}
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-900 shadow-xs backdrop-blur-xs">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span>{vehicle.ratingAvg.toFixed(1)}</span>
          <span className="text-slate-400 font-normal">({vehicle.ratingCount})</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title & City */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              {vehicle.brand}
            </span>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
              {vehicle.model}
              {vehicle.variant && (
                <span className="ml-1.5 text-xs font-medium text-slate-600">
                  {vehicle.variant}
                </span>
              )}
            </h3>
          </div>
        </div>

        {/* Location */}
        <div className="mt-2 flex items-center gap-1 text-xs text-slate-600">
          <MapPin className="h-3.5 w-3.5 text-amber-600 shrink-0" />
          <span className="truncate">{vehicle.locationName}</span>
        </div>

        {/* Vehicle Specs Bar */}
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-2.5 text-center text-xs text-slate-700 border border-slate-100">
          <div className="flex flex-col items-center justify-center gap-1">
            <Gauge className="h-3.5 w-3.5 text-slate-600" />
            <span className="font-semibold capitalize text-[11px]">{vehicle.transmission.toLowerCase()}</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 border-x border-slate-200/60">
            <Fuel className="h-3.5 w-3.5 text-slate-600" />
            <span className="font-semibold capitalize text-[11px]">{vehicle.fuel.toLowerCase()}</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <Users className="h-3.5 w-3.5 text-slate-600" />
            <span className="font-semibold text-[11px]">{vehicle.seats} Seats</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-600">Starting from</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900">
                ₹{dailyPriceRupees.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-600 font-medium">/day</span>
            </div>
            <div className="text-[10px] text-slate-600 flex items-center gap-1 mt-0.5">
              <Shield className="h-3 w-3 text-emerald-800" />
              Deposit: ₹{depositRupees.toLocaleString('en-IN')}
            </div>
          </div>

          <Link
            href={detailUrl}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-600 transition-colors"
          >
            View Car
          </Link>
        </div>
      </div>
    </div>
  );
}
