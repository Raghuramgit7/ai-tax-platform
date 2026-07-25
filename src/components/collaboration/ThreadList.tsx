import { MessageSquare, FileText, Hash, AlertCircle } from 'lucide-react';
import type { Thread, ThreadCategory } from '@/types';

interface ThreadListProps {
  threads: Thread[];
  selectedThreadId: string | null;
  onSelectThread: (threadId: string) => void;
}

const categoryConfig: Record<ThreadCategory, { icon: typeof FileText; label: string; color: string }> = {
  document: { icon: FileText, label: 'Document', color: 'text-blue-600 bg-blue-50' },
  field: { icon: Hash, label: 'Field', color: 'text-purple-600 bg-purple-50' },
  general: { icon: MessageSquare, label: 'General', color: 'text-gray-600 bg-gray-100' },
};

export function ThreadList({ threads, selectedThreadId, onSelectThread }: ThreadListProps) {
  // Group threads by category
  const grouped = groupByCategory(threads);

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-800">Conversations</h2>
        <p className="text-xs text-gray-500 mt-0.5">{threads.length} threads</p>
      </div>

      <div className="flex-1 overflow-auto">
        {(['document', 'field', 'general'] as ThreadCategory[]).map((category) => {
          const items = grouped[category];
          if (!items || items.length === 0) return null;
          const config = categoryConfig[category];
          const Icon = config.icon;

          return (
            <div key={category} className="border-b border-gray-100">
              <div className="px-4 py-2 flex items-center gap-2">
                <Icon size={12} className="text-gray-400" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {config.label}
                </span>
                <span className="text-xs text-gray-400">({items.length})</span>
              </div>
              {items.map((thread) => (
                <ThreadRow
                  key={thread.id}
                  thread={thread}
                  isSelected={thread.id === selectedThreadId}
                  onSelect={() => onSelectThread(thread.id)}
                  category={category}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ThreadRow({
  thread,
  isSelected,
  onSelect,
  category,
}: {
  thread: Thread;
  isSelected: boolean;
  onSelect: () => void;
  category: ThreadCategory;
}) {
  const config = categoryConfig[category];
  const lastMessage = thread.messages[thread.messages.length - 1];
  const preview = lastMessage
    ? lastMessage.content.length > 120
      ? lastMessage.content.slice(0, 120) + '…'
      : lastMessage.content
    : '';

  return (
    <button
      onClick={onSelect}
      className={`
        w-full text-left px-4 py-3 transition-colors border-l-4
        hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-primary-500
        ${isSelected ? 'bg-primary-50 border-l-primary-500' : 'border-l-transparent'}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900 truncate">{thread.title}</p>
            {thread.unreadCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-primary-500 rounded-full">
                {thread.unreadCount}
              </span>
            )}
          </div>
          <p className={`text-xs mt-0.5 ${config.color} inline-flex items-center gap-1 px-1.5 py-0.5 rounded`}>
            {thread.contextLabel}
          </p>
          {preview && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{preview}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-xs text-gray-400">
            {formatRelativeTime(thread.lastActivityAt)}
          </span>
          {thread.openActionItemCount > 0 && (
            <span className="inline-flex items-center gap-0.5 text-xs text-amber-600">
              <AlertCircle size={10} />
              {thread.openActionItemCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function groupByCategory(threads: Thread[]): Record<ThreadCategory, Thread[]> {
  const groups: Record<ThreadCategory, Thread[]> = { document: [], field: [], general: [] };
  for (const thread of threads) {
    groups[thread.category].push(thread);
  }
  // Sort each group by most recent activity
  for (const key of Object.keys(groups) as ThreadCategory[]) {
    groups[key].sort((a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime());
  }
  return groups;
}

function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
