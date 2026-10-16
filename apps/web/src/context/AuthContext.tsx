'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CustomerProfile } from '@newlink/contracts';

interface AuthContextType {
  customer: CustomerProfile | null;
  isLoading: boolean;
  login: (customer: CustomerProfile, token: string) => void;
  logout: () => void;
  updateCustomer: (updates: Partial<CustomerProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('newlink_customer');
      if (stored) {
        setCustomer(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (cust: CustomerProfile, token: string) => {
    setCustomer(cust);
    localStorage.setItem('newlink_customer', JSON.stringify(cust));
    localStorage.setItem('newlink_token', token);
  };

  const logout = () => {
    setCustomer(null);
    localStorage.removeItem('newlink_customer');
    localStorage.removeItem('newlink_token');
  };

  const updateCustomer = (updates: Partial<CustomerProfile>) => {
    if (!customer) return;
    const updated = { ...customer, ...updates };
    setCustomer(updated);
    localStorage.setItem('newlink_customer', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        isLoading,
        login,
        logout,
        updateCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
