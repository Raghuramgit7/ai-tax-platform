import { useMemo, useCallback } from 'react';
import { ResizableSplitPanel } from '@/components/shared/ResizableSplitPanel';
import { ReturnPanel } from '@/components/review/ReturnPanel';
import { TraceabilityPanel } from '@/components/review/TraceabilityPanel';
import { AIInsightPanel } from '@/components/review/AIInsightPanel';
import { SourceDocumentViewer } from '@/components/review/SourceDocumentViewer';
import { useReviewStore } from '@/stores/reviewStore';
import { getDocumentById } from '@/mocks/data/documents';
import { getInsightsForField } from '@/mocks/data/aiInsights';
import type { SourceReference } from '@/types';

export function ReviewView() {
  const { fields, selectedFieldId, setSplitRatio } = useReviewStore();

  const selectedField = useMemo(
    () => fields.find((f) => f.id === selectedFieldId) ?? null,
    [fields, selectedFieldId]
  );

  // AI insights for the selected field
  const fieldInsights = useMemo(
    () => selectedFieldId ? getInsightsForField(selectedFieldId) : [],
    [selectedFieldId]
  );

  // Determine which document to show based on selected field
  const activeDocument = useMemo(() => {
    if (!selectedField?.traceabilityChain) return null;
    const firstSource = selectedField.traceabilityChain.sources[0];
    if (!firstSource) return null;
    return getDocumentById(firstSource.documentId) ?? null;
  }, [selectedField]);

  // Find active highlight based on selected field
  const activeHighlightId = useMemo(() => {
    if (!activeDocument || !selectedField) return undefined;
    const highlight = activeDocument.extractionHighlights.find(
      (h) => h.fieldId === selectedField.id
    );
    return highlight?.id;
  }, [activeDocument, selectedField]);

  const handleSourceSelect = useCallback((source: SourceReference) => {
    console.log('Navigate to source:', source.documentName, 'page', source.page);
  }, []);

  const handleAcceptInsight = useCallback((insightId: string) => {
    console.log('Accept insight:', insightId);
  }, []);

  const handleDismissInsight = useCallback((insightId: string) => {
    console.log('Dismiss insight:', insightId);
  }, []);

  const handleCorrectInsight = useCallback((insightId: string, newValue: number) => {
    console.log('Correct insight:', insightId, 'new value:', newValue);
  }, []);

  const leftPanel = (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto min-h-0">
        <ReturnPanel />
      </div>
      {/* Traceability + AI Insights panel when field is selected */}
      {selectedField && (
        <div className="border-t-2 border-primary-200 p-4 bg-gray-50 overflow-auto" style={{ maxHeight: '50%', minHeight: '200px' }}>
          <TraceabilityPanel
            field={selectedField}
            onSourceSelect={handleSourceSelect}
          />
          {/* AI Insights for this field */}
          {fieldInsights.length > 0 && (
            <div className="mt-4">
              <AIInsightPanel
                insights={fieldInsights}
                onAccept={handleAcceptInsight}
                onDismiss={handleDismissInsight}
                onCorrect={handleCorrectInsight}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );

  const rightPanel = (
    <SourceDocumentViewer
      document={activeDocument}
      activeHighlightId={activeHighlightId}
    />
  );

  return (
    <div className="h-full">
      <ResizableSplitPanel
        leftPanel={leftPanel}
        rightPanel={rightPanel}
        defaultSplit={0.5}
        onSplitChange={setSplitRatio}
      />
    </div>
  );
}
