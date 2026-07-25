import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  validateThreadTitle,
  validateContextLabel,
  validateActionItemDescription,
} from '../../src/utils/validation';

describe('Property 12: Input Length Validation', () => {
  describe('Thread titles: accepted iff 1-100 chars', () => {
    it('accepts strings of length 1-100', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (title) => {
            expect(validateThreadTitle(title)).toBe(true);
          }
        ),
        { numRuns: 200 }
      );
    });

    it('rejects empty string', () => {
      expect(validateThreadTitle('')).toBe(false);
    });

    it('rejects strings longer than 100 chars', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 101, maxLength: 300 }),
          (title) => {
            expect(validateThreadTitle(title)).toBe(false);
          }
        ),
        { numRuns: 200 }
      );
    });
  });

  describe('Context labels: accepted iff 1-120 chars', () => {
    it('accepts strings of length 1-120', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 120 }),
          (label) => {
            expect(validateContextLabel(label)).toBe(true);
          }
        ),
        { numRuns: 200 }
      );
    });

    it('rejects empty string', () => {
      expect(validateContextLabel('')).toBe(false);
    });

    it('rejects strings longer than 120 chars', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 121, maxLength: 300 }),
          (label) => {
            expect(validateContextLabel(label)).toBe(false);
          }
        ),
        { numRuns: 200 }
      );
    });
  });

  describe('Action item descriptions: accepted iff 1-500 chars', () => {
    it('accepts strings of length 1-500', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 500 }),
          (desc) => {
            expect(validateActionItemDescription(desc)).toBe(true);
          }
        ),
        { numRuns: 200 }
      );
    });

    it('rejects empty string', () => {
      expect(validateActionItemDescription('')).toBe(false);
    });

    it('rejects strings longer than 500 chars', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 501, maxLength: 700 }),
          (desc) => {
            expect(validateActionItemDescription(desc)).toBe(false);
          }
        ),
        { numRuns: 200 }
      );
    });
  });
});
