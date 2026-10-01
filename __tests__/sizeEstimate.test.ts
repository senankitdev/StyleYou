import { describe, it, expect } from 'vitest';
import { estimateSize } from '../lib/avatar/sizeEstimate';
import { Profile } from '../lib/types';

describe('sizeEstimate', () => {
  const getProfile = (chestCm: number, waistCm: number, hipCm: number): Profile => ({
    name: 'Test',
    age: 25,
    gender: 'female',
    heightCm: 163,
    weightKg: 60,
    shoulderCm: 38,
    chestCm,
    waistCm,
    hipCm,
  });

  it('should estimate XS', () => {
    expect(estimateSize(getProfile(80, 60, 84))).toBe('XS');
  });

  it('should estimate M', () => {
    expect(estimateSize(getProfile(92, 72, 96))).toBe('M');
  });

  it('should estimate XXL', () => {
    expect(estimateSize(getProfile(120, 100, 120))).toBe('XXL');
  });
});
