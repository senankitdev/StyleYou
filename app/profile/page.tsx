'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Camera, Info } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import FileUpload from '@/components/ui/FileUpload';
import Stepper from '@/components/ui/Stepper';
import PageContainer from '@/components/layout/PageContainer';
import { useAuth } from '@/context/AuthContext';
import { useAvatarContext } from '@/context/AvatarContext';
import { useToast } from '@/context/ToastContext';
import { useRouteGuard } from '@/hooks/useRouteGuard';
import { profileSchema, ProfileFormData } from '@/lib/validators';
import { createAvatar } from '@/lib/api';
import { ONBOARDING_STEPS } from '@/lib/constants';

export default function ProfilePage() {
  const isAllowed = useRouteGuard();
  const router = useRouter();
  const { user } = useAuth();
  const { setAvatar, setPhotoPreview, photoPreview } = useAvatarContext();
  const { showToast } = useToast();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      age: '' as unknown as number,
      gender: undefined as unknown as 'male' | 'female' | 'non-binary',
      heightCm: '' as unknown as number,
      weightKg: '' as unknown as number,
      shoulderCm: '' as unknown as number,
      chestCm: '' as unknown as number,
      waistCm: '' as unknown as number,
      hipCm: '' as unknown as number,
      consent: false,
    },
  });

  const consentChecked = watch('consent');

  const handlePhotoSelect = useCallback(
    (file: File) => {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [setPhotoPreview]
  );

  const handleClearPhoto = useCallback(() => {
    setPhotoFile(null);
    setPhotoPreview(null);
  }, [setPhotoPreview]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!photoFile) {
      showToast('Please upload a photo first.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const { consent, ...profileData } = data;
      const avatar = await createAvatar(profileData, photoFile);
      // Keep local photo preview since mock service doesn't upload
      avatar.photoUrl = photoPreview || '';
      setAvatar(avatar);
      showToast('Avatar created successfully!', 'success');
      router.push('/avatar');
    } catch {
      showToast('Failed to create avatar. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAllowed) return null;

  return (
    <PageContainer narrow>
      <Stepper steps={ONBOARDING_STEPS} currentPath="/profile" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-dark-brown mb-2">
            Create Your Model
          </h1>
          <p className="text-medium-brown">
            Upload a photo and enter your measurements to build your personal 2D avatar.
          </p>
        </div>

        <form onSubmit={handleSubmit((data) => onSubmit(data as unknown as ProfileFormData))} className="flex flex-col gap-6">
          {/* ─── Photo Upload ─── */}
          <Card>
            <h2 className="text-lg font-semibold text-dark-brown mb-1 font-serif flex items-center gap-2">
              <Camera className="w-5 h-5 text-tan" />
              Your Photo
            </h2>
            <div className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-tan/10">
              <Info className="w-4 h-4 text-tan shrink-0 mt-0.5" />
              <p className="text-xs text-medium-brown">
                Front-facing, good lighting, no sunglasses. This photo is used only to build your personal model.
              </p>
            </div>
            <FileUpload
              onFileSelect={handlePhotoSelect}
              preview={photoPreview}
              onClear={handleClearPhoto}
            />
          </Card>

          {/* ─── Basic Info ─── */}
          <Card>
            <h2 className="text-lg font-semibold text-dark-brown mb-4 font-serif">
              Basic Info
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Name"
                placeholder="Your name"
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Age"
                type="number"
                placeholder="25"
                helperText="13–100"
                error={errors.age?.message}
                {...register('age')}
              />
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-dark-brown mb-1.5 block">
                  Gender
                </label>
                <div className="flex gap-2">
                  {(['male', 'female', 'non-binary'] as const).map((g) => (
                    <label
                      key={g}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-warm-beige cursor-pointer transition-colors hover:border-tan-light has-[:checked]:border-tan has-[:checked]:bg-tan/5"
                    >
                      <input
                        type="radio"
                        value={g}
                        {...register('gender')}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium text-dark-brown capitalize">{g}</span>
                    </label>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-sm text-error mt-1" role="alert">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* ─── Body Measurements ─── */}
          <Card>
            <h2 className="text-lg font-semibold text-dark-brown mb-1 font-serif">
              Body Measurements
            </h2>
            <p className="text-xs text-medium-brown mb-4">
              All measurements in centimeters. Used for a visual approximation and estimated fit only.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Height (cm)"
                type="number"
                placeholder="170"
                helperText="100–250 cm"
                error={errors.heightCm?.message}
                {...register('heightCm')}
              />
              <Input
                label="Weight (kg)"
                type="number"
                placeholder="65"
                helperText="25–250 kg"
                error={errors.weightKg?.message}
                {...register('weightKg')}
              />
              <Input
                label="Shoulder (cm)"
                type="number"
                placeholder="42"
                helperText="20–70 cm"
                error={errors.shoulderCm?.message}
                {...register('shoulderCm')}
              />
              <Input
                label="Chest (cm)"
                type="number"
                placeholder="90"
                helperText="50–180 cm"
                error={errors.chestCm?.message}
                {...register('chestCm')}
              />
              <Input
                label="Waist (cm)"
                type="number"
                placeholder="75"
                helperText="40–160 cm"
                error={errors.waistCm?.message}
                {...register('waistCm')}
              />
              <Input
                label="Hip (cm)"
                type="number"
                placeholder="95"
                helperText="50–180 cm"
                error={errors.hipCm?.message}
                {...register('hipCm')}
              />
            </div>
          </Card>

          {/* ─── Consent ─── */}
          <Card>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('consent')}
                className="mt-1 w-5 h-5 rounded border-2 border-warm-beige text-tan focus:ring-tan accent-[#C4A882] cursor-pointer"
              />
              <div>
                <span className="text-sm font-medium text-dark-brown">
                  I agree that my photo is used only to build my personal model.
                </span>
                {errors.consent && (
                  <p className="text-sm text-error mt-1" role="alert">
                    {errors.consent.message}
                  </p>
                )}
              </div>
            </label>
          </Card>

          {/* ─── Submit ─── */}
          <Button
            type="submit"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            disabled={!consentChecked}
          >
            Generate My Avatar
          </Button>

          <p className="text-xs text-center text-medium-brown">
            Measurements are used for a visual approximation and estimated fit only.
          </p>
        </form>
      </motion.div>
    </PageContainer>
  );
}
