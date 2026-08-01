/**
 * Chat Example
 *
 * Demonstrates SmartState in a messaging UI:
 * - Loading while fetching message history
 * - Error if the request fails
 * - Empty state for a new conversation
 * - Offline detection via navigator.onLine
 */

import { useState, useEffect, useRef } from 'react';
import { SmartState } from '@libster/smart-state';
import '@libster/smart-state/styles';

interface Message {
  id: number;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
}

function MessageList({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          style={{
            alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
            background: msg.sender === 'me' ? '#6366f1' : '#f3f4f6',
            color: msg.sender === 'me' ? '#fff' : '#111827',
            padding: '0.5rem 1rem',
            borderRadius: '1rem',
            maxWidth: '70%',
          }}
        >
          <p style={{ margin: 0 }}>{msg.text}</p>
          <small style={{ opacity: 0.65, fontSize: '0.7rem' }}>{msg.timestamp}</small>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export function ChatWindow({ conversationId }: { conversationId: number }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/conversations/${conversationId}/messages`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Message[]>;
      })
      .then(setMessages)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err : new Error('Failed to load messages'))
      )
      .finally(() => setLoading(false));
  }, [conversationId]);

  const handleSend = () => {
    if (!draft.trim() || offline) return;
    const next: Message = {
      id: Date.now(),
      sender: 'me',
      text: draft.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, next]);
    setDraft('');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '600px',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e5e7eb', fontWeight: 600 }}>
        Conversation #{conversationId}
      </div>

      <SmartState<Message[]>
        loading={loading}
        error={error}
        offline={offline}
        data={messages}
        isEmpty={(msgs) => msgs.length === 0}
        emptyComponent={
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
            }}
          >
            <p>No messages yet. Say hello! 👋</p>
          </div>
        }
      >
        <MessageList messages={messages} />
      </SmartState>

      <div
        style={{
          padding: '0.75rem',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: '0.5rem',
        }}
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={offline ? 'You are offline…' : 'Type a message…'}
          disabled={offline}
          aria-label="Message input"
          style={{
            flex: 1,
            padding: '0.5rem 0.75rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            outline: 'none',
          }}
        />
        <button
          onClick={handleSend}
          disabled={offline || !draft.trim()}
          style={{
            padding: '0.5rem 1rem',
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            opacity: offline || !draft.trim() ? 0.5 : 1,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
