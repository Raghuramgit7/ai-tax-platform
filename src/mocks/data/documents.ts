import type { SourceDocument } from '@/types';

export const sourceDocuments: SourceDocument[] = [
  {
    id: 'doc-w2-acme',
    name: 'W-2 – Acme Corp',
    type: 'w2',
    pageCount: 1,
    uploadedAt: '2025-03-01T09:00:00Z',
    extractionHighlights: [
      {
        id: 'ext-1',
        fieldId: 'field-1',
        fieldName: 'Line 1 – Wages',
        page: 1,
        // Row "1. Wages, tips, other" is at ~27%
        boundingBox: { x: 62, y: 26, width: 34, height: 2.8 },
        extractedValue: 72000,
        confidence: 97,
        colorIndex: 0,
      },
      {
        id: 'ext-2',
        fieldId: 'field-9',
        fieldName: 'Line 19 – Child tax credit',
        page: 1,
        // Row "5. Medicare wages" at ~39%
        boundingBox: { x: 62, y: 38, width: 34, height: 2.8 },
        extractedValue: 2000,
        confidence: 88,
        colorIndex: 1,
      },
      {
        id: 'ext-3',
        fieldId: 'field-12',
        fieldName: 'Line 16 – Tax',
        page: 1,
        // Row "6. Medicare tax" at ~42%
        boundingBox: { x: 62, y: 41, width: 34, height: 2.8 },
        extractedValue: 12107,
        confidence: 55,
        colorIndex: 2,
      },
    ],
  },
  {
    id: 'doc-w2-freelance',
    name: 'W-2 – Freelance Co',
    type: 'w2',
    pageCount: 1,
    uploadedAt: '2025-03-02T10:30:00Z',
    extractionHighlights: [
      {
        id: 'ext-4',
        fieldId: 'field-1',
        fieldName: 'Line 1 – Wages',
        page: 1,
        boundingBox: { x: 62, y: 26, width: 34, height: 2.8 },
        extractedValue: 13250,
        confidence: 94,
        colorIndex: 0,
      },
    ],
  },
  {
    id: 'doc-1099-int',
    name: '1099-INT – First National Bank',
    type: '1099',
    pageCount: 1,
    uploadedAt: '2025-02-15T08:00:00Z',
    extractionHighlights: [
      {
        id: 'ext-5',
        fieldId: 'field-2',
        fieldName: 'Line 2b – Taxable interest',
        page: 1,
        // "Amount" row on 1099 is at ~24%
        boundingBox: { x: 62, y: 22, width: 34, height: 2.8 },
        extractedValue: 1245,
        confidence: 99,
        colorIndex: 0,
      },
    ],
  },
  {
    id: 'doc-1099-div',
    name: '1099-DIV – Vanguard',
    type: '1099',
    pageCount: 1,
    uploadedAt: '2025-02-20T11:00:00Z',
    extractionHighlights: [
      {
        id: 'ext-6',
        fieldId: 'field-3',
        fieldName: 'Line 3b – Qualified dividends',
        page: 1,
        boundingBox: { x: 62, y: 22, width: 34, height: 2.8 },
        extractedValue: 890,
        confidence: 96,
        colorIndex: 0,
      },
    ],
  },
  {
    id: 'doc-1099-b',
    name: '1099-B – TD Ameritrade',
    type: '1099',
    pageCount: 2,
    uploadedAt: '2025-03-05T14:00:00Z',
    extractionHighlights: [
      {
        id: 'ext-7',
        fieldId: 'field-4',
        fieldName: 'Line 7 – Capital gain',
        page: 1,
        boundingBox: { x: 62, y: 22, width: 34, height: 2.8 },
        extractedValue: 3200,
        confidence: 62,
        colorIndex: 0,
      },
    ],
  },
];

export function getDocumentById(id: string): SourceDocument | undefined {
  return sourceDocuments.find((d) => d.id === id);
}
