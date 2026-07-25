import { create } from 'zustand';
import type { ReturnField, FieldStatus } from '@/types';
import type { FieldFilter } from '@/types/ui';
import { returnFields } from '@/mocks/data/returnFields';

interface ReviewStore {
  // Data
  fields: ReturnField[];

  // UI State
  selectedFieldId: string | null;
  expandedSections: string[];
  filter: FieldFilter;
  splitRatio: number;

  // Actions
  selectField: (fieldId: string | null) => void;
  toggleSection: (section: string) => void;
  setSplitRatio: (ratio: number) => void;
  setFilter: (filter: Partial<FieldFilter>) => void;
  markAsReviewed: (fieldId: string, reviewerName: string) => void;
}

export const useReviewStore = create<ReviewStore>((set) => ({
  fields: returnFields,
  selectedFieldId: null,
  expandedSections: [],
  filter: {
    statuses: [],
    lowConfidenceOnly: false,
    reviewedOnly: false,
  },
  splitRatio: 0.5,

  selectField: (fieldId) => set({ selectedFieldId: fieldId }),

  toggleSection: (section) =>
    set((state) => ({
      expandedSections: state.expandedSections.includes(section)
        ? state.expandedSections.filter((s) => s !== section)
        : [...state.expandedSections, section],
    })),

  setSplitRatio: (ratio) =>
    set({ splitRatio: clampRatio(ratio) }),

  setFilter: (filterUpdate) =>
    set((state) => ({
      filter: { ...state.filter, ...filterUpdate },
    })),

  markAsReviewed: (fieldId, reviewerName) =>
    set((state) => ({
      fields: state.fields.map((f) =>
        f.id === fieldId
          ? {
              ...f,
              isReviewed: true,
              reviewedBy: reviewerName,
              reviewedAt: new Date().toISOString(),
            }
          : f
      ),
    })),
}));

export function clampRatio(ratio: number): number {
  return Math.min(0.8, Math.max(0.2, ratio));
}

export function filterFields(
  fields: ReturnField[],
  filter: FieldFilter
): ReturnField[] {
  let result = fields;

  if (filter.statuses.length > 0) {
    result = result.filter((f) => filter.statuses.includes(f.status));
  }

  if (filter.lowConfidenceOnly) {
    result = result.filter((f) => {
      const chain = f.traceabilityChain;
      if (!chain) return false;
      return chain.sources.some((s) => s.confidence < 70);
    });
  }

  if (filter.reviewedOnly) {
    result = result.filter((f) => f.isReviewed);
  }

  return result;
}

export function computeSummary(fields: ReturnField[]) {
  const total = fields.length;
  const traced = fields.filter((f) => f.status === 'traced').length;
  const partial = fields.filter((f) => f.status === 'partial').length;
  const manual = fields.filter((f) => f.status === 'manual_entry').length;
  const reviewed = fields.filter((f) => f.isReviewed).length;
  const tracedPercent = total > 0 ? Math.round((traced / total) * 100) : 0;

  return { total, traced, partial, manual, reviewed, tracedPercent };
}

// Re-export FieldStatus for convenience
export type { FieldStatus };
