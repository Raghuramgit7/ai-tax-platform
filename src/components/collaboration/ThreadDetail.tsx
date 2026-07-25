import { useState } from 'react';
import { Lock, Globe, AlertTriangle, Send } from 'lucide-react';
import type { Thread, Message, MessageMode, UserRole } from '@/types';

interface ThreadDetailProps {
  thread: Thread;
  currentUserRole: UserRole;
  currentUserName: string;
}

export function ThreadDetail({ thread, currentUserRole, currentUserName }: ThreadDetailProps) {
  // Filter messages based on role
  const visibleMessages = currentUserRole === 'cpa'
    ? thread.messages
    : thread.messages.filter((m) => m.mode === 'client_message');

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Thread header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">{thread.title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Context: <span className="font-medium">{thread.contextLabel}</span>
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {visibleMessages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            showModeIndicator={currentUserRole === 'cpa'}
          />
        ))}
      </div>

      {/* Composer */}
      <MessageComposer
        currentUserRole={currentUserRole}
        currentUserName={currentUserName}
        threadId={thread.id}
      />
    </div>
  );
}

function MessageBubble({
  message,
  showModeIndicator,
}: {
  message: Message;
  showModeIndicator: boolean;
}) {
  const isInternal = message.mode === 'internal_note';

  return (
    <div
      className={`
        rounded-lg p-3 max-w-[85%]
        ${isInternal ? 'bg-internal-bg border border-internal-border' : 'bg-gray-50 border border-gray-200'}
        ${message.authorRole === 'cpa' ? 'ml-0' : 'ml-auto'}
      `}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-semibold text-gray-700">{message.authorName}</span>
        {showModeIndicator && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded ${
              isInternal ? 'text-amber-700 bg-amber-100' : 'text-green-700 bg-green-100'
            }`}
          >
            {isInternal ? <Lock size={10} /> : <Globe size={10} />}
            {isInternal ? 'Internal' : 'Client'}
          </span>
        )}
        <span className="text-xs text-gray-400 ml-auto">
          {formatTime(message.createdAt)}
        </span>
      </div>
      <p className="text-sm text-gray-800">{message.content}</p>
    </div>
  );
}

function MessageComposer({
  currentUserRole,
  currentUserName,
  threadId,
}: {
  currentUserRole: UserRole;
  currentUserName: string;
  threadId: string;
}) {
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<MessageMode>(
    currentUserRole === 'cpa' ? 'internal_note' : 'client_message'
  );
  const [showConfirm, setShowConfirm] = useState(false);

  const canSwitchMode = currentUserRole === 'cpa';
  const isInternal = mode === 'internal_note';

  const handleModeSwitch = () => {
    if (mode === 'internal_note') {
      // Switching to client message — show confirmation
      setShowConfirm(true);
    } else {
      // Switching back to internal — no confirmation needed
      setMode('internal_note');
    }
  };

  const confirmSwitch = () => {
    setMode('client_message');
    setShowConfirm(false);
  };

  const cancelSwitch = () => {
    setShowConfirm(false);
  };

  const handleSend = () => {
    if (!content.trim()) return;
    // In a real app, this would add the message to the store
    console.log('Send message:', { threadId, content, mode, author: currentUserName });
    setContent('');
  };

  return (
    <div className={`border-t-2 ${isInternal ? 'border-internal-border bg-internal-bg' : 'border-gray-200 bg-white'} p-3`}>
      {/* Confirmation dialog */}
      {showConfirm && (
        <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">Switch to client-visible message?</p>
              <p className="text-xs text-amber-700 mt-0.5">This message will be visible to the client.</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={confirmSwitch}
                  className="px-3 py-1 text-xs font-medium bg-amber-600 text-white rounded hover:bg-amber-700"
                >
                  Yes, switch
                </button>
                <button
                  onClick={cancelSwitch}
                  className="px-3 py-1 text-xs font-medium text-amber-700 bg-white border border-amber-300 rounded hover:bg-amber-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode indicator + toggle */}
      <div className="flex items-center justify-between mb-2">
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${
          isInternal ? 'text-amber-700 bg-amber-100' : 'text-green-700 bg-green-100'
        }`}>
          {isInternal ? <Lock size={12} /> : <Globe size={12} />}
          {isInternal ? 'Internal Note' : 'Client Message'}
        </span>
        {canSwitchMode && (
          <button
            onClick={handleModeSwitch}
            className="text-xs text-primary-600 hover:text-primary-800 font-medium"
          >
            Switch to {isInternal ? 'Client' : 'Internal'}
          </button>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isInternal ? 'Write an internal note...' : 'Write a message to client...'}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-2 focus:outline-primary-500 focus:border-primary-500"
        />
        <button
          onClick={handleSend}
          disabled={!content.trim()}
          className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
