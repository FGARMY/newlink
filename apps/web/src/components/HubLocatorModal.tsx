'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  CheckCircle2,
  X,
  Plane,
  Building,
  Car,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export interface HubLocation {
  id: string;
  name: string;
  city: 'pune' | 'nashik';
  area: string;
  terminalDetails: string;
  walkingDistance: string;
  operatingHours: string;
  landmark: string;
  phone: string;
  isAirportBay?: boolean;
  coordinates: { x: number; y: number };
}

export const HUBS: HubLocation[] = [
  {
    id: 'loc-pn-airport',
    name: 'Pune International Airport (PNQ)',
    city: 'pune',
    area: 'Lohegaon',
    terminalDetails: 'Designated Bay 4, Multi-Level Car Parking (MLCP) Level 2',
    walkingDistance: '2-min walk from Terminal 1 & 2 Arrivals exit',
    operatingHours: '24 Hours Open (Round-the-Clock Fleet Bay)',
    landmark: 'Directly opposite Airport Metro station & Arrival Gate B',
    phone: '+91 98230 11001',
    isAirportBay: true,
    coordinates: { x: 74, y: 32 },
  },
  {
    id: 'loc-pn-hinjewadi',
    name: 'Hinjewadi Phase 1 Tech Hub',
    city: 'pune',
    area: 'Hinjewadi',
    terminalDetails: 'Speion Bay, Commercial Complex opposite Infosys Phase 1',
    walkingDistance: '3-min walk from Shivaji Chowk Hinjewadi',
    operatingHours: '06:00 AM – 11:30 PM Daily',
    landmark: 'Next to Blue Ridge IT Park Interchange',
    phone: '+91 98230 11002',
    coordinates: { x: 26, y: 48 },
  },
  {
    id: 'loc-pn-baner',
    name: 'Baner High Street Hub',
    city: 'pune',
    area: 'Baner - Balewadi',
    terminalDetails: 'Balewadi High Street Promenade Underground Bay',
    walkingDistance: 'Immediate access from Mumbai-Pune Expressway exit',
    operatingHours: '07:00 AM – 11:00 PM Daily',
    landmark: 'Behind Cummins India Corporate Office',
    phone: '+91 98230 11003',
    coordinates: { x: 38, y: 38 },
  },
  {
    id: 'loc-pn-viman',
    name: 'Viman Nagar / Phoenix Bay',
    city: 'pune',
    area: 'Viman Nagar',
    terminalDetails: 'West Gate Parking Complex, Phoenix Marketcity',
    walkingDistance: '1-min from Nagar Road Metro Station',
    operatingHours: '08:00 AM – 11:00 PM Daily',
    landmark: 'Near Hyatt Regency, Viman Nagar',
    phone: '+91 98230 11004',
    coordinates: { x: 68, y: 45 },
  },
  {
    id: 'loc-ns-mumbainaka',
    name: 'Nashik Mumbai Naka Interchange Hub',
    city: 'nashik',
    area: 'Mumbai Naka',
    terminalDetails: 'Speion Expressway Express Bay, National Highway 3',
    walkingDistance: 'Direct interchange for Shirdi, Igatpuri & Mumbai Highway',
    operatingHours: '06:00 AM – 11:00 PM Daily',
    landmark: 'Opposite Mumbai Naka Central Bus Bay',
    phone: '+91 98230 22001',
    coordinates: { x: 50, y: 50 },
  },
];

interface HubLocatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHub?: (hubId: string) => void;
  selectedCity?: 'pune' | 'nashik';
}

