import {
  DomainError,
  generateBookingReference,
  isBlockLive,
  makeInterval,
  blockingInterval,
  overlaps,
  assertBookingTransition,
  validatePickupHandover,
  calculateDepositSettlement,
  validateAndComputeDiscount,
  calculateReviewSummary,
  validateCustomerReview,
  resolveDepositDispute,
  validateDisputeClaim,
  type VehicleBlock,
  type RatePlan,
  type TaxRule,
  type BookingStatus,
  type HandoverChecklist,
  type ReturnInspection,
  type DepositSettlement,
  type CouponRule,
  type CustomerReview,
  type DepositDispute,
  type Paise,
} from '@newlink/domain';
import type {
  City,
  Location,
  VehicleCard,
  AdminVehicle,
  CreateVehicle,
  UpdateVehicle,
  VehicleOperationalStatus,
  AddVehicleDocument,
  VehicleDocument,
  PriceAdjustmentRule,
  CreatePriceAdjustment,
  CouponRuleContract,
  ValidateCouponRequest,
  CouponValidationResult,
  VehicleReviewsSummary,
} from '@newlink/contracts';
import type {
  IFleetRepository,
  IBookingRepository,
  ICustomerRepository,
  BookingRecord,
  ReservationRequest,
  CustomerRecord,
  KycRecord,
} from './interfaces.js';

export class MemoryFleetRepository implements IFleetRepository {
  private cities: City[] = [
    {
      id: 'city-pune',
      name: 'Pune',
      slug: 'pune',
      state: 'Maharashtra',
      code: 'PN',
      timeZone: 'Asia/Kolkata',
      status: 'ACTIVE',
      leadTimeMinutes: 60,
      minDurationMinutes: 480, // 8 hrs
      maxDurationMinutes: 43200, // 30 days
      turnaroundBufferMinutes: 120, // 2 hrs
    },
    {
      id: 'city-nashik',
      name: 'Nashik',
      slug: 'nashik',
      state: 'Maharashtra',
      code: 'NS',
      timeZone: 'Asia/Kolkata',
      status: 'ACTIVE',
      leadTimeMinutes: 60,
      minDurationMinutes: 480,
      maxDurationMinutes: 43200,
      turnaroundBufferMinutes: 120,
    },
  ];

  private locations: Location[] = [
    // Pune locations
    {
      id: 'loc-pn-airport',
      cityId: 'city-pune',
      name: 'Pune Airport (Lohegaon)',
      slug: 'pune-airport',
      address: 'Near Terminal 1, Lohegaon, Pune - 411032',
      lat: 18.5793,
      lng: 73.9089,
      contactPhone: '+91 98765 43210',
      pickupInstructions: 'Our representative meets you at Parking Bay 4 with the keys and checklist.',
      status: 'ACTIVE',
      isFeatured: true,
      hours: [{ dayOfWeek: 0, opensAt: 0, closesAt: 1440 }], // 24x7
    },
    {
      id: 'loc-pn-baner',
      cityId: 'city-pune',
      name: 'Baner - High Street Hub',
      slug: 'baner-high-street',
      address: 'Balewadi High Street, Baner, Pune - 411045',
      lat: 18.5701,
      lng: 73.7745,
      contactPhone: '+91 98765 43211',
      pickupInstructions: 'Pick up from designated Newlink bays outside the hub.',
      status: 'ACTIVE',
      isFeatured: true,
      hours: [{ dayOfWeek: 0, opensAt: 360, closesAt: 1380 }],
    },
    {
      id: 'loc-pn-viman',
      cityId: 'city-pune',
      name: 'Viman Nagar / Phoenix Bay',
      slug: 'viman-nagar',
      address: 'Near Phoenix Marketcity, Viman Nagar, Pune - 411014',
      lat: 18.562,
      lng: 73.9168,
      contactPhone: '+91 98765 43212',
      status: 'ACTIVE',
      isFeatured: false,
      hours: [{ dayOfWeek: 0, opensAt: 360, closesAt: 1380 }],
    },
    {
      id: 'loc-pn-hinjewadi',
      cityId: 'city-pune',
      name: 'Hinjewadi Phase 1 IT Park',
      slug: 'hinjewadi-phase-1',
      address: 'Near Shivaji Chowk, Hinjewadi Phase 1, Pune - 411057',
      lat: 18.5912,
      lng: 73.7389,
      contactPhone: '+91 98765 43213',
      status: 'ACTIVE',
      isFeatured: false,
      hours: [{ dayOfWeek: 0, opensAt: 360, closesAt: 1380 }],
    },
    // Nashik locations
    {
      id: 'loc-ns-citycentre',
      cityId: 'city-nashik',
      name: 'City Centre Mall Hub',
      slug: 'city-centre-mall',
      address: 'Untwadi Road, Lavate Nagar, Nashik - 422002',
      lat: 19.9975,
      lng: 73.7663,
      contactPhone: '+91 98765 43214',
      pickupInstructions: 'Designated parking slot B-12.',
      status: 'ACTIVE',
      isFeatured: true,
      hours: [{ dayOfWeek: 0, opensAt: 420, closesAt: 1320 }],
    },
    {
      id: 'loc-ns-mumbainaka',
      cityId: 'city-nashik',
      name: 'Mumbai Naka Interchange',
      slug: 'mumbai-naka',
      address: 'Mumbai - Agra National Hwy, Mumbai Naka, Nashik - 422001',
      lat: 19.9882,
      lng: 73.7845,
      contactPhone: '+91 98765 43215',
      status: 'ACTIVE',
      isFeatured: true,
      hours: [{ dayOfWeek: 0, opensAt: 360, closesAt: 1380 }],
    },
    {
      id: 'loc-ns-college-rd',
      cityId: 'city-nashik',
      name: 'College Road / Thatte Nagar',
      slug: 'college-road',
      address: 'Off College Road, Thatte Nagar, Nashik - 422005',
      lat: 20.0064,
      lng: 73.7612,
      contactPhone: '+91 98765 43216',
      status: 'ACTIVE',
      isFeatured: false,
      hours: [{ dayOfWeek: 0, opensAt: 420, closesAt: 1320 }],
    },
  ];

