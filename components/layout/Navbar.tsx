'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, APP_NAME } from '@/lib/constants';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();

  // Don't show on landing or processing pages
  if (pathname === '/' || pathname === '/processing') {
    return null;
  }

  return (
    <header className="hidden md:block sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-warm-beige">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold font-serif text-dark-brown">
            {APP_NAME}
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-warm-beige text-dark-brown'
                    : 'text-medium-brown hover:text-dark-brown hover:bg-off-white'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User area */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-medium-brown">
                {user?.name}
              </span>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-warm-beige/50 transition-colors text-medium-brown cursor-pointer"
                aria-label="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="px-4 py-2 bg-dark-brown text-white text-sm font-medium rounded-lg hover:bg-medium-brown transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
