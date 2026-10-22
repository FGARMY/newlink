'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Car,
  ChevronDown,
  X,
  MapPin,
  Calendar,
  Zap,
  Sparkles,
  Briefcase,
  Plane,
} from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { VehicleCard } from '../../components/VehicleCard';
import { Footer } from '../../components/Footer';
import { CompareVehiclesModal } from '../../components/CompareVehiclesModal';
import type { VehicleCard as VehicleCardType } from '@newlink/contracts';

const ALL_CARS: VehicleCardType[] = [
  {
    id: 'veh-creta-pn',
    brand: 'Hyundai',
    model: 'Creta',
    variant: 'SX (O) Turbo',
    category: 'SUV',
    transmission: 'AUTOMATIC',
    fuel: 'PETROL',
    seats: 5,
    cityId: 'city-pune',
    cityName: 'Pune',
    locationId: 'loc-pn-airport',
    locationName: 'Pune Airport (Lohegaon)',
    registrationYear: 2024,
    ratingAvg: 4.92,
    ratingCount: 128,
    startingPricePaise: 18000,
    dailyRatePaise: 240000,
    securityDepositPaise: 500000,
    primaryImageUrl: '/images/car-creta.jpg',
    features: ['Ventilated Seats', 'Panoramic Sunroof', 'Cruise Control', 'Wireless CarPlay'],
    isAvailable: true,
  },
  {
    id: 'veh-carens-pn',
    brand: 'Kia',
    model: 'Carens',
    variant: 'Prestige Plus',
    category: 'SUV',
    transmission: 'AUTOMATIC',
    fuel: 'DIESEL',
    seats: 7,
    cityId: 'city-pune',
    cityName: 'Pune',
    locationId: 'loc-pn-baner',
    locationName: 'Baner - High Street Hub',
    registrationYear: 2024,
    ratingAvg: 4.88,
    ratingCount: 94,
    startingPricePaise: 20000,
    dailyRatePaise: 280000,
    securityDepositPaise: 500000,
    primaryImageUrl: '/images/car-carens.jpg',
    features: [
      '7-Seater Comfort',
      'Rear AC Vents',
      'Touchscreen Infotainment',
      'High Fuel Mileage',
    ],
    isAvailable: true,
  },
  {
    id: 'veh-xuv700-pn',
    brand: 'Mahindra',
    model: 'XUV700',
    variant: 'AX7 Luxury Pack',
    category: 'PREMIUM',
    transmission: 'AUTOMATIC',
    fuel: 'DIESEL',
    seats: 7,
    cityId: 'city-pune',
    cityName: 'Pune',
    locationId: 'loc-pn-airport',
    locationName: 'Pune Airport (Lohegaon)',
    registrationYear: 2024,
    ratingAvg: 4.96,
    ratingCount: 142,
    startingPricePaise: 26000,
    dailyRatePaise: 380000,
    securityDepositPaise: 700000,
    primaryImageUrl: '/images/car-xuv700.jpg',
    features: ['ADAS Level 2', 'Sony 12-Speaker Audio', 'Panoramic Skyroof', 'AWD Drive Modes'],
    isAvailable: true,
  },
  {
    id: 'veh-dzire-pn',
    brand: 'Maruti Suzuki',
    model: 'Dzire',
    variant: 'ZXi Plus',
    category: 'SEDAN',
    transmission: 'AUTOMATIC',
    fuel: 'PETROL',
    seats: 5,
    cityId: 'city-pune',
    cityName: 'Pune',
    locationId: 'loc-pn-viman',
    locationName: 'Viman Nagar / Phoenix Bay',
    registrationYear: 2023,
    ratingAvg: 4.82,
    ratingCount: 210,
    startingPricePaise: 13000,
    dailyRatePaise: 160000,
    securityDepositPaise: 300000,
    primaryImageUrl: '/images/car-dzire.jpg',
    features: [
      'High Mileage (22 km/l)',
      'Compact City Parking',
      'Push Button Start',
      'Apple CarPlay',
    ],
    isAvailable: true,
  },
  {
    id: 'veh-innova-pn',
    brand: 'Toyota',
    model: 'Innova Crysta',
    variant: '2.4 ZX',
    category: 'SUV',
    transmission: 'MANUAL',
    fuel: 'DIESEL',
    seats: 7,
    cityId: 'city-pune',
    cityName: 'Pune',
    locationId: 'loc-pn-hinjewadi',
    locationName: 'Hinjewadi Phase 1 IT Park',
    registrationYear: 2023,
    ratingAvg: 4.95,
    ratingCount: 310,
    startingPricePaise: 25000,
    dailyRatePaise: 350000,
    securityDepositPaise: 600000,
    primaryImageUrl: '/images/car-innova.jpg',
    features: [
      'Legendary Highway Reliability',
      'Captain Seats',
      'Spacious Boot Space',
      'Cruise Control',
    ],
    isAvailable: true,
  },
  {
    id: 'veh-creta-ns',
    brand: 'Hyundai',
    model: 'Creta',
    variant: 'SX (O) Diesel',
    category: 'SUV',
    transmission: 'AUTOMATIC',
    fuel: 'DIESEL',
    seats: 5,
    cityId: 'city-nashik',
    cityName: 'Nashik',
    locationId: 'loc-ns-citycentre',
    locationName: 'City Centre Mall Hub',
    registrationYear: 2024,
    ratingAvg: 4.91,
    ratingCount: 86,
    startingPricePaise: 18000,
    dailyRatePaise: 240000,
    securityDepositPaise: 500000,
    primaryImageUrl: '/images/car-creta.jpg',
    features: ['Ventilated Seats', 'Panoramic Sunroof', 'Cruise Control', 'Wireless CarPlay'],
    isAvailable: true,
  },
  {
    id: 'veh-fortuner-ns',
    brand: 'Toyota',
    model: 'Fortuner',
    variant: '4x4 AT Sigma',
    category: 'LUXURY',
    transmission: 'AUTOMATIC',
    fuel: 'DIESEL',
    seats: 7,
    cityId: 'city-nashik',
    cityName: 'Nashik',
    locationId: 'loc-ns-mumbainaka',
    locationName: 'Mumbai Naka Interchange',
    registrationYear: 2024,
    ratingAvg: 4.98,
    ratingCount: 164,
    startingPricePaise: 42000,
    dailyRatePaise: 580000,
    securityDepositPaise: 1000000,
    primaryImageUrl: '/images/car-fortuner.jpg',
    features: [
      '4x4 Tough Terrain Ability',
      'Commanding Road Presence',
      'JBL Premium Sound',
      'Ventilated Seats',
    ],
    isAvailable: true,
  },
];

function CarsSearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const city = searchParams.get('city') || 'pune';
  const location = searchParams.get('location') || '';
  const start = searchParams.get('start') || '';
  const end = searchParams.get('end') || '';
  const mode = searchParams.get('mode') || 'daily';

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('ALL');
  const [selectedFuel, setSelectedFuel] = useState<string>('ALL');
  const [selectedSeats, setSelectedSeats] = useState<string>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [sortBy, setSortBy] = useState<string>('RECOMMENDED');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Quick Filter Pill State
  const [quickFilter, setQuickFilter] = useState<'ALL' | 'AUTOMATIC' | '7_SEATER' | 'SUNROOF' | 'DIESEL' | 'NEW_FLEET'>('ALL');

  // Compare Vehicles State
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  const toggleCompare = (id: string) => {
    setComparedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 vehicles side-by-side.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const comparedVehicles = useMemo(() => {
    return ALL_CARS.filter((c) => comparedIds.includes(c.id));
  }, [comparedIds]);

  // Filter and Sort Logic with Mode-based adjustments
  const filteredCars = useMemo(() => {
    return ALL_CARS.map((car) => {
      let dailyRatePaise = car.dailyRatePaise;
      let features = [...car.features];

      if (mode === 'subscription') {
        dailyRatePaise = Math.round(car.dailyRatePaise * 0.65); // 35% Long-term discount
        features = ['35% Monthly Discount', 'Free Doorstep Delivery', ...features.slice(0, 2)];
      } else if (mode === 'weekday') {
        dailyRatePaise = Math.round(car.dailyRatePaise * 0.8); // 20% Weekday Package discount
        features = ['Mon-Fri 500 KM Pass', 'Zero Security Deposit', ...features.slice(0, 2)];
      } else if (mode === 'outstation') {
        features = ['Unlimited KMs Included', 'Airport Terminal Bay Handover', ...features.slice(0, 2)];
      }

      return {
        ...car,
        dailyRatePaise,
        features,
      };
    }).filter((car) => {
      // City Match
      const matchesCity =
        city === 'nashik' ? car.cityId === 'city-nashik' : car.cityId === 'city-pune';
      if (!matchesCity) return false;

      // Location Match (if specified)
      if (location && location !== 'all' && car.locationId !== location) return false;

      // Category
      if (selectedCategory !== 'ALL' && car.category !== selectedCategory) return false;

      // Transmission
      if (selectedTransmission !== 'ALL' && car.transmission !== selectedTransmission) return false;

      // Fuel
      if (selectedFuel !== 'ALL' && car.fuel !== selectedFuel) return false;

      // Seats
      if (selectedSeats !== 'ALL') {
        const seatsNum = Number(selectedSeats);
        if (seatsNum === 7 && car.seats < 7) return false;
        if (seatsNum === 5 && car.seats !== 5) return false;
      }

      // Max Daily Price (in rupees)
      const dailyRupees = car.dailyRatePaise / 100;
      if (dailyRupees > maxPrice) return false;

      // Quick Filter Pills
      if (quickFilter === 'AUTOMATIC' && car.transmission !== 'AUTOMATIC') return false;
      if (quickFilter === '7_SEATER' && car.seats < 7) return false;
      if (quickFilter === 'SUNROOF') {
        const hasSunroof = car.features.some(
          (f) => f.toLowerCase().includes('sunroof') || f.toLowerCase().includes('skyroof')
        );
        if (!hasSunroof) return false;
      }
      if (quickFilter === 'DIESEL' && car.fuel !== 'DIESEL') return false;
      if (quickFilter === 'NEW_FLEET' && car.registrationYear < 2024) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.dailyRatePaise - b.dailyRatePaise;
      if (sortBy === 'PRICE_DESC') return b.dailyRatePaise - a.dailyRatePaise;
      return 0; // RECOMMENDED
    });
  }, [
    city,
    location,
    mode,
    selectedCategory,
    selectedTransmission,
    selectedFuel,
    selectedSeats,
    maxPrice,
    quickFilter,
    sortBy,
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-white font-sans">
      <Navbar selectedCity={city} />

      {/* Top Search Context Bar */}
      <div className="border-b border-white/10 bg-card py-4 shadow-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Searching In
              </div>
              <div className="text-base font-bold text-white capitalize">
                {city === 'nashik' ? 'Nashik' : 'Pune'}
                {location && location !== 'all' && (
                  <span className="text-xs font-normal text-slate-400 ml-1.5">
                    ({location.replace('loc-pn-', '').replace('loc-ns-', '')})
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Active Service Mode Pill */}
            <div className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold border ${
              mode === 'subscription'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : mode === 'weekday'
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                : mode === 'outstation'
                ? 'bg-primary/10 border-primary/30 text-primary-light'
                : 'bg-surface border-white/10 text-slate-300'
            }`}>
              {mode === 'subscription' && <Sparkles className="h-3.5 w-3.5" />}
              {mode === 'weekday' && <Briefcase className="h-3.5 w-3.5" />}
              {mode === 'outstation' && <Plane className="h-3.5 w-3.5" />}
              {mode === 'daily' && <Car className="h-3.5 w-3.5" />}
              <span>
                {mode === 'subscription'
                  ? 'Subscription (35% Off)'
                  : mode === 'weekday'
                  ? 'Weekday Pass (20% Off)'
                  : mode === 'outstation'
                  ? 'Airport / Outstation'
                  : 'Daily Drives'}
              </span>
            </div>

            {/* Quick Date Badge */}
            {start && end && (
              <div className="flex items-center gap-2 rounded-xl bg-surface px-3 py-1.5 text-xs font-semibold text-slate-200">
                <Calendar className="h-3.5 w-3.5 text-blue-400" />
                <span>
                  {start.split('T')[0]} to {end.split('T')[0]}
                </span>
              </div>
            )}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-card px-3.5 py-2 text-xs font-bold text-slate-100 shadow-xs md:hidden"
          >
            <Filter className="h-4 w-4 text-blue-400" />
            <span>Filters ({filteredCars.length})</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Left Filter Sidebar (Desktop) */}
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-24 rounded-2xl border border-white/10 bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <SlidersHorizontal className="h-4 w-4 text-blue-400" />
                <span>Filters</span>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedTransmission('ALL');
                  setSelectedFuel('ALL');
                  setSelectedSeats('ALL');
                  setMaxPrice(6000);
                }}
                className="text-xs font-semibold text-blue-400 hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Price Slider */}
            <div className="mt-5 border-b border-white/5 pb-5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Max Daily Rate: ₹{maxPrice.toLocaleString('en-IN')}
              </label>
              <input
                type="range"
                min="1500"
                max="6000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-2 w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹1,500</span>
                <span>₹6,000</span>
              </div>
            </div>

            {/* Vehicle Type / Category */}
            <div className="mt-5 border-b border-white/5 pb-5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Vehicle Type
              </label>
              <div className="mt-2.5 space-y-1.5">
                {[
                  { id: 'ALL', label: 'All Categories' },
                  { id: 'SUV', label: 'SUV & MUV' },
                  { id: 'SEDAN', label: 'Sedan' },
                  { id: 'PREMIUM', label: 'Premium' },
                  { id: 'LUXURY', label: 'Luxury 4x4' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 text-xs font-medium text-slate-200 cursor-pointer hover:text-white"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === item.id}
                      onChange={() => setSelectedCategory(item.id)}
                      className="accent-blue-600"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div className="mt-5 border-b border-white/5 pb-5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Transmission
              </label>
              <div className="mt-2.5 flex gap-2">
                {['ALL', 'AUTOMATIC', 'MANUAL'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTransmission(t)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      selectedTransmission === t
                        ? 'bg-blue-600 text-white'
                        : 'bg-surface text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {t === 'ALL' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Fuel Type */}
            <div className="mt-5 border-b border-white/5 pb-5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Fuel Type
              </label>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {['ALL', 'DIESEL', 'PETROL'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFuel(f)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      selectedFuel === f
                        ? 'bg-blue-600 text-white'
                        : 'bg-surface text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Seating Capacity */}
            <div className="mt-5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Seating Capacity
              </label>
              <div className="mt-2.5 flex gap-2">
                {[
                  { id: 'ALL', label: 'All' },
                  { id: '5', label: '5 Seater' },
                  { id: '7', label: '7 Seater' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSeats(s.id)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      selectedSeats === s.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-surface text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Vehicle Results */}
        <div className="flex-1">
          {/* Header & Sort Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Available Cars in {city === 'nashik' ? 'Nashik' : 'Pune'}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Showing {filteredCars.length} verified vehicles with guaranteed availability
              </p>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-white/15 bg-card px-3 py-1.5 text-xs font-bold text-white shadow-xs focus:border-blue-600 focus:outline-none"
              >
                <option value="RECOMMENDED">Recommended</option>
                <option value="PRICE_ASC">Price: Low to High</option>
                <option value="PRICE_DESC">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Quick-Filter Pills */}
          <div className="mb-5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'ALL', label: 'All Fleet' },
              { id: 'AUTOMATIC', label: 'Automatic Only' },
              { id: '7_SEATER', label: '7-Seaters' },
              { id: 'SUNROOF', label: 'Panoramic Sunroof' },
              { id: 'DIESEL', label: 'Diesel Mileage' },
              { id: 'NEW_FLEET', label: 'New 2024 Fleet' },
            ].map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setQuickFilter(pill.id as any)}
                className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
                  quickFilter === pill.id
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-900/40'
                    : 'bg-card border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Mode Notification Banner */}
          {mode !== 'daily' && (
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-emerald-300 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-emerald-400 font-bold">
                  {mode === 'subscription' && <Sparkles className="h-5 w-5" />}
                  {mode === 'weekday' && <Briefcase className="h-5 w-5" />}
                  {mode === 'outstation' && <Plane className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {mode === 'subscription'
                      ? 'Long-term Subscription Discount (35% Off Applied)'
                      : mode === 'weekday'
                      ? 'Weekday Commuter Pass (20% Off Applied)'
                      : 'Airport & Highway Outstation Mode Active'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {mode === 'subscription'
                      ? 'All car rates already reflect 35% savings. Includes doorstep delivery, comprehensive maintenance & 50% reduced deposit.'
                      : mode === 'weekday'
                      ? 'Mon-Fri special package pricing with 500 included kilometers and zero security deposit.'
                      : 'Direct airport terminal bay handover, 24/7 highway assistance & unlimited kilometers included.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('mode', 'daily');
                  router.push(`/cars?${params.toString()}`);
                }}
                className="self-end sm:self-center shrink-0 rounded-xl bg-white/10 hover:bg-white/20 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Reset to Daily
              </button>
            </div>
          )}

          {/* Cars Grid */}
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {filteredCars.map((car) => (
                <VehicleCard
                  key={car.id}
                  vehicle={car}
                  searchParams={searchParams.toString()}
                  isCompared={comparedIds.includes(car.id)}
                  onToggleCompare={toggleCompare}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-card p-12 text-center shadow-xs">
              <Car className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-base font-bold text-white">
                No vehicles match your current filters
              </h3>
              <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                Try widening your price range, clearing fuel or transmission selections.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedTransmission('ALL');
                  setSelectedFuel('ALL');
                  setSelectedSeats('ALL');
                  setMaxPrice(6000);
                  setQuickFilter('ALL');
                }}
                className="mt-5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Compare Vehicles Tray */}
      {comparedIds.length > 0 && (
        <div className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl rounded-2xl bg-card/95 border border-blue-500/30 p-3 sm:p-4 shadow-2xl backdrop-blur-xl animate-fade-in text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-x-auto">
              <div className="hidden sm:block">
                <span className="text-xs font-bold text-slate-200 block">Compare Cars</span>
                <span className="text-[11px] text-slate-400">({comparedIds.length}/3 selected)</span>
              </div>
              <div className="flex items-center gap-2">
                {comparedVehicles.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-2 rounded-xl bg-surface/80 border border-white/10 px-2.5 py-1.5 text-xs"
                  >
                    <span className="font-bold text-white whitespace-nowrap">
                      {c.brand} {c.model}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleCompare(c.id)}
                      className="text-slate-400 hover:text-rose-400 font-bold ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setComparedIds([])}
                className="rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setCompareModalOpen(true)}
                className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-blue-900/40 transition-all cursor-pointer"
              >
                Compare Now ({comparedIds.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      <CompareVehiclesModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        vehicles={comparedVehicles}
        onRemoveVehicle={toggleCompare}
        searchParams={searchParams.toString()}
      />

      <Footer />
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense
      fallback={<div className="p-8 text-center text-sm font-semibold">Loading fleet...</div>}
    >
      <CarsSearchContent />
    </Suspense>
  );
}
