'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tan disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary: 'bg-dark-brown text-white hover:bg-medium-brown active:scale-[0.98]',
    secondary:
      'bg-white text-dark-brown border-2 border-warm-beige hover:border-tan hover:bg-off-white active:scale-[0.98]',
    ghost: 'bg-transparent text-medium-brown hover:bg-warm-beige/50 hover:text-dark-brown',
    danger: 'bg-error text-white hover:bg-error/90 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'text-sm px-4 py-2 gap-1.5',
    md: 'text-sm md:text-base px-6 py-3 gap-2',
    lg: 'text-base md:text-lg px-8 py-4 gap-2.5',
  };

  return (
    <button
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
