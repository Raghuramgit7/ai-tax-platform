interface SkeletonLoaderProps {
  variant?: 'list' | 'panel' | 'card' | 'text';
  rows?: number;
}

export function SkeletonLoader({ variant = 'list', rows = 5 }: SkeletonLoaderProps) {
  return (
    <div aria-busy="true" aria-label="Loading content" className="animate-pulse p-4 space-y-3">
      {variant === 'list' && (
        <>
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-2 bg-gray-100 rounded w-1/2" />
              </div>
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </>
      )}

      {variant === 'panel' && (
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-2/3" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-gray-100 rounded" />
            <div className="h-32 bg-gray-100 rounded" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-3 bg-gray-100 rounded" style={{ width: `${80 - i * 10}%` }} />
            ))}
          </div>
        </div>
      )}

      {variant === 'card' && (
        <div className="space-y-4">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="flex gap-3">
                <div className="h-3 bg-gray-100 rounded w-20" />
                <div className="h-3 bg-gray-100 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === 'text' && (
        <div className="space-y-2">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="h-3 bg-gray-200 rounded" style={{ width: `${90 - i * 8}%` }} />
          ))}
        </div>
      )}
    </div>
  );
}
