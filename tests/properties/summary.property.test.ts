import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { computeSummary } from '../../src/utils/filters';
import type { ReturnField, FieldStatus } from '../../src/types';

const returnFieldGen: fc.Arbitrary<ReturnField> = fc.record({
  id: fc.uuid(),
  section: fc.constantFrom('income' as const, 'deductions' as const, 'credits' as const, 'tax_computation' as const),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  value: fc.integer({ min: 0, max: 100000 }),
  status: fc.constantFrom('traced' as const, 'partial' as const, 'manual_entry' as const),
  isReviewed: fc.boolean(),
  reviewedBy: fc.option(fc.constant('Sarah Chen'), { nil: undefined }),
  reviewedAt: fc.option(fc.constant('2025-06-15T14:30:00Z'), { nil: undefined }),
  traceabilityChain: fc.constant(undefined),
});

describe('Property 11: Summary Bar Computation', () => {
  it('status counts sum to total', () => {
    fc.assert(
      fc.property(fc.array(returnFieldGen, { minLength: 0, maxLength: 30 }), (fields) => {
        const summary = computeSummary(fields);
        expect(summary.traced + summary.partial + summary.manual).toBe(summary.total);
      }),
      { numRuns: 200 }
    );
  });

  it('traced percentage = round((traced / total) × 100)', () => {
    fc.assert(
      fc.property(fc.array(returnFieldGen, { minLength: 1, maxLength: 30 }), (fields) => {
        const summary = computeSummary(fields);
        const expected = Math.round((summary.traced / summary.total) * 100);
        expect(summary.tracedPercent).toBe(expected);
      }),
      { numRuns: 200 }
    );
  });

  it('reviewed count matches fields with isReviewed=true', () => {
    fc.assert(
      fc.property(fc.array(returnFieldGen, { minLength: 0, maxLength: 30 }), (fields) => {
        const summary = computeSummary(fields);
        const expectedReviewed = fields.filter((f) => f.isReviewed).length;
        expect(summary.reviewed).toBe(expectedReviewed);
      }),
      { numRuns: 200 }
    );
  });

  it('empty fields array produces zero summary', () => {
    const summary = computeSummary([]);
    expect(summary.total).toBe(0);
    expect(summary.traced).toBe(0);
    expect(summary.partial).toBe(0);
    expect(summary.manual).toBe(0);
    expect(summary.reviewed).toBe(0);
    expect(summary.tracedPercent).toBe(0);
  });
});
