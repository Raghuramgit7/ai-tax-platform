export type InsightSeverity = 'info' | 'warning' | 'suggestion';
export type InsightStatus = 'open' | 'accepted' | 'dismissed' | 'corrected';

export interface AIInsight {
  id: string;
  fieldId: string;
  fieldName: string;
  severity: InsightSeverity;
  status: InsightStatus;
  title: string;
  explanation: string;
  evidence: string[];
  confidence: number;
  suggestedAction?: string;
  suggestedValue?: number;
  currentValue?: number;
}

export const aiInsights: AIInsight[] = [
  {
    id: 'insight-1',
    fieldId: 'field-4',
    fieldName: 'Line 7 – Capital gain or (loss)',
    severity: 'warning',
    status: 'open',
    title: 'Low confidence extraction',
    explanation: 'The AI extracted $3,200 from the 1099-B summary page, but the document quality was poor and the value could not be cross-verified against individual transactions.',
    evidence: [
      '1099-B summary shows net gain of $3,200 (page 1, bottom section)',
      'Individual transaction detail pages were not provided',
      'Prior year return showed $1,850 in capital gains (58% increase year-over-year)',
    ],
    confidence: 62,
    suggestedAction: 'Request the full 1099-B with transaction detail from the client.',
  },
  {
    id: 'insight-2',
    fieldId: 'field-12',
    fieldName: 'Line 16 – Tax',
    severity: 'warning',
    status: 'open',
    title: 'Tax calculation uses approximate lookup',
    explanation: 'The tax was computed using the 2024 tax table lookup. The AI matched the taxable income of $75,985 to the closest bracket but the exact table entry could not be verified.',
    evidence: [
      'Taxable income: $75,985 (derived from Line 15)',
      'Tax table 2024, Single filer: 22% bracket applies to income $47,150–$100,525',
      'Computed: $5,426 + 22% × ($75,985 – $47,150) = $11,770 (differs from shown $12,107)',
    ],
    confidence: 55,
    suggestedAction: 'Verify tax amount against official 2024 tax table.',
    suggestedValue: 11770,
    currentValue: 12107,
  },
  {
    id: 'insight-3',
    fieldId: 'field-1',
    fieldName: 'Line 1 – Wages, salaries, tips',
    severity: 'info',
    status: 'accepted',
    title: 'Multi-source aggregation verified',
    explanation: 'Two W-2 forms were found and their Box 1 values sum correctly to the reported wages. Both extractions had high confidence (>94%).',
    evidence: [
      'W-2 Acme Corp Box 1: $72,000 (confidence 97%)',
      'W-2 Freelance Co Box 1: $13,250 (confidence 94%)',
      'Sum: $85,250 matches reported value',
    ],
    confidence: 97,
  },
  {
    id: 'insight-4',
    fieldId: 'field-9',
    fieldName: 'Line 19 – Child tax credit',
    severity: 'suggestion',
    status: 'open',
    title: 'Credit amount may need adjustment',
    explanation: 'The AI applied the standard $2,000 child tax credit. However, based on the client\'s income level, a partial reduction may apply if there are additional income sources not yet captured.',
    evidence: [
      'One dependent child claimed (questionnaire response)',
      'AGI: $90,585 — below the $200,000 phaseout threshold',
      'Standard credit: $2,000 per qualifying child',
      'No additional income sources flagged',
    ],
    confidence: 88,
    suggestedAction: 'Confirm no additional income that would trigger phaseout. Current amount is likely correct.',
  },
];

export function getInsightsForField(fieldId: string): AIInsight[] {
  return aiInsights.filter((i) => i.fieldId === fieldId);
}

export function getOpenInsights(): AIInsight[] {
  return aiInsights.filter((i) => i.status === 'open');
}
