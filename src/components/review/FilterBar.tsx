import { Filter } from 'lucide-react';
import type { FieldFilter } from '@/types/ui';
import type { FieldStatus } from '@/types';

interface FilterBarProps {
  filter: FieldFilter;
  onFilterChange: (filter: Partial<FieldFilter>) => void;
}

export function FilterBar({ filter, onFilterChange }: FilterBarProps) {
  const toggleStatus = (status: FieldStatus) => {
    const current = filter.statuses;
    const next = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    onFilterChange({ statuses: next });
  };

  const hasActiveFilters =
    filter.statuses.length > 0 || filter.lowConfidenceOnly || filter.reviewedOnly;

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-gray-400" />
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Filter:
        </span>

        <FilterChip
          label="Partial"
          active={filter.statuses.includes('partial')}
          onClick={() => toggleStatus('partial')}
        />
        <FilterChip
          label="Manual Entry"
          active={filter.statuses.includes('manual_entry')}
          onClick={() => toggleStatus('manual_entry')}
        />
        <FilterChip
          label="Low Confidence"
          active={filter.lowConfidenceOnly}
          onClick={() => onFilterChange({ lowConfidenceOnly: !filter.lowConfidenceOnly })}
        />

        {hasActiveFilters && (
          <button
            onClick={() =>
              onFilterChange({ statuses: [], lowConfidenceOnly: false, reviewedOnly: false })
            }
            className="text-xs text-primary-600 hover:text-primary-800 font-medium ml-2"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-2 py-0.5 rounded-full text-xs font-medium transition-colors
        focus-visible:outline-2 focus-visible:outline-primary-500
        ${active
          ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-300'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
      `}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
