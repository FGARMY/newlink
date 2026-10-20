import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';

export const metadata: Metadata = {
  title: 'Newlink — Premium Self-Drive Car Rentals in Pune & Nashik',
  description:
    'Rent verified cars across Pune and Nashik with zero hidden charges, transparent pricing, and instant booking confirmation.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#FAFAF8] text-slate-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
