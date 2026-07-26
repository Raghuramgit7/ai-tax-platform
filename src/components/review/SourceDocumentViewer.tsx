import { useState } from 'react';
import { ZoomIn, ZoomOut, FileText, AlertCircle } from 'lucide-react';
import type { SourceDocument, ExtractionHighlight } from '@/types';

interface SourceDocumentViewerProps {
  document: SourceDocument | null;
  activeHighlightId?: string;
  scrollToPage?: number;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
}

const HIGHLIGHT_COLORS = [
  'rgba(59, 130, 246, 0.25)',   // blue
  'rgba(16, 185, 129, 0.25)',   // green
  'rgba(245, 158, 11, 0.25)',   // amber
  'rgba(239, 68, 68, 0.25)',    // red
  'rgba(139, 92, 246, 0.25)',   // purple
  'rgba(236, 72, 153, 0.25)',   // pink
  'rgba(20, 184, 166, 0.25)',   // teal
  'rgba(251, 146, 60, 0.25)',   // orange
];

const HIGHLIGHT_BORDERS = [
  'rgb(59, 130, 246)',
  'rgb(16, 185, 129)',
  'rgb(245, 158, 11)',
  'rgb(239, 68, 68)',
  'rgb(139, 92, 246)',
  'rgb(236, 72, 153)',
  'rgb(20, 184, 166)',
  'rgb(251, 146, 60)',
];

export function SourceDocumentViewer({
  document,
  activeHighlightId,
}: SourceDocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [hoveredHighlight, setHoveredHighlight] = useState<string | null>(null);

  const clampZoom = (value: number) => Math.min(200, Math.max(50, value));

  if (!document) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-400">
          <FileText size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">No document selected</p>
          <p className="text-xs mt-1">Select a field to view its source document</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={14} className="text-gray-400 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-700 truncate">
            {document.name}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom(clampZoom(zoom - 25))}
            disabled={zoom <= 50}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-primary-500"
            aria-label="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-medium text-gray-600 w-10 text-center">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom(clampZoom(zoom + 25))}
            disabled={zoom >= 200}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-primary-500"
            aria-label="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      {/* Document canvas */}
      <div className="flex-1 overflow-auto p-4">
        <div
          className="mx-auto bg-white shadow-md rounded relative"
          style={{
            width: `${(595 * zoom) / 100}px`,
            height: `${(842 * zoom) / 100}px`,
            transform: `scale(1)`,
          }}
        >
          {/* Simulated document content */}
          <SimulatedDocContent document={document} zoom={zoom} />

          {/* Extraction highlight overlays */}
          {document.extractionHighlights.map((highlight) => (
            <HighlightOverlay
              key={highlight.id}
              highlight={highlight}
              isActive={highlight.id === activeHighlightId}
              isHovered={highlight.id === hoveredHighlight}
              onMouseEnter={() => setHoveredHighlight(highlight.id)}
              onMouseLeave={() => setHoveredHighlight(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SimulatedDocContent({
  document,
  zoom,
}: {
  document: SourceDocument;
  zoom: number;
}) {
  const fontSize = (12 * zoom) / 100;

  return (
    <div className="absolute inset-0 p-6" style={{ fontSize: `${fontSize}px` }}>
      {/* Document header */}
      <div className="text-center mb-4">
        <p className="font-bold text-gray-800" style={{ fontSize: `${fontSize * 1.4}px` }}>
          {document.type === 'w2' ? 'Form W-2' : document.type === '1099' ? 'Form 1099' : 'Document'}
        </p>
        <p className="text-gray-500 mt-1">{document.name}</p>
        <p className="text-gray-400 mt-0.5" style={{ fontSize: `${fontSize * 0.8}px` }}>
          Tax Year 2024
        </p>
      </div>

      {/* Simulated form fields */}
      <div className="space-y-3 mt-6">
        {document.type === 'w2' && (
          <>
            <FormField label="a. Employee's SSN" value="XXX-XX-1234" fontSize={fontSize} />
            <FormField label="b. Employer ID" value="12-3456789" fontSize={fontSize} />
            <FormField label="c. Employer" value={document.name.replace('W-2 – ', '')} fontSize={fontSize} />
            <FormField label="1. Wages, tips, other" value={
              document.extractionHighlights.find(h => h.fieldName.includes('Wages'))?.extractedValue?.toLocaleString() ?? '—'
            } fontSize={fontSize} />
            <FormField label="2. Federal tax withheld" value="14,400" fontSize={fontSize} />
            <FormField label="3. Social security wages" value="72,000" fontSize={fontSize} />
            <FormField label="4. Social security tax" value="4,464" fontSize={fontSize} />
            <FormField label="5. Medicare wages" value="72,000" fontSize={fontSize} />
            <FormField label="6. Medicare tax" value="1,044" fontSize={fontSize} />
          </>
        )}
        {document.type === '1099' && (
          <>
            <FormField label="Payer" value={document.name.replace('1099-INT – ', '').replace('1099-DIV – ', '').replace('1099-B – ', '')} fontSize={fontSize} />
            <FormField label="Recipient" value="Michael Johnson" fontSize={fontSize} />
            <FormField label="Amount" value={
              document.extractionHighlights[0]?.extractedValue?.toLocaleString() ?? '—'
            } fontSize={fontSize} />
          </>
        )}
      </div>
    </div>
  );
}

function FormField({ label, value, fontSize }: { label: string; value: string; fontSize: number }) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-1">
      <span className="text-gray-500" style={{ fontSize: `${fontSize * 0.9}px` }}>{label}</span>
      <span className="font-mono text-gray-800">${value}</span>
    </div>
  );
}

function HighlightOverlay({
  highlight,
  isActive,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: {
  highlight: ExtractionHighlight;
  isActive: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const { boundingBox, colorIndex, confidence } = highlight;
  const color = HIGHLIGHT_COLORS[colorIndex % 8];
  const border = HIGHLIGHT_BORDERS[colorIndex % 8];
  const isLowConfidence = confidence < 70;

  return (
    <div
      className={`absolute transition-all ${isActive ? 'ring-2 ring-primary-500' : ''}`}
      style={{
        left: `${boundingBox.x}%`,
        top: `${boundingBox.y}%`,
        width: `${boundingBox.width}%`,
        height: `${boundingBox.height}%`,
        backgroundColor: isActive || isHovered ? color.replace('0.25', '0.4') : color,
        border: `2px solid ${isActive ? 'rgb(59, 130, 246)' : border}`,
        borderRadius: '3px',
        zIndex: isActive ? 10 : 1,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Low confidence warning */}
      {isLowConfidence && (
        <div className="absolute -top-5 -left-1">
          <AlertCircle size={14} className="text-status-warning" />
        </div>
      )}

      {/* Tooltip on hover */}
      {isHovered && (
        <div
          className="absolute left-0 -top-12 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50 shadow-lg"
        >
          <p className="font-medium">{highlight.fieldName}</p>
          <p className="text-gray-300">
            Value: ${typeof highlight.extractedValue === 'number'
              ? highlight.extractedValue.toLocaleString()
              : highlight.extractedValue}
            {' · '}Confidence: {confidence}%
          </p>
        </div>
      )}
    </div>
  );
}
