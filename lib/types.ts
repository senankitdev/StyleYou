// ─── User & Auth ───────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Profile & Avatar ──────────────────────────────────────────

export type Gender = 'male' | 'female' | 'non-binary';

export interface Profile {
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  shoulderCm: number;
  chestCm: number;
  waistCm: number;
  hipCm: number;
}

export interface Avatar {
  avatarId: string;
  faceUrl: string;
  bodyUrl: string;
  profile: Profile;
  photoUrl: string; // uploaded face photo preview (data URL or blob URL)
  createdAt: string;
}

// ─── Dress ─────────────────────────────────────────────────────

export type DressSource = 'link' | 'upload' | 'sample';

export interface DressItem {
  id: string;
  imageUrl: string;
  name: string;
  source: DressSource;
  originalUrl?: string;
}

// ─── Try-On Result ─────────────────────────────────────────────

export interface TryOnResult {
  resultId: string;
  resultUrl: string;
  estimatedSize: string; // "S", "M", "L", "XL", etc.
  fitNotes: string; // "Slightly loose around the waist"
  dressItem: DressItem;
  createdAt: string;
}

// ─── Processing Step ───────────────────────────────────────────

export type ProcessingStepStatus = 'pending' | 'active' | 'complete';

export interface ProcessingStep {
  label: string;
  status: ProcessingStepStatus;
}
