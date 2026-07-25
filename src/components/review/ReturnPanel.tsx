import { useReviewStore, filterFields, computeSummary } from '@/stores/reviewStore';
import { ReturnSection, sectionLabels } from './ReturnSection';
import { SummaryBar } from './SummaryBar';
import { FilterBar } from './FilterBar';
import type { ReturnField } from '@/types';

const sections = ['income', 'deductions', 'credits', 'tax_computation'] as const;

export function ReturnPanel() {
  const {
    fields,
    selectedFieldId,
    expandedSections,
    filter,
    selectField,
    toggleSection,
    setFilter,
  } = useReviewStore();

  const filteredFields = filterFields(fields, filter);
  const summary = computeSummary(fields);

  const fieldsBySection = sections.reduce(
    (acc, section) => {
      acc[section] = filteredFields.filter((f) => f.section === section);
      return acc;
    },
    {} as Record<string, ReturnField[]>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      <SummaryBar {...summary} />
      <FilterBar filter={filter} onFilterChange={setFilter} />

      <div className="flex-1 overflow-auto">
        {sections.map((section) => (
          <ReturnSection
            key={section}
            title={sectionLabels[section] ?? section}
            section={section}
            fields={fieldsBySection[section]}
            isExpanded={expandedSections.includes(section)}
            onToggle={() => toggleSection(section)}
            selectedFieldId={selectedFieldId}
            onSelectField={selectField}
          />
        ))}
      </div>
    </div>
  );
}
