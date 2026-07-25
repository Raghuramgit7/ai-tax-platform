import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { ThreadList } from '@/components/collaboration/ThreadList';
import { ThreadDetail } from '@/components/collaboration/ThreadDetail';
import { useAppStore } from '@/stores/appStore';
import { threads } from '@/mocks/data/threads';

export function CollaborationView() {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const { currentUser } = useAppStore();

  const selectedThread = threads.find((t) => t.id === selectedThreadId) ?? null;

  return (
    <div className="h-full flex">
      {/* Thread list - left side */}
      <div className="w-80 flex-shrink-0">
        <ThreadList
          threads={threads}
          selectedThreadId={selectedThreadId}
          onSelectThread={setSelectedThreadId}
        />
      </div>

      {/* Thread detail - right side */}
      <div className="flex-1">
        {selectedThread ? (
          <ThreadDetail
            thread={selectedThread}
            currentUserRole={currentUser.role}
            currentUserName={currentUser.name}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-400">
              <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">Select a conversation</p>
              <p className="text-xs mt-1">Choose a thread to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
