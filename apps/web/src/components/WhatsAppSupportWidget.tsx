'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, Shield, Clock } from 'lucide-react';

export function WhatsAppSupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('Trip Booking Inquiry');

  const topics = [
    { id: 'Trip Booking Inquiry', label: 'Car Availability & Rates' },
    { id: 'Airport Bay Pickup', label: 'Airport Bay Location' },
    { id: 'Host Onboarding', label: 'List My Car as Host' },
    { id: 'Active Trip Support', label: 'Active Trip Assistance' },
  ];

  const handleLaunchWhatsApp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const phone = '919823011000';
    const message = customMsg.trim()
      ? `Hello Speion Cars Team! [${selectedTopic}]: ${customMsg.trim()}`
      : `Hello Speion Cars Team! I have a question regarding: ${selectedTopic} in Pune/Nashik.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      {/* Popover Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-3xl bg-card border border-white/10 shadow-2xl p-5 text-white animate-fade-in backdrop-blur-xl">
          <div className="flex items-start justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 font-bold">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Speion Live Support
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </h4>
                <p className="text-[11px] text-slate-400">Avg reply time: ~2 minutes</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3">
            <label className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
              Quick Topic
            </label>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5">
              {topics.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTopic(t.id)}
                  className={`rounded-xl px-2.5 py-1.5 text-[11px] font-semibold text-left transition-all ${
                    selectedTopic === t.id
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                      : 'bg-surface/50 border border-white/5 text-slate-300 hover:bg-surface'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLaunchWhatsApp} className="mt-3 space-y-3">
            <textarea
              rows={2}
              placeholder="How can we assist your trip? (optional)..."
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-surface/50 p-2.5 text-xs text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none resize-none"
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Chat on WhatsApp</span>
            </button>
          </form>

          <div className="mt-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <Clock className="h-3 w-3 text-emerald-400" />
            <span>Operational: 24/7 across Pune &amp; Nashik</span>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 px-4 py-3 text-xs font-extrabold text-white shadow-xl shadow-emerald-950/50 hover:shadow-emerald-900/60 transition-all duration-300 cursor-pointer active:scale-95"
        aria-label="Contact Speion Support on WhatsApp"
      >
        <div className="relative">
          <MessageSquare className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-white border-2 border-emerald-600 animate-pulse" />
        </div>
        <span className="hidden sm:inline font-bold">Trip Support</span>
      </button>
    </div>
  );
}
