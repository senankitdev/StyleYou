'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shirt, Edit3, Trash2, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Stepper from '@/components/ui/Stepper';
import PageContainer from '@/components/layout/PageContainer';
import { useAvatarContext } from '@/context/AvatarContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useRouteGuard } from '@/hooks/useRouteGuard';
import { deleteMyData } from '@/lib/api';
import { ONBOARDING_STEPS } from '@/lib/constants';

export default function AvatarPage() {
  const isAllowed = useRouteGuard();
  const router = useRouter();
  const { avatar, photoPreview, clearAvatar } = useAvatarContext();
  const { showToast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMyData();
      clearAvatar();
      showToast('Your data has been deleted.', 'success');
      setShowDeleteModal(false);
      router.push('/profile');
    } catch {
      showToast('Failed to delete data. Try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isAllowed || !avatar) return null;

  const { profile } = avatar;

  return (
    <PageContainer narrow>
      <Stepper steps={ONBOARDING_STEPS} currentPath="/avatar" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-dark-brown mb-2">
            Your Avatar
          </h1>
          <p className="text-medium-brown">
            Your personal model is ready! Try on any dress to see how it looks.
          </p>
        </div>

        {/* ─── Avatar Display ─── */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="flex flex-col items-center">
            <div className="w-full aspect-[3/4] rounded-xl bg-off-white overflow-hidden mb-3 flex items-center justify-center">
              {photoPreview || avatar.photoUrl ? (
                <img
                  src={photoPreview || avatar.photoUrl}
                  alt="Your face model"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={avatar.faceUrl}
                  alt="Face model placeholder"
                  className="w-3/4 h-3/4 object-contain"
                />
              )}
            </div>
            <p className="text-sm font-medium text-dark-brown">Face Model</p>
          </Card>

          <Card className="flex flex-col items-center">
            <div className="w-full aspect-[3/4] rounded-xl bg-off-white overflow-hidden mb-3 flex items-center justify-center">
              <img
                src={avatar.bodyUrl}
                alt="Body model placeholder"
                className="w-3/4 h-3/4 object-contain"
              />
            </div>
            <p className="text-sm font-medium text-dark-brown">Body Model</p>
          </Card>
        </div>

        {/* ─── Measurement Summary ─── */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dark-brown font-serif">
              Your Measurements
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/profile')}
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Height', value: `${profile.heightCm} cm` },
              { label: 'Weight', value: `${profile.weightKg} kg` },
              { label: 'Shoulder', value: `${profile.shoulderCm} cm` },
              { label: 'Chest', value: `${profile.chestCm} cm` },
              { label: 'Waist', value: `${profile.waistCm} cm` },
              { label: 'Hip', value: `${profile.hipCm} cm` },
              { label: 'Age', value: `${profile.age}` },
              { label: 'Gender', value: profile.gender },
            ].map((item) => (
              <div key={item.label} className="bg-off-white rounded-lg p-3 text-center">
                <p className="text-xs text-medium-brown mb-0.5">{item.label}</p>
                <p className="text-sm font-semibold text-dark-brown capitalize">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* ─── Actions ─── */}
        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            fullWidth
            onClick={() => router.push('/try-on')}
          >
            <Shirt className="w-5 h-5" />
            Try a Dress
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-error hover:bg-error/10 hover:text-error"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="w-4 h-4" />
            Delete My Data
          </Button>
        </div>

        {/* ─── Delete Confirmation Modal ─── */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete My Data"
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-error/10 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-error" />
            </div>
            <p className="text-sm text-medium-brown">
              This will permanently delete your avatar, photo, and all measurements.
              This action cannot be undone.
            </p>
            <div className="flex gap-3 w-full">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                fullWidth
                isLoading={isDeleting}
                onClick={handleDelete}
              >
                Delete Everything
              </Button>
            </div>
          </div>
        </Modal>
      </motion.div>
    </PageContainer>
  );
}
