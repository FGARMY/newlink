'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Car,
  Users,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowUpRight,
  ArrowRight,
  Percent,
  IndianRupee,
  Activity,
  AlertCircle,
  Zap,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { AdminNav } from '../../components/AdminNav';

interface CityAnalytics {
  cityId: string;
  cityName: string;
  totalFleet: number;
  activeRentals: number;
  revenuePaise: number;
  occupancyRatePercent: number;
  revPacPaise: number;
}

interface RecentBooking {
  reference: string;
  vehicleModel: string;
  cityName: string;
  customerName: string;
  status: string;
  amountPaise: number;
  createdAt: string;
}

interface AnalyticsData {
  totalFleet: number;
  activeRentals: number;
  availableVehicles: number;
  maintenanceVehicles: number;
  occupancyRatePercent: number;
  serviceabilityPercent: number;
  totalRevenuePaise: number;
  depositsHeldPaise: number;
  depositsRefundedPaise: number;
  revPacPaise: number;
  totalBookingsCount: number;
  cityBreakdown: CityAnalytics[];
  recentBookings: RecentBooking[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    totalFleet: 8,
    activeRentals: 5,
    availableVehicles: 2,
    maintenanceVehicles: 1,
    occupancyRatePercent: 71.4,
    serviceabilityPercent: 87.5,
    totalRevenuePaise: 54850000, // ₹5,48,500
    depositsHeldPaise: 1500000,
    depositsRefundedPaise: 850000,
    revPacPaise: 3450000, // ₹34,500
    totalBookingsCount: 18,
    cityBreakdown: [
      {
        cityId: 'city-pune',
        cityName: 'Pune',
        totalFleet: 5,
        activeRentals: 3,
        revenuePaise: 38200000,
        occupancyRatePercent: 75.0,
        revPacPaise: 3820000,
      },
      {
        cityId: 'city-nashik',
        cityName: 'Nashik',
        totalFleet: 3,
        activeRentals: 2,
        revenuePaise: 16650000,
        occupancyRatePercent: 66.7,
        revPacPaise: 2775000,
      },
    ],
    recentBookings: [
      {
        reference: 'NL-PN-7K3Q9M',
        vehicleModel: 'Hyundai Creta SX Turbo',
        cityName: 'Pune',
        customerName: 'Aditya Kulkarni',
        status: 'ACTIVE',
        amountPaise: 450000,
        createdAt: '10 mins ago',
      },
      {
        reference: 'NL-NS-4M8P2W',
        vehicleModel: 'Mahindra Scorpio-N Z8',
        cityName: 'Nashik',
        customerName: 'Rohit Deshmukh',
        status: 'CONFIRMED',
        amountPaise: 380000,
        createdAt: '45 mins ago',
      },
      {
        reference: 'NL-PN-9R2D5X',
        vehicleModel: 'Kia Carens Prestige',
        cityName: 'Pune',
        customerName: 'Neha Shinde',
        status: 'COMPLETED',
        amountPaise: 520000,
        createdAt: '3 hours ago',
      },
      {
        reference: 'NL-PN-2B8V4K',
        vehicleModel: 'Mahindra XUV700 AX7',
        cityName: 'Pune',
        customerName: 'Vikram Mehta',
        status: 'ACTIVE',
        amountPaise: 740000,
        createdAt: '5 hours ago',
      },
      {
        reference: 'NL-NS-6T1Y8Q',
        vehicleModel: 'Toyota Innova Crysta',
        cityName: 'Nashik',
        customerName: 'Anand Patil',
        status: 'CONFIRMED',
        amountPaise: 680000,
        createdAt: '1 day ago',
      },
    ],
  });

  const [bookingFilter, setBookingFilter] = useState<string>('ALL');

  useEffect(() => {
    // Attempt live fetch from API
    fetch('http://localhost:3000/api/v1/admin/analytics')
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((json) => {
        if (json?.data) {
          setData(json.data);
        }
      })
      .catch(() => {
        // Fallback to high-fidelity defaults
      });
  }, []);

  const filteredBookings = data.recentBookings.filter((b) => {
    if (bookingFilter === 'ALL') return true;
    return b.status === bookingFilter;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <TrendingUp className="h-4 w-4" />
              <span>Executive Command & Intelligence</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
              Platform Analytics
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Cross-hub operational performance, revenue yield (RevPAC), occupancy rates, and real-time fleet activity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/pricing"
              className="flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-all"
            >
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Surge & Promos</span>
            </Link>
            <Link
              href="/admin/vehicles"
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all"
            >
              <Car className="h-4 w-4" />
              <span>Manage Fleet</span>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6">
          <AdminNav />
        </div>

        {/* Hero KPI Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Occupancy Rate */}
          <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-6 backdrop-blur-xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Fleet Occupancy Rate
              </span>
              <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400">
                <Percent className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{data.occupancyRatePercent}%</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center">
                <ArrowUpRight className="h-3 w-3 inline" /> +4.2% wk
              </span>
            </div>
            <div className="mt-3 w-full bg-slate-700/60 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${data.occupancyRatePercent}%` }}
              />
            </div>
            <div className="mt-3 text-xs text-slate-400 flex justify-between">
              <span>{data.activeRentals} Active rentals</span>
              <span>{data.availableVehicles} Idle / ready</span>
            </div>
          </div>

          {/* RevPAC */}
          <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-6 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                RevPAC (Rev / Avail Car)
              </span>
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                <IndianRupee className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                ₹{(data.revPacPaise / 100).toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400">/ car</span>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Yield per in-service vehicle across 30-day operating window.
            </p>
          </div>

          {/* Gross Bookings Revenue */}
          <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-6 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Gross Bookings GMV
              </span>
              <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                ₹{(data.totalRevenuePaise / 100).toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400">total</span>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Total transaction volume completed & active trips.
            </p>
          </div>

          {/* Security Deposits Escrow */}
          <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-6 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Escrow Security Deposits
              </span>
              <div className="rounded-lg bg-purple-500/10 p-2 text-purple-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                ₹{(data.depositsHeldPaise / 100).toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-emerald-400 font-semibold">Held</span>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              ₹{(data.depositsRefundedPaise / 100).toLocaleString('en-IN')} auto-settled & refunded.
            </p>
          </div>
        </div>

        {/* City Hub Performance Breakdown */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-amber-400" />
                <span>Operating Hub Performance Comparison</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Comparative metrics across Pune & Nashik operational stations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.cityBreakdown.map((city) => (
              <div
                key={city.cityId}
                className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6 backdrop-blur-xs relative overflow-hidden"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-400 text-sm">
                      {city.cityName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{city.cityName} Hub</h3>
                      <p className="text-xs text-slate-400">
                        {city.cityName === 'Pune' ? 'Airport & Baner Fleet' : 'Mumbai Naka & City Hub'}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                    High Demand
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div>
                    <span className="text-xs text-slate-400 block">Fleet Allocated</span>
                    <span className="text-xl font-black text-white mt-1 block">
                      {city.totalFleet} Cars
                    </span>
                    <span className="text-xs text-amber-400 mt-0.5 block">
                      {city.activeRentals} on road
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block">Occupancy</span>
                    <span className="text-xl font-black text-white mt-1 block">
                      {city.occupancyRatePercent}%
                    </span>
                    <span className="text-xs text-slate-400 mt-0.5 block">Target 70%</span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block">Total Revenue</span>
                    <span className="text-xl font-black text-white mt-1 block">
                      ₹{(city.revenuePaise / 100).toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400 mt-0.5 block">
                      RevPAC ₹{(city.revPacPaise / 100).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Fleet Utilization Bar
                  </span>
                  <div className="w-1/2 bg-slate-700/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full"
                      style={{ width: `${city.occupancyRatePercent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Bookings & Activity Stream */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-6 backdrop-blur-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-amber-400" />
                <span>Live Operational Bookings Activity</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Real-time stream of vehicle dispatches, active trips, and completed settlements.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
              {['ALL', 'ACTIVE', 'CONFIRMED', 'COMPLETED'].map((f) => (
                <button
                  key={f}
                  onClick={() => setBookingFilter(f)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    bookingFilter === f
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400">
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Vehicle Model</th>
                  <th className="py-3 px-4">Hub</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBookings.map((b) => (
                  <tr key={b.reference} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-amber-400">
                      {b.reference}
                    </td>
                    <td className="py-4 px-4 font-medium text-white">
                      {b.customerName}
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {b.vehicleModel}
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      {b.cityName}
                    </td>
                    <td className="py-4 px-4">
                      {b.status === 'ACTIVE' && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          ACTIVE TRIP
                        </span>
                      )}
                      {b.status === 'CONFIRMED' && (
                        <span className="inline-flex items-center rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-xs font-bold text-blue-400">
                          CONFIRMED (READY)
                        </span>
                      )}
                      {b.status === 'COMPLETED' && (
                        <span className="inline-flex items-center rounded-full bg-slate-700/60 px-2.5 py-0.5 text-xs font-bold text-slate-300">
                          COMPLETED & SETTLED
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-white">
                      ₹{(b.amountPaise / 100).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-right text-xs text-slate-400">
                      {b.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Management Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link
            href="/admin/pricing"
            className="group rounded-2xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800/70 p-6 transition-all backdrop-blur-xs flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Zap className="h-4 w-4" />
                <span>Yield Management</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">
                Dynamic Pricing & Promotions Center
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure weekend surge multipliers, festive calendar overrides, and discount coupons.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/admin/vehicles"
            className="group rounded-2xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800/70 p-6 transition-all backdrop-blur-xs flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Car className="h-4 w-4" />
                <span>Fleet Operations</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1 group-hover:text-emerald-400 transition-colors">
                Vehicle Roster & Compliance Vault
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Maintain vehicle odometers, commercial RC/Insurance/PUC verification, and maintenance locks.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
