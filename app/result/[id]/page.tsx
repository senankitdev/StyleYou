'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, Shirt, Download, Share2, Info, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Stepper from '@/components/ui/Stepper';
import PageContainer from '@/components/layout/PageContainer';
import { useAuth } from '@/context/AuthContext';
import { useTryOnContext } from '@/context/TryOnContext';
import { useToast } from '@/context/ToastContext';
import { useRouteGuard } from '@/hooks/useRouteGuard';
import { saveLook } from '@/lib/api';
import { ONBOARDING_STEPS } from '@/lib/constants';

export default function ResultPage() {
  const isAllowed = useRouteGuard();
  const router = useRouter();
  const { currentResult, clearSession } = useTryOnContext();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    if (!currentResult) return;
    setIsSaving(true);
    try {
      await saveLook(currentResult);
      setIsSaved(true);
      showToast('Look saved!', 'success');
    } catch {
      showToast('Failed to save. Try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTryAnother = () => {
    clearSession();
    router.push('/try-on');
  };

  const handleDownload = () => {
    // Mock: in real app, download the result image
    showToast('Download started! (Mock)', 'info');
  };

  const handleShare = () => {
    // Mock: in real app, open share sheet
    if (navigator.share) {
      navigator.share({
        title: 'My StyleYou Look',
        text: 'Check out how this dress looks on me!',
        url: window.location.href,
      }).catch(() => {
        // User cancelled or share not supported
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  if (!isAllowed) return null;

  if (!currentResult) {
    return (
      <PageContainer narrow className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-medium-brown mb-4">No result to display.</p>
          <Button onClick={() => router.push('/try-on')}>
            Try On a Dress
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer narrow>
      <Stepper steps={ONBOARDING_STEPS} currentPath="/result" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-dark-brown mb-2">
            Your Look
          </h1>
          <p className="text-medium-brown">
            Here&apos;s how the dress looks on your model!
          </p>
        </div>

        {/* ─── Result Image ─── */}
        <Card className="mb-6">
          <div className="aspect-[3/4] max-w-sm mx-auto rounded-xl bg-warm-beige overflow-hidden flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-warm-beige via-tan-light/30 to-cream flex flex-col items-center justify-center gap-4">
              <img
                src="/placeholder-body.svg"
                alt="Try-on result"
                className="w-1/2 h-auto object-contain opacity-80"
              />
              <p className="text-xs text-medium-brown px-4 text-center">
                AI-generated try-on result will appear here
              </p>
            </div>
          </div>
        </Card>

        {/* ─── Estimated Fit ─── */}
        <Card className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-tan/15 flex items-center justify-center">
              <span className="text-lg font-bold text-tan">{currentResult.estimatedSize}</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-dark-brown">Estimated Fit</h3>
              <p className="text-xs text-medium-brown">Suggested size: {currentResult.estimatedSize}</p>
            </div>
          </div>
          <p className="text-sm text-medium-brown mb-3">{currentResult.fitNotes}</p>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-tan/10">
            <Info className="w-4 h-4 text-tan shrink-0 mt-0.5" />
            <p className="text-xs text-medium-brown">
              This is an estimate based on your measurements, not an exact fit. Always check the
              store&apos;s size chart before purchasing.
            </p>
          </div>
        </Card>

        {/* ─── Actions ─── */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button
            onClick={handleSave}
            isLoading={isSaving}
            disabled={isSaved}
            fullWidth
          >
            <Save className="w-4 h-4" />
            {isSaved ? 'Saved!' : 'Save Look'}
          </Button>
          <Button
            variant="secondary"
            onClick={handleTryAnother}
            fullWidth
          >
            <Shirt className="w-4 h-4" />
            Try Another
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button variant="ghost" onClick={handleDownload} fullWidth>
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button variant="ghost" onClick={handleShare} fullWidth>
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>

        {/* ─── View Saved Looks ─── */}
        {isSaved && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              variant="secondary"
              fullWidth
              onClick={() => router.push('/saved')}
            >
              View Saved Looks
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </PageContainer>
  );
}
