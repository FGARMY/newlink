'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Shield,
  ShieldCheck,
  Check,
  MapPin,
  Calendar,
  Clock,
  Gauge,
  Fuel,
  Users,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Phone,
  FileCheck,
  AlertCircle,
  CreditCard,
  QrCode,
  Building2,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import type { VehicleCard as VehicleCardType } from '@newlink/contracts';

const ALL_CARS: Record<string, VehicleCardType> = {
  'veh-creta-pn': {
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
    features: [
      'Ventilated Seats',
      'Panoramic Sunroof',
      'Cruise Control',
      'Wireless CarPlay',
      'Bose Sound',
      'Air Purifier',
    ],
    isAvailable: true,
  },
  'veh-xuv700-pn': {
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
    features: [
      'ADAS Level 2',
      'Sony 12-Speaker Audio',
      'Panoramic Skyroof',
      'AWD Drive Modes',
      'Memory Seats',
    ],
    isAvailable: true,
  },
  'veh-carens-pn': {
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
      'Type-C Fast Charging',
    ],
    isAvailable: true,
  },
  'veh-innova-pn': {
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
      'Captain Seats',
      'Spacious Boot Space',
      'Cruise Control',
      'Legendary Reliability',
      'Rear Climate Control',
    ],
    isAvailable: true,
  },
  'veh-dzire-pn': {
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
      '22 km/l Mileage',
      'Apple CarPlay',
      'Push Button Start',
      'Keyless Entry',
      'Rear Parking Camera',
    ],
    isAvailable: true,
  },
  'veh-creta-ns': {
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
    features: [
      'Ventilated Seats',
      'Panoramic Sunroof',
      'Cruise Control',
      'Wireless CarPlay',
      'Bose Sound',
    ],
    isAvailable: true,
  },
  'veh-fortuner-ns': {
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
      'JBL Sound',
      'Ventilated Seats',
      'Diff Locks',
    ],
    isAvailable: true,
  },
};

