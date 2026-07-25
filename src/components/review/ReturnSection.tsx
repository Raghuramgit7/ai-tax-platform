import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ReturnField } from '@/types';
import { ReturnFieldRow } from './ReturnFieldRow';

interface ReturnSectionProps {
  title: string;
  section: string;
  fields: ReturnField[];
  isExpanded: boolean;
  onToggle: () => void;
  selectedFieldId: string | null;
  onSelectField: (fieldId: string) => void;
}

const sectionLabels: Record<string, string> = {
  income: 'Income',
  deductions: 'Deductions',
  credits: 'Credits',
  tax_computation: 'Tax Computation',
};

export function ReturnSection({
  title,
  fields,
  isExpanded,
  onToggle,
  selectedFieldId,
  onSelectField,
}: ReturnSectionProps) {
  const sectionTotal = fields.length > 0 ? fields[fields.length - 1].value : 0;

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors focus-visible:outline-2 focus-visible:outline-primary-500"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown size={16} className="text-gray-400" />
          ) : (
            <ChevronRight size={16} className="text-gray-400" />
          )}
          <span className="text-sm font-semibold text-gray-800">{title}</span>
          <span className="text-xs text-gray-500">({fields.length} fields)</span>
        </div>
        <span className="text-sm font-bold text-gray-900 tabular-nums">
          ${sectionTotal.toLocaleString()}
        </span>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100">
          {fields.map((field) => (
            <ReturnFieldRow
              key={field.id}
              field={field}
              isSelected={field.id === selectedFieldId}
              onSelect={onSelectField}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export { sectionLabels };
