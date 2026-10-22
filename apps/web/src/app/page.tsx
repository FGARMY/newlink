'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  Lock,
  KeyRound,
  FileCheck2,
  Compass,
  PhoneCall,
  RotateCcw,
  Navigation,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { SearchWidget } from '../components/SearchWidget';
import { VehicleCard } from '../components/VehicleCard';
import { Footer } from '../components/Footer';
import { HubLocatorModal } from '../components/HubLocatorModal';
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

// Destination slides for the hero background slideshow
const DESTINATION_SLIDES = [
  {
    image: '/images/dest-goa-hd.jpg',
    title: 'Goa Coastal Highway',
    location: 'Goa Coastline',
  },
  {
    image: '/images/dest-lonavala-hd.jpg',
    title: 'Western Ghats & Lonavala',
    location: 'Lonavala Ghats',
  },
  {
    image: '/images/dest-mahabaleshwar-hd.jpg',
    title: 'Mahabaleshwar Hills',
    location: 'Mahabaleshwar',
  },
  {
    image: '/images/dest-pune-hd.jpg',
    title: 'Pune & Sahyadri Foothills',
    location: 'Pune Outskirts',
  },
  {
    image: '/images/dest-mumbai-hd.jpg',
    title: 'Mumbai-Pune Expressway',
    location: 'Expressway Route',
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % DESTINATION_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [hubLocatorOpen, setHubLocatorOpen] = useState(false);
  const [hubLocatorCity, setHubLocatorCity] = useState<'pune' | 'nashik'>('pune');

  // Filter state (City kept inside Sort/Filter so front page remains clean)
  const [filterCity, setFilterCity] = useState<'all' | 'pune' | 'nashik'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price_low' | 'price_high'>('popular');
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
      return 0; // recommended / default
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

      {/* ===== HERO SECTION WITH DYNAMIC DESTINATION BACKGROUND SLIDESHOW ===== */}
      <section className="relative overflow-hidden pt-10 pb-20 sm:pt-14 sm:pb-28">
        {/* Background Slideshow Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {DESTINATION_SLIDES.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={idx === 0}
                className="object-cover object-center opacity-40 dark:opacity-30"
              />
            </div>
          ))}

          {/* Theme-aware contrast overlay: high-contrast scrim ensuring 100% crystal-clear readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-slate-50 dark:from-black/95 dark:via-black/85 dark:to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(255,255,255,0.7),transparent_70%)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(0,0,0,0.85),transparent_70%)] pointer-events-none" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Destination Badge & Slide Indicators */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-slate-200/80 dark:border-white/15 bg-white/85 dark:bg-black/70 px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm backdrop-blur-md">
              <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline text-slate-500 dark:text-slate-400 font-normal">Scenic Escapes:</span>
              <span className="font-bold text-slate-900 dark:text-white">{DESTINATION_SLIDES[currentSlide].title}</span>
              <div className="flex items-center gap-1.5 ml-1.5">
                {DESTINATION_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer pointer-events-auto ${
                      i === currentSlide
                        ? 'w-4 bg-blue-600 dark:bg-blue-400'
                        : 'w-1.5 bg-slate-300 dark:bg-white/30 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to ${DESTINATION_SLIDES[i].title}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main Title & Subtitle Matching Reference Image */}
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-white leading-[1.15] drop-shadow-xs dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              Self-Drive Car Rental in Pune &amp; Nashik &mdash;{' '}
              <span className="text-blue-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-blue-400 dark:via-sky-300 dark:to-blue-500 font-black">
                Book by Hour or Day
              </span>
            </h1>

            {/* Trust Badges Bar in High-Contrast Frosted Badge */}
            <div className="mt-4 flex justify-center">
              <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 rounded-2xl border border-slate-300/80 dark:border-white/10 bg-white/95 dark:bg-card/90 px-4 py-2 text-xs sm:text-sm font-semibold shadow-md backdrop-blur-md text-slate-800 dark:text-slate-100">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-slate-900 dark:text-white">Pune &amp; Nashik Hubs</span>
                </span>
                <span className="text-slate-300 dark:text-white/20">&bull;</span>
                <span className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 dark:text-white">100% Sanitized Fleet</span>
                </span>
                <span className="text-slate-300 dark:text-white/20">&bull;</span>
                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
                  Doorstep Delivery &amp; Hub Pickup
                </span>
              </div>
            </div>

            {/* Subtitle */}
            <p className="mt-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200 max-w-2xl mx-auto font-medium drop-shadow-xs dark:drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              Choose your car, choose your dates, pick up or get it delivered, and drive without a driver.
            </p>
          </div>

          {/* ===== SEARCH WIDGET (Directly below headline) ===== */}
          <div className="mt-8">
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
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-canvas dark:via-surface/40 dark:to-canvas py-20 sm:py-24 border-y border-slate-200/80 dark:border-white/10 transition-colors">
        {/* Soft background aura glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-700 dark:text-blue-300">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>EFFORTLESS SELF-DRIVE EXPERIENCE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight font-display">
              How Renting with Speion Works
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
              No dealership counters, no paperwork hurdles, and no surprise deductions. Book in under two minutes from your phone.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="relative flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-card/90 p-7 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 backdrop-blur-md group">
              <div className="absolute top-6 right-6 font-display font-black text-3xl text-slate-200 dark:text-white/10 select-none group-hover:text-blue-500/20 transition-colors">
                01
              </div>
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <span className="rounded-md bg-blue-100 dark:bg-blue-500/20 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:text-blue-300">
                    Step 1
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Instant Availability
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white font-display">
                  Choose Dates &amp; Hub
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Select Pune or Nashik. Pick your designated airport parking bay, express city hub, or select doorstep delivery.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>24/7 Airport &amp; Highway Bays</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-card/90 p-7 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 backdrop-blur-md group">
              <div className="absolute top-6 right-6 font-display font-black text-3xl text-slate-200 dark:text-white/10 select-none group-hover:text-sky-500/20 transition-colors">
                02
              </div>
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
                  <Car className="h-6 w-6" />
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <span className="rounded-md bg-sky-100 dark:bg-sky-500/20 px-2 py-0.5 text-[11px] font-bold text-sky-700 dark:text-sky-300">
                    Step 2
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Zero Bait &amp; Switch
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white font-display">
                  Select Exact Car
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Browse authentic photos of the actual car you will drive. Inspect verified transmission, fuel type, boot space, and sanitization.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Exact Number Plate &amp; Specs</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-card/90 p-7 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 backdrop-blur-md group">
              <div className="absolute top-6 right-6 font-display font-black text-3xl text-slate-200 dark:text-white/10 select-none group-hover:text-emerald-500/20 transition-colors">
                03
              </div>
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                  <FileCheck2 className="h-6 w-6" />
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <span className="rounded-md bg-emerald-100 dark:bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                    Step 3
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    60-Second KYC
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white font-display">
                  Instant Verification
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Upload your Driving License or verify via DigiLocker. Secure payment via UPI, cards, or netbanking with a 10-minute instant inventory lock.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Encrypted &amp; 100% Paperless</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-card/90 p-7 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 backdrop-blur-md group">
              <div className="absolute top-6 right-6 font-display font-black text-3xl text-slate-200 dark:text-white/10 select-none group-hover:text-amber-500/20 transition-colors">
                04
              </div>
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
                  <KeyRound className="h-6 w-6" />
                </div>
                <div className="mt-6 flex items-center gap-2">
                  <span className="rounded-md bg-amber-100 dark:bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                    Step 4
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Fast Handover
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white font-display">
                  Unlock &amp; Drive Free
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                  Collect keys at the bay in under 3 minutes with our mobile checklist, or have our concierge deliver the vehicle right to your door.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>24/7 Roadside Assistance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== THE SPEION STANDARD / BENTO GRID ===== */}
      <section id="about" className="py-20 sm:py-28 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>THE SPEION STANDARD</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight font-display">
            Engineered for drivers who demand excellence.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
            We eliminated the friction, bait-and-switch cars, and surprise damage penalties common with traditional car rentals in Maharashtra.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Large Featured Card (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-card p-8 sm:p-10 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            {/* Background scenic image with deep gradient scrim */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/dest-lonavala-hd.jpg"
                alt="Scenic Western Ghats drive"
                fill
                className="object-cover opacity-20 dark:opacity-15 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-card dark:via-card/90 dark:to-transparent" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-500/20">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Zero Bait-and-Switch Guarantee</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-4 font-display">
                The exact vehicle you select is what you drive.
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-sans leading-relaxed max-w-2xl">
                Unlike competitors who promise &ldquo;or similar category&rdquo; and downgrade you at the bay, Speion provides the exact vehicle, verified transmission, and precise registration number you reserved.
              </p>

              {/* Feature pills */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-surface/80 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Real VIN &amp; Odometer Photos
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-surface/80 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Fleet Under 3 Years Old
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-surface/80 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Deep Interior Sanitization
                </span>
              </div>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Western Ghats &amp; Expressway Ready</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Pre-inspected tyres, brakes &amp; fluids for mountain drives</div>
                </div>
              </div>
              <Link
                href="/cars"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:gap-2.5 transition-all"
              >
                <span>Browse Available Fleet</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Server-Side Concurrency Shield */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-card p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <Lock className="h-6 w-6" />
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Concurrency Shield
                </span>
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white font-display">
                Atomic Double-Booking Shield
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                Our backend concurrency engine places a cryptographically sealed reservation lock on your car the instant you enter checkout. You will never arrive to an unavailable car.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Inventory Integrity</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">100% Guaranteed Lock</span>
            </div>
          </div>

          {/* Card 3: Instant UPI Security Deposit Refund */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-card p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <RotateCcw className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  Within 48 Hours
                </span>
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white font-display">
                Automated Deposit Release
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                No chasing customer service for your security deposit. Post-trip inspection triggers an automated UPI/bank transfer refund within 48 hours with full audit transparency.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Smart Shield Option</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">₹0 Deposit Available</span>
            </div>
          </div>

          {/* Card 4: 24/7 Roadside Assistance */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-card p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <PhoneCall className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-amber-50 dark:bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  24/7 Maharashtra SOS
                </span>
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white font-display">
                Highway Breakdown Assist
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                Dedicated rapid-response roadside assistance on Pune-Mumbai Expressway, NH-48, NH-60, Igatpuri, and Khandala ghats with emergency flat tyre and battery jumpstart service.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Helpline</span>
              <span className="font-bold text-slate-900 dark:text-white">+91 98765 43210</span>
            </div>
          </div>

          {/* Card 5: Express Doorstep Delivery */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-card p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <Navigation className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-blue-50 dark:bg-blue-500/15 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                  30+ Pincodes
                </span>
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white font-display">
                Doorstep Handover &amp; Return
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans leading-relaxed">
                Prefer not to travel to a hub? Our executive brings the sanitized car directly to your apartment, office, or hotel in Pune &amp; Nashik with live delivery ETA.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Delivery Time</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">60-90 Min Window</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POPULAR PICKUP LOCATIONS ===== */}
      <section className="bg-slate-50/80 dark:bg-surface/40 py-20 sm:py-24 border-t border-slate-200/80 dark:border-white/10 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-50 dark:bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-700 dark:text-blue-300">
                <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>OFFICIAL PICKUP BAYS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight font-display">
                Convenient Hubs Across Pune &amp; Nashik
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 font-sans max-w-xl">
                Collect at high-connectivity airport terminals and key business bypasses, or get your car delivered directly to your doorstep.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setHubLocatorCity('pune');
                setHubLocatorOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer shrink-0"
            >
              <Navigation className="h-4 w-4" />
              <span>Explore Interactive Bay Map</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Hub 1: Pune Airport */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-card p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-blue-100 dark:bg-blue-500/20 px-2.5 py-1 text-[11px] font-extrabold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                    Pune
                  </span>
                  <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    24 Hours Open
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-4 font-display">
                  Pune Airport (PNQ)
                </h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                  Lohegaon MLCP Level 2, Bay 4
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed font-sans">
                  2-minute direct walk from Terminal 1 &amp; 2 arrivals exit. Perfect for inbound flights and immediate city or highway exit.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Walking: 2 mins
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setHubLocatorCity('pune');
                    setHubLocatorOpen(true);
                  }}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Details</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Hub 2: Baner High Street */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-card p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-blue-100 dark:bg-blue-500/20 px-2.5 py-1 text-[11px] font-extrabold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                    Pune West
                  </span>
                  <span className="rounded-full bg-slate-100 dark:bg-surface border border-slate-200 dark:border-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                    6 AM &ndash; 11 PM
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-4 font-display">
                  Baner High Street Hub
                </h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                  Balewadi Promenade Underground Bay
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed font-sans">
                  Direct ramp to Mumbai-Pune Expressway bypass. Ideal for quick weekend road trips to Lonavala, Khandala, and Mumbai.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Near Balewadi
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setHubLocatorCity('pune');
                    setHubLocatorOpen(true);
                  }}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Details</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Hub 3: Viman Nagar */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-card p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-blue-100 dark:bg-blue-500/20 px-2.5 py-1 text-[11px] font-extrabold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                    Pune East
                  </span>
                  <span className="rounded-full bg-slate-100 dark:bg-surface border border-slate-200 dark:border-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                    8 AM &ndash; 11 PM
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-4 font-display">
                  Viman Nagar / Phoenix Bay
                </h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                  West Gate Complex, Phoenix Marketcity
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed font-sans">
                  Central eastern hub connecting Kharadi IT park, Koregaon Park, and direct Nagar Road highway transit corridor.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  1 min from Metro
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setHubLocatorCity('pune');
                    setHubLocatorOpen(true);
                  }}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Details</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Hub 4: Nashik Mumbai Naka */}
            <div className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-card p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-emerald-100 dark:bg-emerald-500/20 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                    Nashik
                  </span>
                  <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    24 Hours Open
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base mt-4 font-display">
                  Mumbai Naka Interchange
                </h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  Central National Highway Hub
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed font-sans">
                  Major interchange point for Sula Vineyards, Trimbakeshwar temple, Shirdi pilgrimages, and Igatpuri expressway travel.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Opposite Bus Bay
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setHubLocatorCity('nashik');
                    setHubLocatorOpen(true);
                  }}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Details</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CALL TO ACTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-black py-20 sm:py-24 text-white border-t border-slate-200/80 dark:border-white/10">
        {/* Ambient neon radial glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/20 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -bottom-10 right-10 w-80 h-80 bg-indigo-600/15 blur-3xl pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-300 mb-6 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>INSTANT RESERVATION LOCK &bull; ZERO CANCEL PENALTY UP TO 24H</span>
          </div>

          <h2 className="text-3xl font-extrabold sm:text-5xl text-white font-display tracking-tight leading-tight">
            Ready to explore Maharashtra on your terms?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
            Reserve your verified SUV or Sedan in Pune and Nashik today. 100% genuine cars, clean interiors, guaranteed rates, and 24/7 roadside assistance.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/cars"
              className="rounded-2xl bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 text-sm font-extrabold shadow-xl shadow-blue-600/30 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Search &amp; Book Fleet</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => {
                setHubLocatorCity('pune');
                setHubLocatorOpen(true);
              }}
              className="rounded-2xl border border-white/20 bg-white/10 hover:bg-white/15 backdrop-blur-md text-white px-7 py-3.5 text-sm font-bold shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <MapPin className="h-4 w-4 text-blue-400" />
              <span>Locate Nearest Hub</span>
            </button>
          </div>

          {/* Trust points bar */}
          <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-emerald-400 shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">100% Sanitized</div>
                <div className="text-slate-400 text-[11px]">Deep cleaned before trip</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-blue-400 shrink-0">
                <Zap className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">Zero Hidden Charges</div>
                <div className="text-slate-400 text-[11px]">GST &amp; fastag itemized</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-amber-400 shrink-0">
                <PhoneCall className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">24/7 Roadside SOS</div>
                <div className="text-slate-400 text-[11px]">Anywhere in Maharashtra</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-emerald-400 shrink-0">
                <RotateCcw className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">Instant UPI Refund</div>
                <div className="text-slate-400 text-[11px]">Deposit returned in 48h</div>
              </div>
            </div>
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
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'popular', label: 'Recommended' },
                    { id: 'price_low', label: 'Price: Low' },
                    { id: 'price_high', label: 'Price: High' },
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

      {/* ===== HUB LOCATOR MODAL ===== */}
      <HubLocatorModal
        isOpen={hubLocatorOpen}
        onClose={() => setHubLocatorOpen(false)}
        selectedCity={hubLocatorCity}
      />

      <Footer />
    </div>
  );
}
