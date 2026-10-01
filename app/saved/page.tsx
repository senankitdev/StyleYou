'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, Trash2, Shirt } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import PageContainer from '@/components/layout/PageContainer';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useRouteGuard } from '@/hooks/useRouteGuard';
import { getSavedLooks, deleteSavedLook } from '@/lib/api';
import { TryOnResult } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function SavedPage() {
  const isAllowed = useRouteGuard();
  const router = useRouter();
  const { showToast } = useToast();
  const [looks, setLooks] = useState<TryOnResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSavedLooks();
        setLooks(data);
      } catch {
        showToast('Failed to load saved looks.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [showToast]);

  const handleDelete = async (resultId: string) => {
    try {
      await deleteSavedLook(resultId);
      setLooks((prev) => prev.filter((l) => l.resultId !== resultId));
      showToast('Look removed.', 'success');
    } catch {
      showToast('Failed to delete.', 'error');
    }
  };

  if (!isAllowed) return null;

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-dark-brown mb-2">
            Saved Looks
          </h1>
          <p className="text-medium-brown">
            Your collection of virtual try-on results.
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <Skeleton className="w-full aspect-[3/4] mb-3" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-3 w-1/3" />
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && looks.length === 0 && (
          <EmptyState
            icon={<Heart className="w-8 h-8 text-medium-brown" />}
            title="No saved looks yet"
            description="Try on some dresses and save your favorites to see them here."
            actionLabel="Try On a Dress"
            onAction={() => router.push('/try-on')}
          />
        )}

        {/* Grid of saved looks */}
        {!isLoading && looks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {looks.map((look, index) => (
              <motion.div
                key={look.resultId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card hover className="group">
                  {/* Preview */}
                  <div className="aspect-[3/4] rounded-lg bg-warm-beige overflow-hidden mb-3 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-br from-warm-beige via-tan-light/30 to-cream flex items-center justify-center">
                      <img
                        src="/placeholder-body.svg"
                        alt={`Try-on with ${look.dressItem.name}`}
                        className="w-1/2 h-auto object-contain opacity-70"
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-dark-brown">
                        {look.dressItem.name}
                      </h3>
                      <p className="text-xs text-medium-brown mt-0.5">
                        Size: {look.estimatedSize} · {formatDate(look.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(look.resultId)}
                      className="p-2 rounded-lg hover:bg-error/10 transition-colors text-medium-brown hover:text-error opacity-0 group-hover:opacity-100 cursor-pointer"
                      aria-label={`Delete ${look.dressItem.name} look`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </PageContainer>
  );
}
