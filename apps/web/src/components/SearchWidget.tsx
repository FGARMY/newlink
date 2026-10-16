'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Clock, Search, ArrowRight, ShieldCheck } from 'lucide-react';

const LOCATIONS_BY_CITY: Record<string, { id: string; name: string }[]> = {
  pune: [
    { id: 'all', name: 'All Locations in Pune' },
    { id: 'loc-pn-airport', name: 'Pune Airport (Lohegaon)' },
    { id: 'loc-pn-baner', name: 'Baner - High Street Hub' },
    { id: 'loc-pn-viman', name: 'Viman Nagar / Phoenix Bay' },
    { id: 'loc-pn-hinjewadi', name: 'Hinjewadi Phase 1 IT Park' },
  ],
  nashik: [
    { id: 'all', name: 'All Locations in Nashik' },
    { id: 'loc-ns-citycentre', name: 'City Centre Mall Hub' },
    { id: 'loc-ns-mumbainaka', name: 'Mumbai Naka Interchange' },
    { id: 'loc-ns-college-rd', name: 'College Road / Thatte Nagar' },
  ],
};

export function SearchWidget({ defaultCity = 'pune' }: { defaultCity?: string }) {
  const router = useRouter();
  const [city, setCity] = useState(defaultCity);
  const [location, setLocation] = useState('all');

  // Default: tomorrow 10:00 AM to 2 days later 10:00 AM
  const tomorrow = new Date(Date.now() + 24 * 3600 * 1000);
  const twoDaysLater = new Date(Date.now() + 72 * 3600 * 1000);

  const formatDateInput = (d: Date) => d.toISOString().split('T')[0];
  const [pickupDate, setPickupDate] = useState(formatDateInput(tomorrow));
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState(formatDateInput(twoDaysLater));
  const [returnTime, setReturnTime] = useState('10:00');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const startDateTime = new Date(`${pickupDate}T${pickupTime}:00`);
    const endDateTime = new Date(`${returnDate}T${returnTime}:00`);

    if (endDateTime.getTime() <= startDateTime.getTime()) {
      setError('Return date & time must be after pick-up date & time');
      return;
    }

    const durationHours = (endDateTime.getTime() - startDateTime.getTime()) / (3600 * 1000);
    if (durationHours < 8) {
      setError('Minimum rental duration is 8 hours');
      return;
    }

    const params = new URLSearchParams({
      city,
      location: location === 'all' ? '' : location,
      start: `${pickupDate}T${pickupTime}`,
      end: `${returnDate}T${returnTime}`,
    });

    router.push(`/cars?${params.toString()}`);
  };

  const availableLocations = LOCATIONS_BY_CITY[city] || [];

  return (
    <div className="w-full max-w-5xl rounded-2xl border border-slate-200/90 bg-white/95 p-4 sm:p-6 shadow-xl backdrop-blur-md">
      {/* City Switcher Tabs */}
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Select City:
          </span>
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200/80">
            <button
              type="button"
              onClick={() => {
                setCity('pune');
                setLocation('all');
              }}
              className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                city === 'pune'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pune
            </button>
            <button
              type="button"
              onClick={() => {
                setCity('nashik');
                setLocation('all');
              }}
              className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                city === 'nashik'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nashik
            </button>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
          <ShieldCheck className="h-4 w-4" />
          <span>Zero security deposit options available</span>
        </div>
      </div>

      {/* Main Search Form */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end">
        {/* Pickup Location */}
        <div className="md:col-span-4 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-amber-600" />
            Pick-up Location
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 shadow-xs focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
          >
            {availableLocations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Pickup Date + Time */}
        <div className="md:col-span-3 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            Pick-up Date & Time
          </label>
          <div className="flex gap-1.5">
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-2/3 rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs font-medium text-slate-900 shadow-xs focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
            />
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-1/3 rounded-xl border border-slate-300 bg-white px-2 py-2 text-xs font-medium text-slate-900 shadow-xs focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
            />
          </div>
        </div>

        {/* Return Date + Time */}
        <div className="md:col-span-3 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            Return Date & Time
          </label>
          <div className="flex gap-1.5">
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-2/3 rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs font-medium text-slate-900 shadow-xs focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
            />
            <input
              type="time"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              className="w-1/3 rounded-xl border border-slate-300 bg-white px-2 py-2 text-xs font-medium text-slate-900 shadow-xs focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 px-4 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition-all cursor-pointer hover:shadow-lg active:scale-98"
          >
            <Search className="h-4 w-4 text-amber-400" />
            <span>Search</span>
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-3 rounded-lg bg-red-50 p-2.5 text-xs font-medium text-red-700 border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
}
