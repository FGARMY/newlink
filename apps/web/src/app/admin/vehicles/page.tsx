'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Car,
  ShieldCheck,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Wrench,
  Gauge,
  Fuel,
  Calendar,
  MapPin,
  FileText,
  Clock,
  ArrowRight,
  RefreshCw,
  X,
  Check,
  ChevronDown,
} from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { AdminNav } from '../../../components/AdminNav';
import type {
  AdminVehicle,
  VehicleCategory,
  Transmission,
  FuelType,
  VehicleOperationalStatus,
  VehicleDocumentType,
} from '@newlink/contracts';
import { checkVehicleCompliance } from '@newlink/domain';

const INITIAL_FLEET: AdminVehicle[] = [
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
    registrationNumber: 'MH 12 RN 8821',
    registrationYear: 2024,
    odometerKm: 14200,
    fuelLevelPercent: 95,
    operationalStatus: 'IN_SERVICE',
    ratingAvg: 4.92,
    ratingCount: 128,
    startingPricePaise: 18000,
    dailyRatePaise: 240000,
    securityDepositPaise: 500000,
    primaryImageUrl: '/images/car-creta.jpg',
    features: ['Ventilated Seats', 'Panoramic Sunroof', 'Cruise Control', 'Wireless CarPlay', 'Fastag Active'],
    isAvailable: true,
    documents: [
      {
        id: 'doc-creta-rc',
        vehicleId: 'veh-creta-pn',
        type: 'REGISTRATION_CERTIFICATE',
        documentNumber: 'MH 12 RN 8821',
        expiresOn: '2039-02-15T00:00:00Z',
        verified: true,
      },
      {
        id: 'doc-creta-ins',
        vehicleId: 'veh-creta-pn',
        type: 'COMMERCIAL_INSURANCE',
        documentNumber: 'HDFC-ERGO-88412',
        expiresOn: '2027-02-14T00:00:00Z',
        verified: true,
      },
      {
        id: 'doc-creta-puc',
        vehicleId: 'veh-creta-pn',
        type: 'POLLUTION_UNDER_CONTROL',
        documentNumber: 'PUC-MH12-9901',
        expiresOn: '2026-12-01T00:00:00Z',
        verified: true,
      },
    ],
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
    registrationNumber: 'MH 12 TC 4402',
    registrationYear: 2024,
    odometerKm: 21300,
    fuelLevelPercent: 80,
    operationalStatus: 'IN_SERVICE',
    ratingAvg: 4.88,
    ratingCount: 94,
    startingPricePaise: 20000,
    dailyRatePaise: 280000,
    securityDepositPaise: 500000,
    primaryImageUrl: '/images/car-carens.jpg',
    features: ['7-Seater Comfort', 'Rear AC Vents', 'Touchscreen Infotainment', 'High Fuel Mileage', 'Fastag Active'],
    isAvailable: true,
    documents: [
      {
        id: 'doc-carens-rc',
        vehicleId: 'veh-carens-pn',
        type: 'REGISTRATION_CERTIFICATE',
        documentNumber: 'MH 12 TC 4402',
        expiresOn: '2039-05-10T00:00:00Z',
        verified: true,
      },
      {
        id: 'doc-carens-ins',
        vehicleId: 'veh-carens-pn',
        type: 'COMMERCIAL_INSURANCE',
        documentNumber: 'BAJAJ-ALL-11029',
        expiresOn: '2027-05-09T00:00:00Z',
        verified: true,
      },
      {
        id: 'doc-carens-puc',
        vehicleId: 'veh-carens-pn',
        type: 'POLLUTION_UNDER_CONTROL',
        documentNumber: 'PUC-MH12-4412',
        expiresOn: '2026-11-20T00:00:00Z',
        verified: true,
      },
    ],
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
    registrationNumber: 'MH 12 UX 9001',
    registrationYear: 2024,
    odometerKm: 8500,
    fuelLevelPercent: 100,
    operationalStatus: 'IN_SERVICE',
    ratingAvg: 4.96,
    ratingCount: 142,
    startingPricePaise: 26000,
    dailyRatePaise: 380000,
    securityDepositPaise: 700000,
    primaryImageUrl: '/images/car-xuv700.jpg',
    features: ['ADAS Level 2', 'Sony 12-Speaker Audio', 'Panoramic Skyroof', 'AWD Drive Modes', 'Fastag Active'],
    isAvailable: true,
    documents: [
      {
        id: 'doc-xuv-rc',
        vehicleId: 'veh-xuv700-pn',
        type: 'REGISTRATION_CERTIFICATE',
        documentNumber: 'MH 12 UX 9001',
        expiresOn: '2039-07-22T00:00:00Z',
        verified: true,
      },
      {
        id: 'doc-xuv-ins',
        vehicleId: 'veh-xuv700-pn',
        type: 'COMMERCIAL_INSURANCE',
        documentNumber: 'ICICI-LOMB-99014',
        expiresOn: '2027-07-21T00:00:00Z',
        verified: true,
      },
      {
        id: 'doc-xuv-puc',
        vehicleId: 'veh-xuv700-pn',
        type: 'POLLUTION_UNDER_CONTROL',
        documentNumber: 'PUC-MH12-8812',
        expiresOn: '2027-01-15T00:00:00Z',
        verified: true,
      },
    ],
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
    registrationNumber: 'MH 12 QM 3110',
    registrationYear: 2023,
    odometerKm: 34100,
    fuelLevelPercent: 70,
    operationalStatus: 'IN_SERVICE',
    ratingAvg: 4.82,
    ratingCount: 210,
    startingPricePaise: 13000,
    dailyRatePaise: 160000,
    securityDepositPaise: 300000,
    primaryImageUrl: '/images/car-dzire.jpg',
    features: ['High Mileage (22 km/l)', 'Compact City Parking', 'Push Button Start', 'Apple CarPlay', 'Fastag Active'],
    isAvailable: true,
    documents: [
      {
        id: 'doc-dzire-rc',
        vehicleId: 'veh-dzire-pn',
        type: 'REGISTRATION_CERTIFICATE',
        documentNumber: 'MH 12 QM 3110',
        expiresOn: '2038-09-01T00:00:00Z',
        verified: true,
      },
      {
        id: 'doc-dzire-ins',
        vehicleId: 'veh-dzire-pn',
        type: 'COMMERCIAL_INSURANCE',
        documentNumber: 'TATA-AIG-44910',
        expiresOn: '2027-03-10T00:00:00Z',
        verified: true,
      },
      {
        id: 'doc-dzire-puc',
        vehicleId: 'veh-dzire-pn',
        type: 'POLLUTION_UNDER_CONTROL',
        documentNumber: 'PUC-MH12-3301',
        expiresOn: '2026-10-30T00:00:00Z',
        verified: true,
      },
    ],
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
    registrationNumber: 'MH 12 PL 5543',
    registrationYear: 2023,
    odometerKm: 46200,
    fuelLevelPercent: 85,
    operationalStatus: 'IN_SERVICE',
    ratingAvg: 4.95,
    ratingCount: 310,
    startingPricePaise: 25000,
    dailyRatePaise: 350000,
    securityDepositPaise: 600000,
    primaryImageUrl: '/images/car-innova.jpg',
    features: ['Legendary Highway Reliability', 'Captain Seats', 'Spacious Luggage Boot', 'Cruise Control', 'Fastag Active'],
    isAvailable: true,
    documents: [
      {
        id: 'doc-innova-rc',
        vehicleId: 'veh-innova-pn',
        type: 'REGISTRATION_CERTIFICATE',
        documentNumber: 'MH 12 PL 5543',
        expiresOn: '2038-04-12T00:00:00Z',
        verified: true,
      },
      {
        id: 'doc-innova-ins',
        vehicleId: 'veh-innova-pn',
        type: 'COMMERCIAL_INSURANCE',
        documentNumber: 'NEW-INDIA-77182',
        expiresOn: '2027-04-11T00:00:00Z',
        verified: true,
      },
      {
        id: 'doc-innova-puc',
        vehicleId: 'veh-innova-pn',
        type: 'POLLUTION_UNDER_CONTROL',
        documentNumber: 'PUC-MH12-2290',
        expiresOn: '2026-12-15T00:00:00Z',
        verified: true,
      },
    ],
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
    registrationNumber: 'MH 15 BK 2020',
    registrationYear: 2024,
    odometerKm: 11200,
    fuelLevelPercent: 90,
    operationalStatus: 'IN_SERVICE',
    ratingAvg: 4.91,
    ratingCount: 86,
    startingPricePaise: 18000,
    dailyRatePaise: 240000,
    securityDepositPaise: 500000,
    primaryImageUrl: '/images/car-creta.jpg',
    features: ['Ventilated Seats', 'Panoramic Sunroof', 'Cruise Control', 'Wireless CarPlay', 'Fastag Active'],
    isAvailable: true,
    documents: [
      {
        id: 'doc-cretans-rc',
        vehicleId: 'veh-creta-ns',
        type: 'REGISTRATION_CERTIFICATE',
        documentNumber: 'MH 15 BK 2020',
        expiresOn: '2039-01-10T00:00:00Z',
        verified: true,
      },
      {
        id: 'doc-cretans-ins',
        vehicleId: 'veh-creta-ns',
        type: 'COMMERCIAL_INSURANCE',
        documentNumber: 'ICICI-LOMB-33019',
        expiresOn: '2027-01-09T00:00:00Z',
        verified: true,
      },
      {
        id: 'doc-cretans-puc',
        vehicleId: 'veh-creta-ns',
        type: 'POLLUTION_UNDER_CONTROL',
        documentNumber: 'PUC-MH15-8822',
        expiresOn: '2026-11-15T00:00:00Z',
        verified: true,
      },
    ],
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
    registrationNumber: 'MH 15 DX 7777',
    registrationYear: 2024,
    odometerKm: 16800,
    fuelLevelPercent: 100,
    operationalStatus: 'MAINTENANCE',
    ratingAvg: 4.98,
    ratingCount: 164,
    startingPricePaise: 42000,
    dailyRatePaise: 580000,
    securityDepositPaise: 1000000,
    primaryImageUrl: '/images/car-fortuner.jpg',
    features: ['4x4 Tough Terrain Ability', 'Commanding Road Presence', 'JBL Premium Sound', 'Ventilated Seats', 'Fastag Active'],
    isAvailable: false,
    documents: [
      {
        id: 'doc-fortuner-rc',
        vehicleId: 'veh-fortuner-ns',
        type: 'REGISTRATION_CERTIFICATE',
        documentNumber: 'MH 15 DX 7777',
        expiresOn: '2039-03-25T00:00:00Z',
        verified: true,
      },
      {
        id: 'doc-fortuner-ins',
        vehicleId: 'veh-fortuner-ns',
        type: 'COMMERCIAL_INSURANCE',
        documentNumber: 'BAJAJ-ALL-88192',
        expiresOn: '2027-03-24T00:00:00Z',
        verified: true,
      },
      {
        id: 'doc-fortuner-puc',
        vehicleId: 'veh-fortuner-ns',
        type: 'POLLUTION_UNDER_CONTROL',
        documentNumber: 'PUC-MH15-1192',
        expiresOn: '2026-12-20T00:00:00Z',
        verified: true,
      },
    ],
  },
];

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<AdminVehicle[]>(INITIAL_FLEET);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<'ALL' | 'pune' | 'nashik'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | VehicleOperationalStatus>('ALL');
  const [notification, setNotification] = useState<string | null>(null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [statusModalVehicle, setStatusModalVehicle] = useState<AdminVehicle | null>(null);
  const [docModalVehicle, setDocModalVehicle] = useState<AdminVehicle | null>(null);

  // New Vehicle form state
  const [newBrand, setNewBrand] = useState('Mahindra');
  const [newModel, setNewModel] = useState('Thar 4x4');
  const [newVariant, setNewVariant] = useState('LX Hard Top');
  const [newCategory, setNewCategory] = useState<VehicleCategory>('SUV');
  const [newTransmission, setNewTransmission] = useState<Transmission>('AUTOMATIC');
  const [newFuel, setNewFuel] = useState<FuelType>('DIESEL');
  const [newSeats, setNewSeats] = useState(4);
  const [newCity, setNewCity] = useState<'pune' | 'nashik'>('pune');
  const [newLocationName, setNewLocationName] = useState('Baner - High Street Hub');
  const [newRegNumber, setNewRegNumber] = useState('MH 12 TH 9988');
  const [newRegYear, setNewRegYear] = useState(2024);
  const [newOdometer, setNewOdometer] = useState(4200);
  const [newDailyRate, setNewDailyRate] = useState(3200);
  const [newDeposit, setNewDeposit] = useState(6000);
  const [newImage, setNewImage] = useState('/images/car-xuv700.jpg');

  // Status update form state
  const [targetStatus, setTargetStatus] = useState<VehicleOperationalStatus>('IN_SERVICE');
  const [statusReason, setStatusReason] = useState('');

  // Add Document form state
  const [docType, setDocType] = useState<VehicleDocumentType>('COMMERCIAL_INSURANCE');
  const [docNumber, setDocNumber] = useState('');
  const [docExpiry, setDocExpiry] = useState('2027-10-01');

  // Load persisted fleet from localStorage if exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem('newlink_admin_fleet');
      if (saved) {
        setVehicles(JSON.parse(saved));
      }
    } catch {
      // fallback to initial
    }
  }, []);

  const saveFleet = (updated: AdminVehicle[]) => {
    setVehicles(updated);
    try {
      localStorage.setItem('newlink_admin_fleet', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // KPIs
  const totalFleet = vehicles.length;
  const inServiceCount = vehicles.filter((v) => v.operationalStatus === 'IN_SERVICE').length;
  const maintenanceCount = vehicles.filter((v) => v.operationalStatus === 'MAINTENANCE').length;
  const inactiveCount = vehicles.filter((v) => v.operationalStatus === 'INACTIVE').length;

  const complianceStats = useMemo(() => {
    const now = new Date();
    let legal = 0;
    vehicles.forEach((v) => {
      const docs = v.documents.map((d) => ({
        type: d.type as any,
        documentNumber: d.documentNumber,
        expiresOn: new Date(d.expiresOn),
      }));
      const check = checkVehicleCompliance(docs, now);
      if (check.isRoadLegal) legal += 1;
    });
    return {
      legalCount: legal,
      legalPercentage: totalFleet > 0 ? Math.round((legal / totalFleet) * 100) : 100,
    };
  }, [vehicles, totalFleet]);

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // City filter
      if (selectedCity === 'pune' && v.cityId !== 'city-pune') return false;
      if (selectedCity === 'nashik' && v.cityId !== 'city-nashik') return false;

      // Status filter
      if (selectedStatus !== 'ALL' && v.operationalStatus !== selectedStatus) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = `${v.brand} ${v.model} ${v.variant || ''}`.toLowerCase().includes(q);
        const matchReg = v.registrationNumber.toLowerCase().includes(q);
        const matchLoc = v.locationName.toLowerCase().includes(q);
        if (!matchTitle && !matchReg && !matchLoc) return false;
      }

      return true;
    });
  }, [vehicles, selectedCity, selectedStatus, searchQuery]);

  // Handle Add Vehicle
  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const cityId = newCity === 'pune' ? 'city-pune' : 'city-nashik';
    const cityName = newCity === 'pune' ? 'Pune' : 'Nashik';
    const locationId = newCity === 'pune' ? 'loc-pn-baner' : 'loc-ns-mumbainaka';
    const id = `veh-${newBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString(36)}`;

    const newVehicle: AdminVehicle = {
      id,
      brand: newBrand,
      model: newModel,
      variant: newVariant,
      category: newCategory,
      transmission: newTransmission,
      fuel: newFuel,
      seats: Number(newSeats),
      cityId,
      cityName,
      locationId,
      locationName: newLocationName,
      registrationNumber: newRegNumber.toUpperCase(),
      registrationYear: Number(newRegYear),
      odometerKm: Number(newOdometer),
      fuelLevelPercent: 100,
      operationalStatus: 'IN_SERVICE',
      ratingAvg: 5.0,
      ratingCount: 1,
      startingPricePaise: Math.round((newDailyRate * 100) / 12),
      dailyRatePaise: newDailyRate * 100,
      securityDepositPaise: newDeposit * 100,
      primaryImageUrl: newImage,
      features: ['Fastag Active', 'High Road Clearance', 'Touchscreen Media', 'Air Conditioning'],
      isAvailable: true,
      documents: [
        {
          id: `doc-${Date.now().toString(36)}-rc`,
          vehicleId: id,
          type: 'REGISTRATION_CERTIFICATE',
          documentNumber: newRegNumber.toUpperCase(),
          expiresOn: '2039-12-31T00:00:00Z',
          verified: true,
        },
        {
          id: `doc-${Date.now().toString(36)}-ins`,
          vehicleId: id,
          type: 'COMMERCIAL_INSURANCE',
          documentNumber: `POL-${Date.now().toString().slice(-6)}`,
          expiresOn: '2027-10-01T00:00:00Z',
          verified: true,
        },
        {
          id: `doc-${Date.now().toString(36)}-puc`,
          vehicleId: id,
          type: 'POLLUTION_UNDER_CONTROL',
          documentNumber: `PUC-MH-${Date.now().toString().slice(-5)}`,
          expiresOn: '2026-12-15T00:00:00Z',
          verified: true,
        },
      ],
    };

    saveFleet([newVehicle, ...vehicles]);
    setIsAddModalOpen(false);
    showToast(`✓ Added ${newBrand} ${newModel} (${newRegNumber.toUpperCase()}) to active fleet!`);
  };

  // Handle Status Update
  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalVehicle) return;

    const updated = vehicles.map((v) => {
      if (v.id === statusModalVehicle.id) {
        return {
          ...v,
          operationalStatus: targetStatus,
          isAvailable: targetStatus === 'IN_SERVICE',
        };
      }
      return v;
    });

    saveFleet(updated);
    setStatusModalVehicle(null);
    showToast(`✓ Updated status of ${statusModalVehicle.brand} ${statusModalVehicle.model} to ${targetStatus}`);
  };

  // Handle Add / Renew Document
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docModalVehicle) return;

    const newDoc = {
      id: `doc-${Date.now().toString(36)}`,
      vehicleId: docModalVehicle.id,
      type: docType,
      documentNumber: docNumber || `DOC-${Date.now().toString().slice(-5)}`,
      expiresOn: new Date(docExpiry).toISOString(),
      verified: true,
    };

    const updated = vehicles.map((v) => {
      if (v.id === docModalVehicle.id) {
        const remainingDocs = v.documents.filter((d) => d.type !== docType);
        return {
          ...v,
          documents: [...remainingDocs, newDoc],
        };
      }
      return v;
    });

    saveFleet(updated);
    setDocModalVehicle(null);
    showToast(`✓ Recorded ${docType.replace(/_/g, ' ')} for ${docModalVehicle.registrationNumber}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <Navbar />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-3 font-semibold text-slate-950 shadow-2xl transition-all">
          <CheckCircle2 className="h-5 w-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Operations & Fleet Command</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
              Fleet Management
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Real-time vehicle status, road compliance certificates, and fleet dispatch across Pune & Nashik hubs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              id="add-vehicle-btn"
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6">
          <AdminNav />
        </div>

        {/* KPI Metrics Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-5 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Fleet</span>
              <Car className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{totalFleet}</span>
              <span className="text-xs text-slate-400">vehicles</span>
            </div>
            <div className="mt-2 text-xs text-slate-400">
              Pune ({vehicles.filter((v) => v.cityId === 'city-pune').length}) · Nashik ({vehicles.filter((v) => v.cityId === 'city-nashik').length})
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400">In Service (Active)</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400">{inServiceCount}</span>
              <span className="text-xs text-emerald-500/80">ready for dispatch</span>
            </div>
            <div className="mt-2 text-xs text-emerald-400/70">
              {Math.round((inServiceCount / (totalFleet || 1)) * 100)}% utilization readiness
            </div>
          </div>

          <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400">In Maintenance</span>
              <Wrench className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-400">{maintenanceCount}</span>
              <span className="text-xs text-amber-500/80">bays occupied</span>
            </div>
            <div className="mt-2 text-xs text-amber-400/70">
              {maintenanceCount > 0 ? 'Service ongoing' : 'Zero downtime'}
            </div>
          </div>

          <div className="rounded-2xl border border-blue-900/40 bg-blue-950/20 p-5 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-400">Legal Compliance</span>
              <ShieldCheck className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-blue-400">{complianceStats.legalPercentage}%</span>
              <span className="text-xs text-blue-300">RC / Ins / PUC</span>
            </div>
            <div className="mt-2 text-xs text-blue-300/70">
              {complianceStats.legalCount} of {totalFleet} vehicles road-legal
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-800/40 p-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by model, brand, registration plate (e.g. MH 12 RN 8821)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-slate-900/80 border border-slate-700/80 pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {/* City Filter */}
            <div className="flex items-center rounded-xl bg-slate-900/80 p-1 border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setSelectedCity('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedCity === 'ALL' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Hubs
              </button>
              <button
                onClick={() => setSelectedCity('pune')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedCity === 'pune' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pune
              </button>
              <button
                onClick={() => setSelectedCity('nashik')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedCity === 'nashik' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Nashik
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center rounded-xl bg-slate-900/80 p-1 border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setSelectedStatus('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedStatus === 'ALL' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All Status
              </button>
              <button
                onClick={() => setSelectedStatus('IN_SERVICE')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedStatus === 'IN_SERVICE' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                In Service
              </button>
              <button
                onClick={() => setSelectedStatus('MAINTENANCE')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedStatus === 'MAINTENANCE' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Maintenance
              </button>
              <button
                onClick={() => setSelectedStatus('INACTIVE')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedStatus === 'INACTIVE' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>

        {/* Vehicles Table & Cards */}
        <div className="space-y-4">
          {filteredVehicles.map((vehicle) => {
            const now = new Date();
            const docsFormatted = vehicle.documents.map((d) => ({
              type: d.type as any,
              documentNumber: d.documentNumber,
              expiresOn: new Date(d.expiresOn),
            }));
            const compliance = checkVehicleCompliance(docsFormatted, now);

            return (
              <div
                key={vehicle.id}
                className="rounded-2xl border border-slate-800 bg-slate-800/40 p-5 hover:border-slate-700 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Vehicle Identity */}
                <div className="flex items-center gap-4 min-w-[280px]">
                  <img
                    src={vehicle.primaryImageUrl}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="h-20 w-28 rounded-xl object-cover bg-slate-900 border border-slate-700 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">
                        {vehicle.brand} {vehicle.model}
                      </span>
                      {vehicle.variant && (
                        <span className="text-xs text-slate-400 font-medium">{vehicle.variant}</span>
                      )}
                    </div>

                    {/* High Security Number Plate Pill */}
                    <div className="mt-1.5 inline-flex items-center rounded-md border border-slate-300 bg-slate-100 px-2 py-0.5 shadow-xs">
                      <span className="mr-1 text-[9px] font-black text-blue-700">IND</span>
                      <span className="font-mono text-xs font-extrabold tracking-wider text-slate-950">
                        {vehicle.registrationNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-amber-500" />
                        {vehicle.cityName} · {vehicle.locationName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specs & Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs min-w-[320px]">
                  <div className="rounded-xl bg-slate-900/60 p-2.5 border border-slate-800/80">
                    <span className="text-slate-400 block">Odometer</span>
                    <span className="font-bold text-white text-sm flex items-center gap-1 mt-0.5">
                      <Gauge className="h-3.5 w-3.5 text-slate-400" />
                      {vehicle.odometerKm.toLocaleString('en-IN')} km
                    </span>
                  </div>

                  <div className="rounded-xl bg-slate-900/60 p-2.5 border border-slate-800/80">
                    <span className="text-slate-400 block">Fuel / EV</span>
                    <span className="font-bold text-white text-sm flex items-center gap-1 mt-0.5">
                      <Fuel className="h-3.5 w-3.5 text-amber-500" />
                      {vehicle.fuelLevelPercent}% · {vehicle.fuel}
                    </span>
                  </div>

                  <div className="rounded-xl bg-slate-900/60 p-2.5 border border-slate-800/80">
                    <span className="text-slate-400 block">Base Daily Rate</span>
                    <span className="font-bold text-white text-sm mt-0.5 block">
                      ₹{(vehicle.dailyRatePaise / 100).toLocaleString('en-IN')}/day
                    </span>
                  </div>

                  <div className="rounded-xl bg-slate-900/60 p-2.5 border border-slate-800/80">
                    <span className="text-slate-400 block">Security Deposit</span>
                    <span className="font-bold text-white text-sm mt-0.5 block">
                      ₹{(vehicle.securityDepositPaise / 100).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Compliance Badge & Status */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 min-w-[200px]">
                  {/* Status Pill */}
                  <div className="flex items-center gap-2">
                    {vehicle.operationalStatus === 'IN_SERVICE' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        IN SERVICE
                      </span>
                    )}
                    {vehicle.operationalStatus === 'MAINTENANCE' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 px-3 py-1 text-xs font-bold text-amber-400">
                        <Wrench className="h-3 w-3" />
                        MAINTENANCE
                      </span>
                    )}
                    {vehicle.operationalStatus === 'INACTIVE' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-950/80 border border-red-500/40 px-3 py-1 text-xs font-bold text-red-400">
                        <XCircle className="h-3 w-3" />
                        INACTIVE
                      </span>
                    )}
                  </div>

                  {/* Road Legal Compliance Pill */}
                  <div className="flex items-center gap-1.5 text-xs">
                    {compliance.isRoadLegal ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Road Legal (3/3 Docs)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-400 font-semibold">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Compliance Issue
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => {
                        setStatusModalVehicle(vehicle);
                        setTargetStatus(vehicle.operationalStatus);
                      }}
                      className="rounded-lg bg-slate-700/60 hover:bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-200 border border-slate-600/50 transition-colors cursor-pointer"
                    >
                      Change Status
                    </button>
                    <button
                      onClick={() => setDocModalVehicle(vehicle)}
                      className="rounded-lg bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/30 transition-colors cursor-pointer"
                    >
                      Docs & Renewal
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredVehicles.length === 0 && (
            <div className="text-center py-16 rounded-2xl border border-slate-800 bg-slate-800/20">
              <Car className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No vehicles found</h3>
              <p className="text-xs text-slate-400 mt-1">
                Try adjusting your search query or filters.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* Modal: Add New Vehicle                                                    */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-bold text-white">Add New Vehicle to Fleet</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="mt-6 space-y-4 text-xs font-medium">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 block mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Model</label>
                  <input
                    type="text"
                    required
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Variant</label>
                  <input
                    type="text"
                    value={newVariant}
                    onChange={(e) => setNewVariant(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-slate-300 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 text-sm"
                  >
                    <option value="SUV">SUV</option>
                    <option value="SEDAN">SEDAN</option>
                    <option value="HATCHBACK">HATCHBACK</option>
                    <option value="COMPACT_SUV">COMPACT SUV</option>
                    <option value="PREMIUM">PREMIUM</option>
                    <option value="LUXURY">LUXURY</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Transmission</label>
                  <select
                    value={newTransmission}
                    onChange={(e) => setNewTransmission(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 text-sm"
                  >
                    <option value="AUTOMATIC">AUTOMATIC</option>
                    <option value="MANUAL">MANUAL</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Fuel Type</label>
                  <select
                    value={newFuel}
                    onChange={(e) => setNewFuel(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 text-sm"
                  >
                    <option value="DIESEL">DIESEL</option>
                    <option value="PETROL">PETROL</option>
                    <option value="CNG">CNG</option>
                    <option value="ELECTRIC">ELECTRIC</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Seats</label>
                  <input
                    type="number"
                    min={2}
                    max={10}
                    value={newSeats}
                    onChange={(e) => setNewSeats(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 block mb-1">Registration Plate (IND)</label>
                  <input
                    type="text"
                    required
                    placeholder="MH 12 XX 1234"
                    value={newRegNumber}
                    onChange={(e) => setNewRegNumber(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">City Hub</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 text-sm"
                  >
                    <option value="pune">Pune</option>
                    <option value="nashik">Nashik</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Hub Location</label>
                  <input
                    type="text"
                    required
                    value={newLocationName}
                    onChange={(e) => setNewLocationName(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 block mb-1">Daily Rate (₹)</label>
                  <input
                    type="number"
                    required
                    value={newDailyRate}
                    onChange={(e) => setNewDailyRate(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Refundable Deposit (₹)</label>
                  <input
                    type="number"
                    required
                    value={newDeposit}
                    onChange={(e) => setNewDeposit(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Odometer (km)</label>
                  <input
                    type="number"
                    value={newOdometer}
                    onChange={(e) => setNewOdometer(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Vehicle Image</label>
                <select
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 text-sm"
                >
                  <option value="/images/car-xuv700.jpg">Mahindra XUV700 / Thar Style</option>
                  <option value="/images/car-creta.jpg">Hyundai Creta</option>
                  <option value="/images/car-carens.jpg">Kia Carens</option>
                  <option value="/images/car-innova.jpg">Toyota Innova</option>
                  <option value="/images/car-fortuner.jpg">Toyota Fortuner</option>
                  <option value="/images/car-dzire.jpg">Maruti Dzire</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-add-vehicle-btn"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 cursor-pointer"
                >
                  Confirm & Deploy to Fleet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Modal: Change Operational Status                                          */}
      {/* ========================================================================= */}
      {statusModalVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Change Operational Status</h3>
              <button
                onClick={() => setStatusModalVehicle(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
              <span className="font-bold text-white">
                {statusModalVehicle.brand} {statusModalVehicle.model}
              </span>
              <span className="block font-mono text-slate-400 mt-0.5">
                {statusModalVehicle.registrationNumber}
              </span>
            </div>

            <form onSubmit={handleUpdateStatus} className="mt-4 space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-semibold">
                  Target Operational Status
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setTargetStatus('IN_SERVICE')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      targetStatus === 'IN_SERVICE'
                        ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                        : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:text-white'
                    }`}
                  >
                    IN SERVICE
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetStatus('MAINTENANCE')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      targetStatus === 'MAINTENANCE'
                        ? 'border-amber-500 bg-amber-950/60 text-amber-300'
                        : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:text-white'
                    }`}
                  >
                    MAINTENANCE
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetStatus('INACTIVE')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      targetStatus === 'INACTIVE'
                        ? 'border-red-500 bg-red-950/60 text-red-300'
                        : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:text-white'
                    }`}
                  >
                    INACTIVE
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-semibold">
                  Reason / Maintenance Log Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Scheduled 20k km oil change and tire rotation at authorized service hub."
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStatusModalVehicle(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-status-update-btn"
                  className="px-4 py-1.5 rounded-xl bg-amber-500 text-xs font-bold text-slate-950 hover:bg-amber-400 cursor-pointer"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Modal: Document Renewal & Compliance                                      */}
      {/* ========================================================================= */}
      {docModalVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-bold text-white">Compliance & Document Renewal</h3>
              </div>
              <button
                onClick={() => setDocModalVehicle(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Existing Documents List */}
            <div className="mt-4 space-y-2">
              <span className="text-xs text-slate-400 font-semibold block">Active Certifications</span>
              {docModalVehicle.documents.map((doc) => {
                const isExpired = new Date(doc.expiresOn) < new Date();
                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">
                        {doc.type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {doc.documentNumber}
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-semibold block ${
                          isExpired ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {isExpired ? 'EXPIRED' : 'VALID'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Expires {new Date(doc.expiresOn).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add / Renew Form */}
            <form onSubmit={handleAddDocument} className="mt-5 pt-4 border-t border-slate-800 space-y-3">
              <span className="text-xs text-amber-400 font-bold block">Record New / Renewed Certificate</span>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Doc Type</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2 text-white text-xs"
                  >
                    <option value="COMMERCIAL_INSURANCE">Commercial Insurance</option>
                    <option value="POLLUTION_UNDER_CONTROL">Pollution Under Control (PUC)</option>
                    <option value="REGISTRATION_CERTIFICATE">Registration Certificate (RC)</option>
                    <option value="FITNESS_CERTIFICATE">Fitness Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Cert / Policy Number</label>
                  <input
                    type="text"
                    placeholder="e.g. POL-992144"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="text-slate-400 block mb-1">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={docExpiry}
                  onChange={(e) => setDocExpiry(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2 text-white text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDocModalVehicle(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-500 text-xs font-bold text-slate-950 hover:bg-amber-400 cursor-pointer"
                >
                  Update Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
