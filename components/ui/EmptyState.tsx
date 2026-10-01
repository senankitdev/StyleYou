'use client';

import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-warm-beige flex items-center justify-center mb-4">
        {icon || <Inbox className="w-8 h-8 text-medium-brown" />}
      </div>
      <h3 className="text-lg font-semibold text-dark-brown mb-2 font-serif">{title}</h3>
      <p className="text-sm text-medium-brown max-w-xs mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