  private vehicles: AdminVehicle[] = [
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
      startingPricePaise: 18000, // ₹180/hr
      dailyRatePaise: 240000,    // ₹2,400/day
      securityDepositPaise: 500000, // ₹5,000
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

  private ratePlans: Map<string, RatePlan> = new Map([
    [
      'veh-creta-pn',
      {
        id: 'rp-creta-pn',
        scope: 'VEHICLE',
        scopeId: 'veh-creta-pn',
        cityId: 'city-pune',
        hourlyRate: 18000,
        weekdayDailyRate: 240000,
        weekendDailyRate: 280000,
        securityDeposit: 500000,
        minHours: 8,
      },
    ],
    [
      'veh-carens-pn',
      {
        id: 'rp-carens-pn',
        scope: 'VEHICLE',
        scopeId: 'veh-carens-pn',
        cityId: 'city-pune',
        hourlyRate: 20000,
        weekdayDailyRate: 280000,
        weekendDailyRate: 320000,
        securityDeposit: 500000,
        minHours: 8,
      },
    ],
    [
      'veh-xuv700-pn',
      {
        id: 'rp-xuv700-pn',
        scope: 'VEHICLE',
        scopeId: 'veh-xuv700-pn',
        cityId: 'city-pune',
        hourlyRate: 26000,
        weekdayDailyRate: 380000,
        weekendDailyRate: 440000,
        securityDeposit: 700000,
        minHours: 8,
      },
    ],
    [
      'veh-dzire-pn',
      {
        id: 'rp-dzire-pn',
        scope: 'VEHICLE',
        scopeId: 'veh-dzire-pn',
        cityId: 'city-pune',
        hourlyRate: 13000,
        weekdayDailyRate: 160000,
        weekendDailyRate: 190000,
        securityDeposit: 300000,
        minHours: 8,
      },
    ],
    [
      'veh-innova-pn',
      {
        id: 'rp-innova-pn',
        scope: 'VEHICLE',
        scopeId: 'veh-innova-pn',
        cityId: 'city-pune',
        hourlyRate: 25000,
        weekdayDailyRate: 350000,
        weekendDailyRate: 400000,
        securityDeposit: 600000,
        minHours: 8,
      },
    ],
    [
      'veh-creta-ns',
      {
        id: 'rp-creta-ns',
        scope: 'VEHICLE',
        scopeId: 'veh-creta-ns',
        cityId: 'city-nashik',
        hourlyRate: 18000,
        weekdayDailyRate: 240000,
        weekendDailyRate: 280000,
        securityDeposit: 500000,
        minHours: 8,
      },
    ],
    [
      'veh-fortuner-ns',
      {
        id: 'rp-fortuner-ns',
        scope: 'VEHICLE',
        scopeId: 'veh-fortuner-ns',
        cityId: 'city-nashik',
        hourlyRate: 42000,
        weekdayDailyRate: 580000,
        weekendDailyRate: 680000,
        securityDeposit: 1000000,
        minHours: 8,
      },
    ],
  ]);

  private taxRule: TaxRule = {
    id: 'tax-gst-18',
    name: 'GST',
    rateBps: 1800, // 18%
  };

  private blocks: VehicleBlock[] = [];

  async getCities(): Promise<City[]> {
    return this.cities.filter((c) => c.status === 'ACTIVE');
  }

  async getCityById(id: string): Promise<City | null> {
    return this.cities.find((c) => c.id === id) ?? null;
  }

  async getCityBySlug(slug: string): Promise<City | null> {
    return this.cities.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) ?? null;
  }

  async createCity(cityData: Omit<City, 'id'>): Promise<City> {
    const newCity: City = {
      ...cityData,
      id: `city-${cityData.slug}`,
    };
    this.cities.push(newCity);
    return newCity;
  }

