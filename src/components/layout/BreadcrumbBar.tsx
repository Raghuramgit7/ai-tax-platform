import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { threads } from '@/mocks/data/threads';

interface BreadcrumbSegment {
  label: string;
  path?: string;
}

export function BreadcrumbBar() {
  const location = useLocation();
  const segments = getBreadcrumbs(location.pathname);

  if (segments.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="px-4 py-2 bg-white border-b border-gray-100">
      <ol className="flex items-center gap-1 text-sm">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && <ChevronRight size={12} className="text-gray-300" />}
              {isLast || !segment.path ? (
                <span className="text-gray-700 font-medium">{segment.label}</span>
              ) : (
                <Link
                  to={segment.path}
                  className="text-gray-500 hover:text-primary-600 transition-colors focus-visible:outline-2 focus-visible:outline-primary-500 rounded"
                >
                  {segment.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function getBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  const parts = pathname.split('/').filter(Boolean);

  if (parts.length === 0) return [{ label: 'Home' }];

  const segments: BreadcrumbSegment[] = [];

  // Level 1: Primary section
  switch (parts[0]) {
    case 'review':
      segments.push({ label: 'Return Review', path: '/review' });
      break;
    case 'documents':
      segments.push({ label: 'Documents', path: '/documents' });
      break;
    case 'collaboration':
      segments.push({ label: 'Collaboration', path: '/collaboration' });
      if (parts[1]) {
        const thread = threads.find((t) => t.id === parts[1]);
        segments.push({ label: thread?.title ?? 'Thread' });
      }
      break;
    case 'action-items':
      segments.push({ label: 'Action Items', path: '/action-items' });
      break;
    default:
      segments.push({ label: parts[0] });
  }

  return segments;
}
