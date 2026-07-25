import type { ReturnField } from '@/types';
import { StatusIndicator } from '@/components/shared/StatusIndicator';

interface ReturnFieldRowProps {
  field: ReturnField;
  isSelected: boolean;
  onSelect: (fieldId: string) => void;
}

export function ReturnFieldRow({ field, isSelected, onSelect }: ReturnFieldRowProps) {
  const confidence = field.traceabilityChain?.sources[0]?.confidence;

  return (
    <button
      onClick={() => onSelect(field.id)}
      className={`
        w-full text-left px-4 py-3 border-l-4 transition-all
        hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-primary-500
        ${isSelected
          ? 'border-l-primary-500 bg-primary-50 ring-1 ring-primary-200'
          : 'border-l-transparent'
        }
      `}
      aria-pressed={isSelected}
      aria-label={`${field.name}: $${field.value.toLocaleString()}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 truncate">{field.name}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-sm font-semibold text-gray-900 tabular-nums">
            ${field.value.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="mt-1">
        <StatusIndicator
          status={field.status}
          confidence={confidence}
          isReviewed={field.isReviewed}
          reviewedBy={field.reviewedBy}
          reviewedAt={field.reviewedAt}
        />
      </div>
    </button>
  );
}
