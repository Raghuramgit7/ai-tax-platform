import type { ReturnField } from '@/types';

export const returnFields: ReturnField[] = [
  // === INCOME ===
  {
    id: 'field-1',
    section: 'income',
    name: 'Line 1 – Wages, salaries, tips',
    value: 85250,
    status: 'traced',
    isReviewed: false,
    traceabilityChain: {
      fieldId: 'field-1',
      sources: [
        {
          documentId: 'doc-w2-acme',
          documentName: 'W-2 – Acme Corp',
          page: 1,
          section: 'Box 1 – Wages, tips, other compensation',
          extractedValue: 72000,
          confidence: 97,
          boundingBox: { x: 55, y: 30, width: 40, height: 4 },
        },
        {
          documentId: 'doc-w2-freelance',
          documentName: 'W-2 – Freelance Co',
          page: 1,
          section: 'Box 1 – Wages, tips, other compensation',
          extractedValue: 13250,
          confidence: 94,
          boundingBox: { x: 55, y: 30, width: 40, height: 4 },
        },
      ],
      transformations: [
        {
          id: 'tx-1',
          order: 1,
          operation: 'sum',
          inputs: [
            { label: 'W-2 Acme Corp Box 1', value: 72000 },
            { label: 'W-2 Freelance Co Box 1', value: 13250 },
          ],
          output: 85250,
          formula: '$72,000 + $13,250 = $85,250',
        },
      ],
    },
  },
  {
    id: 'field-2',
    section: 'income',
    name: 'Line 2b – Taxable interest',
    value: 1245,
    status: 'traced',
    isReviewed: true,
    reviewedBy: 'Sarah Chen, CPA',
    reviewedAt: '2025-06-15T14:30:00Z',
    traceabilityChain: {
      fieldId: 'field-2',
      sources: [
        {
          documentId: 'doc-1099-int',
          documentName: '1099-INT – First National Bank',
          page: 1,
          section: 'Box 1 – Interest income',
          extractedValue: 1245,
          confidence: 99,
          boundingBox: { x: 55, y: 36, width: 40, height: 4 },
        },
      ],
      transformations: [],
    },
  },
  {
    id: 'field-3',
    section: 'income',
    name: 'Line 3b – Qualified dividends',
    value: 890,
    status: 'traced',
    isReviewed: false,
    traceabilityChain: {
      fieldId: 'field-3',
      sources: [
        {
          documentId: 'doc-1099-div',
          documentName: '1099-DIV – Vanguard',
          page: 1,
          section: 'Box 1b – Qualified dividends',
          extractedValue: 890,
          confidence: 96,
          boundingBox: { x: 55, y: 36, width: 40, height: 4 },
        },
      ],
      transformations: [],
    },
  },
  {
    id: 'field-4',
    section: 'income',
    name: 'Line 7 – Capital gain or (loss)',
    value: 3200,
    status: 'partial',
    isReviewed: false,
    traceabilityChain: {
      fieldId: 'field-4',
      sources: [
        {
          documentId: 'doc-1099-b',
          documentName: '1099-B – TD Ameritrade',
          page: 1,
          section: 'Summary – Net gain/loss',
          extractedValue: 3200,
          confidence: 62,
          boundingBox: { x: 55, y: 36, width: 40, height: 4 },
        },
      ],
      transformations: [],
    },
  },
  {
    id: 'field-5',
    section: 'income',
    name: 'Line 9 – Total income',
    value: 90585,
    status: 'traced',
    isReviewed: false,
    traceabilityChain: {
      fieldId: 'field-5',
      sources: [
        {
          documentId: 'doc-w2-acme',
          documentName: 'W-2 – Acme Corp',
          page: 1,
          section: 'Box 1',
          extractedValue: 72000,
          confidence: 97,
          boundingBox: { x: 55, y: 30, width: 40, height: 4 },
        },
      ],
      transformations: [
        {
          id: 'tx-5',
          order: 1,
          operation: 'sum',
          inputs: [
            { label: 'Line 1 – Wages', value: 85250 },
            { label: 'Line 2b – Interest', value: 1245 },
            { label: 'Line 3b – Dividends', value: 890 },
            { label: 'Line 7 – Capital gain', value: 3200 },
          ],
          output: 90585,
          formula: '$85,250 + $1,245 + $890 + $3,200 = $90,585',
        },
      ],
    },
  },

  // === DEDUCTIONS ===
  {
    id: 'field-6',
    section: 'deductions',
    name: 'Line 12 – Standard deduction',
    value: 14600,
    status: 'manual_entry',
    isReviewed: true,
    reviewedBy: 'Sarah Chen, CPA',
    reviewedAt: '2025-06-14T10:15:00Z',
  },
  {
    id: 'field-7',
    section: 'deductions',
    name: 'Line 13 – Qualified business income deduction',
    value: 0,
    status: 'traced',
    isReviewed: false,
    traceabilityChain: {
      fieldId: 'field-7',
      sources: [],
      transformations: [],
    },
  },
  {
    id: 'field-8',
    section: 'deductions',
    name: 'Line 14 – Total deductions',
    value: 14600,
    status: 'traced',
    isReviewed: false,
    traceabilityChain: {
      fieldId: 'field-8',
      sources: [],
      transformations: [
        {
          id: 'tx-8',
          order: 1,
          operation: 'sum',
          inputs: [
            { label: 'Line 12 – Standard deduction', value: 14600 },
            { label: 'Line 13 – QBI deduction', value: 0 },
          ],
          output: 14600,
          formula: '$14,600 + $0 = $14,600',
        },
      ],
    },
  },

  // === CREDITS ===
  {
    id: 'field-9',
    section: 'credits',
    name: 'Line 19 – Child tax credit',
    value: 2000,
    status: 'traced',
    isReviewed: false,
    traceabilityChain: {
      fieldId: 'field-9',
      sources: [
        {
          documentId: 'doc-w2-acme',
          documentName: 'W-2 – Acme Corp',
          page: 1,
          section: 'Dependent verification',
          extractedValue: 2000,
          confidence: 88,
          boundingBox: { x: 55, y: 42, width: 40, height: 4 },
        },
      ],
      transformations: [],
    },
  },
  {
    id: 'field-10',
    section: 'credits',
    name: 'Line 21 – Other credits (Form 8812)',
    value: 0,
    status: 'manual_entry',
    isReviewed: false,
  },

  // === TAX COMPUTATION ===
  {
    id: 'field-11',
    section: 'tax_computation',
    name: 'Line 15 – Taxable income',
    value: 75985,
    status: 'traced',
    isReviewed: false,
    traceabilityChain: {
      fieldId: 'field-11',
      sources: [],
      transformations: [
        {
          id: 'tx-11',
          order: 1,
          operation: 'subtract',
          inputs: [
            { label: 'Line 9 – Total income', value: 90585 },
            { label: 'Line 14 – Total deductions', value: 14600 },
          ],
          output: 75985,
          formula: '$90,585 − $14,600 = $75,985',
        },
      ],
    },
  },
  {
    id: 'field-12',
    section: 'tax_computation',
    name: 'Line 16 – Tax',
    value: 12107,
    status: 'partial',
    isReviewed: false,
    traceabilityChain: {
      fieldId: 'field-12',
      sources: [
        {
          documentId: 'doc-w2-acme',
          documentName: 'W-2 – Acme Corp',
          page: 1,
          section: 'Tax table lookup',
          extractedValue: 12107,
          confidence: 55,
          boundingBox: { x: 55, y: 46, width: 40, height: 4 },
        },
      ],
      transformations: [
        {
          id: 'tx-12',
          order: 1,
          operation: 'lookup',
          inputs: [
            { label: 'Taxable income', value: 75985 },
          ],
          output: 12107,
          formula: 'Tax Table 2024 lookup: $75,985 → $12,107',
        },
      ],
    },
  },
  {
    id: 'field-13',
    section: 'tax_computation',
    name: 'Line 24 – Total tax',
    value: 10107,
    status: 'traced',
    isReviewed: false,
    traceabilityChain: {
      fieldId: 'field-13',
      sources: [],
      transformations: [
        {
          id: 'tx-13',
          order: 1,
          operation: 'subtract',
          inputs: [
            { label: 'Line 16 – Tax', value: 12107 },
            { label: 'Line 19 – Child tax credit', value: 2000 },
          ],
          output: 10107,
          formula: '$12,107 − $2,000 = $10,107',
        },
      ],
    },
  },
];

export function getFieldsBySection(section: ReturnField['section']): ReturnField[] {
  return returnFields.filter((f) => f.section === section);
}

export function getSectionTotal(section: ReturnField['section']): number {
  const fields = getFieldsBySection(section);
  // Return the last field's value as the section total (typically the summary line)
  return fields.length > 0 ? fields[fields.length - 1].value : 0;
}
