import React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}

export default function PageContainer({
  children,
  className,
  narrow = false,
}: PageContainerProps) {
  return (
    <main
      className={cn(
        'flex-1 w-full mx-auto px-4 md:px-6 py-6 md:py-10 pb-24 md:pb-10',
        narrow ? 'max-w-2xl' : 'max-w-6xl',
        className
      )}
    >
      {children}
    </main>
  );
}
