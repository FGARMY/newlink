'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
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
  Briefcase,
  Plane,
  Car,
  Zap,
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
import { HubLocatorModal } from '../../../components/HubLocatorModal';
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

  const mode = searchParams.get('mode') || 'daily';

  // Initial duration calculation based on search dates or selected mode
  const initialDays = useMemo(() => {
    const startStr = searchParams.get('start');
    const endStr = searchParams.get('end');
    if (startStr && endStr) {
      const s = new Date(startStr).getTime();
      const e = new Date(endStr).getTime();
      const diffDays = Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)));
      if (!isNaN(diffDays) && diffDays > 0) return diffDays;
    }
    if (mode === 'subscription') return 30;
    if (mode === 'weekday') return 5;
    return 2;
  }, [searchParams, mode]);

  // Rental duration calculations
  const [days, setDays] = useState(initialDays);
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

  // Add-ons State
  const [zeroLiability, setZeroLiability] = useState(false);
  const [fastagPack, setFastagPack] = useState<'NONE' | 'PACK_500' | 'PACK_1000'>('NONE');
  const [doorstepDelivery, setDoorstepDelivery] = useState(false);
  const [deliveryPincode, setDeliveryPincode] = useState('411014');
  const [hubModalOpen, setHubModalOpen] = useState(false);

  // Mode adjustments
  const modeDiscountRate = mode === 'subscription' ? 0.35 : mode === 'weekday' ? 0.20 : 0;
  const rawDailyRateRupees = vehicle.dailyRatePaise / 100;
  const dailyRateRupees = modeDiscountRate > 0 ? Math.round(rawDailyRateRupees * (1 - modeDiscountRate)) : rawDailyRateRupees;
  const baseRental = rawDailyRateRupees * days;
  const modeDiscountAmount = Math.round(baseRental * modeDiscountRate);
  const effectiveBaseRental = baseRental - modeDiscountAmount;

  // Add-on Cost Calculations
  const smartShieldCost = zeroLiability ? 299 * days : 0;
  const fastagCost = fastagPack === 'PACK_500' ? 500 : fastagPack === 'PACK_1000' ? 1000 : 0;
  const isFreeDelivery = mode === 'subscription';
  const deliveryCost = doorstepDelivery ? (isFreeDelivery ? 0 : 499) : 0;
  const totalAddOnsCost = smartShieldCost + fastagCost + deliveryCost;

  const isPunePin = /^411\d{3}$/.test(deliveryPincode.trim());
  const isNashikPin = /^422\d{3}$/.test(deliveryPincode.trim());
  const isPincodeValid = isPunePin || isNashikPin;

  const [appliedDiscountAmount, setAppliedDiscountAmount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);

  const taxableValue = Math.max(0, effectiveBaseRental - appliedDiscountAmount);
  const gst = Math.round(taxableValue * 0.18);
  const rentalTotal = taxableValue + gst + totalAddOnsCost;

  // Deposit calculation: Zero liability or weekday pass completely waives deposit!
  const baseDeposit = mode === 'subscription'
    ? Math.round((vehicle.securityDepositPaise / 100) * 0.5) // 50% deposit discount for subscribers
    : mode === 'weekday'
    ? 0 // Zero deposit for verified weekday office commuters
    : vehicle.securityDepositPaise / 100;
  const deposit = zeroLiability ? 0 : baseDeposit;

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
    } else if (code === 'WELCOME500' || code === 'SPEION' || code === 'NEWLINK') {
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
    <div className="flex min-h-screen flex-col bg-canvas text-white font-sans">
      <Navbar selectedCity={vehicle.cityId === 'city-nashik' ? 'nashik' : 'pune'} />

      {/* Breadcrumb Bar */}
      <div className="border-b border-white/10 bg-card py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 text-xs font-semibold text-slate-400 sm:px-6 lg:px-8">
          <Link href="/cars" className="flex items-center gap-1 hover:text-white">
            <ChevronLeft className="h-4 w-4" />
            <span>Back to All Cars</span>
          </Link>
          <span>/</span>
          <span className="capitalize">{vehicle.cityName}</span>
          <span>/</span>
          <span className="text-white font-bold">
            {vehicle.brand} {vehicle.model}
          </span>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Column: Gallery & Details (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Main Vehicle Image */}
            <div className="relative aspect-16/10 w-full overflow-hidden rounded-3xl border border-white/10 bg-card shadow-md">
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
              <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-300 shadow-sm backdrop-blur-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Verified Fleet</span>
              </div>
            </div>

            {/* Vehicle Title & Key Specs */}
            <div className="rounded-2xl border border-white/10 bg-card p-6 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                {vehicle.brand} • {vehicle.registrationYear}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {vehicle.brand} {vehicle.model}
                {vehicle.variant && (
                  <span className="ml-2 text-sm font-semibold text-slate-400">
                    {vehicle.variant}
                  </span>
                )}
              </h1>

              {/* Specs Pills */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="flex items-center gap-2.5 rounded-xl bg-surface/50 p-3 border border-white/5">
                  <Gauge className="h-4 w-4 text-blue-400" />
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-bold">
                      Transmission
                    </div>
                    <div className="text-xs font-bold text-slate-100 capitalize">
                      {vehicle.transmission.toLowerCase()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl bg-surface/50 p-3 border border-white/5">
                  <Fuel className="h-4 w-4 text-blue-400" />
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-bold">Fuel Type</div>
                    <div className="text-xs font-bold text-slate-100 capitalize">
                      {vehicle.fuel.toLowerCase()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl bg-surface/50 p-3 border border-white/5">
                  <Users className="h-4 w-4 text-blue-400" />
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-bold">Seating</div>
                    <div className="text-xs font-bold text-slate-100">{vehicle.seats} Adults</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl bg-surface/50 p-3 border border-white/5">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  <div>
                    <div className="text-[10px] uppercase text-slate-400 font-bold">Toll Tag</div>
                    <div className="text-xs font-bold text-slate-100">Fastag Enabled</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Features */}
            <div className="rounded-2xl border border-white/10 bg-card p-6 shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Key Vehicle Features
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {vehicle.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs font-medium text-slate-200"
                  >
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pickup Location Info */}
            <div className="rounded-2xl border border-white/10 bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  Pickup & Handover Location
                </h3>
                <button
                  type="button"
                  onClick={() => setHubModalOpen(true)}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline flex items-center gap-1 cursor-pointer"
                >
                  View Bay Guide & Map
                </button>
              </div>
              <div className="mt-3">
                <div className="text-base font-bold text-white">{vehicle.locationName}</div>
                <div className="text-xs text-slate-400 mt-1">
                  Designated Speion Cars parking zone. Our ground staff will conduct a quick 3-minute
                  photo & odometer handover.
                </div>
              </div>
            </div>

            {/* Speion Quality & Fresh Fleet Guarantee */}
            <div className="rounded-2xl border border-white/10 bg-card p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    <span>Speion Fresh Fleet Guarantee</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Starting fresh across Pune &amp; Nashik with verified, sanitized cars.
                  </p>
                </div>
                <span className="self-start sm:self-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                  Fresh Fleet 2026
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-surface/50 border border-white/5">
                  <div className="text-xs font-bold text-white">Full Sanitization</div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Multi-point cabin disinfection and vacuum cleaning before each booking handover.
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface/50 border border-white/5">
                  <div className="text-xs font-bold text-white">Zero Deposit Option</div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Fast KYC verification with prompt automated deposit settlements.
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface/50 border border-white/5">
                  <div className="text-xs font-bold text-white">24/7 Roadside Assist</div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Dedicated round-the-clock emergency support across Maharashtra highways.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Transparent Pricing & Booking Box (5 cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl border border-white/10 bg-card p-6 shadow-xl">
              {/* Mode Active Badge */}
              {mode !== 'daily' && (
                <div className="mb-4 rounded-2xl border border-primary/30 bg-primary/10 p-3.5 text-xs text-emerald-300">
                  <div className="flex items-center gap-2 font-bold text-white">
                    {mode === 'subscription' && <Sparkles className="h-4 w-4 text-emerald-400" />}
                    {mode === 'weekday' && <Briefcase className="h-4 w-4 text-emerald-400" />}
                    {mode === 'outstation' && <Plane className="h-4 w-4 text-emerald-400" />}
                    <span>
                      {mode === 'subscription'
                        ? '35% Subscription Savings Active'
                        : mode === 'weekday'
                        ? '20% Weekday Commuter Pass Active'
                        : 'Airport & Highway Outstation Mode'}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-300 leading-relaxed">
                    {mode === 'subscription'
                      ? 'Free doorstep handover, regular maintenance & 50% deposit discount.'
                      : mode === 'weekday'
                      ? 'Mon-Fri package with 500 free KMs and zero security deposit.'
                      : 'Airport terminal bay handover with unlimited highway KMs.'}
                  </div>
                </div>
              )}

              <div className="flex items-baseline justify-between border-b border-white/5 pb-4">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Rental Rate
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-white">
                      ₹{dailyRateRupees.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-medium text-slate-400">/day</span>
                    {modeDiscountRate > 0 && (
                      <span className="text-xs text-slate-500 line-through">
                        ₹{rawDailyRateRupees.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                    Available Now
                  </span>
                </div>
              </div>

              {/* Duration Selector */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">Trip Duration</label>
                  {mode === 'subscription' && (
                    <span className="text-[11px] font-semibold text-emerald-400">Min 7 days</span>
                  )}
                  {mode === 'weekday' && (
                    <span className="text-[11px] font-semibold text-blue-400">Mon-Fri (5-15 Days)</span>
                  )}
                </div>
                <div className="mt-2 flex gap-2">
                  {(mode === 'subscription'
                    ? [7, 14, 30, 60]
                    : mode === 'weekday'
                    ? [5, 10, 15]
                    : [1, 2, 3, 5, 7]
                  ).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDays(d)}
                      className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                        days === d
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                          : 'bg-surface text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      {d} {d === 1 ? 'Day' : 'Days'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trip Add-ons Selection */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">Trip Add-ons &amp; Protection</label>
                  <span className="text-[10px] text-emerald-400 font-semibold">Optional Perks</span>
                </div>

                {/* 1. Smart Shield Zero Liability */}
                <div
                  onClick={() => setZeroLiability(!zeroLiability)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    zeroLiability
                      ? 'border-emerald-500/40 bg-emerald-500/10 shadow-xs'
                      : 'border-white/10 bg-surface/40 hover:bg-surface/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={zeroLiability}
                        onChange={() => {}}
                        className="mt-0.5 accent-emerald-500 rounded h-4 w-4"
                      />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5 flex-wrap">
                          <span>Smart Shield Zero Liability</span>
                          <span className="rounded bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 text-[9px] font-extrabold uppercase">
                            Zero Deposit
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                          Cap financial liability to ₹0 for scratches, dents &amp; mishaps. Waives security deposit!
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-emerald-400">+₹299/day</span>
                    </div>
                  </div>
                </div>

                {/* 2. Fastag Pre-Loaded Toll Pass */}
                <div className="p-3 rounded-2xl border border-white/10 bg-surface/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-amber-400" />
                      <span>Pre-Loaded Fastag Toll Pass</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Expressway Ready</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    {[
                      { id: 'NONE', label: 'No Pass' },
                      { id: 'PACK_500', label: '+₹500 Pass' },
                      { id: 'PACK_1000', label: '+₹1,000 Pass' },
                    ].map((pack) => (
                      <button
                        key={pack.id}
                        type="button"
                        onClick={() => setFastagPack(pack.id as any)}
                        className={`rounded-xl py-1.5 text-[11px] font-bold border transition-all cursor-pointer ${
                          fastagPack === pack.id
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                            : 'bg-surface/50 border-white/5 text-slate-300 hover:bg-surface'
                        }`}
                      >
                        {pack.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Doorstep Express Delivery & Return */}
                <div className={`p-3 rounded-2xl border transition-all ${
                  doorstepDelivery
                    ? 'border-blue-500/40 bg-blue-500/10'
                    : 'border-white/10 bg-surface/40'
                }`}>
                  <div
                    onClick={() => setDoorstepDelivery(!doorstepDelivery)}
                    className="flex items-start justify-between gap-2 cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={doorstepDelivery}
                        onChange={() => {}}
                        className="mt-0.5 accent-blue-500 rounded h-4 w-4"
                      />
                      <div>
                        <div className="text-xs font-bold text-white">
                          Doorstep Express Delivery &amp; Return
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                          {isFreeDelivery
                            ? 'Free with Subscription mode!'
                            : 'Vehicle delivered directly to your doorstep in Pune or Nashik.'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-blue-400">
                        {isFreeDelivery ? 'FREE' : '+₹499'}
                      </span>
                    </div>
                  </div>

                  {doorstepDelivery && (
                    <div className="mt-2.5 pt-2 border-t border-white/10 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="Enter 6-digit Pincode"
                          value={deliveryPincode}
                          onChange={(e) => setDeliveryPincode(e.target.value)}
                          className="w-32 rounded-xl border border-white/15 bg-card px-2.5 py-1.5 font-mono text-xs text-white focus:border-blue-500 focus:outline-none"
                        />
                        <span className={`text-[11px] font-semibold ${
                          isPincodeValid ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {isPincodeValid
                            ? isPunePin ? '✓ Pune Pincode Verified' : '✓ Nashik Pincode Verified'
                            : 'Enter 411xxx or 422xxx'}
                        </span>
                      </div>
                    </div>
                  )}
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
                    className="flex-1 rounded-xl border border-white/15 px-3 py-2 text-xs uppercase font-bold text-white placeholder:normal-case placeholder:font-normal focus:border-blue-600 focus:outline-hidden disabled:bg-surface disabled:text-slate-400"
                  />
                  {couponApplied ? (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="rounded-xl bg-rose-500/10 border border-rose-500/30 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  )}
                </form>

                {couponError && (
                  <p className="mt-1.5 text-[11px] font-medium text-rose-400">{couponError}</p>
                )}

                {couponApplied && (
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                      Promo <strong>{couponCode}</strong> applied!
                    </span>
                    <span className="font-bold text-emerald-400">
                      -₹{appliedDiscountAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                {!couponApplied && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="text-slate-400">Try:</span>
                    <button
                      type="button"
                      onClick={() => applyPromo('PUNE10')}
                      className="rounded-md bg-surface px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-200 hover:bg-blue-500/15 hover:text-blue-200 cursor-pointer"
                    >
                      PUNE10 (10%)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPromo('FIRSTDRIVE')}
                      className="rounded-md bg-surface px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-200 hover:bg-blue-500/15 hover:text-blue-200 cursor-pointer"
                    >
                      FIRSTDRIVE (15%)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPromo('WINEWEEKEND')}
                      className="rounded-md bg-surface px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-200 hover:bg-blue-500/15 hover:text-blue-200 cursor-pointer"
                    >
                      WINEWEEKEND (₹500)
                    </button>
                  </div>
                )}
              </div>

              {/* Transparent Pricing Breakdown (PRD §21) */}
              <div className="mt-5 space-y-2.5 rounded-2xl bg-surface/50 p-4 border border-white/5 text-xs text-slate-200">
                <div className="flex justify-between">
                  <span>
                    Base Rental ({days} days @ ₹{rawDailyRateRupees.toLocaleString('en-IN')})
                  </span>
                  <span className="font-semibold text-white">
                    ₹{baseRental.toLocaleString('en-IN')}
                  </span>
                </div>

                {modeDiscountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      {mode === 'subscription' ? 'Subscription Discount (35%)' : 'Weekday Pass Discount (20%)'}
                    </span>
                    <span>-₹{modeDiscountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {smartShieldCost > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Smart Shield Zero Liability ({days}d @ ₹299/d)</span>
                    <span>+₹{smartShieldCost.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {fastagCost > 0 && (
                  <div className="flex justify-between text-amber-300 font-semibold">
                    <span>Pre-Loaded Fastag Pass ({fastagPack === 'PACK_500' ? '₹500' : '₹1,000'})</span>
                    <span>+₹{fastagCost.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {doorstepDelivery && (
                  <div className="flex justify-between text-blue-300 font-semibold">
                    <span>Doorstep Express Delivery ({isFreeDelivery ? 'Free' : 'Pune/Nashik'})</span>
                    <span>{isFreeDelivery ? 'FREE' : `+₹${deliveryCost.toLocaleString('en-IN')}`}</span>
                  </div>
                )}

                {appliedDiscountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Coupon Discount ({couponCode})</span>
                    <span>-₹{appliedDiscountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Taxes (GST 18%)</span>
                  <span className="font-semibold text-white">
                    ₹{gst.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between border-t border-white/10 pt-2 text-white font-bold">
                  <span>Rental &amp; Add-ons Total</span>
                  <span>₹{rentalTotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between border-t border-white/10 pt-2 text-slate-300">
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-emerald-400" />
                    Refundable Security Deposit
                    {zeroLiability && (
                      <span className="text-[10px] text-emerald-400 font-bold ml-1">(Waived by Smart Shield)</span>
                    )}
                    {!zeroLiability && mode === 'subscription' && (
                      <span className="text-[10px] text-emerald-400 font-bold ml-1">(50% Off)</span>
                    )}
                    {!zeroLiability && mode === 'weekday' && (
                      <span className="text-[10px] text-emerald-400 font-bold ml-1">(Zero Deposit)</span>
                    )}
                  </span>
                  <span className="font-semibold text-white">
                    {deposit === 0 ? '₹0 (Waived)' : `₹${deposit.toLocaleString('en-IN')}`}
                  </span>
                </div>
              </div>

              {/* Total Payable */}
              <div className="mt-5 flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Total Payable Now
                  </div>
                  <div className="text-2xl font-extrabold text-white">
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
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-500 transition-all cursor-pointer hover:shadow-xl active:scale-98"
              >
                <span>Book Now (10-Min Hold)</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Instant confirmation • Server-guaranteed no double booking</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ===== MULTI-STEP CHECKOUT & PAYMENT MODAL ===== */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-card p-6 sm:p-8 shadow-2xl border border-white/5">
            {/* STEP 3: PAYMENT CONFIRMED */}
            {checkoutStep === 'CONFIRMED' && confirmedBookingData ? (
              <div className="text-center py-2">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 shadow-xs">
                  <CheckCircle2 className="h-10 w-10 stroke-2" />
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  <Sparkles className="h-3 w-3" />
                  Payment Verified • Booking Confirmed
                </div>
                <h3 className="mt-2 text-2xl font-black text-white">You're Ready to Roll!</h3>

                <div className="mt-4 rounded-2xl bg-surface/50 p-4 border border-white/10 text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-semibold">Booking Reference</span>
                    <span className="font-mono text-sm font-extrabold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/30">
                      {confirmedBookingData.reference}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-2.5">
                    <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                      <KeyRound className="h-3.5 w-3.5 text-slate-400" />
                      Digital Pickup Passcode
                    </span>
                    <span className="font-mono text-base font-black text-white bg-card px-2.5 py-0.5 rounded-md border border-white/15 shadow-2xs">
                      {confirmedBookingData.passcode}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-2.5 text-xs">
                    <span className="text-slate-400">Pick-up Location</span>
                    <span className="font-bold text-slate-100">
                      {vehicle.cityName} ({vehicle.locationName})
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-2.5 text-xs">
                    <span className="text-slate-400">Amount Paid (Incl. Deposit)</span>
                    <span className="font-bold text-emerald-400">
                      ₹{totalPayable.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-400 leading-relaxed">
                  Show your 4-digit pickup passcode to the Speion Cars fleet executive at Parking Bay.
                  Your vehicle will be unlocked after digital handover inspection.
                </p>

                <div className="mt-6 flex flex-col gap-2.5">
                  <button
                    id="view-trip-in-account-btn"
                    onClick={() => {
                      setBookingModalOpen(false);
                      router.push('/account');
                    }}
                    className="w-full rounded-xl bg-blue-600 py-3.5 text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-md cursor-pointer"
                  >
                    Go to My Account & Digital Handover
                  </button>

                  <button
                    onClick={() => {
                      setBookingModalOpen(false);
                      setCheckoutStep('DETAILS');
                      router.push('/cars');
                    }}
                    className="w-full rounded-xl border border-white/10 bg-card py-2.5 text-xs font-bold text-slate-200 hover:bg-surface/50 cursor-pointer"
                  >
                    Done & Return to Fleet
                  </button>
                </div>
              </div>
            ) : checkoutStep === 'PAYMENT' ? (
              /* STEP 2: PAYMENT GATEWAY */
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      256-Bit SSL Secured Checkout
                    </div>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      Select Payment Method
                    </h3>
                  </div>
                  <button
                    onClick={() => setBookingModalOpen(false)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-surface hover:text-slate-200"
                  >
                    ✕
                  </button>
                </div>

                {/* Amount Ribbon */}
                <div className="mt-4 rounded-2xl bg-luxury-gradient border border-blue-500/20 p-4 text-white flex items-center justify-between shadow-lg shadow-blue-950/40">
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
                        ? 'border-blue-600 bg-blue-500/10 text-blue-200 shadow-2xs'
                        : 'border-white/10 text-slate-300 hover:border-white/15'
                    }`}
                  >
                    <QrCode className="h-5 w-5 text-blue-400" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === 'CARD'
                        ? 'border-blue-600 bg-blue-500/10 text-blue-200 shadow-2xs'
                        : 'border-white/10 text-slate-300 hover:border-white/15'
                    }`}
                  >
                    <CreditCard className="h-5 w-5 text-blue-400" />
                    <span>Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NET_BANKING')}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === 'NET_BANKING'
                        ? 'border-blue-600 bg-blue-500/10 text-blue-200 shadow-2xs'
                        : 'border-white/10 text-slate-300 hover:border-white/15'
                    }`}
                  >
                    <Building2 className="h-5 w-5 text-blue-400" />
                    <span>Net Banking</span>
                  </button>
                </div>

                {/* Method Details Form */}
                <div className="mt-4 p-4 rounded-2xl border border-white/10 bg-surface/50">
                  {paymentMethod === 'UPI' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                        <span>Pay via UPI App or VPA ID</span>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded">
                          Zero Fee
                        </span>
                      </div>
                      <div>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. mobile@upi / yourname@oksbi"
                          className="w-full rounded-xl border border-white/15 bg-card px-3.5 py-2 text-xs font-medium text-white focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Supports GPay, PhonePe, Paytm, BHIM UPI</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'CARD' && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-slate-300 font-semibold block mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          defaultValue="4532 8821 9901 8812"
                          className="w-full rounded-xl border border-white/15 bg-card px-3 py-2 font-mono text-white focus:border-blue-600 focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-300 font-semibold block mb-1">
                            Valid Thru
                          </label>
                          <input
                            type="text"
                            defaultValue="08/29"
                            className="w-full rounded-xl border border-white/15 bg-card px-3 py-2 font-mono text-white focus:border-blue-600 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-slate-300 font-semibold block mb-1">CVV</label>
                          <input
                            type="password"
                            defaultValue="882"
                            className="w-full rounded-xl border border-white/15 bg-card px-3 py-2 font-mono text-white focus:border-blue-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'NET_BANKING' && (
                    <div className="space-y-2 text-xs">
                      <span className="text-slate-300 font-semibold block">Select Your Bank</span>
                      <div className="grid grid-cols-2 gap-2 font-semibold text-slate-100">
                        <div className="p-2.5 rounded-xl border border-white/10 bg-card text-center hover:border-blue-600 cursor-pointer">
                          HDFC Bank
                        </div>
                        <div className="p-2.5 rounded-xl border border-white/10 bg-card text-center hover:border-blue-600 cursor-pointer">
                          ICICI Bank
                        </div>
                        <div className="p-2.5 rounded-xl border border-white/10 bg-card text-center hover:border-blue-600 cursor-pointer">
                          SBI
                        </div>
                        <div className="p-2.5 rounded-xl border border-white/10 bg-card text-center hover:border-blue-600 cursor-pointer">
                          Axis Bank
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-5 flex items-center justify-between gap-3 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('DETAILS')}
                    className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
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
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">Complete Your Reservation</h3>
                    <p className="text-xs text-slate-400">
                      10-Minute Lock for {vehicle.brand} {vehicle.model}
                    </p>
                  </div>
                  <button
                    onClick={() => setBookingModalOpen(false)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-surface hover:text-slate-200"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleProceedToPayment} className="mt-5 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-200">
                      Full Name (as per Driving License)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/15 px-3.5 py-2.5 text-xs font-medium text-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-200">
                      Mobile Number (for OTP & Trip Updates)
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-white/15 px-3.5 py-2.5 text-xs font-medium text-white focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div className="rounded-xl bg-amber-500/10 p-3 text-xs text-amber-200 border border-amber-500/30 flex items-start gap-2">
                    <FileCheck className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      Driving License photo will be verified before vehicle handover at{' '}
                      {vehicle.locationName}.
                    </span>
                  </div>

                  <div className="border-t border-white/5 pt-3">
                    <div className="flex justify-between text-xs font-bold text-white mb-4">
                      <span>Total Amount:</span>
                      <span>₹{totalPayable.toLocaleString('en-IN')} (Incl. Deposit)</span>
                    </div>

                    <button
                      type="submit"
                      id="proceed-to-payment-btn"
                      className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition-all cursor-pointer flex items-center justify-center gap-1.5"
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

      {/* Official Pune & Nashik Hub Locator Modal */}
      <HubLocatorModal
        isOpen={hubModalOpen}
        onClose={() => setHubModalOpen(false)}
        selectedCity={vehicle.cityId === 'city-nashik' ? 'nashik' : 'pune'}
      />

      <Footer />
    </div>
  );
}
