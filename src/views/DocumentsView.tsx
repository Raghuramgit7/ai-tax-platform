import { useState } from 'react';
import { FileText, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { sourceDocuments } from '@/mocks/data/documents';
import { SourceDocumentViewer } from '@/components/review/SourceDocumentViewer';
import type { SourceDocument } from '@/types';

export function DocumentsView() {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const selectedDoc = sourceDocuments.find((d) => d.id === selectedDocId) ?? null;

  return (
    <div className="h-full flex">
      {/* Document list */}
      <div className="w-80 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-800">Source Documents</h2>
          <p className="text-xs text-gray-500 mt-0.5">{sourceDocuments.length} uploaded</p>
        </div>

        <div className="flex-1 overflow-auto">
          {sourceDocuments.map((doc) => (
            <DocumentRow
              key={doc.id}
              document={doc}
              isSelected={doc.id === selectedDocId}
              onSelect={() => setSelectedDocId(doc.id)}
            />
          ))}
        </div>
      </div>

      {/* Document viewer */}
      <div className="flex-1">
        {selectedDoc ? (
          <SourceDocumentViewer
            document={selectedDoc}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-400">
              <FileText size={48} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">Select a document</p>
              <p className="text-xs mt-1">Choose a document from the list to preview</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DocumentRow({
  document,
  isSelected,
  onSelect,
}: {
  document: SourceDocument;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const totalExtractions = document.extractionHighlights.length;
  const lowConfidence = document.extractionHighlights.filter((h) => h.confidence < 70).length;
  const allHigh = lowConfidence === 0 && totalExtractions > 0;

  return (
    <button
      onClick={onSelect}
      className={`
        w-full text-left px-4 py-3 border-l-4 transition-colors
        hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-primary-500
        ${isSelected ? 'bg-primary-50 border-l-primary-500' : 'border-l-transparent'}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0">
          <FileText size={16} className="text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{document.name}</p>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <span className="uppercase font-medium text-gray-400">{document.type}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Calendar size={10} />
              {formatDate(document.uploadedAt)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-gray-500">
              {totalExtractions} extraction{totalExtractions !== 1 ? 's' : ''}
            </span>
            {lowConfidence > 0 && (
              <span className="inline-flex items-center gap-0.5 text-xs text-status-warning">
                <AlertCircle size={10} />
                {lowConfidence} low confidence
              </span>
            )}
            {allHigh && (
              <span className="inline-flex items-center gap-0.5 text-xs text-status-traced">
                <CheckCircle size={10} />
                All verified
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
