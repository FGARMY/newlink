'use client';

import React, { useState } from 'react';
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
    features: [
      '7-Seater Comfort',
      'Rear AC Vents',
      'Touchscreen Infotainment',
      'High Fuel Mileage',
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
  { id: 'all', label: 'All Cars', count: 6 },
  { id: 'SUV', label: 'SUVs & MUVs', count: 3 },
  { id: 'PREMIUM', label: 'Premium & Tech', count: 1 },
  { id: 'SEDAN', label: 'Sedans', count: 1 },
  { id: 'LUXURY', label: 'Luxury 4x4', count: 1 },
];

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState<'pune' | 'nashik'>('pune');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredVehicles = FEATURED_VEHICLES.filter((v) => {
    const matchesCity =
      selectedCity === 'pune' ? v.cityId === 'city-pune' : v.cityId === 'city-nashik';
    const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
    return matchesCity && matchesCategory;
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF8] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      <Navbar
        selectedCity={selectedCity}
        onCityChange={(c) => setSelectedCity(c as 'pune' | 'nashik')}
      />

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-slate-950 py-16 sm:py-24 lg:py-28 text-white">
        {/* Subtle background overlay */}
        <div className="absolute inset-0 z-0 opacity-25">
          <Image
            src="/images/hero-bg.jpg"
            alt="Scenic highway drive"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/90" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-400 backdrop-blur-xs mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Pune & Nashik Premier Self-Drive Fleet</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
              Your car. <span className="text-amber-500">Your journey.</span>
            </h1>

            {/* Subheading */}
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Clean, verified cars with unlimited freedom. Zero hidden charges, 100% server-verified
              availability, and instant booking confirmation.
            </p>
          </div>

          {/* Search Widget */}
          <div className="mt-10 flex justify-center">
            <SearchWidget defaultCity={selectedCity} />
          </div>

          {/* Micro trust row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Free Cancellation up to 24h</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Home Delivery Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Fastag Pre-Activated</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POPULAR CARS SECTION ===== */}
      <section className="py-16 sm:py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Explore Our Fleet
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Popular cars in {selectedCity === 'pune' ? 'Pune' : 'Nashik'}
            </h2>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                searchParams={`city=${selectedCity}`}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <Car className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-3 text-base font-bold text-slate-900">
              No cars found in this category
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Try switching category or check our full fleet in Pune & Nashik.
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
            >
              View All Vehicles
            </button>
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href={`/cars?city=${selectedCity}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-xs hover:bg-slate-50 hover:border-slate-400 transition-all"
          >
            <span>View All Cars in {selectedCity === 'pune' ? 'Pune' : 'Nashik'}</span>
            <ArrowRight className="h-4 w-4 text-amber-600" />
          </Link>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="bg-white py-16 sm:py-20 border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Simple & Transparent
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How renting with Newlink works
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              No lengthy paperwork or dealership queues. Book in under two minutes from your phone.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 font-extrabold text-lg border border-amber-500/20 shadow-xs">
                1
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900">Choose City & Dates</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Pick Pune or Nashik, select your convenient pickup hub and trip hours.
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 font-extrabold text-lg border border-amber-500/20 shadow-xs">
                2
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900">Select Your Car</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Browse verified cars with genuine photos, transparent rates, and real ratings.
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 font-extrabold text-lg border border-amber-500/20 shadow-xs">
                3
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900">Digital KYC & Pay</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Quick DL upload and secure payment via UPI, cards or netbanking with a 10-min lock.
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 font-extrabold text-lg border border-amber-500/20 shadow-xs">
                4
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900">Drive with Freedom</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Collect keys at the hub with our checklist or get it delivered right to your
                doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-16 sm:py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              The Newlink Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Built for people who love the drive.
            </h2>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              We started in Pune and Nashik with a clear mission: eliminate the uncertainty,
              surprise penalties, and worn-out vehicles common in traditional car rentals.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Guaranteed Specific Vehicle</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    No bait-and-switch. You get the exact car you booked, in clean condition.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Server-Side Double-Booking Shield
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Our atomic reservation engine ensures your chosen car is exclusively locked for
                    you.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Swift Security Deposit Refund
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Automated bank refunds initiated within 48 hours of vehicle return inspection.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-4/3 shadow-xl border border-slate-200">
            <Image
              src="/images/dest-lonavala.jpg"
              alt="Road trip through Western Ghats"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
              <div className="text-white">
                <div className="text-xs font-semibold text-amber-400">
                  Road Trips From Pune & Nashik
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
      <section className="bg-slate-100 py-16 sm:py-20 border-t border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Convenient Hubs
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Popular Pickup Locations
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Collect at high-connectivity transport nodes or key business districts.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold">
                <MapPin className="h-4 w-4" />
                <span>Pune Airport</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mt-1">Lohegaon Terminal Hub</h3>
              <p className="text-xs text-slate-500 mt-1">
                Parking Bay 4. Ideal for inbound flights and immediate city exit.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-emerald-800">
                Operating: 24 Hours
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold">
                <MapPin className="h-4 w-4" />
                <span>Baner High Street</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mt-1">Western Pune Corridor</h3>
              <p className="text-xs text-slate-500 mt-1">
                Near expressway bypass for quick escapes to Mumbai or Goa.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-slate-700">
                Operating: 6 AM - 11 PM
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold">
                <MapPin className="h-4 w-4" />
                <span>Nashik City Centre</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mt-1">Untwadi Road Mall Hub</h3>
              <p className="text-xs text-slate-500 mt-1">
                Central access point for vineyards and city business trips.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-slate-700">
                Operating: 7 AM - 10 PM
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold">
                <MapPin className="h-4 w-4" />
                <span>Mumbai Naka Nashik</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mt-1">National Highway Hub</h3>
              <p className="text-xs text-slate-500 mt-1">
                Direct highway junction for Shirdi, Igatpuri, and Mumbai transit.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-slate-700">
                Operating: 6 AM - 11 PM
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CALL TO ACTION ===== */}
      <section className="bg-slate-900 py-16 text-white text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold sm:text-4xl text-white">
            Ready to hit the road in Pune or Nashik?
          </h2>
          <p className="mt-3 text-sm text-slate-300 max-w-xl mx-auto">
            Book now and enjoy transparent prices, clean vehicles, and complete peace of mind.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/cars?city=pune"
              className="rounded-xl bg-amber-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-md hover:bg-amber-400 transition-all cursor-pointer"
            >
              Book in Pune
            </Link>
            <Link
              href="/cars?city=nashik"
              className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-bold text-white shadow-xs hover:bg-slate-700 transition-all cursor-pointer"
            >
              Book in Nashik
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
