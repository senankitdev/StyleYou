import { z } from 'zod';
import { profileSchema, dressLinkSchema } from './validators';

// Avatar Create
export const avatarCreateSchema = z.object({
  profile: profileSchema,
});

export type AvatarCreateInput = z.infer<typeof avatarCreateSchema>;

// Dress Import
export const dressImportSchema = dressLinkSchema;

// TryOn Generate
export const tryOnGenerateSchema = z.object({
  avatarId: z.string().uuid(),
  dressImageUrl: z.string().url(),
});

export type TryOnGenerateInput = z.infer<typeof tryOnGenerateSchema>;