  async updateCity(id: string, updates: Partial<City>): Promise<City> {
    const idx = this.cities.findIndex((c) => c.id === id);
    if (idx === -1) throw new DomainError('INVALID_INPUT', 'City not found');
    const existing = this.cities[idx]!;
    const updated: City = { ...existing, ...updates };
    this.cities[idx] = updated;
    return updated;
  }

  async getLocations(cityId?: string): Promise<Location[]> {
    if (cityId) {
      return this.locations.filter((l) => l.cityId === cityId && l.status === 'ACTIVE');
    }
    return this.locations.filter((l) => l.status === 'ACTIVE');
  }

  async getLocationById(id: string): Promise<Location | null> {
    return this.locations.find((l) => l.id === id) ?? null;
  }

  async createLocation(locData: Omit<Location, 'id'>): Promise<Location> {
    const newLoc: Location = {
      ...locData,
      id: `loc-${Date.now().toString(36)}`,
    };
    this.locations.push(newLoc);
    return newLoc;
  }

  async updateLocation(id: string, updates: Partial<Location>): Promise<Location> {
    const idx = this.locations.findIndex((l) => l.id === id);
    if (idx === -1) throw new DomainError('INVALID_INPUT', 'Location not found');
    const existing = this.locations[idx]!;
    const updated: Location = { ...existing, ...updates };
    this.locations[idx] = updated;
    return updated;
  }

  async getVehicles(cityId?: string, locationId?: string): Promise<VehicleCard[]> {
    let result = this.vehicles.map((v) => ({
      ...v,
      isAvailable: v.operationalStatus === 'IN_SERVICE' && v.isAvailable,
    }));
    if (cityId) {
      result = result.filter((v) => v.cityId === cityId);
    }
    if (locationId) {
      result = result.filter((v) => v.locationId === locationId);
    }
    return result;
  }

  async getVehicleById(id: string): Promise<VehicleCard | null> {
    const v = this.vehicles.find((item) => item.id === id);
    if (!v) return null;
    return {
      ...v,
      isAvailable: v.operationalStatus === 'IN_SERVICE' && v.isAvailable,
    };
  }

  async getAdminVehicles(cityId?: string, locationId?: string): Promise<AdminVehicle[]> {
    let result = this.vehicles;
    if (cityId) {
      result = result.filter((v) => v.cityId === cityId);
    }
    if (locationId) {
      result = result.filter((v) => v.locationId === locationId);
    }
    return result;
  }

  async getAdminVehicleById(id: string): Promise<AdminVehicle | null> {
    return this.vehicles.find((v) => v.id === id) ?? null;
  }

