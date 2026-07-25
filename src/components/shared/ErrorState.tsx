import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  retryCount?: number;
  maxRetries?: number;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Something went wrong loading this content.',
  retryCount = 0,
  maxRetries = 3,
  onRetry,
}: ErrorStateProps) {
  const isExhausted = retryCount >= maxRetries;

  return (
    <div className="flex items-center justify-center p-8" role="alert">
      <div className="text-center max-w-sm">
        <AlertCircle size={40} className="mx-auto mb-3 text-red-400" />
        <p className="text-sm font-medium text-gray-800 mb-1">Unable to load</p>
        <p className="text-xs text-gray-500 mb-4">{message}</p>

        {!isExhausted && onRetry ? (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors focus-visible:outline-2 focus-visible:outline-primary-500"
          >
            <RefreshCw size={14} />
            Retry {retryCount > 0 && `(${retryCount}/${maxRetries})`}
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              Multiple retries failed. Please reload the page or contact support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reload page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
