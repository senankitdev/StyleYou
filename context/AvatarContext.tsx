'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Avatar, Profile } from '@/lib/types';

interface AvatarContextValue {
  avatar: Avatar | null;
  photoPreview: string | null;
  isCreating: boolean;
  setAvatar: (avatar: Avatar) => void;
  setPhotoPreview: (url: string | null) => void;
  setIsCreating: (v: boolean) => void;
  clearAvatar: () => void;
}

const AvatarContext = createContext<AvatarContextValue | null>(null);

const AVATAR_STORAGE_KEY = 'styleyou_avatar';

export function AvatarProvider({ children }: { children: React.ReactNode }) {
  const [avatar, setAvatarState] = useState<Avatar | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Restore from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AVATAR_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setAvatarState(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  const setAvatar = useCallback((av: Avatar) => {
    setAvatarState(av);
    localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(av));
  }, []);

  const clearAvatar = useCallback(() => {
    setAvatarState(null);
    setPhotoPreview(null);
    localStorage.removeItem(AVATAR_STORAGE_KEY);
  }, []);

  return (
    <AvatarContext.Provider
      value={{
        avatar,
        photoPreview,
        isCreating,
        setAvatar,
        setPhotoPreview,
        setIsCreating,
        clearAvatar,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatarContext(): AvatarContextValue {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error('useAvatarContext must be used within AvatarProvider');
  return ctx;
}
