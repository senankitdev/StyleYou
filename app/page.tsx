'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Globe, UserCheck, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import Footer from '@/components/layout/Footer';
import { HOW_IT_WORKS_STEPS, WHY_STYLEYOU, APP_NAME, APP_TAGLINE } from '@/lib/constants';

const stepIcons = [
  <UserCheck key="1" className="w-7 h-7" />,
  <Globe key="2" className="w-7 h-7" />,
  <Sparkles key="3" className="w-7 h-7" />,
  <ShieldCheck key="4" className="w-7 h-7" />,
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ─── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream via-off-white to-warm-beige">
        {/* Decorative circles */}
        <div className="absolute top-[-5rem] right-[-5rem] w-72 h-72 rounded-full bg-tan/10 blur-3xl" />
        <div className="absolute bottom-[-3rem] left-[-3rem] w-56 h-56 rounded-full bg-tan/15 blur-2xl" />

        <div className="relative max-w-6xl mx-auto px-4 md:px-6 pt-12 pb-16 md:pt-24 md:pb-28">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* Text */}
            <motion.div
              className="flex-1 text-center md:text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-tan/15 text-tan text-xs font-semibold tracking-wide uppercase mb-6">
                AI Virtual Try-On
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif text-dark-brown leading-[1.1] mb-6">
                See It On You{' '}
                <span className="text-tan">Before</span>{' '}
                You Buy
              </h1>
              <p className="text-base md:text-lg text-medium-brown max-w-lg mx-auto md:mx-0 mb-8 leading-relaxed">
                {APP_TAGLINE} Create your personal 2D avatar, paste a dress link from any store, and
                instantly see how it looks on you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link href="/auth">
                  <Button size="lg">
                    Create Your Avatar
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button variant="secondary" size="lg">
                    How It Works
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Hero visual */}
            <motion.div
              className="flex-1 max-w-sm md:max-w-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-tan/20 rounded-3xl rotate-3 scale-105" />
                <div className="relative bg-white rounded-3xl p-6 shadow-card">
                  <div className="aspect-[3/4] rounded-2xl bg-warm-beige flex items-center justify-center overflow-hidden">
                    <img
                      src="/placeholder-body.svg"
                      alt="StyleYou avatar preview"
                      className="w-3/4 h-3/4 object-contain"
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-tan/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-tan" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-dark-brown">Perfect Fit</p>
                      <p className="text-xs text-medium-brown">Estimated size: M</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────── */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-semibold tracking-wide uppercase text-tan mb-3">
              Simple & Quick
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-dark-brown">
              How It Works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <motion.div
                key={step.step}
                className="relative bg-off-white rounded-2xl p-6 text-center group hover:bg-tan/5 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-tan/15 flex items-center justify-center mx-auto mb-4 group-hover:bg-tan/25 transition-colors text-tan">
                  {stepIcons[index]}
                </div>
                <div className="text-xs font-bold text-tan uppercase tracking-wide mb-2">
                  Step {step.step}
                </div>
                <h3 className="text-base font-semibold text-dark-brown mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-medium-brown leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why StyleYou ──────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-semibold tracking-wide uppercase text-tan mb-3">
              Why Choose Us
            </p>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-dark-brown">
              Why {APP_NAME}?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY_STYLEYOU.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-dark-brown mb-3 font-serif">
                  {benefit.title}
                </h3>
                <p className="text-sm text-medium-brown leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-dark-brown">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-4xl font-bold font-serif text-white mb-4">
              Ready to Try It On?
            </h2>
            <p className="text-warm-beige mb-8 max-w-md mx-auto">
              Create your avatar in minutes. No credit card required, no commitment.
            </p>
            <Link href="/auth">
              <Button
                size="lg"
                className="bg-tan text-white hover:bg-tan-light"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
