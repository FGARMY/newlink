'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Car, Zap, Tag } from 'lucide-react';

export function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Analytics & Overview',
      href: '/admin',
      icon: BarChart3,
      isActive: pathname === '/admin',
    },
    {
      label: 'Fleet Management',
      href: '/admin/vehicles',
      icon: Car,
      isActive: pathname.startsWith('/admin/vehicles'),
    },
    {
      label: 'Dynamic Pricing & Promos',
      href: '/admin/pricing',
      icon: Zap,
      isActive: pathname.startsWith('/admin/pricing'),
    },
    {
      label: 'Disputes & Claims',
      href: '/admin/disputes',
      icon: Tag,
      isActive: pathname.startsWith('/admin/disputes'),
    },
  ];

  return (
    <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-8 overflow-x-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              item.isActive
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
