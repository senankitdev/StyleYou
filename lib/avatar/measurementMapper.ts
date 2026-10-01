import { Profile, Gender } from '../types';

export interface BodyParameters {
  shoulderRatio: number;
  chestRatio: number;
  waistRatio: number;
  hipRatio: number;
  heightRatio: number;
}

// Reference medians (cm)
const REFERENCES = {
  male: {
    height: 175,
    shoulder: 45,
    chest: 100,
    waist: 85,
    hip: 98,
  },
  female: {
    height: 163,
    shoulder: 38,
    chest: 90,
    waist: 72,
    hip: 100,
  },
  'non-binary': {
    height: 169,
    shoulder: 41.5,
    chest: 95,
    waist: 78.5,
    hip: 99,
  },
};

/**
 * Clamp a number between min and max.
 */
function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

/**
 * Maps raw measurements to normalized body parameters (ratios against reference values).
 * Clamped to safe limits so the avatar never breaks (e.g. 0.8 to 1.3).
 */
export function mapMeasurementsToParameters(profile: Profile): BodyParameters {
  const ref = REFERENCES[profile.gender] || REFERENCES['non-binary'];

  return {
    heightRatio: clamp(profile.heightCm / ref.height, 0.85, 1.2),
    shoulderRatio: clamp(profile.shoulderCm / ref.shoulder, 0.8, 1.3),
    chestRatio: clamp(profile.chestCm / ref.chest, 0.8, 1.3),
    waistRatio: clamp(profile.waistCm / ref.waist, 0.8, 1.3),
    hipRatio: clamp(profile.hipCm / ref.hip, 0.8, 1.3),
  };
}
