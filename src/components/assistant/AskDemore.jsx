import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Loader2, MessageSquare, Send, X } from 'lucide-react';

const QUICK = ['What does Demore build?', 'Can you improve my current website?', 'How does the Lead Engine work?'];

export default function AskDemore() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Ask Demore here. Tell me what your business needs, and I will point you to the service that fits or start a website comparison.',
    },
  ]);
  const [busy, setBusy] = useState(false);
  const { pathname } = useLocation();

  async function send(text) {
    const question = (text ?? input).trim();
    if (!question || busy) return;
    const next = [...messages, { role: 'user', content: question }];
    setMessages(next);
    setInput('');
    setBusy(true);
    try {
      const response = await base44.functions.invoke('askDemore', { messages: next, page: pathname });
      setMessages([...next, { role: 'assistant', content: response.data?.reply || 'I could not answer that one. Email Ryan and he will help.' }]);
    } catch (err) {
      setMessages([
        ...next,
        {
          role: 'assistant',
          content: 'The assistant is unavailable right now. You can email ryan@demoretechnologysolutions.com or file a brief.',
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-volt px-4 py-3 text-sm font-semibold text-ink shadow-lg transition-transform hover:-translate-y-0.5"
        >
          <MessageSquare size={16} />
          Ask Demore
        </button>
      )}

      {open && (
        <div className="fixed bottom-4 right-4 z-50 flex h-[min(560px,80vh)] w-[min(380px,92vw)] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div>
              <p className="font-display text-sm font-bold">Ask Demore</p>
              <p className="text-[11px] text-faint">AI-assisted answers about your website and system</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant" className="rounded-full border border-line p-1.5 text-muted-foreground hover:text-foreground">
              <X size={15} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'ml-auto bg-volt text-ink'
                    : 'border border-line bg-ink text-foreground/90'
                }`}
              >
                {message.content}
              </div>
            ))}
            {busy && (
              <div className="inline-flex items-center gap-2 text-xs text-faint">
                <Loader2 size={13} className="animate-spin" />
                Thinking
              </div>
            )}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => send(question)}
                    className="rounded-full border border-line px-3 py-1.5 text-xs text-muted-foreground hover:border-volt hover:text-volt"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              send();
            }}
            className="border-t border-line p-3"
          >
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about your website or system"
                className="h-10 flex-1 rounded-full border border-line bg-ink px-3.5 text-sm outline-none focus:border-volt"
              />
              <button type="submit" disabled={busy} aria-label="Send" className="rounded-full bg-volt p-2.5 text-ink disabled:opacity-50">
                <Send size={15} />
              </button>
            </div>
            <p className="mt-2 px-1 text-[10px] text-faint">
              Answers are AI-assisted. For a real audit, <Link to="/compare" className="text-volt underline underline-offset-2">run the free comparison</Link>.
            </p>
          </form>
        </div>
      )}
    </>
  );
}