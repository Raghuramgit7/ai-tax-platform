import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { clampSplitRatio, clampZoom } from '../../src/utils/clamp';

describe('Property 1: Split Panel Ratio Clamping', () => {
  it('output is always between 0.2 and 0.8 inclusive for any input in [0,1]', () => {
    fc.assert(
      fc.property(fc.double({ min: 0, max: 1, noNaN: true }), (ratio) => {
        const result = clampSplitRatio(ratio);
        expect(result).toBeGreaterThanOrEqual(0.2);
        expect(result).toBeLessThanOrEqual(0.8);
      }),
      { numRuns: 200 }
    );
  });

  it('identity within bounds: input within [0.2, 0.8] returns unchanged', () => {
    fc.assert(
      fc.property(fc.double({ min: 0.2, max: 0.8, noNaN: true }), (ratio) => {
        expect(clampSplitRatio(ratio)).toBeCloseTo(ratio, 10);
      }),
      { numRuns: 200 }
    );
  });

  it('handles extreme values outside [0,1]', () => {
    fc.assert(
      fc.property(fc.double({ min: -100, max: 100, noNaN: true }), (ratio) => {
        const result = clampSplitRatio(ratio);
        expect(result).toBeGreaterThanOrEqual(0.2);
        expect(result).toBeLessThanOrEqual(0.8);
      }),
      { numRuns: 200 }
    );
  });
});

describe('Property 9: Zoom Level Clamping', () => {
  it('output is always between 50 and 200 inclusive', () => {
    fc.assert(
      fc.property(fc.integer({ min: -500, max: 500 }), (zoom) => {
        const result = clampZoom(zoom);
        expect(result).toBeGreaterThanOrEqual(50);
        expect(result).toBeLessThanOrEqual(200);
      }),
      { numRuns: 200 }
    );
  });

  it('identity within bounds: input within [50, 200] returns unchanged', () => {
    fc.assert(
      fc.property(fc.integer({ min: 50, max: 200 }), (zoom) => {
        expect(clampZoom(zoom)).toBe(zoom);
      }),
      { numRuns: 200 }
    );
  });
});
