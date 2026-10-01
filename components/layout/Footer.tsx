import React from 'react';
import { APP_NAME } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-dark-brown text-warm-beige py-10 px-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-lg font-serif font-bold text-white">{APP_NAME}</p>
          <p className="text-sm text-light-brown mt-1">See it on you before you buy.</p>
        </div>
        <div className="text-center md:text-right">
          <p className="text-xs text-light-brown leading-relaxed max-w-md">
            Your privacy matters. Photos are used only to generate your personal model and are never
            shared with third parties. You can delete your data at any time from your avatar page.
          </p>
          <p className="text-xs text-light-brown/60 mt-3">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
