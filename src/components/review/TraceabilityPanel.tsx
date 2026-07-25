import { FileText, AlertCircle, Link2, Zap } from 'lucide-react';
import type { ReturnField, SourceReference } from '@/types';
import { TransformationChain } from './TransformationChain';

interface TraceabilityPanelProps {
  field: ReturnField;
  onSourceSelect: (source: SourceReference) => void;
}

export function TraceabilityPanel({ field, onSourceSelect }: TraceabilityPanelProps) {
  const chain = field.traceabilityChain;

  // Manual entry — no traceability
  if (!chain || (chain.sources.length === 0 && chain.transformations.length === 0 && field.status === 'manual_entry')) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2 text-gray-500">
          <AlertCircle size={16} />
          <p className="text-sm">
            No traceability data available for this field. This is a manual entry.
          </p>
        </div>
      </div>
    );
  }

  const hasTransformations = chain.transformations.length > 0;
  const hasMultipleSources = chain.sources.length > 1;

  return (
    <div className="space-y-4 p-4 bg-white border border-gray-200 rounded-lg">
      {/* Field header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{field.name}</h3>
          <p className="text-lg font-bold text-primary-700">${field.value.toLocaleString()}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
            hasTransformations
              ? 'bg-blue-50 text-blue-700'
              : 'bg-green-50 text-green-700'
          }`}
        >
          {hasTransformations ? (
            <>
              <Zap size={12} /> Computed
            </>
          ) : (
            <>
              <Link2 size={12} /> Direct Extraction
            </>
          )}
        </span>
      </div>

      {/* Sources */}
      {chain.sources.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
            <FileText size={12} />
            Source Documents {hasMultipleSources && `(${chain.sources.length})`}
          </h4>
          {chain.sources.map((source, i) => (
            <button
              key={`${source.documentId}-${i}`}
              onClick={() => onSourceSelect(source)}
              className="w-full text-left p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-primary-300 transition-colors focus-visible:outline-2 focus-visible:outline-primary-500"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">
                  {source.documentName}
                </span>
                <span className="text-xs text-gray-500">
                  Page {source.page}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">{source.section}</span>
                <span className="text-sm font-mono font-semibold text-gray-900">
                  ${source.extractedValue.toLocaleString()}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1">
                <ConfidenceBadge confidence={source.confidence} />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Transformation chain */}
      {hasTransformations && (
        <TransformationChain transformations={chain.transformations} />
      )}
    </div>
  );
}

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const isLow = confidence < 70;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        isLow ? 'text-status-warning' : 'text-status-traced'
      }`}
    >
      {isLow && <AlertCircle size={10} />}
      <span>Confidence: {confidence}%</span>
    </span>
  );
}
