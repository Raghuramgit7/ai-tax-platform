import { CheckCircle, AlertTriangle, Edit3, AlertCircle, Eye } from 'lucide-react';
import type { FieldStatus } from '@/types';

interface StatusIndicatorProps {
  status: FieldStatus;
  confidence?: number;
  isReviewed?: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
}

const statusConfig = {
  traced: {
    icon: CheckCircle,
    label: 'Traced',
    colorClass: 'text-status-traced',
    bgClass: 'bg-emerald-50',
  },
  partial: {
    icon: AlertTriangle,
    label: 'Partial',
    colorClass: 'text-status-partial',
    bgClass: 'bg-amber-50',
  },
  manual_entry: {
    icon: Edit3,
    label: 'Manual',
    colorClass: 'text-status-manual',
    bgClass: 'bg-gray-50',
  },
} as const;

export function StatusIndicator({
  status,
  confidence,
  isReviewed,
  reviewedBy,
  reviewedAt,
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const isLowConfidence = confidence !== undefined && confidence < 70;

  return (
    <div className="flex items-center gap-1.5">
      {/* Primary status */}
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${config.bgClass} ${config.colorClass}`}
        title={config.label}
      >
        <Icon size={12} aria-hidden="true" />
        <span>{config.label}</span>
      </span>

      {/* Low confidence warning */}
      {isLowConfidence && (
        <span
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-red-50 text-status-warning"
          title={`Low confidence: ${confidence}%`}
        >
          <AlertCircle size={12} aria-hidden="true" />
          <span>{confidence}%</span>
        </span>
      )}

      {/* Reviewed badge */}
      {isReviewed && (
        <span
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-purple-50 text-status-reviewed"
          title={`Reviewed by ${reviewedBy} on ${reviewedAt ? formatDate(reviewedAt) : ''}`}
        >
          <Eye size={12} aria-hidden="true" />
          <span>Reviewed</span>
        </span>
      )}
    </div>
  );
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export { formatDate };
