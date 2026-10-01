import { describe, it, expect } from 'vitest';
import { mapMeasurementsToParameters } from '../lib/avatar/measurementMapper';
import { Profile } from '../lib/types';

describe('measurementMapper', () => {
  const baseProfile: Profile = {
    name: 'Test',
    age: 25,
    gender: 'female',
    heightCm: 163,
    weightKg: 60,
    shoulderCm: 38,
    chestCm: 90,
    waistCm: 72,
    hipCm: 100,
  };

  it('should map perfect median measurements to 1.0 ratios', () => {
    const params = mapMeasurementsToParameters(baseProfile);
    expect(params.heightRatio).toBe(1.0);
    expect(params.shoulderRatio).toBe(1.0);
    expect(params.chestRatio).toBe(1.0);
    expect(params.waistRatio).toBe(1.0);
    expect(params.hipRatio).toBe(1.0);
  });

  it('should clamp extreme large values', () => {
    const extremeProfile = { ...baseProfile, heightCm: 250, chestCm: 180 };
    const params = mapMeasurementsToParameters(extremeProfile);
    expect(params.heightRatio).toBe(1.2);
    expect(params.chestRatio).toBe(1.3);
  });

  it('should clamp extreme small values', () => {
    const extremeProfile = { ...baseProfile, heightCm: 100, waistCm: 40 };
    const params = mapMeasurementsToParameters(extremeProfile);
    expect(params.heightRatio).toBe(0.85);
    expect(params.waistRatio).toBe(0.8);
  });
});
