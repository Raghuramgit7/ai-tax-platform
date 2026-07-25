import { useState } from 'react';
import { CheckCircle, Circle, Calendar, Link2, ClipboardList } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { actionItems as initialActionItems } from '@/mocks/data/actionItems';
import { threads } from '@/mocks/data/threads';
import type { ActionItem } from '@/types';

export function ActionItemsView() {
  const { currentUser } = useAppStore();
  const [items, setItems] = useState<ActionItem[]>(initialActionItems);

  const openItems = items.filter((i) => i.status === 'open');
  const completedItems = items.filter((i) => i.status === 'completed');

  // For client: show "Your Action Items" prominently
  const isClient = currentUser.role === 'client';
  const myOpenItems = openItems.filter((i) => i.ownerId === currentUser.id);
  const otherOpenItems = openItems.filter((i) => i.ownerId !== currentUser.id);

  const handleComplete = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: 'completed' as const,
              completedAt: new Date().toISOString(),
              completedBy: currentUser.name,
            }
          : item
      )
    );
  };

  return (
    <div className="h-full overflow-auto bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Action Items</h1>
        <p className="text-sm text-gray-500 mb-6">
          {openItems.length} open · {completedItems.length} completed
        </p>

        {/* Client landing: their items prominently first */}
        {isClient && myOpenItems.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-2">
              <ClipboardList size={14} className="text-primary-600" />
              Your Action Items
            </h2>
            <div className="space-y-3">
              {myOpenItems.map((item) => (
                <ActionItemCard
                  key={item.id}
                  item={item}
                  onComplete={handleComplete}
                />
              ))}
            </div>
          </section>
        )}

        {/* Open items grouped by owner */}
        {!isClient && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">
              Open ({openItems.length})
            </h2>
            {groupByOwner(openItems).map(({ ownerName, items: ownerItems }) => (
              <div key={ownerName} className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2 pl-1">
                  {ownerName} ({ownerItems.length})
                </p>
                <div className="space-y-3">
                  {ownerItems.map((item) => (
                    <ActionItemCard
                      key={item.id}
                      item={item}
                      onComplete={handleComplete}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* For client: other items (CPA's items) */}
        {isClient && otherOpenItems.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Assigned to CPA ({otherOpenItems.length})
            </h2>
            <div className="space-y-3">
              {otherOpenItems.map((item) => (
                <ActionItemCard
                  key={item.id}
                  item={item}
                  onComplete={handleComplete}
                  readOnly
                />
              ))}
            </div>
          </section>
        )}

        {/* Completed section */}
        {completedItems.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Completed ({completedItems.length})
            </h2>
            <div className="space-y-3 opacity-60">
              {completedItems.map((item) => (
                <ActionItemCard key={item.id} item={item} completed />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ActionItemCard({
  item,
  onComplete,
  completed,
  readOnly,
}: {
  item: ActionItem;
  onComplete?: (id: string) => void;
  completed?: boolean;
  readOnly?: boolean;
}) {
  const thread = threads.find((t) => t.id === item.threadId);

  return (
    <div className={`bg-white rounded-lg border p-4 ${completed ? 'border-gray-200' : 'border-gray-200 shadow-sm'}`}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        {!completed && !readOnly && onComplete ? (
          <button
            onClick={() => onComplete(item.id)}
            className="mt-0.5 text-gray-300 hover:text-status-traced transition-colors focus-visible:outline-2 focus-visible:outline-primary-500"
            aria-label="Mark as complete"
          >
            <Circle size={20} />
          </button>
        ) : completed ? (
          <CheckCircle size={20} className="mt-0.5 text-status-traced flex-shrink-0" />
        ) : (
          <Circle size={20} className="mt-0.5 text-gray-200 flex-shrink-0" />
        )}

        <div className="flex-1 min-w-0">
          <p className={`text-sm ${completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {item.description}
          </p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-xs text-gray-500">
              Owner: <span className="font-medium">{item.ownerName}</span>
            </span>
            {item.dueDate && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <Calendar size={10} />
                Due {formatDate(item.dueDate)}
              </span>
            )}
            {thread && (
              <span className="inline-flex items-center gap-1 text-xs text-primary-600">
                <Link2 size={10} />
                {thread.title}
              </span>
            )}
          </div>
          {completed && item.completedAt && (
            <p className="text-xs text-gray-400 mt-1">
              Completed {formatDate(item.completedAt)} by {item.completedBy}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function groupByOwner(items: ActionItem[]): { ownerName: string; items: ActionItem[] }[] {
  const map = new Map<string, ActionItem[]>();
  for (const item of items) {
    const existing = map.get(item.ownerName) ?? [];
    existing.push(item);
    map.set(item.ownerName, existing);
  }
  return Array.from(map.entries()).map(([ownerName, items]) => ({ ownerName, items }));
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
