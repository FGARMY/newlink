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
} from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { VehicleCard } from '../../components/VehicleCard';
import { Footer } from '../../components/Footer';
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

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('ALL');
  const [selectedFuel, setSelectedFuel] = useState<string>('ALL');
  const [selectedSeats, setSelectedSeats] = useState<string>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [sortBy, setSortBy] = useState<string>('RECOMMENDED');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter and Sort Logic
  const filteredCars = useMemo(() => {
    return ALL_CARS.filter((car) => {
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

      return true;
    }).sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.dailyRatePaise - b.dailyRatePaise;
      if (sortBy === 'PRICE_DESC') return b.dailyRatePaise - a.dailyRatePaise;
      if (sortBy === 'RATING') return b.ratingAvg - a.ratingAvg;
      return b.ratingCount - a.ratingCount; // RECOMMENDED
    });
  }, [
    city,
    location,
    selectedCategory,
    selectedTransmission,
    selectedFuel,
    selectedSeats,
    maxPrice,
    sortBy,
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF8] text-slate-900 font-sans">
      <Navbar selectedCity={city} />

      {/* Top Search Context Bar */}
      <div className="border-b border-slate-200 bg-white py-4 shadow-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Searching In
              </div>
              <div className="text-base font-bold text-slate-900 capitalize">
                {city === 'nashik' ? 'Nashik' : 'Pune'}
                {location && location !== 'all' && (
                  <span className="text-xs font-normal text-slate-500 ml-1.5">
                    ({location.replace('loc-pn-', '').replace('loc-ns-', '')})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Date Badge */}
          {start && end && (
            <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
              <Calendar className="h-3.5 w-3.5 text-amber-600" />
              <span>
                {start.split('T')[0]} to {end.split('T')[0]}
              </span>
            </div>
          )}

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-xs md:hidden"
          >
            <Filter className="h-4 w-4 text-amber-600" />
            <span>Filters ({filteredCars.length})</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Left Filter Sidebar (Desktop) */}
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-24 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <SlidersHorizontal className="h-4 w-4 text-amber-600" />
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
                className="text-xs font-semibold text-amber-600 hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Price Slider */}
            <div className="mt-5 border-b border-slate-100 pb-5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Max Daily Rate: ₹{maxPrice.toLocaleString('en-IN')}
              </label>
              <input
                type="range"
                min="1500"
                max="6000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-2 w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹1,500</span>
                <span>₹6,000</span>
              </div>
            </div>

            {/* Vehicle Type / Category */}
            <div className="mt-5 border-b border-slate-100 pb-5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
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
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer hover:text-slate-900"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === item.id}
                      onChange={() => setSelectedCategory(item.id)}
                      className="accent-amber-600"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div className="mt-5 border-b border-slate-100 pb-5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Transmission
              </label>
              <div className="mt-2.5 flex gap-2">
                {['ALL', 'AUTOMATIC', 'MANUAL'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTransmission(t)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      selectedTransmission === t
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {t === 'ALL' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Fuel Type */}
            <div className="mt-5 border-b border-slate-100 pb-5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Fuel Type
              </label>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {['ALL', 'DIESEL', 'PETROL'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFuel(f)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      selectedFuel === f
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Seating Capacity */}
            <div className="mt-5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
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
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Available Cars in {city === 'nashik' ? 'Nashik' : 'Pune'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {filteredCars.length} verified vehicles with guaranteed availability
              </p>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 shadow-xs focus:border-amber-600 focus:outline-none"
              >
                <option value="RECOMMENDED">Recommended</option>
                <option value="PRICE_ASC">Price: Low to High</option>
                <option value="PRICE_DESC">Price: High to Low</option>
                <option value="RATING">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Cars Grid */}
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {filteredCars.map((car) => (
                <VehicleCard key={car.id} vehicle={car} searchParams={searchParams.toString()} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
              <Car className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-base font-bold text-slate-900">
                No vehicles match your current filters
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range, clearing fuel or transmission selections.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedTransmission('ALL');
                  setSelectedFuel('ALL');
                  setSelectedSeats('ALL');
                  setMaxPrice(6000);
                }}
                className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>

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