export function HubLocatorModal({
  isOpen,
  onClose,
  onSelectHub,
  selectedCity = 'pune',
}: HubLocatorModalProps) {
  const [activeCity, setActiveCity] = useState<'pune' | 'nashik'>(selectedCity);
  const [activeHubId, setActiveHubId] = useState<string>(
    selectedCity === 'nashik' ? 'loc-ns-mumbainaka' : 'loc-pn-airport',
  );

  if (!isOpen) return null;

  const cityHubs = HUBS.filter((h) => h.city === activeCity);
  const currentHub = HUBS.find((h) => h.id === activeHubId) || cityHubs[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-card text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 px-6 py-4 bg-slate-50 dark:bg-surface/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-emerald-600 dark:text-emerald-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Official Speion Pickup Bays
                <span className="rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold">
                  Guaranteed Handover
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct terminal & highway parking bays with 3-minute quick checkout
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* City Toggle Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-2 border-b border-white/5 bg-surface/20">
          <button
            onClick={() => {
              setActiveCity('pune');
              setActiveHubId('loc-pn-airport');
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeCity === 'pune'
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'bg-card text-slate-300 hover:bg-white/5 border border-white/10'
            }`}
          >
            <Plane className="h-3.5 w-3.5" />
            <span>Pune Hubs ({HUBS.filter((h) => h.city === 'pune').length})</span>
          </button>

          <button
            onClick={() => {
              setActiveCity('nashik');
              setActiveHubId('loc-ns-mumbainaka');
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeCity === 'nashik'
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'bg-card text-slate-300 hover:bg-white/5 border border-white/10'
            }`}
          >
            <Car className="h-3.5 w-3.5" />
            <span>Nashik Hubs ({HUBS.filter((h) => h.city === 'nashik').length})</span>
          </button>
        </div>

        {/* Body Content (Split View: Left list + Right Visual Map Card) */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Hub List (5 cols) */}
          <div className="md:col-span-5 p-4 sm:p-5 border-r border-white/5 space-y-2.5 overflow-y-auto max-h-[550px]">
            {cityHubs.map((hub) => {
              const isSelected = hub.id === currentHub?.id;
              return (
                <div
                  key={hub.id}
                  onClick={() => setActiveHubId(hub.id)}
                  className={`group relative rounded-2xl p-4 transition-all cursor-pointer border ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                      : 'border-white/5 bg-surface/30 hover:bg-surface hover:border-white/15'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {hub.isAirportBay && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 text-blue-300 px-2 py-0.5 text-[10px] font-bold mb-1.5 border border-blue-500/30">
                          <Plane className="h-2.5 w-2.5" /> Airport Express Bay
                        </span>
                      )}
                      <h4
                        className={`text-sm font-bold transition-colors ${
                          isSelected ? 'text-emerald-400' : 'text-white group-hover:text-emerald-300'
                        }`}
                      >
                        {hub.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{hub.area}</p>
                    </div>

                    <ChevronRight
                      className={`h-4 w-4 shrink-0 transition-transform ${
                        isSelected ? 'text-emerald-400 translate-x-0.5' : 'text-slate-500'
                      }`}
                    />
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-300">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {hub.operatingHours.split('(')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Hub Detail & Interactive Map Simulation (7 cols) */}
          <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between bg-surface/10 space-y-5">
            {currentHub && (
              <>
                {/* Visual Location Card */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-slate-900 to-black p-6">
                  {/* Subtle Radar Background Lines */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px]" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 text-xs font-bold flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Active Operational Bay
                      </span>

                      <span className="text-xs font-mono text-slate-400">
                        LAT: 18.58° N, LNG: 73.91° E
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-white mt-3">{currentHub.name}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {currentHub.terminalDetails}
                    </p>

                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl bg-card/80 border border-white/5 p-3">
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Walking Proximity
                        </div>
                        <div className="text-xs font-bold text-white mt-1 flex items-center gap-1.5">
                          <Navigation className="h-3.5 w-3.5 text-blue-400" />
                          {currentHub.walkingDistance}
                        </div>
                      </div>

                      <div className="rounded-xl bg-card/80 border border-white/5 p-3">
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Operating Timings
                        </div>
                        <div className="text-xs font-bold text-white mt-1 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-emerald-400" />
                          {currentHub.operatingHours}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl bg-card/80 border border-white/5 p-3 text-xs">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Landmark &amp; Directions
                      </div>
                      <div className="text-xs text-slate-200 mt-1">{currentHub.landmark}</div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-emerald-400" />
                        Bay Executive: {currentHub.phone}
                      </span>
                      <span className="text-emerald-400 font-semibold">3-Min Fast Handover</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/10">
                  <span className="text-xs text-slate-400">
                    Selected for pickup: <strong className="text-white">{currentHub.name}</strong>
                  </span>

                  <button
                    onClick={() => {
                      if (onSelectHub) onSelectHub(currentHub.id);
                      onClose();
                    }}
                    className="rounded-xl bg-primary hover:bg-primary-light px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/25 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Select this Hub</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
