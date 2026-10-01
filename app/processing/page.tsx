'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import LoadingSteps from '@/components/ui/LoadingSteps';
import PageContainer from '@/components/layout/PageContainer';
import { useAvatarContext } from '@/context/AvatarContext';
import { useTryOnContext } from '@/context/TryOnContext';
import { useToast } from '@/context/ToastContext';
import { useRouteGuard } from '@/hooks/useRouteGuard';
import { generateTryOn } from '@/lib/api';
import { PROCESSING_STEP_LABELS } from '@/lib/constants';
import { ProcessingStepStatus } from '@/lib/types';

export default function ProcessingPage() {
  const isAllowed = useRouteGuard();
  const router = useRouter();
  const { avatar } = useAvatarContext();
  const { selectedDress, setCurrentResult } = useTryOnContext();
  const { showToast } = useToast();
  const hasStarted = useRef(false);

  const [steps, setSteps] = useState(
    PROCESSING_STEP_LABELS.map((label) => ({
      label,
      status: 'pending' as ProcessingStepStatus,
    }))
  );

  useEffect(() => {
    if (hasStarted.current) return;
    if (!avatar || !selectedDress) {
      router.replace('/try-on');
      return;
    }
    hasStarted.current = true;

    // Animate through steps sequentially
    const advanceStep = async (index: number) => {
      // Mark current step as active
      setSteps((prev) =>
        prev.map((s, i) => ({
          ...s,
          status: i === index ? 'active' : i < index ? 'complete' : 'pending',
        }))
      );

      // Wait for step duration
      await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

      // Mark as complete
      setSteps((prev) =>
        prev.map((s, i) => ({
          ...s,
          status: i <= index ? 'complete' : s.status,
        }))
      );
    };

    const run = async () => {
      try {
        // Animate steps
        for (let i = 0; i < PROCESSING_STEP_LABELS.length; i++) {
          await advanceStep(i);
        }

        // Generate result
        const result = await generateTryOn(avatar.avatarId, selectedDress.imageUrl);
        result.dressItem = selectedDress;
        setCurrentResult(result);

        // Small delay before navigating to let the user see all steps complete
        await new Promise((r) => setTimeout(r, 600));
        router.push(`/result/${result.resultId}`);
      } catch {
        showToast('Something went wrong. Please try again.', 'error');
        router.push('/try-on');
      }
    };

    run();
  }, [avatar, selectedDress, router, setCurrentResult, showToast]);

  if (!isAllowed) return null;

  return (
    <PageContainer narrow className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        className="w-full text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <motion.div
            className="w-20 h-20 rounded-full bg-tan/15 flex items-center justify-center mx-auto mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-3xl">✨</span>
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-dark-brown mb-2">
            Creating Your Look
          </h1>
          <p className="text-medium-brown">
            Our AI is fitting the dress to your model. This takes just a moment...
          </p>
        </div>

        <LoadingSteps steps={steps} />
      </motion.div>
    </PageContainer>
  );
}
