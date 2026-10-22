'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Calendar,
  Clock,
  Search,
  Building,
  Sparkles,
  CheckSquare,
  Square,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

const LOCATIONS_BY_CITY: Record<string, { id: string; name: string; tag?: string }[]> = {
  pune: [
    { id: 'all', name: 'All Locations in Pune' },
    { id: 'loc-pn-airport', name: 'Pune Airport (Lohegaon)', tag: 'Airport Hub' },
    { id: 'loc-pn-baner', name: 'Baner - High Street Hub', tag: 'West Pune' },
    { id: 'loc-pn-viman', name: 'Viman Nagar / Phoenix Bay', tag: 'East Pune' },
    { id: 'loc-pn-hinjewadi', name: 'Hinjewadi Phase 1 IT Park', tag: 'Tech Corridor' },
  ],
  nashik: [
    { id: 'all', name: 'All Locations in Nashik' },
    { id: 'loc-ns-citycentre', name: 'City Centre Mall Hub', tag: 'Downtown' },
    { id: 'loc-ns-mumbainaka', name: 'Mumbai Naka Interchange', tag: 'Highway Junction' },
    { id: 'loc-ns-college-rd', name: 'College Road / Thatte Nagar', tag: 'Central Nashik' },
  ],
};

type ServiceTab = 'daily' | 'subscription' | 'weekday' | 'outstation';

