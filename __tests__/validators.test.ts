import { describe, it, expect } from 'vitest';
import { profileSchema, dressLinkSchema } from '../lib/validators';

describe('validators', () => {
  describe('profileSchema', () => {
    it('should pass valid data', () => {
      const result = profileSchema.safeParse({
        name: 'Test',
        age: 25,
        gender: 'female',
        heightCm: 165,
        weightKg: 60,
        shoulderCm: 40,
        chestCm: 90,
        waistCm: 70,
        hipCm: 95,
        consent: true,
      });
      expect(result.success).toBe(true);
    });

    it('should fail if consent is false', () => {
      const result = profileSchema.safeParse({
        name: 'Test',
        age: 25,
        gender: 'female',
        heightCm: 165,
        weightKg: 60,
        shoulderCm: 40,
        chestCm: 90,
        waistCm: 70,
        hipCm: 95,
        consent: false,
      });
      expect(result.success).toBe(false);
    });

    it('should fail if out of bounds', () => {
      const result = profileSchema.safeParse({
        name: 'Test',
        age: 5, // < 13
        gender: 'female',
        heightCm: 300, // > 250
        weightKg: 60,
        shoulderCm: 40,
        chestCm: 90,
        waistCm: 70,
        hipCm: 95,
        consent: true,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('dressLinkSchema', () => {
    it('should pass valid url', () => {
      const result = dressLinkSchema.safeParse({ url: 'https://example.com/product' });
      expect(result.success).toBe(true);
    });
    
    it('should fail invalid url', () => {
      const result = dressLinkSchema.safeParse({ url: 'not-a-url' });
      expect(result.success).toBe(false);
    });
  });
});
