'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepperProps {
  steps: readonly { label: string; path: string }[];
  currentPath: string;
}

export default function Stepper({ steps, currentPath }: StepperProps) {
  const currentIndex = steps.findIndex((s) => currentPath.startsWith(s.path));

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isComplete = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <React.Fragment key={step.path}>
              <div className="flex flex-col items-center gap-2">
                {/* Circle */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                    isComplete && 'bg-tan text-white',
                    isActive && 'bg-dark-brown text-white ring-4 ring-tan/20',
                    !isComplete && !isActive && 'bg-warm-beige text-medium-brown'
                  )}
                >
                  {isComplete ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                {/* Label */}
                <span
                  className={cn(
                    'text-xs text-center hidden sm:block transition-colors',
                    isActive ? 'text-dark-brown font-semibold' : 'text-medium-brown'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mt-[-1rem] sm:mt-0">
                  <div
                    className={cn(
                      'h-full rounded-full transition-colors duration-300',
                      index < currentIndex ? 'bg-tan' : 'bg-warm-beige'
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