export default function VehicleDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = String(params.id);
  const vehicle = ALL_CARS[id] || ALL_CARS['veh-creta-pn'];

  // Rental duration calculations
  const [days, setDays] = useState(2);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'DETAILS' | 'PAYMENT' | 'CONFIRMED'>('DETAILS');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NET_BANKING'>('UPI');
  const [upiId, setUpiId] = useState('rahul@oksbi');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<{
    reference: string;
    passcode: string;
    paymentId: string;
  } | null>(null);

  // Customer form
  const [name, setName] = useState('Aarav Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');

  // Financial calculations
  const dailyRateRupees = vehicle.dailyRatePaise / 100;
  const baseRental = dailyRateRupees * days;
  const [appliedDiscountAmount, setAppliedDiscountAmount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);

  const taxableValue = Math.max(0, baseRental - appliedDiscountAmount);
  const gst = Math.round(taxableValue * 0.18);
  const rentalTotal = taxableValue + gst;
  const deposit = vehicle.securityDepositPaise / 100;
  const totalPayable = rentalTotal + deposit;

  const applyPromo = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    setCouponError(null);

    if (code === 'PUNE10') {
      const disc = Math.min(Math.round(baseRental * 0.1), 1000);
      setAppliedDiscountAmount(disc);
      setCouponApplied(true);
      setCouponCode(code);
    } else if (code === 'FIRSTDRIVE') {
      const disc = Math.min(Math.round(baseRental * 0.15), 1500);
      setAppliedDiscountAmount(disc);
      setCouponApplied(true);
      setCouponCode(code);
    } else if (code === 'WINEWEEKEND') {
      const disc = Math.min(500, baseRental);
      setAppliedDiscountAmount(disc);
      setCouponApplied(true);
      setCouponCode(code);
    } else if (code === 'MONSOON20') {
      const disc = Math.min(Math.round(baseRental * 0.2), 2000);
      setAppliedDiscountAmount(disc);
      setCouponApplied(true);
      setCouponCode(code);
    } else if (code === 'WELCOME500' || code === 'NEWLINK') {
      const disc = Math.min(500, baseRental);
      setAppliedDiscountAmount(disc);
      setCouponApplied(true);
      setCouponCode(code);
    } else {
      setCouponError(`Code "${code}" is invalid. Try PUNE10 or FIRSTDRIVE`);
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    applyPromo(couponCode);
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setAppliedDiscountAmount(0);
    setCouponCode('');
    setCouponError(null);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('PAYMENT');
  };

  const handleExecutePayment = async () => {
    setIsProcessingPayment(true);
    try {
      const cityCode = vehicle.cityId === 'city-nashik' ? 'NS' : 'PN';
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      const generatedRef = `NL-${cityCode}-${randomPart}`;
      const passcode = Math.floor(1000 + Math.random() * 9000).toString();
      const paymentId = `pay_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;

      await new Promise((r) => setTimeout(r, 700));

      const bookingRecord = {
        reference: generatedRef,
        passcode,
        paymentId,
        vehicle: {
          id: vehicle.id,
          brand: vehicle.brand,
          model: vehicle.model,
          variant: vehicle.variant,
          category: vehicle.category,
          primaryImageUrl: vehicle.primaryImageUrl,
          cityName: vehicle.cityName,
          locationName: vehicle.locationName,
          dailyRatePaise: vehicle.dailyRatePaise,
          securityDepositPaise: vehicle.securityDepositPaise,
        },
        customerName: name || 'Aarav Sharma',
        customerPhone: phone || '+91 98765 43210',
        days,
        totalPaidRupees: totalPayable,
        depositRupees: deposit,
        rentalRupees: rentalTotal,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        paymentMethod,
        createdAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem('newlink_active_booking', JSON.stringify(bookingRecord));
      } catch {
        // ignore
      }

      setConfirmedBookingData({
        reference: generatedRef,
        passcode,
        paymentId,
      });
      setCheckoutStep('CONFIRMED');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF8] text-slate-900 font-sans">
      <Navbar selectedCity={vehicle.cityId === 'city-nashik' ? 'nashik' : 'pune'} />

      {/* Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 text-xs font-semibold text-slate-500 sm:px-6 lg:px-8">
          <Link href="/cars" className="flex items-center gap-1 hover:text-slate-900">
            <ChevronLeft className="h-4 w-4" />
            <span>Back to All Cars</span>
          </Link>
          <span>/</span>
          <span className="capitalize">{vehicle.cityName}</span>
          <span>/</span>
          <span className="text-slate-900 font-bold">
            {vehicle.brand} {vehicle.model}
          </span>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Column: Gallery & Details (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Main Vehicle Image */}
            <div className="relative aspect-16/10 w-full overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-md">
              <Image
                src={vehicle.primaryImageUrl}
                alt={`${vehicle.brand} ${vehicle.model}`}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute top-4 left-4 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                {vehicle.category}
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-xs">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{vehicle.ratingAvg.toFixed(1)}</span>
                <span className="text-slate-400">({vehicle.ratingCount} reviews)</span>
              </div>
            </div>

            {/* Vehicle Title & Key Specs */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                {vehicle.brand} • {vehicle.registrationYear}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {vehicle.brand} {vehicle.model}
                {vehicle.variant && (
                  <span className="ml-2 text-sm font-semibold text-slate-500">
                    {vehicle.variant}
                  </span>
                )}
              </h1>

              {/* Specs Pills */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <Gauge className="h-4 w-4 text-amber-600" />
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-bold">
                      Transmission
                    </div>
                    <div className="text-xs font-bold text-slate-800 capitalize">
                      {vehicle.transmission.toLowerCase()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <Fuel className="h-4 w-4 text-amber-600" />
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-bold">Fuel Type</div>
                    <div className="text-xs font-bold text-slate-800 capitalize">
                      {vehicle.fuel.toLowerCase()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <Users className="h-4 w-4 text-amber-600" />
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-bold">Seating</div>
                    <div className="text-xs font-bold text-slate-800">{vehicle.seats} Adults</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-bold">Toll Tag</div>
                    <div className="text-xs font-bold text-slate-800">Fastag Enabled</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Features */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Key Vehicle Features
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {vehicle.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700"
                  >
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pickup Location Info */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-600" />
                Pickup & Handover Location
              </h3>
              <div className="mt-3">
                <div className="text-base font-bold text-slate-900">{vehicle.locationName}</div>
                <div className="text-xs text-slate-500 mt-1">
                  Designated Newlink parking zone. Our ground staff will conduct a quick 3-minute
                  photo & odometer handover.
                </div>
              </div>
            </div>

            {/* Verified Customer Reviews & Ratings (PRD §50) */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                    <span>Verified Renter Reviews & Ratings</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authentic feedback from customers who completed trips with this vehicle.
                  </p>
                </div>
                <span className="self-start sm:self-auto rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  100% Verified Trips
                </span>
              </div>

              {/* Rating Summary Breakdown */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <div className="sm:col-span-4 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-200/80 pb-3 sm:pb-0">
                  <span className="text-4xl font-black text-slate-900">4.92</span>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Based on 128 completed trips
                  </span>
                </div>

                <div className="sm:col-span-8 space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Vehicle Cleanliness & Sanitization</span>
                      <span className="font-bold text-slate-900">4.9 / 5.0</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full w-[98%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Mechanical Condition & AC Performance</span>
                      <span className="font-bold text-slate-900">4.9 / 5.0</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full w-[98%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-slate-700 mb-1">
                      <span>Handover Speed & Passcode Smoothness</span>
                      <span className="font-bold text-slate-900">5.0 / 5.0</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full w-[100%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Individual Reviews Stream */}
              <div className="mt-6 divide-y divide-slate-100 space-y-4">
                <div className="pt-4 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900">Aditya Kulkarni</span>
                      <span className="text-[10px] text-slate-400 ml-2">
                        Pune Airport Pickup • Oct 2026
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-3 w-3 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    "Immaculate condition! Picked up from Pune Airport in 2 minutes using the
                    digital passcode. Panoramic sunroof was a hit on our Lavasa weekend drive."
                  </p>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900">Sneha Kadam</span>
                      <span className="text-[10px] text-slate-400 ml-2">
                        Mumbai Renter • Sep 2026
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-3 w-3 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    "Super smooth automatic transmission. Full tank handed over, Fastag worked
                    effortlessly on the Mumbai-Pune Expressway."
                  </p>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900">Rohan Deshpande</span>
                      <span className="text-[10px] text-slate-400 ml-2">
                        Pune Baner Hub • Sep 2026
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4].map((s) => (
                        <Star key={s} className="h-3 w-3 text-amber-500 fill-amber-500" />
                      ))}
                      <Star className="h-3 w-3 text-slate-300" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    "Very well maintained Creta Turbo. Great driving dynamics and instant security
                    deposit settlement upon return."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Transparent Pricing & Booking Box (5 cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl">
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Rental Rate
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900">
                      ₹{dailyRateRupees.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-medium text-slate-500">/day</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                    Available Now
                  </span>
                </div>
              </div>

              {/* Duration Selector */}
              <div className="mt-4">
                <label className="text-xs font-bold text-slate-700">Trip Duration</label>
                <div className="mt-2 flex gap-2">
                  {[1, 2, 3, 5, 7].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDays(d)}
                      className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                        days === d
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {d} {d === 1 ? 'Day' : 'Days'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Coupon Input & Quick Suggestions */}
              <div className="mt-5">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. PUNE10)"
                    value={couponCode}
                    disabled={couponApplied}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs uppercase font-bold text-slate-900 placeholder:normal-case placeholder:font-normal focus:border-amber-600 focus:outline-hidden disabled:bg-slate-100 disabled:text-slate-500"
                  />
                  {couponApplied ? (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  )}
                </form>

                {couponError && (
                  <p className="mt-1.5 text-[11px] font-medium text-rose-600">{couponError}</p>
                )}

                {couponApplied && (
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 border border-emerald-200">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      Promo <strong>{couponCode}</strong> applied!
                    </span>
                    <span className="font-bold text-emerald-700">
                      -₹{appliedDiscountAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                {!couponApplied && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="text-slate-400">Try:</span>
                    <button
                      type="button"
                      onClick={() => applyPromo('PUNE10')}
                      className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700 hover:bg-amber-100 hover:text-amber-900 cursor-pointer"
                    >
                      PUNE10 (10%)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPromo('FIRSTDRIVE')}
                      className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700 hover:bg-amber-100 hover:text-amber-900 cursor-pointer"
                    >
                      FIRSTDRIVE (15%)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPromo('WINEWEEKEND')}
                      className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700 hover:bg-amber-100 hover:text-amber-900 cursor-pointer"
                    >
                      WINEWEEKEND (₹500)
                    </button>
                  </div>
                )}
              </div>

              {/* Transparent Pricing Breakdown (PRD §21) */}
              <div className="mt-5 space-y-2.5 rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>
                    Base Rental ({days} days @ ₹{dailyRateRupees.toLocaleString('en-IN')})
                  </span>
                  <span className="font-semibold text-slate-900">
                    ₹{baseRental.toLocaleString('en-IN')}
                  </span>
                </div>

                {appliedDiscountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount ({couponCode})</span>
                    <span>-₹{appliedDiscountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Taxes (GST 18%)</span>
                  <span className="font-semibold text-slate-900">
                    ₹{gst.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between border-t border-slate-200/80 pt-2 text-slate-900 font-bold">
                  <span>Rental Total</span>
                  <span>₹{rentalTotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between border-t border-slate-200/80 pt-2 text-slate-600">
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-emerald-700" />
                    Refundable Security Deposit
                  </span>
                  <span className="font-semibold text-slate-900">
                    ₹{deposit.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Total Payable */}
              <div className="mt-5 flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Total Payable Now
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">
                    ₹{totalPayable.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 text-right">
                  Includes deposit of ₹{deposit.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={() => setBookingModalOpen(true)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white shadow-md hover:bg-amber-600 transition-all cursor-pointer hover:shadow-xl active:scale-98"
              >
                <span>Book Now (10-Min Hold)</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Instant confirmation • Server-guaranteed no double booking</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ===== MULTI-STEP CHECKOUT & PAYMENT MODAL ===== */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100">
            {/* STEP 3: PAYMENT CONFIRMED */}
            {checkoutStep === 'CONFIRMED' && confirmedBookingData ? (
              <div className="text-center py-2">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-xs">
                  <CheckCircle2 className="h-10 w-10 stroke-2" />
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <Sparkles className="h-3 w-3" />
                  Payment Verified • Booking Confirmed
                </div>
                <h3 className="mt-2 text-2xl font-black text-slate-900">You're Ready to Roll!</h3>

                <div className="mt-4 rounded-2xl bg-slate-50 p-4 border border-slate-200 text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-semibold">Booking Reference</span>
                    <span className="font-mono text-sm font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      {confirmedBookingData.reference}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200/80 pt-2.5">
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <KeyRound className="h-3.5 w-3.5 text-slate-400" />
                      Digital Pickup Passcode
                    </span>
                    <span className="font-mono text-base font-black text-slate-900 bg-white px-2.5 py-0.5 rounded-md border border-slate-300 shadow-2xs">
                      {confirmedBookingData.passcode}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200/80 pt-2.5 text-xs">
                    <span className="text-slate-500">Pick-up Location</span>
                    <span className="font-bold text-slate-800">
                      {vehicle.cityName} ({vehicle.locationName})
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200/80 pt-2.5 text-xs">
                    <span className="text-slate-500">Amount Paid (Incl. Deposit)</span>
                    <span className="font-bold text-emerald-700">
                      ₹{totalPayable.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                  Show your 4-digit pickup passcode to the Newlink fleet executive at Parking Bay.
                  Your vehicle will be unlocked after digital handover inspection.
                </p>

                <div className="mt-6 flex flex-col gap-2.5">
                  <button
                    id="view-trip-in-account-btn"
                    onClick={() => {
                      setBookingModalOpen(false);
                      router.push('/account');
                    }}
                    className="w-full rounded-xl bg-slate-900 py-3.5 text-xs font-bold text-white hover:bg-amber-600 transition-all shadow-md cursor-pointer"
                  >
                    Go to My Account & Digital Handover
                  </button>

                  <button
                    onClick={() => {
                      setBookingModalOpen(false);
                      setCheckoutStep('DETAILS');
                      router.push('/cars');
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Done & Return to Fleet
                  </button>
                </div>
              </div>
            ) : checkoutStep === 'PAYMENT' ? (
              /* STEP 2: PAYMENT GATEWAY */
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      256-Bit SSL Secured Checkout
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      Select Payment Method
                    </h3>
                  </div>
                  <button
                    onClick={() => setBookingModalOpen(false)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    ✕
                  </button>
                </div>

                {/* Amount Ribbon */}
                <div className="mt-4 rounded-2xl bg-slate-900 p-4 text-white flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                      Total Amount Payable
                    </span>
                    <span className="text-xl font-extrabold text-white">
                      ₹{totalPayable.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-right text-[11px] text-slate-300">
                    <span>Deposit: ₹{deposit.toLocaleString('en-IN')} (Refundable)</span>
                    <span className="block text-emerald-400 font-semibold">
                      100% Secure Gateway
                    </span>
                  </div>
                </div>

                {/* Method Tabs */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === 'UPI'
                        ? 'border-amber-600 bg-amber-50/60 text-amber-900 shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <QrCode className="h-5 w-5 text-amber-600" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === 'CARD'
                        ? 'border-amber-600 bg-amber-50/60 text-amber-900 shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="h-5 w-5 text-amber-600" />
                    <span>Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NET_BANKING')}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === 'NET_BANKING'
                        ? 'border-amber-600 bg-amber-50/60 text-amber-900 shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Building2 className="h-5 w-5 text-amber-600" />
                    <span>Net Banking</span>
                  </button>
                </div>

                {/* Method Details Form */}
                <div className="mt-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                  {paymentMethod === 'UPI' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>Pay via UPI App or VPA ID</span>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                          Zero Fee
                        </span>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. mobile@upi / yourname@oksbi"
                          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-900 focus:border-amber-600 focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Supports GPay, PhonePe, Paytm, BHIM UPI</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'CARD' && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-slate-600 font-semibold block mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          defaultValue="4532 8821 9901 8812"
                          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-slate-900 focus:border-amber-600 focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-600 font-semibold block mb-1">
                            Valid Thru
                          </label>
                          <input
                            type="text"
                            defaultValue="08/29"
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-slate-900 focus:border-amber-600 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-slate-600 font-semibold block mb-1">CVV</label>
                          <input
                            type="password"
                            defaultValue="882"
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-slate-900 focus:border-amber-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'NET_BANKING' && (
                    <div className="space-y-2 text-xs">
                      <span className="text-slate-600 font-semibold block">Select Your Bank</span>
                      <div className="grid grid-cols-2 gap-2 font-semibold text-slate-800">
                        <div className="p-2.5 rounded-xl border border-slate-200 bg-white text-center hover:border-amber-600 cursor-pointer">
                          HDFC Bank
                        </div>
                        <div className="p-2.5 rounded-xl border border-slate-200 bg-white text-center hover:border-amber-600 cursor-pointer">
                          ICICI Bank
                        </div>
                        <div className="p-2.5 rounded-xl border border-slate-200 bg-white text-center hover:border-amber-600 cursor-pointer">
                          SBI
                        </div>
                        <div className="p-2.5 rounded-xl border border-slate-200 bg-white text-center hover:border-amber-600 cursor-pointer">
                          Axis Bank
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-5 flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('DETAILS')}
                    className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    ← Back to Details
                  </button>

                  <button
                    type="button"
                    id="pay-securely-btn"
                    disabled={isProcessingPayment}
                    onClick={handleExecutePayment}
                    className="rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying with Bank...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        <span>Pay ₹{totalPayable.toLocaleString('en-IN')} Securely</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* STEP 1: CUSTOMER DETAILS */
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Complete Your Reservation</h3>
                    <p className="text-xs text-slate-500">
                      10-Minute Lock for {vehicle.brand} {vehicle.model}
                    </p>
                  </div>
                  <button
                    onClick={() => setBookingModalOpen(false)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleProceedToPayment} className="mt-5 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700">
                      Full Name (as per Driving License)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-amber-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">
                      Mobile Number (for OTP & Trip Updates)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-amber-600 focus:outline-none"
                    />
                  </div>

                  <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200/80 flex items-start gap-2">
                    <FileCheck className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      Driving License photo will be verified before vehicle handover at{' '}
                      {vehicle.locationName}.
                    </span>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <div className="flex justify-between text-xs font-bold text-slate-900 mb-4">
                      <span>Total Amount:</span>
                      <span>₹{totalPayable.toLocaleString('en-IN')} (Incl. Deposit)</span>
                    </div>

                    <button
                      type="submit"
                      id="proceed-to-payment-btn"
                      className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-md hover:bg-amber-600 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
