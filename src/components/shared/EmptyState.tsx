import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        {icon ?? <Inbox size={40} className="mx-auto mb-3 text-gray-300" />}
        <p className="text-sm font-medium text-gray-700 mb-1">{title}</p>
        <p className="text-xs text-gray-500 mb-4">{description}</p>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors focus-visible:outline-2 focus-visible:outline-primary-500"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
