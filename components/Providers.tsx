'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import BottomTabBar from '@/components/layout/BottomTabBar';
import ToastContainer from '@/components/ui/Toast';
import { AuthProvider } from '@/context/AuthContext';
import { AvatarProvider } from '@/context/AvatarContext';
import { TryOnProvider } from '@/context/TryOnContext';
import { ToastProvider } from '@/context/ToastContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AvatarProvider>
        <TryOnProvider>
          <ToastProvider>
            <Navbar />
            <div className="flex-1 flex flex-col">{children}</div>
            <BottomTabBar />
            <ToastContainer />
          </ToastProvider>
        </TryOnProvider>
      </AvatarProvider>
    </AuthProvider>
  );
}
