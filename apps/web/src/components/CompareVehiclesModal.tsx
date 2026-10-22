'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  Check,
  Fuel,
  Users,
  Gauge,
  Shield,
  ArrowRight,
  Sparkles,
  Zap,
  Luggage,
  ShieldCheck,
  Compass,
  Radio,
  SlidersHorizontal,
  Flame,
  Award,
  CircleDollarSign,
  CalendarCheck,
  CheckCircle2,
} from 'lucide-react';
import type { VehicleCard as VehicleCardType } from '@newlink/contracts';

interface VehicleSpecs {
  tagline: string;
  engine: string;
  powerTorque: string;
  mileage: string;
  tankRange: string;
  bootSpace: string;
  groundClearance: string;
  sunroof: string;
  infotainment: string;
  soundSystem: string;
  climateControl: string;
  airbags: string;
  parkingAssist: string;
  adasCruise: string;
  hillAssist: string;
  idealFor: string;
}

const VEHICLE_SPECS_CATALOG: Record<string, VehicleSpecs> = {
  Creta: {
    tagline: 'Best-Selling Urban & Highway SUV',
    engine: '1.5L Turbo GDi (4-Cylinder Petrol/Diesel)',
    powerTorque: '160 PS @ 5500 RPM • 253 Nm Torque',
    mileage: '18.4 km/l ARAI Certified',
    tankRange: '50 Liters (~900 km Highway Range)',
    bootSpace: '433 Liters (3 Large Suitcases + 2 Duffle Bags)',
    groundClearance: '190 mm (Rough Ghats & Potholes Ready)',
    sunroof: 'Voice-Controlled Panoramic Sunroof',
    infotainment: '10.25" HD Screen + Wireless Apple CarPlay & Android Auto',
    soundSystem: 'Bose Premium 8-Speaker Acoustic System',
    climateControl: 'Dual-Zone Automatic Climate Control',
    airbags: '6 Airbags Standard (Front, Side & Curtain)',
    parkingAssist: '360° Surround View Camera + Front/Rear Sensors',
    adasCruise: 'Smart Cruise Control with Stop & Go',
    hillAssist: 'Hill-Start Assist Control (HAC) + ESC',
    idealFor: 'Couples & Small Families (Lonavala, Mahabaleshwar, Goa trips)',
  },
  Carens: {
    tagline: 'Supreme 7-Seater Family Cruiser',
    engine: '1.5L CRDi VGT Diesel Engine',
    powerTorque: '116 PS @ 4000 RPM • 250 Nm Torque',
    mileage: '19.8 km/l Diesel Efficiency',
    tankRange: '45 Liters (~880 km Highway Range)',
    bootSpace: '216L (All rows up) / 648L (3rd row folded)',
    groundClearance: '195 mm (High Stance MPV)',
    sunroof: 'Electric Sunroof with Anti-Pinch',
    infotainment: '10.25" Touchscreen with Navigation & Telematics',
    soundSystem: 'Kia 6-Speaker Hi-Fi Acoustic System',
    climateControl: 'Roof-Mounted AC Vents for 2nd & 3rd Rows with Diffuser',
    airbags: '6 Airbags (Standard across all trims)',
    parkingAssist: 'Rear HD Camera with Dynamic Guidelines & Sensors',
    adasCruise: 'Cruise Control with Steering Wheel Controls',
    hillAssist: 'Hill-Start Assist & Downhill Brake Control (DBC)',
    idealFor: 'Big Families & Group Tours (Shirdi, Nashik, Alibaug)',
  },
  XUV700: {
    tagline: 'Flagship Luxury SUV with ADAS & Skyroof',
    engine: '2.2L mHawk Turbocharged Diesel Engine',
    powerTorque: '185 PS @ 3500 RPM • 450 Nm High-Torque',
    mileage: '16.5 km/l Diesel Highway',
    tankRange: '60 Liters (~990 km Long-Haul Range)',
    bootSpace: '450 Liters (Flexible 7-Seat Layout)',
    groundClearance: '200 mm (True All-Terrain Clearance)',
    sunroof: 'Segment-Largest Panoramic Skyroof',
    infotainment: 'Dual 10.25" Super-Screen Curved Digital Cockpit',
    soundSystem: 'Sony 12-Speaker 3D Immersive Surround Audio',
    climateControl: 'Dual-Zone Auto AC + 3rd Row Independent Blower',
    airbags: '7 Airbags with Dedicated Driver Knee Airbag',
    parkingAssist: '360° HD Camera with Blind View Monitor in Cluster',
    adasCruise: 'ADAS Level 2 (Adaptive Cruise Control + Lane Keep)',
    hillAssist: 'Electronic Stability Program (ESP) + Hill Hold',
    idealFor: 'Executive Escapes, Expressway Cruising & VIP Hospitality',
  },
  Dzire: {
    tagline: 'Ultra-Frugal Easy-Drive City & Highway Sedan',
    engine: '1.2L DualJet Dual VVT Petrol Engine',
    powerTorque: '90 PS @ 6000 RPM • 113 Nm Torque',
    mileage: '22.4 km/l (Highest Mileage in Fleet)',
    tankRange: '37 Liters (~820 km Highway Range)',
    bootSpace: '378 Liters (2 Large Suitcases + Hand Baggage)',
    groundClearance: '163 mm (Comfort Sedated Ride)',
    sunroof: 'Not Applicable',
    infotainment: '7" SmartPlay Studio + Apple CarPlay & Android Auto',
    soundSystem: 'Arkamys Premium Sound Tuning (4 Speakers + 2 Tweeters)',
    climateControl: 'Automatic Climate Control + Dedicated Rear AC Vents',
    airbags: 'Dual Front Airbags + ABS with EBD & Brake Assist',
    parkingAssist: 'Reverse Parking Sensors & Camera with Guidelines',
    adasCruise: 'Steering Mounted Cruise Control',
    hillAssist: 'Hill Hold Assist (Automatic Transmission)',
    idealFor: 'Budget Commuters, Pune-Nashik Highway & Agile City Parking',
  },
  'Innova Crysta': {
    tagline: 'Unmatched 7-Seater Highway King',
    engine: '2.4L GD Turbo Diesel Engine',
    powerTorque: '150 PS @ 3400 RPM • 343 Nm Heavy Torque',
    mileage: '14.8 km/l Diesel Highway',
    tankRange: '65 Liters (~960 km Range)',
    bootSpace: '300L (All 7 Seats Active) / 758L (3rd Row Tumbled)',
    groundClearance: '178 mm (Body-on-Frame Heavy Duty Chassis)',
    sunroof: 'Not Applicable (High Roofline Cabin)',
    infotainment: '8" Display Audio with Android Auto & Apple CarPlay',
    soundSystem: 'Toyota High-Fidelity 6-Speaker System',
    climateControl: 'Auto Climate Control with Ceiling Vents for All 3 Rows',
    airbags: '7 Airbags (Front, Side, Curtain & Driver Knee)',
    parkingAssist: 'Back Monitor with Distance Guidelines & Sensors',
    adasCruise: 'Automatic Cruise Control',
    hillAssist: 'Vehicle Stability Control (VSC) & Hill Start Assist',
    idealFor: 'Long-Distance Road Trips, Multi-Family Vacations & Goa Tours',
  },
  Fortuner: {
    tagline: 'Dominant 4x4 Luxury Off-Roader',
    engine: '2.8L D-4D Diesel Turbo (4WD Sigma)',
    powerTorque: '204 PS @ 3400 RPM • 500 Nm Massive Torque',
    mileage: '12.8 km/l Diesel',
    tankRange: '80 Liters (~1,020 km Cross-Country Range)',
    bootSpace: '296 Liters (7 Seats) / 716 Liters Folded',
    groundClearance: '225 mm (Water-Wading & Tough Terrain Ready)',
    sunroof: 'Not Applicable (Reinforced Tough Roof)',
    infotainment: '9" Touchscreen with Premium Telematics',
    soundSystem: 'JBL 11-Speaker Audiophile Sound System with Subwoofer',
    climateControl: 'Dual-Zone Front & Rear Independent Controls',
    airbags: '7 SRS Airbags (Full Cabin Curtain Cover)',
    parkingAssist: 'Panoramic View 360° Monitor + Clearance Sonar',
    adasCruise: 'High-Speed Dynamic Cruise Control',
    hillAssist: 'Hill Assist Control (HAC) + Downhill Assist (DAC)',
    idealFor: 'Executive Escapes, Ghat Exploration & Commanding Road Presence',
  },
  Swift: {
    tagline: 'Sporty, Nimble & Highly Efficient Hatchback',
    engine: '1.2L DualJet Dual VVT Petrol Engine',
    powerTorque: '90 PS @ 6000 RPM • 113 Nm Torque',
    mileage: '22.5 km/l ARAI Certified',
    tankRange: '37 Liters (~830 km Highway Range)',
    bootSpace: '268 Liters (1 Large Suitcase + Hand Luggage)',
    groundClearance: '163 mm',
    sunroof: 'Not Applicable',
    infotainment: '7" Touchscreen SmartPlay + Wireless CarPlay',
    soundSystem: 'Suzuki 4-Speaker Audio',
    climateControl: 'Automatic AC with Quick Chill',
    airbags: '6 Airbags (New 2024 Generation)',
    parkingAssist: 'Rear Parking Camera & Sensors',
    adasCruise: 'Standard Cruise Control',
    hillAssist: 'Hill Hold Assist & Electronic Stability Program',
    idealFor: 'Solo & Couple Weekend Getaways, City Driving & Scenic Ghats',
  },
};