export function SearchWidget({ defaultCity = 'pune' }: { defaultCity?: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ServiceTab>('daily');
  const [city, setCity] = useState(defaultCity);
  const [location, setLocation] = useState('all');
  const [homeDelivery, setHomeDelivery] = useState(true);

  // Defaults: tomorrow 3:00 PM to 2 days later 3:00 PM
  const now = new Date();
  const tomorrow = new Date(Date.now() + 24 * 3600 * 1000);
  const twoDaysLater = new Date(Date.now() + 48 * 3600 * 1000);

  const formatDateInput = (d: Date) => d.toISOString().split('T')[0];
  const [pickupDate, setPickupDate] = useState(formatDateInput(tomorrow));
  const [pickupTime, setPickupTime] = useState('15:00');
  const [returnDate, setReturnDate] = useState(formatDateInput(twoDaysLater));
  const [returnTime, setReturnTime] = useState('15:00');
  const [error, setError] = useState<string | null>(null);

  // Helper to format date display (e.g., "24 Oct'26, 3:00 pm")
  const formatDisplayDateTime = (dateStr: string, timeStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      if (!year || !month || !day) return `${dateStr}, ${timeStr}`;
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = months[parseInt(month, 10) - 1] || month;
      const yrShort = year.slice(-2);

      const [hours, minutes] = timeStr.split(':');
      let h = parseInt(hours, 10);
      const ampm = h >= 12 ? 'pm' : 'am';
      h = h % 12 || 12;

      return `${parseInt(day, 10)} ${monthName}'${yrShort}, ${h}:${minutes} ${ampm}`;
    } catch {
      return `${dateStr}, ${timeStr}`;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const startDateTime = new Date(`${pickupDate}T${pickupTime}:00`);
    const endDateTime = new Date(`${returnDate}T${returnTime}:00`);

    if (endDateTime.getTime() <= startDateTime.getTime()) {
      setError('Trip End must be after Trip Start date & time');
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
      mode: activeTab,
      delivery: homeDelivery ? 'true' : 'false',
    });

    router.push(`/cars?${params.toString()}`);
  };

  const availableLocations = LOCATIONS_BY_CITY[city] || [];
  const selectedLocationName =
    availableLocations.find((l) => l.id === location)?.name || 'Select Location';

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* ===== TOP TABS (Zoomcar Style Embedded Bar) ===== */}
      <div className="flex justify-center -mb-2 relative z-20">
        <div className="inline-flex items-center rounded-2xl bg-white/95 dark:bg-card/95 border border-slate-200 dark:border-white/10 p-1.5 shadow-lg backdrop-blur-md max-w-full overflow-x-auto gap-1">
          {/* Tab 1: Daily Drives */}
          <button
            type="button"
            onClick={() => setActiveTab('daily')}
            className={`flex flex-col items-center justify-center px-5 py-2.5 rounded-xl transition-all text-left cursor-pointer whitespace-nowrap ${
              activeTab === 'daily'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <span className="text-xs sm:text-sm font-bold leading-tight">Daily Drives</span>
            <span
              className={`text-[10px] mt-0.5 leading-tight ${
                activeTab === 'daily' ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-400'
              }`}
            >
              Short trips, upto 7 days
            </span>
          </button>

          {/* Tab 2: Subscription */}
          <button
            type="button"
            onClick={() => setActiveTab('subscription')}
            className={`flex flex-col items-center justify-center px-5 py-2.5 rounded-xl transition-all text-left cursor-pointer whitespace-nowrap ${
              activeTab === 'subscription'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <span className="text-xs sm:text-sm font-bold leading-tight">Subscription</span>
            <span
              className={`text-[10px] mt-0.5 leading-tight ${
                activeTab === 'subscription' ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-400'
              }`}
            >
              Long duration rentals, 7+ days
            </span>
          </button>

          {/* Tab 3: Weekday Pass */}
          <button
            type="button"
            onClick={() => setActiveTab('weekday')}
            className={`flex flex-col items-center justify-center px-5 py-2.5 rounded-xl transition-all text-left cursor-pointer whitespace-nowrap ${
              activeTab === 'weekday'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <span className="text-xs sm:text-sm font-bold leading-tight">Weekday Pass</span>
            <span
              className={`text-[10px] mt-0.5 leading-tight ${
                activeTab === 'weekday' ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-400'
              }`}
            >
              Mon-Fri fixed KM rentals
            </span>
          </button>

          {/* Tab 4: Airport & Outstation */}
          <button
            type="button"
            onClick={() => setActiveTab('outstation')}
            className={`relative flex flex-col items-center justify-center px-5 py-2.5 rounded-xl transition-all text-left cursor-pointer whitespace-nowrap ${
              activeTab === 'outstation'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            <span className="absolute -top-1.5 right-2 rounded-full bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 shadow-xs">
              New
            </span>
            <span className="text-xs sm:text-sm font-bold leading-tight">Airport / Outstation</span>
            <span
              className={`text-[10px] mt-0.5 leading-tight ${
                activeTab === 'outstation' ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-400'
              }`}
            >
              Direct airport bays
            </span>
          </button>
        </div>
      </div>

      {/* ===== FLOATING SEARCH CARD (4-Field Card + Search Button) ===== */}
      <div className="relative z-10 rounded-3xl bg-white dark:bg-card border border-slate-200/90 dark:border-white/10 p-5 sm:p-6 shadow-2xl backdrop-blur-md transition-colors">
        <form onSubmit={handleSearch}>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0 md:divide-x divide-slate-200 dark:divide-white/10 w-full">
            {/* Field 1: City */}
            <div className="md:w-[15%] px-3 sm:px-4 py-1 flex flex-col justify-center shrink-0">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Building className="h-3.5 w-3.5 text-slate-400" />
                City
              </span>
              <div className="relative mt-1">
                <select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setLocation('all');
                  }}
                  className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white cursor-pointer focus:outline-none appearance-none pr-5 truncate"
                >
                  <option value="pune" className="bg-white dark:bg-card text-slate-900 dark:text-white">
                    Pune
                  </option>
                  <option value="nashik" className="bg-white dark:bg-card text-slate-900 dark:text-white">
                    Nashik
                  </option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Field 2: Location */}
            <div className="md:w-[27%] px-3 sm:px-4 py-1 flex flex-col justify-center min-w-0">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Location
              </span>
              <div className="relative mt-1">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm text-slate-900 dark:text-white cursor-pointer focus:outline-none appearance-none pr-5 truncate"
                >
                  {availableLocations.map((loc) => (
                    <option key={loc.id} value={loc.id} className="bg-white dark:bg-card text-slate-900 dark:text-white">
                      {loc.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Field 3: Trip Start */}
            <div className="md:w-[22%] px-3 sm:px-4 py-1 flex flex-col justify-center min-w-0">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                Trip Start
              </span>
              <div className="relative mt-1">
                <label className="block font-bold text-xs sm:text-sm text-slate-900 dark:text-white cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
                  {formatDisplayDateTime(pickupDate, pickupTime)}
                  <input
                    type="datetime-local"
                    value={`${pickupDate}T${pickupTime}`}
                    onChange={(e) => {
                      if (e.target.value) {
                        const [d, t] = e.target.value.split('T');
                        setPickupDate(d);
                        if (t) setPickupTime(t.slice(0, 5));
                      }
                    }}
                    className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                  />
                </label>
              </div>
            </div>

            {/* Field 4: Trip End */}
            <div className="md:w-[22%] px-3 sm:px-4 py-1 flex flex-col justify-center min-w-0">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                Trip End
              </span>
              <div className="relative mt-1">
                <label className="block font-bold text-xs sm:text-sm text-slate-900 dark:text-white cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
                  {formatDisplayDateTime(returnDate, returnTime)}
                  <input
                    type="datetime-local"
                    value={`${returnDate}T${returnTime}`}
                    onChange={(e) => {
                      if (e.target.value) {
                        const [d, t] = e.target.value.split('T');
                        setReturnDate(d);
                        if (t) setReturnTime(t.slice(0, 5));
                      }
                    }}
                    className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                  />
                </label>
              </div>
            </div>

            {/* Column 5: Search Cars Button */}
            <div className="md:w-[14%] px-2 py-1 flex items-center justify-end shrink-0">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3 px-3 sm:px-4 text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98 whitespace-nowrap"
              >
                <Search className="h-4 w-4 shrink-0" />
                <span>Search Cars</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: Delivery Checkbox */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer select-none font-medium">
              <input
                type="checkbox"
                checked={homeDelivery}
                onChange={(e) => setHomeDelivery(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 cursor-pointer"
              />
              <span>Delivery &amp; Pick-up, available for eligible cars &amp; locations.</span>
            </label>

            <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Zero Security Deposit Eligible</span>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-3 rounded-xl bg-red-50 dark:bg-red-500/10 p-2.5 text-xs font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
