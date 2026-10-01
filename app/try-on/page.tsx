'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Link2, Upload, Sparkles, AlertCircle, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import FileUpload from '@/components/ui/FileUpload';
import Stepper from '@/components/ui/Stepper';
import PageContainer from '@/components/layout/PageContainer';
import { useAvatarContext } from '@/context/AvatarContext';
import { useTryOnContext } from '@/context/TryOnContext';
import { useToast } from '@/context/ToastContext';
import { useRouteGuard } from '@/hooks/useRouteGuard';
import { importDress, uploadDress } from '@/lib/api';
import { dressLinkSchema, DressLinkFormData } from '@/lib/validators';
import { ONBOARDING_STEPS, SAMPLE_COSTUMES } from '@/lib/constants';
import { DressItem } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function TryOnPage() {
  const isAllowed = useRouteGuard();
  const router = useRouter();
  const { avatar } = useAvatarContext();
  const { selectedDress, setSelectedDress } = useTryOnContext();
  const { showToast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [showUploadFallback, setShowUploadFallback] = useState(false);
  const [dressPreview, setDressPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DressLinkFormData>({
    resolver: zodResolver(dressLinkSchema),
    defaultValues: { url: '' },
  });

  const handleImportDress = async (data: DressLinkFormData) => {
    setIsImporting(true);
    setImportError(null);
    setShowUploadFallback(false);
    try {
      const dress = await importDress(data.url);
      setSelectedDress(dress);
      showToast('Dress imported successfully!', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to import dress.';
      setImportError(msg);
      setShowUploadFallback(true);
      showToast(msg, 'error');
    } finally {
      setIsImporting(false);
    }
  };

  const handleUploadDress = useCallback(
    async (file: File) => {
      try {
        // Show local preview
        const reader = new FileReader();
        reader.onload = (e) => setDressPreview(e.target?.result as string);
        reader.readAsDataURL(file);

        const dress = await uploadDress(file);
        setSelectedDress(dress);
        setShowUploadFallback(false);
        setImportError(null);
        showToast('Dress uploaded!', 'success');
      } catch {
        showToast('Failed to upload dress.', 'error');
      }
    },
    [setSelectedDress, showToast]
  );

  const handleSelectSample = (sample: DressItem) => {
    setSelectedDress(sample);
    setImportError(null);
    setShowUploadFallback(false);
  };

  const handleTryOn = () => {
    if (!selectedDress) {
      showToast('Please select or import a dress first.', 'error');
      return;
    }
    router.push('/processing');
  };

  if (!isAllowed) return null;

  return (
    <PageContainer narrow>
      <Stepper steps={ONBOARDING_STEPS} currentPath="/try-on" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-dark-brown mb-2">
            Try On a Dress
          </h1>
          <p className="text-medium-brown">
            Paste a link from any online store, upload an image, or pick from our samples.
          </p>
        </div>

        {/* ─── Paste Link ─── */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-dark-brown mb-4 font-serif flex items-center gap-2">
            <Link2 className="w-5 h-5 text-tan" />
            Paste a Dress Link
          </h2>
          <form
            onSubmit={handleSubmit(handleImportDress)}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="flex-1">
              <Input
                label=""
                placeholder="https://store.com/dress-link"
                error={errors.url?.message}
                {...register('url')}
              />
            </div>
            <Button type="submit" isLoading={isImporting} className="sm:mt-0 self-start">
              Get Dress
            </Button>
          </form>

          {/* Import error & fallback */}
          {importError && (
            <div className="mt-4 p-4 rounded-xl bg-error/5 border border-error/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-error font-medium">{importError}</p>
                  {showUploadFallback && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-3"
                      onClick={() => setShowUploadFallback(true)}
                    >
                      <Upload className="w-4 h-4" />
                      Upload dress image instead
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {showUploadFallback && (
            <div className="mt-4">
              <FileUpload
                onFileSelect={handleUploadDress}
                preview={dressPreview}
                onClear={() => {
                  setDressPreview(null);
                  setSelectedDress(null);
                }}
              />
            </div>
          )}
        </Card>

        {/* ─── Selected Dress Preview ─── */}
        {selectedDress && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6 border-2 border-tan/30">
              <div className="flex items-center gap-2 mb-3">
                <Check className="w-5 h-5 text-success" />
                <h3 className="text-sm font-semibold text-dark-brown">Selected Dress</h3>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-20 h-24 rounded-lg bg-off-white overflow-hidden shrink-0">
                  <img
                    src={dressPreview || selectedDress.imageUrl}
                    alt={selectedDress.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-dark-brown">{selectedDress.name}</p>
                  <p className="text-xs text-medium-brown capitalize">
                    Source: {selectedDress.source}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ─── Sample Costumes ─── */}
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-dark-brown mb-4 font-serif">
            Sample Costumes
          </h2>
          <p className="text-xs text-medium-brown mb-4">
            Try our demo collection to see how the experience works.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SAMPLE_COSTUMES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={cn(
                  'relative rounded-xl overflow-hidden border-2 transition-all duration-200 group cursor-pointer',
                  selectedDress?.id === sample.id
                    ? 'border-tan ring-2 ring-tan/20'
                    : 'border-warm-beige hover:border-tan-light'
                )}
              >
                <div className="aspect-[3/4] bg-warm-beige flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-warm-beige to-tan-light/50 flex items-center justify-center">
                    <span className="text-3xl">👗</span>
                  </div>
                </div>
                <div className="p-2 bg-white">
                  <p className="text-xs font-medium text-dark-brown truncate">
                    {sample.name}
                  </p>
                </div>
                {selectedDress?.id === sample.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-tan text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* ─── CTA ─── */}
        <Button
          size="lg"
          fullWidth
          onClick={handleTryOn}
          disabled={!selectedDress}
        >
          <Sparkles className="w-5 h-5" />
          See It On Me
        </Button>
      </motion.div>
    </PageContainer>
  );
}