function getSpecsForVehicle(v: VehicleCardType): VehicleSpecs {
  for (const [key, specs] of Object.entries(VEHICLE_SPECS_CATALOG)) {
    if (v.model.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(v.model.toLowerCase())) {
      return specs;
    }
  }
  return {
    tagline: `${v.brand} ${v.model} Self-Drive Fleet`,
    engine: `${v.fuel} 1.5L Multi-Point Engine`,
    powerTorque: '120 PS Power • 170 Nm Torque',
    mileage: '18.0 km/l ARAI',
    tankRange: '45 Liters (~800 km Range)',
    bootSpace: '380 Liters Luggage Capacity',
    groundClearance: '180 mm',
    sunroof: v.features.some((f) => f.toLowerCase().includes('sunroof')) ? 'Panoramic Sunroof' : 'Not Applicable',
    infotainment: 'Touchscreen Audio with Apple CarPlay & Android Auto',
    soundSystem: 'Hi-Fi 6-Speaker Acoustic Audio',
    climateControl: 'Automatic Climate Control',
    airbags: '6 Airbags Standard',
    parkingAssist: 'Reverse Parking Camera with Sensors',
    adasCruise: 'Cruise Control',
    hillAssist: 'Hill-Start Assist Control',
    idealFor: 'City & Highway Outstation Drives',
  };
}

