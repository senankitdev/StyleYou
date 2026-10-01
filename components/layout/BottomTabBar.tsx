'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Shirt, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/lib/constants';

const iconMap = {
  Home,
  User,
  Shirt,
  Heart,
} as const;

export default function BottomTabBar() {
  const pathname = usePathname();

  // Don't show on landing, auth, or processing pages
  if (pathname === '/' || pathname === '/auth' || pathname === '/processing') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-warm-beige">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors',
                isActive ? 'text-dark-brown' : 'text-medium-brown'
              )}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={cn(
                  'w-5 h-5 transition-all',
                  isActive && 'text-tan'
                )}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