  async createVehicle(data: CreateVehicle): Promise<AdminVehicle> {
    const city = this.cities.find((c) => c.id === data.cityId);
    const location = this.locations.find((l) => l.id === data.locationId);
    const slugPart = `${data.brand}-${data.model}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = `veh-${slugPart}-${Date.now().toString(36)}`;

    const newVehicle: AdminVehicle = {
      id,
      brand: data.brand,
      model: data.model,
      variant: data.variant,
      category: data.category,
      transmission: data.transmission,
      fuel: data.fuel,
      seats: data.seats,
      cityId: data.cityId,
      cityName: city ? city.name : 'Pune',
      locationId: data.locationId,
      locationName: location ? location.name : 'Airport Hub',
      registrationNumber: data.registrationNumber,
      registrationYear: data.registrationYear,
      odometerKm: data.odometerKm,
      fuelLevelPercent: 100,
      operationalStatus: data.operationalStatus || 'IN_SERVICE',
      ratingAvg: 5.0,
      ratingCount: 0,
      startingPricePaise: Math.round(data.dailyRatePaise / 12),
      dailyRatePaise: data.dailyRatePaise,
      securityDepositPaise: data.securityDepositPaise,
      primaryImageUrl: data.primaryImageUrl,
      features: data.features || [],
      isAvailable: data.operationalStatus === 'IN_SERVICE',
      documents: [
        {
          id: `doc-${Date.now().toString(36)}-rc`,
          vehicleId: id,
          type: 'REGISTRATION_CERTIFICATE',
          documentNumber: data.registrationNumber,
          expiresOn: new Date(Date.now() + 15 * 365 * 86400 * 1000).toISOString(),
          verified: true,
        },
        {
          id: `doc-${Date.now().toString(36)}-ins`,
          vehicleId: id,
          type: 'COMMERCIAL_INSURANCE',
          documentNumber: `POL-${Date.now().toString().slice(-6)}`,
          expiresOn: new Date(Date.now() + 365 * 86400 * 1000).toISOString(),
          verified: true,
        },
        {
          id: `doc-${Date.now().toString(36)}-puc`,
          vehicleId: id,
          type: 'POLLUTION_UNDER_CONTROL',
          documentNumber: `PUC-${Date.now().toString().slice(-5)}`,
          expiresOn: new Date(Date.now() + 180 * 86400 * 1000).toISOString(),
          verified: true,
        },
      ],
    };

    this.vehicles.unshift(newVehicle);

    // Register rate plan
    this.ratePlans.set(id, {
      id: `rp-${id}`,
      scope: 'VEHICLE',
      scopeId: id,
      cityId: data.cityId,
      hourlyRate: Math.round(data.dailyRatePaise / 12),
      weekdayDailyRate: data.dailyRatePaise,
      weekendDailyRate: Math.round(data.dailyRatePaise * 1.15),
      securityDeposit: data.securityDepositPaise,
      minHours: 8,
    });

    return newVehicle;
  }

  async updateVehicle(id: string, updates: UpdateVehicle): Promise<AdminVehicle> {
    const idx = this.vehicles.findIndex((v) => v.id === id);
    if (idx === -1) throw new DomainError('INVALID_INPUT', 'Vehicle not found');
    const existing = this.vehicles[idx]!;
    const city = updates.cityId ? this.cities.find((c) => c.id === updates.cityId) : null;
    const location = updates.locationId ? this.locations.find((l) => l.id === updates.locationId) : null;

    const updated: AdminVehicle = {
      ...existing,
      ...updates,
      cityName: city ? city.name : existing.cityName,
      locationName: location ? location.name : existing.locationName,
      isAvailable: updates.operationalStatus
        ? updates.operationalStatus === 'IN_SERVICE'
        : existing.operationalStatus === 'IN_SERVICE',
    };
    this.vehicles[idx] = updated;

    if (updates.dailyRatePaise) {
      const rp = this.ratePlans.get(id);
      if (rp) {
        this.ratePlans.set(id, {
          ...rp,
          weekdayDailyRate: updates.dailyRatePaise,
          weekendDailyRate: Math.round(updates.dailyRatePaise * 1.15),
          hourlyRate: Math.round(updates.dailyRatePaise / 12),
          securityDeposit:
            updates.securityDepositPaise !== undefined
              ? updates.securityDepositPaise
              : rp.securityDeposit,
        });
      }
    }
    return updated;
  }

  async updateVehicleStatus(id: string, status: VehicleOperationalStatus, _reason?: string): Promise<AdminVehicle> {
    const idx = this.vehicles.findIndex((v) => v.id === id);
    if (idx === -1) throw new DomainError('INVALID_INPUT', 'Vehicle not found');
    const existing = this.vehicles[idx]!;
    const updated: AdminVehicle = {
      ...existing,
      operationalStatus: status,
      isAvailable: status === 'IN_SERVICE',
    };
    this.vehicles[idx] = updated;
    return updated;
  }

  async addVehicleDocument(vehicleId: string, doc: AddVehicleDocument): Promise<VehicleDocument> {
    const vehicle = this.vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) throw new DomainError('INVALID_INPUT', 'Vehicle not found');
    const newDoc: VehicleDocument = {
      id: `doc-${Date.now().toString(36)}`,
      vehicleId,
      type: doc.type,
      documentNumber: doc.documentNumber,
      documentUrl: doc.documentUrl,
      issuedOn: doc.issuedOn,
      expiresOn: doc.expiresOn,
      verified: true,
    };
    vehicle.documents.push(newDoc);
    return newDoc;
  }

  async getRatePlan(vehicleId: string): Promise<RatePlan | null> {
    return this.ratePlans.get(vehicleId) ?? null;
  }

  async getTaxRule(): Promise<TaxRule> {
    return this.taxRule;
  }

  async getVehicleBlocks(vehicleId: string): Promise<VehicleBlock[]> {
    return this.blocks.filter((b) => b.vehicleId === vehicleId);
  }

  private priceAdjustments: PriceAdjustmentRule[] = [
    {
      id: 'adj-weekend-surge',
      name: 'Weekend Peak Demand Surge',
      kind: 'SEASON',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      mode: 'MULTIPLIER',
      value: 11500, // 1.15x (+15%)
      priority: 1,
      isActive: true,
    },
    {
      id: 'adj-diwali-surge',
      name: 'Diwali & Festive Season Surge',
      kind: 'HOLIDAY',
      startDate: '2026-10-15',
      endDate: '2026-11-15',
      mode: 'MULTIPLIER',
      value: 12500, // 1.25x (+25%)
      priority: 2,
      isActive: true,
    },
    {
      id: 'adj-nashik-wine-season',
      name: 'Nashik Wine Tour Harvest Multiplier',
      kind: 'SEASON',
      startDate: '2026-08-01',
      endDate: '2026-12-31',
      mode: 'MULTIPLIER',
      value: 12000, // 1.20x (+20%)
      priority: 2,
      cityId: 'city-nashik',
      isActive: true,
    },
  ];

  private coupons: CouponRuleContract[] = [
    {
      id: 'coup-firstdrive',
      code: 'FIRSTDRIVE',
      type: 'PERCENT',
      value: 1500, // 15%
      description: 'Flat 15% off on your first self-drive booking (up to ₹1,500)',
      maxDiscountPaise: 150000,
      minBookingAmountPaise: 300000,
      validFrom: '2026-01-01T00:00:00Z',
      validTo: '2027-01-01T00:00:00Z',
      totalUsageLimit: 1000,
      usedCount: 42,
      isActive: true,
    },
    {
      id: 'coup-pune10',
      code: 'PUNE10',
      type: 'PERCENT',
      value: 1000, // 10%
      description: 'Exclusive 10% off on all Pune rentals (up to ₹1,000)',
      maxDiscountPaise: 100000,
      minBookingAmountPaise: 250000,
      validFrom: '2026-01-01T00:00:00Z',
      validTo: '2027-01-01T00:00:00Z',
      totalUsageLimit: 500,
      usedCount: 88,
      isActive: true,
    },
    {
      id: 'coup-wineweekend',
      code: 'WINEWEEKEND',
      type: 'FIXED',
      value: 50000, // ₹500
      description: 'Flat ₹500 off on your Nashik vineyard road trip',
      minBookingAmountPaise: 400000,
      validFrom: '2026-01-01T00:00:00Z',
      validTo: '2027-01-01T00:00:00Z',
      totalUsageLimit: 300,
      usedCount: 19,
      isActive: true,
    },
  ];

  async getPriceAdjustments(): Promise<PriceAdjustmentRule[]> {
    return [...this.priceAdjustments];
  }

  async createPriceAdjustment(adj: CreatePriceAdjustment): Promise<PriceAdjustmentRule> {
    const newAdj: PriceAdjustmentRule = {
      id: `adj-${Date.now().toString(36)}`,
      ...adj,
      isActive: true,
    };
    this.priceAdjustments.push(newAdj);
    return newAdj;
  }

  async togglePriceAdjustment(id: string): Promise<PriceAdjustmentRule> {
    const adj = this.priceAdjustments.find((a) => a.id === id);
    if (!adj) throw new DomainError('INVALID_INPUT', 'Price adjustment rule not found');
    adj.isActive = !adj.isActive;
    return adj;
  }

  async getCoupons(): Promise<CouponRuleContract[]> {
    return [...this.coupons];
  }

  async createCoupon(data: Omit<CouponRuleContract, 'id' | 'usedCount'>): Promise<CouponRuleContract> {
    const newCoupon: CouponRuleContract = {
      id: `coup-${Date.now().toString(36)}`,
      ...data,
      code: data.code.toUpperCase(),
      usedCount: 0,
    };
    this.coupons.push(newCoupon);
    return newCoupon;
  }

  async validateCoupon(req: ValidateCouponRequest): Promise<CouponValidationResult> {
    const cleanCode = req.code.trim().toUpperCase();
    const coupon = this.coupons.find((c) => c.code === cleanCode);
    if (!coupon) {
      return {
        isValid: false,
        code: cleanCode,
        discountPaise: 0,
        message: `Promo code "${cleanCode}" is invalid.`,
      };
    }

    if (!coupon.isActive) {
      return {
        isValid: false,
        code: cleanCode,
        discountPaise: 0,
        message: `Promo code "${cleanCode}" is currently inactive.`,
      };
    }

    const domainCoupon: CouponRule = {
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      maxDiscountPaise: coupon.maxDiscountPaise,
      minBookingAmountPaise: coupon.minBookingAmountPaise,
      validFrom: new Date(coupon.validFrom),
      validTo: new Date(coupon.validTo),
      totalUsageLimit: coupon.totalUsageLimit,
      perCustomerLimit: 2,
      isActive: coupon.isActive,
    };

    try {
      const discountPaise = validateAndComputeDiscount(domainCoupon, {
        baseRentalPaise: req.baseRentalPaise,
        cityId: req.cityId ?? 'city-pune',
        categoryId: req.categoryId ?? 'SUV',
        vehicleId: req.vehicleId ?? 'veh-creta-pn',
        customerId: req.customerId ?? 'guest',
        customerPriorUsages: 0,
        totalPriorUsages: coupon.usedCount,
        now: new Date(),
      });

      const newTotalPaise = Math.max(0, req.baseRentalPaise - discountPaise);
      return {
        isValid: true,
        code: cleanCode,
        discountPaise,
        newTotalPaise,
        message: `Applied ${cleanCode}! You saved ₹${discountPaise / 100}.`,
      };
    } catch (err: any) {
      return {
        isValid: false,
        code: cleanCode,
        discountPaise: 0,
        message: err.message || 'Coupon not applicable for this booking.',
      };
    }
  }

  private reviews: CustomerReview[] = [
    {
      id: 'rev-creta-1',
      vehicleId: 'veh-creta-pn',
      bookingReference: 'NL-PN-7K3Q9M',
      customerName: 'Aditya Kulkarni',
      customerCity: 'Pune',
      overallRating: 5,
      cleanlinessRating: 5,
      conditionRating: 5,
      handoverRating: 5,
      comment: 'Immaculate condition! Picked up from Pune Airport in 2 minutes using the digital passcode. Panoramic sunroof was a hit on our Lavasa drive.',
      createdAt: new Date('2026-10-02T14:30:00Z'),
    },
    {
      id: 'rev-creta-2',
      vehicleId: 'veh-creta-pn',
      bookingReference: 'NL-PN-8M4Q2R',
      customerName: 'Sneha Kadam',
      customerCity: 'Mumbai',
      overallRating: 5,
      cleanlinessRating: 5,
      conditionRating: 4,
      handoverRating: 5,
      comment: 'Super smooth automatic transmission. Full tank handed over, Fastag worked effortlessly on the Mumbai-Pune Expressway.',
      createdAt: new Date('2026-09-28T18:15:00Z'),
    },
    {
      id: 'rev-creta-3',
      vehicleId: 'veh-creta-pn',
      bookingReference: 'NL-PN-3K9P1W',
      customerName: 'Rohan Deshpande',
      customerCity: 'Pune',
      overallRating: 4,
      cleanlinessRating: 4,
      conditionRating: 5,
      handoverRating: 4,
      comment: 'Very well maintained Creta Turbo. Great driving dynamics and instant security deposit settlement upon return.',
      createdAt: new Date('2026-09-15T11:00:00Z'),
    },
    {
      id: 'rev-carens-1',
      vehicleId: 'veh-carens-pn',
      bookingReference: 'NL-PN-9R2D5X',
      customerName: 'Vikram Joshi',
      customerCity: 'Pune',
      overallRating: 5,
      cleanlinessRating: 5,
      conditionRating: 5,
      handoverRating: 5,
      comment: 'Perfect 7-seater for our family trip to Mahabaleshwar. Extremely comfortable second row and great fuel mileage.',
      createdAt: new Date('2026-10-05T16:20:00Z'),
    },
    {
      id: 'rev-scorpio-1',
      vehicleId: 'veh-scorpio-ns',
      bookingReference: 'NL-NS-4M8P2W',
      customerName: 'Rajesh Shinde',
      customerCity: 'Nashik',
      overallRating: 5,
      cleanlinessRating: 5,
      conditionRating: 5,
      handoverRating: 5,
      comment: 'True road presence! Handled the Trimbakeshwar ghats with total ease. 4x4 capability gave solid confidence.',
      createdAt: new Date('2026-10-04T12:00:00Z'),
    },
  ];

  private disputes: DepositDispute[] = [
    {
      id: 'disp-demo-1',
      bookingReference: 'NL-PN-9R2D5X',
      vehicleId: 'veh-carens-pn',
      customerName: 'Neha Shinde',
      customerPhone: '+91 98220 11994',
      reason: 'FASTAG_MISMATCH',
      claimedRefundPaise: 35000 as Paise, // ₹350
      customerNotes: 'Khed Shivapur toll plaza scanner double-debited Fastag due to barrier delay. Attached toll SMS screenshot.',
      status: 'OPEN',
      createdAt: new Date('2026-10-08T19:30:00Z'),
    },
  ];

  async getVehicleReviews(vehicleId: string): Promise<VehicleReviewsSummary> {
    const list = this.reviews.filter((r) => r.vehicleId === vehicleId);
    const summary = calculateReviewSummary(list);
    return {
      ratingAvg: summary.ratingAvg,
      ratingCount: summary.ratingCount,
      cleanlinessAvg: summary.cleanlinessAvg,
      conditionAvg: summary.conditionAvg,
      handoverAvg: summary.handoverAvg,
      reviews: summary.reviews.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
    };
  }

  async addVehicleReview(data: Omit<CustomerReview, 'id' | 'createdAt'>): Promise<CustomerReview> {
    validateCustomerReview(data);
    const newRev: CustomerReview = {
      id: `rev-${Date.now().toString(36)}`,
      ...data,
      createdAt: new Date(),
    };
    this.reviews.unshift(newRev);

    // Update vehicle average rating in fleet roster
    const vehicle = this.vehicles.find((v) => v.id === data.vehicleId);
    if (vehicle) {
      const allForCar = this.reviews.filter((r) => r.vehicleId === data.vehicleId);
      const summ = calculateReviewSummary(allForCar);
      vehicle.ratingAvg = summ.ratingAvg;
      vehicle.ratingCount = summ.ratingCount;
    }

    return newRev;
  }

  async getDisputes(): Promise<DepositDispute[]> {
    return [...this.disputes].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createDispute(data: Omit<DepositDispute, 'id' | 'createdAt' | 'status'>): Promise<DepositDispute> {
    validateDisputeClaim(data.claimedRefundPaise, 500000 as Paise, data.customerNotes);
    const newDisp: DepositDispute = {
      id: `disp-${Date.now().toString(36)}`,
      ...data,
      status: 'OPEN',
      createdAt: new Date(),
    };
    this.disputes.unshift(newDisp);
    return newDisp;
  }

  async resolveDispute(
    id: string,
    action: 'APPROVE' | 'REJECT',
    approvedRefundPaise: number,
    resolutionNotes: string,
  ): Promise<DepositDispute> {
    const disp = this.disputes.find((d) => d.id === id);
    if (!disp) throw new DomainError('INVALID_INPUT', 'Dispute record not found');
    const resolved = resolveDepositDispute(
      disp,
      action,
      approvedRefundPaise as Paise,
      resolutionNotes,
    );
    const idx = this.disputes.findIndex((d) => d.id === id);
    if (idx !== -1) {
      this.disputes[idx] = resolved;
    }
    return resolved;
  }

  /** Internal helper to record a calendar block */
  addBlock(block: VehicleBlock): void {
    this.blocks.push(block);
  }

  /** Internal helper to update a calendar block immutably */
  updateBlock(id: string, updates: Partial<VehicleBlock>): void {
    const idx = this.blocks.findIndex((b) => b.id === id);
    if (idx !== -1) {
      this.blocks[idx] = { ...this.blocks[idx]!, ...updates };
    }
  }
}

export class MemoryBookingRepository implements IBookingRepository {
  private bookings: Map<string, BookingRecord> = new Map();
  private idempotencyIndex: Map<string, BookingRecord> = new Map();
  // Per-vehicle mutex to serialize reservation requests and eliminate race conditions
  private vehicleLocks: Map<string, Promise<void>> = new Map();

  async getAllBookings(): Promise<BookingRecord[]> {
    return Array.from(this.bookings.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  constructor(private fleetRepo: MemoryFleetRepository) {}

  private async acquireVehicleLock(vehicleId: string): Promise<() => void> {
    while (this.vehicleLocks.has(vehicleId)) {
      await this.vehicleLocks.get(vehicleId);
    }
    let release!: () => void;
    const lockPromise = new Promise<void>((resolve) => {
      release = () => {
        this.vehicleLocks.delete(vehicleId);
        resolve();
      };
    });
    this.vehicleLocks.set(vehicleId, lockPromise);
    return release;
  }

  async reserveIfAvailable(req: ReservationRequest): Promise<BookingRecord> {
    // 1. Idempotency check: if customer re-submits with identical key, return existing record
    const existing = this.idempotencyIndex.get(req.idempotencyKey);
    if (existing) {
      return existing;
    }

    // 2. Acquire vehicle mutex: guarantees strict serializability per car
    const releaseLock = await this.acquireVehicleLock(req.vehicleId);

    try {
      const now = new Date();
      const requestedInterval = makeInterval(req.start, req.end);
      const blockingReq = blockingInterval(requestedInterval, req.bufferMinutes);

      // Check existing blocks for this vehicle
      const existingBlocks = await this.fleetRepo.getVehicleBlocks(req.vehicleId);
      const isConflicted = existingBlocks.some((b) => {
        if (!isBlockLive(b, now)) return false;
        return overlaps(b, blockingReq);
      });

      if (isConflicted) {
        throw new DomainError(
          'VEHICLE_UNAVAILABLE',
          'This vehicle is already reserved for the requested dates/times.',
        );
      }

      // Generate booking and block
      const bookingId = `bk-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const reference = generateBookingReference(req.brandPrefix, req.cityCode);
      const holdExpiresAt = new Date(now.getTime() + req.holdDurationMinutes * 60 * 1000);

      const block: VehicleBlock = {
        id: `blk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        vehicleId: req.vehicleId,
        type: 'HOLD',
        start: blockingReq.start,
        end: blockingReq.end,
        isActive: true,
        holdExpiresAt,
        bookingId,
      };

      this.fleetRepo.addBlock(block);

      const pickupPasscode = Math.floor(1000 + Math.random() * 9000).toString();

      const record: BookingRecord = {
        id: bookingId,
        reference,
        vehicleId: req.vehicleId,
        customerId: req.customerId,
        customerPhone: req.customerPhone,
        customerName: req.customerName,
        pickupLocationId: req.pickupLocationId,
        returnLocationId: req.returnLocationId,
        start: req.start,
        end: req.end,
        status: 'PAYMENT_PENDING',
        paymentStatus: 'UNPAID',
        holdExpiresAt,
        amountPayablePaise: req.amountPayablePaise,
        ratePlanId: req.ratePlanId,
        idempotencyKey: req.idempotencyKey,
        pickupPasscode,
        createdAt: now,
        updatedAt: now,
      };

      this.bookings.set(bookingId, record);
      this.idempotencyIndex.set(req.idempotencyKey, record);

      return record;
    } finally {
      releaseLock();
    }
  }

  async getBookingByReference(reference: string): Promise<BookingRecord | null> {
    for (const b of this.bookings.values()) {
      if (b.reference === reference) return b;
    }
    return null;
  }

  async getBookingById(id: string): Promise<BookingRecord | null> {
    return this.bookings.get(id) ?? null;
  }

  async updateBookingStatus(id: string, status: BookingStatus): Promise<BookingRecord> {
    const booking = this.bookings.get(id);
    if (!booking) throw new DomainError('INVALID_INPUT', 'Booking not found');
    booking.status = status;
    booking.updatedAt = new Date();
    return booking;
  }

  async confirmBookingPayment(reference: string, paymentId: string, orderId: string): Promise<BookingRecord> {
    const booking = await this.getBookingByReference(reference);
    if (!booking) throw new DomainError('INVALID_INPUT', 'Booking reference not found');

    assertBookingTransition(booking.status, 'CONFIRMED');
    booking.status = 'CONFIRMED';
    booking.paymentStatus = 'PAID';
    booking.paymentId = paymentId;
    booking.orderId = orderId;
    booking.holdExpiresAt = null;
    booking.updatedAt = new Date();

    // Convert hold block to confirmed block
    const blocks = await this.fleetRepo.getVehicleBlocks(booking.vehicleId);
    const relatedBlock = blocks.find((b) => b.bookingId === booking.id);
    if (relatedBlock) {
      this.fleetRepo.updateBlock(relatedBlock.id, {
        type: 'BOOKING',
        holdExpiresAt: null,
      });
    }

    return booking;
  }

  async startTripHandover(reference: string, handover: HandoverChecklist): Promise<BookingRecord> {
    const booking = await this.getBookingByReference(reference);
    if (!booking) throw new DomainError('INVALID_INPUT', 'Booking reference not found');

    validatePickupHandover(handover);
    assertBookingTransition(booking.status, 'ACTIVE');

    booking.status = 'ACTIVE';
    booking.handover = handover;
    booking.updatedAt = new Date();

    // Update vehicle odometer if higher
    const vehicle = await this.fleetRepo.getAdminVehicleById(booking.vehicleId);
    if (vehicle) {
      await this.fleetRepo.updateVehicle(booking.vehicleId, {
        odometerKm: Math.max(vehicle.odometerKm, handover.odometerKm),
      });
    }

    return booking;
  }

  async completeTripReturn(
    reference: string,
    inspection: ReturnInspection,
    originalDepositPaise: number,
  ): Promise<{ booking: BookingRecord; settlement: DepositSettlement }> {
    const booking = await this.getBookingByReference(reference);
    if (!booking) throw new DomainError('INVALID_INPUT', 'Booking reference not found');
    if (!booking.handover) {
      throw new DomainError('INVALID_INPUT', 'Cannot complete return for a trip without start handover');
    }

    assertBookingTransition(booking.status, 'COMPLETED');
    const settlement = calculateDepositSettlement(originalDepositPaise, booking.handover, inspection);

    booking.status = 'COMPLETED';
    booking.returnInspection = inspection;
    booking.depositSettlement = settlement;
    booking.updatedAt = new Date();

    // Update vehicle odometer
    await this.fleetRepo.updateVehicle(booking.vehicleId, {
      odometerKm: Math.max(inspection.returnOdometerKm, booking.handover.odometerKm),
    });

    return { booking, settlement };
  }
}

export class MemoryCustomerRepository implements ICustomerRepository {
  private customers: Map<string, CustomerRecord> = new Map();
  private phoneIndex: Map<string, string> = new Map(); // phone -> id
  private kycDocuments: Map<string, KycRecord[]> = new Map(); // customerId -> docs

  async findByPhone(phone: string): Promise<CustomerRecord | null> {
    const id = this.phoneIndex.get(phone);
    if (!id) return null;
    return this.customers.get(id) ?? null;
  }

  async findById(id: string): Promise<CustomerRecord | null> {
    return this.customers.get(id) ?? null;
  }

  async create(phone: string, name?: string): Promise<CustomerRecord> {
    const id = `cust-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date();
    const record: CustomerRecord = {
      id,
      phone,
      name: name ?? null,
      email: null,
      kycStatus: 'NOT_SUBMITTED',
      createdAt: now,
      updatedAt: now,
    };
    this.customers.set(id, record);
    this.phoneIndex.set(phone, id);
    return record;
  }

  async update(id: string, updates: Partial<CustomerRecord>): Promise<CustomerRecord> {
    const record = this.customers.get(id);
    if (!record) throw new DomainError('INVALID_INPUT', 'Customer not found');
    const updated: CustomerRecord = {
      ...record,
      ...updates,
      updatedAt: new Date(),
    };
    this.customers.set(id, updated);
    return updated;
  }

  async addKycDocument(docData: Omit<KycRecord, 'id' | 'submittedAt'>): Promise<KycRecord> {
    const id = `kyc-${Date.now().toString(36)}`;
    const doc: KycRecord = {
      ...docData,
      id,
      submittedAt: new Date(),
    };
    const list = this.kycDocuments.get(docData.customerId) || [];
    list.push(doc);
    this.kycDocuments.set(docData.customerId, list);

    // Update customer KYC status to PENDING_REVIEW
    await this.update(docData.customerId, { kycStatus: 'PENDING_REVIEW' });
    return doc;
  }

  async getKycDocuments(customerId: string): Promise<KycRecord[]> {
    return this.kycDocuments.get(customerId) || [];
  }
}

