import { z } from 'zod';
import { MEASUREMENT_LIMITS, PHOTO_MAX_SIZE_BYTES, ACCEPTED_IMAGE_TYPES } from './constants';

// ─── Auth ──────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

// ─── Profile ───────────────────────────────────────────────────

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.coerce
    .number()
    .min(MEASUREMENT_LIMITS.age.min, `Must be at least ${MEASUREMENT_LIMITS.age.min}`)
    .max(MEASUREMENT_LIMITS.age.max, `Must be at most ${MEASUREMENT_LIMITS.age.max}`),
  gender: z.enum(['male', 'female', 'non-binary'], {
    errorMap: () => ({ message: 'Please select a gender' }),
  }),
  heightCm: z.coerce
    .number()
    .min(MEASUREMENT_LIMITS.heightCm.min, `Min ${MEASUREMENT_LIMITS.heightCm.min} cm`)
    .max(MEASUREMENT_LIMITS.heightCm.max, `Max ${MEASUREMENT_LIMITS.heightCm.max} cm`),
  weightKg: z.coerce
    .number()
    .min(MEASUREMENT_LIMITS.weightKg.min, `Min ${MEASUREMENT_LIMITS.weightKg.min} kg`)
    .max(MEASUREMENT_LIMITS.weightKg.max, `Max ${MEASUREMENT_LIMITS.weightKg.max} kg`),
  shoulderCm: z.coerce
    .number()
    .min(MEASUREMENT_LIMITS.shoulderCm.min, `Min ${MEASUREMENT_LIMITS.shoulderCm.min} cm`)
    .max(MEASUREMENT_LIMITS.shoulderCm.max, `Max ${MEASUREMENT_LIMITS.shoulderCm.max} cm`),
  chestCm: z.coerce
    .number()
    .min(MEASUREMENT_LIMITS.chestCm.min, `Min ${MEASUREMENT_LIMITS.chestCm.min} cm`)
    .max(MEASUREMENT_LIMITS.chestCm.max, `Max ${MEASUREMENT_LIMITS.chestCm.max} cm`),
  waistCm: z.coerce
    .number()
    .min(MEASUREMENT_LIMITS.waistCm.min, `Min ${MEASUREMENT_LIMITS.waistCm.min} cm`)
    .max(MEASUREMENT_LIMITS.waistCm.max, `Max ${MEASUREMENT_LIMITS.waistCm.max} cm`),
  hipCm: z.coerce
    .number()
    .min(MEASUREMENT_LIMITS.hipCm.min, `Min ${MEASUREMENT_LIMITS.hipCm.min} cm`)
    .max(MEASUREMENT_LIMITS.hipCm.max, `Max ${MEASUREMENT_LIMITS.hipCm.max} cm`),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to continue',
  }),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// ─── Photo Validation (client-side) ────────────────────────────

export function validatePhoto(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Please upload a JPG, PNG, or WebP image.';
  }
  if (file.size > PHOTO_MAX_SIZE_BYTES) {
    return 'Image must be under 5 MB.';
  }
  return null;
}

// ─── Dress Link ────────────────────────────────────────────────

export const dressLinkSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
});

export type DressLinkFormData = z.infer<typeof dressLinkSchema>;
