import { DressItem } from './types';

// ─── App ───────────────────────────────────────────────────────

export const APP_NAME = 'StyleYou';
export const APP_TAGLINE = 'See it on you before you buy.';

// ─── How It Works Steps ────────────────────────────────────────

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Create Your Model',
    description: 'Upload a front-facing photo and enter your body measurements.',
  },
  {
    step: 2,
    title: 'Paste a Dress Link',
    description: 'Copy the link of any dress from any online store.',
  },
  {
    step: 3,
    title: 'See It On You',
    description: 'Our AI fits the dress onto your personal 2D model.',
  },
  {
    step: 4,
    title: 'Save & Compare',
    description: 'Save your looks, compare outfits, and decide before you buy.',
  },
] as const;

// ─── Why StyleYou Benefits ─────────────────────────────────────

export const WHY_STYLEYOU = [
  {
    title: 'Works With Any Store',
    description: 'Paste a dress link from any online fashion retailer.',
  },
  {
    title: 'Build Your Model Once',
    description: 'Create your avatar once and try on unlimited outfits.',
  },
  {
    title: 'Decide Before Paying',
    description: 'See how clothes look on you before making a purchase.',
  },
] as const;

// ─── Onboarding Stepper ────────────────────────────────────────

export const ONBOARDING_STEPS = [
  { label: 'Photo & Measurements', path: '/profile' },
  { label: 'Your Avatar', path: '/avatar' },
  { label: 'Try On', path: '/try-on' },
  { label: 'Result', path: '/result' },
] as const;

// ─── Processing Steps ──────────────────────────────────────────

export const PROCESSING_STEP_LABELS = [
  'Reading dress',
  'Cleaning image',
  'Fitting to your model',
  'Creating your look',
] as const;

// ─── Sample Costumes ───────────────────────────────────────────

export const SAMPLE_COSTUMES: DressItem[] = [
  { id: 'sample-1', imageUrl: '/samples/dress-1.jpg', name: 'Floral Maxi Dress', source: 'sample' },
  { id: 'sample-2', imageUrl: '/samples/dress-2.jpg', name: 'Casual Linen Shirt', source: 'sample' },
  { id: 'sample-3', imageUrl: '/samples/dress-3.jpg', name: 'Elegant Evening Gown', source: 'sample' },
  { id: 'sample-4', imageUrl: '/samples/dress-4.jpg', name: 'Denim Jacket', source: 'sample' },
  { id: 'sample-5', imageUrl: '/samples/dress-5.jpg', name: 'Summer Wrap Dress', source: 'sample' },
  { id: 'sample-6', imageUrl: '/samples/dress-6.jpg', name: 'Classic Blazer', source: 'sample' },
  { id: 'sample-7', imageUrl: '/samples/dress-7.jpg', name: 'Bohemian Skirt', source: 'sample' },
  { id: 'sample-8', imageUrl: '/samples/dress-8.jpg', name: 'Knit Sweater', source: 'sample' },
];

// ─── Validation Limits ─────────────────────────────────────────

export const PHOTO_MAX_SIZE_MB = 5;
export const PHOTO_MAX_SIZE_BYTES = PHOTO_MAX_SIZE_MB * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const MEASUREMENT_LIMITS = {
  age: { min: 13, max: 100 },
  heightCm: { min: 100, max: 250 },
  weightKg: { min: 25, max: 250 },
  shoulderCm: { min: 20, max: 70 },
  chestCm: { min: 50, max: 180 },
  waistCm: { min: 40, max: 160 },
  hipCm: { min: 50, max: 180 },
} as const;

// ─── Navigation ────────────────────────────────────────────────

export const NAV_ITEMS = [
  { label: 'Home', href: '/', icon: 'Home' as const },
  { label: 'Avatar', href: '/avatar', icon: 'User' as const },
  { label: 'Try-On', href: '/try-on', icon: 'Shirt' as const },
  { label: 'Saved', href: '/saved', icon: 'Heart' as const },
] as const;
