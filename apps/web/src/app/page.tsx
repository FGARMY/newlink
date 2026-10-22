'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Car,
  Award,
  SlidersHorizontal,
  X,
  Filter,
  Check,
  Star,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { SearchWidget } from '../components/SearchWidget';
import { VehicleCard } from '../components/VehicleCard';
import { Footer } from '../components/Footer';
import type { VehicleCard as VehicleCardType } from '@newlink/contracts';

// Seeded inventory for Pune & Nashik
const FEATURED_VEHICLES: VehicleCardType[] = [
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
    features: ['7-Seater Comfort', 'Rear AC Vents', 'Touchscreen Infotainment', 'High Fuel Mileage'],
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
    features: ['Captain Seats', 'Spacious Boot Space', 'Cruise Control', 'Highway King'],
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
    features: ['22 km/l Mileage', 'Apple CarPlay', 'Push Button Start', 'City Agility'],
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
    features: ['4x4 Tough Terrain', 'Commanding Road Presence', 'JBL Sound', 'Ventilated Seats'],
    isAvailable: true,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Cars' },
  { id: 'SUV', label: 'SUVs & MUVs' },
  { id: 'PREMIUM', label: 'Premium & Tech' },
  { id: 'SEDAN', label: 'Sedans' },
  { id: 'LUXURY', label: 'Luxury 4x4' },
];