interface CompareVehiclesModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: VehicleCardType[];
  onRemoveVehicle: (id: string) => void;
  searchParams?: string;
}

export function CompareVehiclesModal({
  isOpen,
  onClose,
  vehicles,
  onRemoveVehicle,
  searchParams = '',
}: CompareVehiclesModalProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'PRICING' | 'SPACE' | 'ENGINE' | 'SAFETY'>('ALL');

  if (!isOpen || vehicles.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-6xl max-h-[94vh] flex flex-col rounded-3xl bg-card border border-white/10 shadow-2xl overflow-hidden text-white font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 px-5 sm:px-6 py-4 bg-surface/60 gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 font-bold">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Detailed Vehicle Specification Comparison
                <span className="rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 text-[10px] font-bold">
                  {vehicles.length} of 3 Selected
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Compare daily rates, boot space, engine power, mileage, and safety specs side-by-side
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Quick Filter Section Tabs */}
            <div className="hidden lg:flex items-center gap-1 bg-surface/50 p-1 rounded-xl border border-white/5 text-[11px] font-bold">
              {[
                { id: 'ALL', label: 'All Specs' },
                { id: 'PRICING', label: 'Pricing & Trust' },
                { id: 'SPACE', label: 'Space & Cabin' },
                { id: 'ENGINE', label: 'Engine & Mileage' },
                { id: 'SAFETY', label: 'Safety & Tech' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title="Close comparison"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Comparison Matrix */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-white/10">
          <div className="min-w-[760px] md:min-w-[880px]">
            {/* Sticky Vehicle Cards Row */}
            <div className="grid grid-cols-4 gap-4 sticky top-0 z-20 pb-4 bg-card/95 backdrop-blur-md border-b border-white/10 pt-1">
              {/* Left Column Label Header */}
              <div className="flex flex-col justify-end p-3">
                <span className="text-[10px] uppercase font-extrabold text-blue-400 tracking-wider">
                  Vehicle Matrix
                </span>
                <span className="text-xs text-slate-400 mt-0.5">
                  Side-by-side comparison across 18 real-world parameters
                </span>
              </div>

              {/* Cars Columns (up to 3) */}
              {vehicles.map((v) => {
                const specs = getSpecsForVehicle(v);
                const dailyRate = Math.round(v.dailyRatePaise / 100);
                const bookUrl = searchParams ? `/cars/${v.id}?${searchParams}` : `/cars/${v.id}`;

                return (
                  <div
                    key={v.id}
                    className="relative rounded-2xl border border-white/15 bg-surface/70 p-3.5 shadow-lg flex flex-col justify-between"
                  >
                    {/* Remove Pill */}
                    <button
                      onClick={() => onRemoveVehicle(v.id)}
                      className="absolute top-2.5 right-2.5 rounded-full bg-black/70 hover:bg-rose-600 p-1 text-slate-300 hover:text-white transition-all z-10 cursor-pointer shadow-md"
                      title="Remove from comparison"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>

                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-20 rounded-xl overflow-hidden bg-surface shrink-0 border border-white/10">
                        <Image
                          src={v.primaryImageUrl}
                          alt={v.model}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <span className="text-[10px] uppercase font-bold text-blue-400 block truncate">
                          {v.brand}
                        </span>
                        <h4 className="text-sm font-extrabold text-white truncate">{v.model}</h4>
                        <span className="text-[10px] text-slate-400 block truncate">{v.variant || v.category}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5">
                      <div>
                        <span className="text-base font-black text-white">
                          ₹{dailyRate.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">/day</span>
                      </div>

                      <Link
                        href={bookUrl}
                        onClick={onClose}
                        className="rounded-xl bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                      >
                        <span>Book Car</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}

              {/* Empty Slot Placeholder if < 3 */}
              {vehicles.length < 3 && (
                <div className="rounded-2xl border border-dashed border-white/15 bg-surface/20 p-4 flex flex-col items-center justify-center text-center text-slate-400">
                  <Sparkles className="h-6 w-6 text-slate-500 mb-1" />
                  <span className="text-xs font-bold text-slate-200">Add Another Car</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    Click '+ Compare' on any car to view side-by-side
                  </span>
                </div>
              )}
            </div>

            {/* Spec Comparison Rows */}
            <div className="space-y-6 pt-4 text-xs">
              {/* SECTION 1: PRICING & TRUST SAFEGUARDS */}
              {(activeTab === 'ALL' || activeTab === 'PRICING') && (
                <div>
                  <div className="flex items-center gap-2 pb-2 mb-2 border-b border-white/10 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <CircleDollarSign className="h-4 w-4" />
                    <span>Pricing, Deposits &amp; Policies</span>
                  </div>

                  {/* Daily Rate */}
                  <div className="grid grid-cols-4 gap-4 py-2.5 border-b border-white/5 items-center">
                    <span className="text-slate-400 font-semibold">Daily Rental Rate</span>
                    {vehicles.map((v) => (
                      <div key={v.id} className="font-extrabold text-white text-sm">
                        ₹{Math.round(v.dailyRatePaise / 100).toLocaleString('en-IN')}{' '}
                        <span className="text-[11px] text-slate-400 font-normal">/day</span>
                      </div>
                    ))}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>

                  {/* Refundable Security Deposit */}
                  <div className="grid grid-cols-4 gap-4 py-2.5 border-b border-white/5 items-center">
                    <span className="text-slate-400 font-semibold">Refundable Security Deposit</span>
                    {vehicles.map((v) => (
                      <div key={v.id} className="font-semibold text-slate-200">
                        ₹{Math.round(v.securityDepositPaise / 100).toLocaleString('en-IN')}
                        <span className="block text-[10px] text-emerald-400 font-medium">
                          Waived to ₹0 with Smart Shield
                        </span>
                      </div>
                    ))}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>

                  {/* Included Distance */}
                  <div className="grid grid-cols-4 gap-4 py-2.5 border-b border-white/5 items-center">
                    <span className="text-slate-400 font-semibold">Included Distance</span>
                    {vehicles.map((v) => (
                      <div key={v.id} className="font-semibold text-emerald-400 flex items-center gap-1">
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Unlimited Kilometers</span>
                      </div>
                    ))}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>

                  {/* Toll Pass */}
                  <div className="grid grid-cols-4 gap-4 py-2.5 border-b border-white/5 items-center">
                    <span className="text-slate-400 font-semibold">Highway Fastag RFID</span>
                    {vehicles.map((v) => (
                      <div key={v.id} className="text-slate-200">
                        <span>Active RFID Tag Installed</span>
                        <span className="block text-[10px] text-slate-400">Pre-loaded packs available</span>
                      </div>
                    ))}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>

                  {/* Cancellation */}
                  <div className="grid grid-cols-4 gap-4 py-2.5 border-b border-white/5 items-center">
                    <span className="text-slate-400 font-semibold">Cancellation Policy</span>
                    {vehicles.map((v) => (
                      <div key={v.id} className="text-slate-300 text-[11px]">
                        100% Free Cancellation up to 24 hours before pickup
                      </div>
                    ))}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>
                </div>
              )}

              {/* SECTION 2: SPACE, CABIN & DIMENSIONS */}
              {(activeTab === 'ALL' || activeTab === 'SPACE') && (
                <div>
                  <div className="flex items-center gap-2 pb-2 mb-2 border-b border-white/10 text-blue-400 font-bold text-xs uppercase tracking-wider">
                    <Luggage className="h-4 w-4" />
                    <span>Space, Seating &amp; Luggage Capacity</span>
                  </div>

                  {/* Seating Capacity */}
                  <div className="grid grid-cols-4 gap-4 py-2.5 border-b border-white/5 items-center">
                    <span className="text-slate-400 font-semibold">Seating Capacity</span>
                    {vehicles.map((v) => (
                      <div key={v.id} className="font-bold text-white flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-blue-400" />
                        <span>{v.seats} Adults ({v.seats >= 7 ? 'Spacious 3-Row' : 'Comfortable 5-Seater'})</span>
                      </div>
                    ))}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>

                  {/* Boot Space */}
                  <div className="grid grid-cols-4 gap-4 py-2.5 border-b border-white/5 items-center">
                    <span className="text-slate-400 font-semibold">Boot Space / Luggage</span>
                    {vehicles.map((v) => {
                      const specs = getSpecsForVehicle(v);
                      return (
                        <div key={v.id} className="text-slate-200">
                          <span className="font-bold text-white">{specs.bootSpace.split('(')[0]}</span>
                          <span className="block text-[11px] text-slate-400">
                            {specs.bootSpace.includes('(') ? `(${specs.bootSpace.split('(')[1]}` : ''}
                          </span>
                        </div>
                      );
                    })}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>

                  {/* Ground Clearance */}
                  <div className="grid grid-cols-4 gap-4 py-2.5 border-b border-white/5 items-center">
                    <span className="text-slate-400 font-semibold">Ground Clearance</span>
                    {vehicles.map((v) => {
                      const specs = getSpecsForVehicle(v);
                      return (
                        <div key={v.id} className="text-slate-200 font-bold">
                          {specs.groundClearance}
                        </div>
                      );
                    })}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>

                  {/* Climate Control */}
                  <div className="grid grid-cols-4 gap-4 py-2.5 border-b border-white/5 items-center">
                    <span className="text-slate-400 font-semibold">Air Conditioning &amp; Cooling</span>
                    {vehicles.map((v) => {
                      const specs = getSpecsForVehicle(v);
                      return (
                        <div key={v.id} className="text-slate-300 text-[11px]">
                          {specs.climateControl}
                        </div>
                      );
                    })}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>
                </div>
              )}

              {/* SECTION 3: ENGINE, POWERTRAIN & FUEL EFFICIENCY */}
              {(activeTab === 'ALL' || activeTab === 'ENGINE') && (
                <div>
                  <div className="flex items-center gap-2 pb-2 mb-2 border-b border-white/10 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Flame className="h-4 w-4" />
                    <span>Engine, Powertrain &amp; Mileage</span>
                  </div>

                  {/* Engine Specification */}
                  <div className="grid grid-cols-4 gap-4 py-2.5 border-b border-white/5 items-center">
                    <span className="text-slate-400 font-semibold">Engine Displacement</span>
                    {vehicles.map((v) => {
                      const specs = getSpecsForVehicle(v);
                      return (
                        <div key={v.id} className="text-slate-200 font-bold">
                          {specs.engine}
                        </div>
                      );
                    })}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>

                  {/* Power & Torque */}
                  <div className="grid grid-cols-4 gap-4 py-2.5 border-b border-white/5 items-center">
                    <span className="text-slate-400 font-semibold">Max Power &amp; Torque</span>
                    {vehicles.map((v) => {
                      const specs = getSpecsForVehicle(v);
                      return (
                        <div key={v.id} className="text-slate-300 text-[11px]">
                          {specs.powerTorque}
                        </div>
                      );
                    })}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>

                  {/* Transmission */}
                  <div className="grid grid-cols-4 gap-4 py-2.5 border-b border-white/5 items-center">
                    <span className="text-slate-400 font-semibold">Transmission Type</span>
                    {vehicles.map((v) => (
                      <div key={v.id} className="font-bold text-white capitalize flex items-center gap-1.5">
                        <Gauge className="h-3.5 w-3.5 text-blue-400" />
                        <span>{v.transmission.toLowerCase()} drive</span>
                      </div>
                    ))}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>

                  {/* Fuel Type */}
                  <div className="grid grid-cols-4 gap-4 py-2.5 border-b border-white/5 items-center">
                    <span className="text-slate-400 font-semibold">Fuel Type</span>
                    {vehicles.map((v) => (
                      <div key={v.id} className="font-bold text-white capitalize flex items-center gap-1.5">
                        <Fuel className="h-3.5 w-3.5 text-amber-400" />
                        <span>{v.fuel.toLowerCase()}</span>
                      </div>
                    ))}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>

                  {/* Certified Mileage */}
                  <div className="grid grid-cols-4 gap-4 py-2.5 border-b border-white/5 items-center">
                    <span className="text-slate-400 font-semibold">Fuel Mileage (ARAI)</span>
                    {vehicles.map((v) => {
                      const specs = getSpecsForVehicle(v);
                      return (
                        <div key={v.id} className="text-emerald-400 font-extrabold">
                          {specs.mileage}
                        </div>
                      );
                    })}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>

                  {/* Tank Range */}
                  <div className="grid grid-cols-4 gap-4 py-2.5 border-b border-white/5 items-center">
                    <span className="text-slate-400 font-semibold">Fuel Tank &amp; Highway Range</span>
                    {vehicles.map((v) => {
                      const specs = getSpecsForVehicle(v);
                      return (
                        <div key={v.id} className="text-slate-300 text-[11px]">
                          {specs.tankRange}
                        </div>
                      );
                    })}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>
                </div>
              )}

              {/* SECTION 4: SAFETY, GHAT CONTROL & TECH */}
              {(activeTab === 'ALL' || activeTab === 'SAFETY') && (
                <div>
                  <div className="flex items-center gap-2 pb-2 mb-2 border-b border-white/10 text-teal-400 font-bold text-xs uppercase tracking-wider">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Safety, Ghat Driving &amp; Technology</span>
                  </div>

                  {/* Airbags & Crash Safety */}
                  <div className="grid grid-cols-4 gap-4 py-2.5 border-b border-white/5 items-center">
                    <span className="text-slate-400 font-semibold">Airbags &amp; Structure</span>
                    {vehicles.map((v) => {
                      const specs = getSpecsForVehicle(v);
                      return (
                        <div key={v.id} className="text-slate-200 font-bold">
                          {specs.airbags}
                        </div>
                      );
                    })}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>

                  {/* Sunroof */}
                  <div className="grid grid-cols-4 gap-4 py-2.5 border-b border-white/5 items-center">
                    <span className="text-slate-400 font-semibold">Sunroof / Skyroof</span>
                    {vehicles.map((v) => {
                      const specs = getSpecsForVehicle(v);
                      const hasSunroof = specs.sunroof !== 'Not Applicable';
                      return (
                        <div
                          key={v.id}
                          className={hasSunroof ? 'text-blue-300 font-bold' : 'text-slate-500'}
                        >
                          {specs.sunroof}
                        </div>
                      );
                    })}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>

                  {/* Infotainment & Screen */}
                  <div className="grid grid-cols-4 gap-4 py-2.5 border-b border-white/5 items-center">
                    <span className="text-slate-400 font-semibold">Touchscreen &amp; Connectivity</span>
                    {vehicles.map((v) => {
                      const specs = getSpecsForVehicle(v);
                      return (
                        <div key={v.id} className="text-slate-300 text-[11px]">
                          {specs.infotainment}
                        </div>
                      );
                    })}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>

                  {/* Audio System */}
                  <div className="grid grid-cols-4 gap-4 py-2.5 border-b border-white/5 items-center">
                    <span className="text-slate-400 font-semibold">Premium Audio Tuning</span>
                    {vehicles.map((v) => {
                      const specs = getSpecsForVehicle(v);
                      return (
                        <div key={v.id} className="text-slate-300 text-[11px]">
                          {specs.soundSystem}
                        </div>
                      );
                    })}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>

                  {/* Parking Camera */}
                  <div className="grid grid-cols-4 gap-4 py-2.5 border-b border-white/5 items-center">
                    <span className="text-slate-400 font-semibold">Parking Cameras &amp; Sensors</span>
                    {vehicles.map((v) => {
                      const specs = getSpecsForVehicle(v);
                      return (
                        <div key={v.id} className="text-slate-300 text-[11px]">
                          {specs.parkingAssist}
                        </div>
                      );
                    })}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>

                  {/* Ghat & Hill Assist */}
                  <div className="grid grid-cols-4 gap-4 py-2.5 border-b border-white/5 items-center">
                    <span className="text-slate-400 font-semibold">Ghat &amp; Hill Driving Assist</span>
                    {vehicles.map((v) => {
                      const specs = getSpecsForVehicle(v);
                      return (
                        <div key={v.id} className="text-slate-300 text-[11px]">
                          {specs.hillAssist}
                        </div>
                      );
                    })}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>

                  {/* Cruise Control / ADAS */}
                  <div className="grid grid-cols-4 gap-4 py-2.5 border-b border-white/5 items-center">
                    <span className="text-slate-400 font-semibold">Cruise Control / ADAS</span>
                    {vehicles.map((v) => {
                      const specs = getSpecsForVehicle(v);
                      return (
                        <div key={v.id} className="text-slate-300 text-[11px]">
                          {specs.adasCruise}
                        </div>
                      );
                    })}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>

                  {/* Ideal Recommendation */}
                  <div className="grid grid-cols-4 gap-4 py-3 bg-surface/30 rounded-xl px-3 border border-white/5 items-center mt-3">
                    <span className="text-amber-300 font-bold flex items-center gap-1.5">
                      <Award className="h-4 w-4" />
                      Best Suited For
                    </span>
                    {vehicles.map((v) => {
                      const specs = getSpecsForVehicle(v);
                      return (
                        <div key={v.id} className="text-white font-semibold text-[11px] leading-relaxed">
                          {specs.idealFor}
                        </div>
                      );
                    })}
                    {vehicles.length < 3 && <div className="text-slate-600">—</div>}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Booking Action Bar */}
            <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 items-center">
              <div>
                <span className="text-xs font-bold text-slate-300 block">Instant Hold</span>
                <span className="text-[10px] text-slate-500">10-minute hold with 0 cancellation fees</span>
              </div>

              {vehicles.map((v) => {
                const bookUrl = searchParams ? `/cars/${v.id}?${searchParams}` : `/cars/${v.id}`;
                return (
                  <div key={v.id}>
                    <Link
                      href={bookUrl}
                      onClick={onClose}
                      className="w-full rounded-2xl bg-blue-600 hover:bg-blue-500 py-3 text-center text-xs font-bold text-white shadow-lg shadow-blue-950/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-xl active:scale-98"
                    >
                      <span>Select {v.model}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                );
              })}
              {vehicles.length < 3 && <div />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
