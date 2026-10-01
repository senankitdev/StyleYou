'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAvatarContext } from '@/context/AvatarContext';

/**
 * Mock route guard. Redirects unauthenticated or incomplete users.
 * Returns true if the current route is accessible.
 */
export function useRouteGuard(): boolean {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { avatar } = useAvatarContext();

  useEffect(() => {
    if (authLoading) return; // wait for auth to initialize

    // Public routes — no guard needed
    const publicRoutes = ['/', '/auth'];
    if (publicRoutes.includes(pathname)) {
      // If already authenticated and on /auth, redirect to avatar or profile
      if (pathname === '/auth' && isAuthenticated) {
        router.replace(avatar ? '/avatar' : '/profile');
      }
      return;
    }

    // All other routes require auth
    if (!isAuthenticated) {
      router.replace('/auth');
      return;
    }

    // Routes that require an avatar
    const avatarRequiredRoutes = ['/avatar', '/try-on', '/processing'];
    if (avatarRequiredRoutes.some((r) => pathname.startsWith(r)) && !avatar) {
      router.replace('/profile');
      return;
    }
  }, [pathname, isAuthenticated, authLoading, avatar, router]);

  // Return whether the page should render
  if (authLoading) return false;
  const publicRoutes = ['/', '/auth'];
  if (publicRoutes.includes(pathname)) return true;
  if (!isAuthenticated) return false;
  const avatarRequiredRoutes = ['/avatar', '/try-on', '/processing'];
  if (avatarRequiredRoutes.some((r) => pathname.startsWith(r)) && !avatar) return false;
  return true;
}
