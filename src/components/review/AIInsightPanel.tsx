import { useState } from 'react';
import {
  Brain, AlertTriangle, Info, Lightbulb,
  CheckCircle, X, ChevronDown, ChevronRight,
  ThumbsUp, ThumbsDown, Edit3,
} from 'lucide-react';
import type { AIInsight, InsightSeverity } from '@/mocks/data/aiInsights';

interface AIInsightPanelProps {
  insights: AIInsight[];
  onAccept?: (insightId: string) => void;
  onDismiss?: (insightId: string) => void;
  onCorrect?: (insightId: string, newValue: number) => void;
}

const severityConfig: Record<InsightSeverity, { icon: typeof AlertTriangle; color: string; bgColor: string; label: string }> = {
  warning: { icon: AlertTriangle, color: 'text-amber-600', bgColor: 'bg-amber-50 border-amber-200', label: 'Warning' },
  info: { icon: Info, color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-200', label: 'Verified' },
  suggestion: { icon: Lightbulb, color: 'text-purple-600', bgColor: 'bg-purple-50 border-purple-200', label: 'Suggestion' },
};

export function AIInsightPanel({ insights, onAccept, onDismiss, onCorrect }: AIInsightPanelProps) {
  if (insights.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Brain size={14} className="text-primary-600" />
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          AI Insights ({insights.length})
        </h4>
      </div>
      {insights.map((insight) => (
        <InsightCard
          key={insight.id}
          insight={insight}
          onAccept={onAccept}
          onDismiss={onDismiss}
          onCorrect={onCorrect}
        />
      ))}
    </div>
  );
}

function InsightCard({
  insight,
  onAccept,
  onDismiss,
  onCorrect,
}: {
  insight: AIInsight;
  onAccept?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onCorrect?: (id: string, value: number) => void;
}) {
  const [expanded, setExpanded] = useState(insight.status === 'open');
  const [showCorrection, setShowCorrection] = useState(false);
  const [correctedValue, setCorrectedValue] = useState(insight.suggestedValue?.toString() ?? '');

  const config = severityConfig[insight.severity];
  const Icon = config.icon;
  const isResolved = insight.status !== 'open';

  return (
    <div className={`border rounded-lg overflow-hidden ${isResolved ? 'opacity-60' : ''} ${config.bgColor}`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-3 py-2.5 flex items-center gap-2"
      >
        <Icon size={14} className={config.color} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-800 truncate">{insight.title}</p>
        </div>
        <ConfidencePill confidence={insight.confidence} />
        {expanded ? <ChevronDown size={12} className="text-gray-400" /> : <ChevronRight size={12} className="text-gray-400" />}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          {/* Explanation */}
          <p className="text-xs text-gray-700 leading-relaxed">{insight.explanation}</p>

          {/* Evidence */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Evidence:</p>
            <ul className="space-y-1">
              {insight.evidence.map((item, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                  <span className="text-gray-300 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Suggested action */}
          {insight.suggestedAction && (
            <div className="bg-white/60 rounded p-2">
              <p className="text-xs text-gray-500 font-medium">Suggested action:</p>
              <p className="text-xs text-gray-700">{insight.suggestedAction}</p>
            </div>
          )}

          {/* Value correction (if applicable) */}
          {insight.suggestedValue && insight.currentValue && (
            <div className="bg-white/60 rounded p-2">
              <p className="text-xs text-gray-500 font-medium mb-1">Value comparison:</p>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-gray-600">Current: <strong>${insight.currentValue.toLocaleString()}</strong></span>
                <span className="text-gray-400">→</span>
                <span className="text-primary-700">Suggested: <strong>${insight.suggestedValue.toLocaleString()}</strong></span>
              </div>
            </div>
          )}

          {/* Actions (only for open insights) */}
          {!isResolved && (
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onAccept?.(insight.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors"
              >
                <ThumbsUp size={10} /> Accept
              </button>
              <button
                onClick={() => setShowCorrection(!showCorrection)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
              >
                <Edit3 size={10} /> Correct
              </button>
              <button
                onClick={() => onDismiss?.(insight.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
              >
                <ThumbsDown size={10} /> Dismiss
              </button>
            </div>
          )}

          {/* Correction input */}
          {showCorrection && !isResolved && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-gray-500">New value: $</span>
              <input
                type="number"
                value={correctedValue}
                onChange={(e) => setCorrectedValue(e.target.value)}
                className="w-24 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-primary-500"
              />
              <button
                onClick={() => {
                  onCorrect?.(insight.id, Number(correctedValue));
                  setShowCorrection(false);
                }}
                className="px-2 py-1 text-xs font-medium text-white bg-primary-600 rounded hover:bg-primary-700"
              >
                Apply
              </button>
              <button
                onClick={() => setShowCorrection(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* Resolved status */}
          {isResolved && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle size={10} />
              <span className="capitalize">{insight.status}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ConfidencePill({ confidence }: { confidence: number }) {
  const color = confidence >= 90 ? 'text-green-700 bg-green-100'
    : confidence >= 70 ? 'text-blue-700 bg-blue-100'
    : 'text-amber-700 bg-amber-100';

  return (
    <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${color}`}>
      {confidence}%
    </span>
  );
}
