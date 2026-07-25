import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { truncatePreview } from '../../src/utils/truncate';

describe('Property 18: Thread Preview Truncation', () => {
  it('returns full string if length <= 120', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 120 }),
        (content) => {
          expect(truncatePreview(content)).toBe(content);
        }
      ),
      { numRuns: 200 }
    );
  });

  it('truncates to first 120 chars + ellipsis if length > 120', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 121, maxLength: 500 }),
        (content) => {
          const result = truncatePreview(content);
          expect(result).toHaveLength(121); // 120 + '…'
          expect(result.endsWith('…')).toBe(true);
          expect(result.slice(0, 120)).toBe(content.slice(0, 120));
        }
      ),
      { numRuns: 200 }
    );
  });

  it('custom maxLength works correctly', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 300 }),
        fc.integer({ min: 1, max: 200 }),
        (content, maxLen) => {
          const result = truncatePreview(content, maxLen);
          if (content.length <= maxLen) {
            expect(result).toBe(content);
          } else {
            expect(result).toHaveLength(maxLen + 1); // maxLen + '…'
            expect(result.endsWith('…')).toBe(true);
          }
        }
      ),
      { numRuns: 200 }
    );
  });
});
