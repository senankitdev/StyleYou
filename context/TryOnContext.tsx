'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { DressItem, TryOnResult } from '@/lib/types';

interface TryOnContextValue {
  selectedDress: DressItem | null;
  currentResult: TryOnResult | null;
  setSelectedDress: (dress: DressItem | null) => void;
  setCurrentResult: (result: TryOnResult | null) => void;
  clearSession: () => void;
}

const TryOnContext = createContext<TryOnContextValue | null>(null);

export function TryOnProvider({ children }: { children: React.ReactNode }) {
  const [selectedDress, setSelectedDress] = useState<DressItem | null>(null);
  const [currentResult, setCurrentResult] = useState<TryOnResult | null>(null);

  const clearSession = useCallback(() => {
    setSelectedDress(null);
    setCurrentResult(null);
  }, []);

  return (
    <TryOnContext.Provider
      value={{
        selectedDress,
        currentResult,
        setSelectedDress,
        setCurrentResult,
        clearSession,
      }}
    >
      {children}
    </TryOnContext.Provider>
  );
}

export function useTryOnContext(): TryOnContextValue {
  const ctx = useContext(TryOnContext);
  if (!ctx) throw new Error('useTryOnContext must be used within TryOnProvider');
  return ctx;
}
