import { CheckCircle, AlertTriangle, Edit3, Eye } from 'lucide-react';

interface SummaryBarProps {
  total: number;
  traced: number;
  partial: number;
  manual: number;
  reviewed: number;
  tracedPercent: number;
}

export function SummaryBar({
  total,
  traced,
  partial,
  manual,
  reviewed,
  tracedPercent,
}: SummaryBarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-status-traced rounded-full transition-all"
                style={{ width: `${tracedPercent}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {tracedPercent}% traced
            </span>
          </div>
        </div>

        {/* Status counts */}
        <div className="flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1 text-status-traced">
            <CheckCircle size={12} /> {traced} Traced
          </span>
          <span className="inline-flex items-center gap-1 text-status-partial">
            <AlertTriangle size={12} /> {partial} Partial
          </span>
          <span className="inline-flex items-center gap-1 text-status-manual">
            <Edit3 size={12} /> {manual} Manual
          </span>
          <span className="inline-flex items-center gap-1 text-status-reviewed">
            <Eye size={12} /> {reviewed}/{total} Reviewed
          </span>
        </div>
      </div>
    </div>
  );
}
