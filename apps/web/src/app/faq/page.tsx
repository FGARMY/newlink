'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Car,
  FileCheck,
  CreditCard,
  MapPin,
  ShieldCheck,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

interface FaqItem {
  id: string;
  category: 'BOOKING' | 'KYC' | 'PICKUP' | 'TRIP' | 'FUEL';
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'b1',
    category: 'BOOKING',
    question: 'How does self-drive car rental pricing work with Speion Cars?',
    answer:
      'Our pricing is 100% transparent with zero hidden costs. Rates include the base vehicle rental and 18% GST. Each booking includes a free kilometer allowance (typically 250 km/day). Any excess distance is billed at simple per-kilometer rates (₹12 to ₹18/km depending on vehicle segment).',
  },
  {
    id: 'b2',
    category: 'BOOKING',
    question: 'How and when is the security deposit refunded?',
    answer:
      'A refundable deposit (₹3,000 for sedans/compacts, ₹5,000 to ₹10,000 for SUVs & luxury vehicles) is held during your trip. After you drop off the vehicle and complete the return check-in, FASTag tolls and fuel variance are automatically reconciled, and the remaining deposit is refunded to your original payment method within 2 to 4 hours.',
  },
  {
    id: 'b3',
    category: 'BOOKING',
    question: 'What is your cancellation policy?',
    answer:
      'You get a 100% full refund with zero cancellation fee if cancelled at least 6 hours before your scheduled pickup time. Cancellations between 2 to 6 hours receive a 50% rental refund, and security deposits are always refunded 100%.',
  },
  {
    id: 'k1',
    category: 'KYC',
    question: 'What documents are required to book and drive?',
    answer:
      'You need two documents: (1) A valid original Light Motor Vehicle (LMV) Driving License (minimum 1 year old, not a learner license), and (2) A government identity proof (Aadhaar Card, Passport, or Voter ID). Both can be uploaded in 60 seconds through our digital KYC portal.',
  },
  {
    id: 'k2',
    category: 'KYC',
    question: 'Can foreigners or NRI travelers rent a car with an International Driving Permit (IDP)?',
    answer:
      'Yes! Foreign nationals and NRIs can rent by uploading their valid Passport, Visa copy, and an active International Driving Permit (IDP) along with their home country driving license.',
  },
  {
    id: 'k3',
    category: 'KYC',
    question: 'How long does KYC document verification take?',
    answer:
      'Our automated verification system reviews documents within 10 to 15 minutes. For immediate reservations, our operations team verifies documents priority-fast at the pickup hub.',
  },
  {
    id: 'p1',
    category: 'PICKUP',
    question: 'Where can I pick up and drop off the vehicle in Pune and Nashik?',
    answer:
      'In Pune, we have active 24/7 hubs at Pune Airport (Lohegaon), Baner High Street, Viman Nagar, and Hinjewadi IT Park. In Nashik, we operate from City Centre Mall Hub and Mumbai Naka. You can select your preferred pickup location while booking.',
  },
  {
    id: 'p2',
    category: 'PICKUP',
    question: 'How does key handover and contactless unlock work?',
    answer:
      'Once your booking is confirmed, you will receive a secure 4-digit pickup passcode in your Speion Cars dashboard. At the hub, present this passcode to our team, perform a 60-second 4-angle photo inspection on your phone, and drive away!',
  },
  {
    id: 'p3',
    category: 'PICKUP',
    question: 'Can I pick up in Pune and return in Nashik (One-way trip)?',
    answer:
      'Yes, inter-city one-way rentals between Pune and Nashik are supported on select SUV and Sedan models for an additional one-way intercity repositioning fee.',
  },
  {
    id: 't1',
    category: 'TRIP',
    question: 'What should I do if the car breaks down or gets a flat tire?',
    answer:
      'Speion Cars provides 24/7 Roadside Assistance across Maharashtra. Simply tap the Roadside Helpline in your account dashboard or call +91 98765 43210. Our emergency support will dispatch an on-ground technician or replacement vehicle immediately.',
  },
  {
    id: 't2',
    category: 'TRIP',
    question: 'How are FASTag highway toll charges handled?',
    answer:
      'All our vehicles come equipped with an active, pre-loaded FASTag. You can drive through toll plazas without stopping for cash payments. The exact toll deductions are logged digitally and settled from your security deposit upon return.',
  },
  {
    id: 't3',
    category: 'TRIP',
    question: 'What is the speed limit for Speion Cars rentals?',
    answer:
      'As per Maharashtra transport regulations and expressway safety guidelines, the maximum permitted speed is 120 km/h on expressways and 80 km/h on national highways. Over-speeding triggers safety chime alerts and standard safety penalty fines.',
  },
  {
    id: 'f1',
    category: 'FUEL',
    question: 'What is the fuel policy?',
    answer:
      'We follow a simple Level-to-Level fuel policy. If the vehicle is given to you with a full tank (or 75%), return it with the same level. If returned with less fuel, the variance is calculated at ₹25 per 1% shortage without excessive penalty markups.',
  },
  {
    id: 'f2',
    category: 'FUEL',
    question: 'Is smoking or carrying pets allowed inside the car?',
    answer:
      'Smoking is strictly prohibited in all vehicles to maintain freshness for subsequent renters (violators incur a ₹1,500 deep-cleaning fee). Pets are welcome provided they are kept in a travel crate or protective seat cover.',
  },
];

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>('b1');

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchesCategory = activeCategory === 'ALL' || faq.category === activeCategory;
      const matchesQuery =
        searchQuery === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-canvas text-slate-900 dark:text-white font-sans transition-colors duration-200">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-card/60 backdrop-blur-md py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-500/20">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Help Center &amp; Guides</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about renting a self-drive car, KYC documents, deposits, fuel policy, and 24/7 roadside assistance.
          </p>

          {/* Search Box */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions (e.g. deposit, fuel, airport, fastag)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-card pl-11 pr-4 py-3 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'ALL', label: 'All Questions' },
            { id: 'BOOKING', label: 'Booking & Rates' },
            { id: 'KYC', label: 'KYC & License' },
            { id: 'PICKUP', label: 'Pickup Hubs' },
            { id: 'TRIP', label: 'Roadside & FASTag' },
            { id: 'FUEL', label: 'Fuel Policy' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-white dark:bg-card text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-surface'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-12 text-center">
              <HelpCircle className="mx-auto h-10 w-10 text-slate-400" />
              <p className="mt-3 text-sm font-bold text-slate-900 dark:text-white">No questions matched your search</p>
              <p className="mt-1 text-xs text-slate-500">Try searching for keywords like &ldquo;deposit&rdquo;, &ldquo;license&rdquo;, or &ldquo;cancellation&rdquo;.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('ALL');
                }}
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setExpandedId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-blue-600 shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-4" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3 animate-fade-up">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 24/7 Support Contact Card */}
        <div className="mt-12 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-card p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Still have questions?
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                We are here 24 hours a day, 7 days a week
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                Our customer operations and roadside support desk is always active across Pune, Nashik, and highway corridors.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition-all cursor-pointer"
              >
                <Phone className="h-4 w-4" />
                <span>Call +91 98765 43210</span>
              </a>
              <a
                href="mailto:support@speioncars.com"
                className="flex items-center gap-2 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-surface px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <Mail className="h-4 w-4" />
                <span>support@speioncars.com</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
