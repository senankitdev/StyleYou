'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProcessingStepStatus } from '@/lib/types';

interface LoadingStep {
  label: string;
  status: ProcessingStepStatus;
}

interface LoadingStepsProps {
  steps: LoadingStep[];
}

export default function LoadingSteps({ steps }: LoadingStepsProps) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
      {steps.map((step, index) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.15, duration: 0.3 }}
          className="flex items-center gap-4"
        >
          {/* Icon */}
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500',
              step.status === 'complete' && 'bg-success text-white',
              step.status === 'active' && 'bg-tan text-white',
              step.status === 'pending' && 'bg-warm-beige text-medium-brown'
            )}
          >
            {step.status === 'complete' ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Check className="w-5 h-5" />
              </motion.div>
            ) : step.status === 'active' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="text-sm font-medium">{index + 1}</span>
            )}
          </div>
          {/* Label */}
          <span
            className={cn(
              'text-sm transition-colors duration-300',
              step.status === 'complete' && 'text-success font-medium',
              step.status === 'active' && 'text-dark-brown font-semibold',
              step.status === 'pending' && 'text-medium-brown'
            )}
          >
            {step.label}
          </span>
        </motion.div>
      ))}

      {/* Progress bar */}
      <div className="mt-4 h-1.5 bg-warm-beige rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-tan rounded-full"
          initial={{ width: '0%' }}
          animate={{
            width: `${(steps.filter((s) => s.status === 'complete').length / steps.length) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}