// Cards for the roadtrip inspiration fan matching Zoomcar
const FAN_CARDS = [
  {
    image: '/images/dest-lonavala.jpg',
    title: 'Western Ghats Escape',
    rotation: '-rotate-6 sm:-rotate-8 translate-y-3',
  },
  {
    image: '/images/dest-goa.jpg',
    title: 'Coastal Drives to Goa',
    rotation: '-rotate-3 sm:-rotate-4 translate-y-1',
  },
  {
    image: '/images/dest-mahabaleshwar.jpg',
    title: 'Mahabaleshwar Hills',
    rotation: 'rotate-0 -translate-y-1 scale-105 z-10',
  },
  {
    image: '/images/dest-mumbai.jpg',
    title: 'Expressway Commute',
    rotation: 'rotate-3 sm:rotate-4 translate-y-1',
  },
  {
    image: '/images/dest-pune.jpg',
    title: 'City & Vineyard Trips',
    rotation: 'rotate-6 sm:rotate-8 translate-y-3',
  },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Filter state (City kept inside Sort/Filter so front page remains clean)
  const [filterCity, setFilterCity] = useState<'all' | 'pune' | 'nashik'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price_low' | 'price_high' | 'rating'>('popular');
  const [filterFuel, setFilterFuel] = useState<'all' | 'PETROL' | 'DIESEL'>('all');
  const [filterTransmission, setFilterTransmission] = useState<'all' | 'AUTOMATIC' | 'MANUAL'>('all');

  const filteredVehicles = useMemo(() => {
    return FEATURED_VEHICLES.filter((v) => {
      const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
      const matchesCity =
        filterCity === 'all' ||
        (filterCity === 'pune' && v.cityId === 'city-pune') ||
        (filterCity === 'nashik' && v.cityId === 'city-nashik');
      const matchesFuel = filterFuel === 'all' || v.fuel === filterFuel;
      const matchesTransmission =
        filterTransmission === 'all' || v.transmission === filterTransmission;

      return matchesCategory && matchesCity && matchesFuel && matchesTransmission;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.dailyRatePaise - b.dailyRatePaise;
      if (sortBy === 'price_high') return b.dailyRatePaise - a.dailyRatePaise;
      if (sortBy === 'rating') return b.ratingAvg - a.ratingAvg;
      return b.ratingCount - a.ratingCount; // popular
    });
  }, [selectedCategory, filterCity, sortBy, filterFuel, filterTransmission]);

  const activeFilterCount =
    (filterCity !== 'all' ? 1 : 0) +
    (filterFuel !== 'all' ? 1 : 0) +
    (filterTransmission !== 'all' ? 1 : 0) +
    (sortBy !== 'popular' ? 1 : 0);

  const resetFilters = () => {
    setFilterCity('all');
    setFilterFuel('all');
    setFilterTransmission('all');
    setSortBy('popular');
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-canvas text-slate-900 dark:text-white font-sans transition-colors duration-200">
      <Navbar />

      {/* ===== HERO SECTION (Zoomcar Styled Banner + Tilted Cards Fan) ===== */}
      <section className="relative overflow-hidden pt-10 pb-20 sm:pt-14 sm:pb-28">
        {/* Subtle background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 -top-40 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-[120px]"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Main Title & Subtitle Matching Reference Image */}
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-white leading-[1.15]">
              Self-Drive Car Rental in Pune &amp; Nashik &mdash;{' '}
              <span className="text-blue-600 dark:text-primary-gradient">Book by Hour or Day</span>
            </h1>

            {/* Stats Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 dark:text-white">50,00,000+</span> Trips
              </span>
              <span className="text-slate-300 dark:text-white/20">&bull;</span>
              <span className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 dark:text-white">30,00,000+</span> User Ratings
              </span>
              <span className="text-slate-300 dark:text-white/20">&bull;</span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <Star className="h-3.5 w-3.5 fill-current" />
                4.9+ Average Trip Rating
              </span>
            </div>

            {/* Subtitle */}
            <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Choose your car, choose your dates, pick up or get it delivered, and drive without a driver.
            </p>
          </div>

          {/* ===== Tilted Roadtrip Card Fan Gallery (Matching Zoomcar Image) ===== */}
          <div className="mt-10 mb-8 flex justify-center items-center overflow-hidden py-4 px-2">
            <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-5xl">
              {FAN_CARDS.map((card, idx) => (
                <div
                  key={idx}
                  className={`relative w-28 sm:w-44 md:w-52 aspect-4/5 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 sm:border-4 border-white dark:border-white/10 transition-transform duration-300 hover:scale-108 hover:z-20 hover:rotate-0 cursor-pointer ${card.rotation}`}
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 640px) 120px, 220px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2 sm:p-3">
                    <span className="text-[10px] sm:text-xs font-bold text-white leading-tight drop-shadow-sm">
                      {card.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== SEARCH WIDGET (Directly overlapping below the cards) ===== */}
          <div className="mt-4">
            <SearchWidget defaultCity="pune" />
          </div>
        </div>
      </section>

      {/* ===== POPULAR CARS SECTION (Clean front page browsing without bulky city switchers) ===== */}
      <section className="py-14 sm:py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Verified Self-Drive Fleet
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Find Popular Cars in Pune &amp; Nashik
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Choose from available self-drive cars based on your location, travel dates, car type and trip requirements.
            </p>
          </div>

          {/* Clean Controls: Category Filter Chips + Sort/Filter Modal Trigger */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'bg-white dark:bg-card text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-surface'
                }`}
              >
                {cat.label}
              </button>
            ))}

            {/* Filter & Sort Button (Houses the Pune/Nashik city switch cleanly) */}
            <button
              onClick={() => setFilterModalOpen(true)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                activeFilterCount > 0
                  ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                  : 'bg-white dark:bg-card border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>Sort &amp; Filter</span>
              {activeFilterCount > 0 && (
                <span className="ml-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black h-4 w-4 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filters Pill Bar (If user selected city or sort) */}
        {activeFilterCount > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Applied:</span>
            {filterCity !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-500/20 px-2.5 py-0.5 font-bold text-blue-800 dark:text-blue-300">
                City: {filterCity === 'pune' ? 'Pune' : 'Nashik'}
                <button onClick={() => setFilterCity('all')} className="hover:opacity-75">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filterFuel !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 dark:bg-surface px-2.5 py-0.5 font-bold text-slate-800 dark:text-slate-200">
                Fuel: {filterFuel}
                <button onClick={() => setFilterFuel('all')} className="hover:opacity-75">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filterTransmission !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 dark:bg-surface px-2.5 py-0.5 font-bold text-slate-800 dark:text-slate-200">
                Gearbox: {filterTransmission}
                <button onClick={() => setFilterTransmission('all')} className="hover:opacity-75">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-[11px] ml-2"
            >
              Reset all
            </button>
          </div>
        )}

        {/* Vehicles Grid */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                searchParams={`city=${vehicle.cityName.toLowerCase()}`}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-card p-12 text-center">
            <Car className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
              No cars matching your filters
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Try resetting your city or fuel filters to view all available cars.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-card px-6 py-3 text-sm font-bold text-slate-900 dark:text-white shadow-xs hover:bg-slate-50 dark:hover:bg-surface transition-all"
          >
            <span>Explore Full Fleet &amp; All Pickup Hubs</span>
            <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </Link>
        </div>
      </section>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section className="bg-white dark:bg-card py-16 sm:py-20 border-y border-slate-200/80 dark:border-white/10 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Simple &amp; Transparent
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              How Renting with Speion Cars Works
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              No lengthy paperwork or dealership queues. Book in under two minutes from your phone.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-lg border border-blue-500/20 shadow-xs">
                1
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">Choose Dates &amp; Hub</h3>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Pick Pune or Nashik, select your convenient pickup hub and trip hours.
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-lg border border-blue-500/20 shadow-xs">
                2
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">Select Your Car</h3>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Browse verified cars with genuine photos, transparent rates, and real ratings.
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-lg border border-blue-500/20 shadow-xs">
                3
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">Fast Digital KYC</h3>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Quick DL upload and secure payment via UPI, cards or netbanking with a 10-min lock.
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-lg border border-blue-500/20 shadow-xs">
                4
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">Drive with Freedom</h3>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Collect keys at the hub with our checklist or get it delivered right to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE SPEION / COMPANY PROFILE ===== */}
      <section id="about" className="py-16 sm:py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              The Speion Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
              Built for people who love the drive.
            </h2>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We started in Pune and Nashik with a clear mission: eliminate the uncertainty, surprise penalties, and worn-out vehicles common in traditional car rentals.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Guaranteed Specific Vehicle</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    No bait-and-switch. You get the exact car you booked, in clean condition.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Server-Side Double-Booking Shield
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Our atomic reservation engine ensures your chosen car is exclusively locked for you.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Swift Security Deposit Refund
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Automated bank refunds initiated within 48 hours of vehicle return inspection.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden aspect-4/3 shadow-xl border border-slate-200 dark:border-white/10">
            <Image
              src="/images/dest-lonavala.jpg"
              alt="Road trip through Western Ghats"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
              <div className="text-white">
                <div className="text-xs font-semibold text-blue-400">
                  Road Trips From Pune &amp; Nashik
                </div>
                <div className="text-lg font-bold">Lonavala, Mahabaleshwar, Trimbakeshwar, Goa</div>
                <div className="text-xs text-slate-300 mt-1">
                  Unlimited memories, zero odometer anxiety.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POPULAR PICKUP LOCATIONS ===== */}
      <section className="bg-slate-100 dark:bg-surface/50 py-16 sm:py-20 border-t border-slate-200/80 dark:border-white/10 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Convenient Hubs
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Popular Pickup Locations
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Collect at high-connectivity transport nodes or key business districts.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-card p-5 shadow-xs">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold">
                <MapPin className="h-4 w-4" />
                <span>Pune Airport</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-1">Lohegaon Terminal Hub</h3>
              <p className="text-xs text-slate-500 mt-1">
                Parking Bay 4. Ideal for inbound flights and immediate city exit.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Operating: 24 Hours
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-card p-5 shadow-xs">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold">
                <MapPin className="h-4 w-4" />
                <span>Baner High Street</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-1">Western Pune Corridor</h3>
              <p className="text-xs text-slate-500 mt-1">
                Near expressway bypass for quick escapes to Mumbai or Goa.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-slate-500">Operating: 6 AM - 11 PM</div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-card p-5 shadow-xs">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold">
                <MapPin className="h-4 w-4" />
                <span>Nashik City Centre</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-1">Untwadi Road Mall Hub</h3>
              <p className="text-xs text-slate-500 mt-1">
                Central access point for vineyards and city business trips.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-slate-500">Operating: 7 AM - 10 PM</div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-card p-5 shadow-xs">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold">
                <MapPin className="h-4 w-4" />
                <span>Mumbai Naka Nashik</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-1">National Highway Hub</h3>
              <p className="text-xs text-slate-500 mt-1">
                Direct highway junction for Shirdi, Igatpuri, and Mumbai transit.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-slate-500">Operating: 6 AM - 11 PM</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CALL TO ACTION ===== */}
      <section className="relative overflow-hidden bg-primary-gradient py-16 text-white text-center">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold sm:text-4xl text-white">
            Ready to hit the road in Pune or Nashik?
          </h2>
          <p className="mt-3 text-sm text-blue-100 max-w-xl mx-auto">
            Book now and enjoy transparent prices, clean vehicles, and complete peace of mind.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/cars"
              className="rounded-full bg-white text-blue-600 px-7 py-3 text-sm font-bold shadow-lg hover:bg-slate-100 transition-all cursor-pointer"
            >
              Search &amp; Book Cars
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SORT & FILTER MODAL ===== */}
      {filterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-card p-6 shadow-2xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white animate-fade-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold">Sort &amp; Filter Cars</h3>
              </div>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* City Selection (Moved here to keep front page clean) */}
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  City
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['all', 'pune', 'nashik'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFilterCity(c)}
                      className={`py-2 px-3 rounded-xl border font-semibold capitalize text-center transition-all ${
                        filterCity === c
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold'
                          : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-surface text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {c === 'all' ? 'All Cities' : c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  Sort By
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'popular', label: 'Most Popular' },
                    { id: 'rating', label: 'Highest Rated' },
                    { id: 'price_low', label: 'Price: Low to High' },
                    { id: 'price_high', label: 'Price: High to Low' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSortBy(s.id as any)}
                      className={`py-2 px-3 rounded-xl border font-semibold text-center transition-all ${
                        sortBy === s.id
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold'
                          : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-surface text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  Fuel Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['all', 'PETROL', 'DIESEL'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFilterFuel(f)}
                      className={`py-2 px-3 rounded-xl border font-semibold text-center transition-all ${
                        filterFuel === f
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold'
                          : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-surface text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {f === 'all' ? 'All Fuels' : f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transmission */}
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  Transmission
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['all', 'AUTOMATIC', 'MANUAL'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFilterTransmission(t)}
                      className={`py-2 px-3 rounded-xl border font-semibold text-center transition-all ${
                        filterTransmission === t
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold'
                          : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-surface text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {t === 'all' ? 'All' : t === 'AUTOMATIC' ? 'Automatic' : 'Manual'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setFilterModalOpen(false)}
                className="rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2 text-xs font-bold text-white transition-colors"
              >
                Apply Filters ({filteredVehicles.length} cars)
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
