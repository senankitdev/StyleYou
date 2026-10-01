'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { validatePhoto } from '@/lib/validators';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  preview?: string | null;
  onClear?: () => void;
  error?: string;
  accept?: string;
}

export default function FileUpload({
  onFileSelect,
  preview,
  onClear,
  error,
  accept = 'image/jpeg,image/png,image/webp',
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const displayError = error || localError;

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validatePhoto(file);
      if (validationError) {
        setLocalError(validationError);
        return;
      }
      setLocalError(null);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (preview) {
    return (
      <div className="relative">
        <div className="relative w-full aspect-square max-w-[240px] mx-auto rounded-xl overflow-hidden border-2 border-warm-beige">
          <img
            src={preview}
            alt="Uploaded photo preview"
            className="w-full h-full object-cover"
          />
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-card hover:bg-white transition-colors cursor-pointer"
            aria-label="Remove photo"
            type="button"
          >
            <X className="w-4 h-4 text-dark-brown" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        className={cn(
          'relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer',
          isDragging
            ? 'border-tan bg-tan/10 scale-[1.01]'
            : displayError
            ? 'border-error/50 bg-error/5'
            : 'border-warm-beige bg-off-white hover:border-tan hover:bg-tan/5'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload photo: drag and drop or click to browse"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
      >
        <div className="w-12 h-12 rounded-full bg-warm-beige flex items-center justify-center">
          {isDragging ? (
            <ImageIcon className="w-6 h-6 text-tan" />
          ) : (
            <Upload className="w-6 h-6 text-medium-brown" />
          )}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-dark-brown">
            {isDragging ? 'Drop your photo here' : 'Drag & drop or tap to upload'}
          </p>
          <p className="text-xs text-medium-brown mt-1">
            JPG, PNG, or WebP · Max 5 MB
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          aria-hidden="true"
        />
      </div>
      {displayError && (
        <p className="text-sm text-error mt-2" role="alert">
          {displayError}
        </p>
      )}
    </div>
  );
}
