import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { getFishById } from '../data/fishDatabase';
import { getPlantById } from '../data/plantDatabase';
import { calculateTankHealthScore } from '../utils/parameterRanges';
import { ChatMessage } from '../types';
import {
  SparklesIcon,
  PaperAirplaneIcon,
  Cog6ToothIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';

const SUGGESTED_QUESTIONS = [
  "What's the current health status of my tanks?",
  "Which of my tanks needs attention right now?",
  "What fish can I add to my freshwater tank?",
  "How do I lower ammonia levels safely?",
  "What's a good feeding schedule for community fish?",
  "Explain the nitrogen cycle for beginners",
];

function buildTankContext(
  tanks: ReturnType<typeof useStore.getState>['tanks'],
  getLatestReading: ReturnType<typeof useStore.getState>['getLatestReading'],
  getTankReadings: ReturnType<typeof useStore.getState>['getTankReadings'],
  getTankTasks: ReturnType<typeof useStore.getState>['getTankTasks'],
  fishInstances: ReturnType<typeof useStore.getState>['fishInstances'],
) {
  if (tanks.length === 0) return 'The user has no tanks set up yet.';

  return tanks.map((tank) => {
    const latestReading = getLatestReading(tank.id);
    const readings = getTankReadings(tank.id);
    const tasks = getTankTasks(tank.id);
    const instances = fishInstances.filter((f) => f.tankId === tank.id);
    const fish = tank.fishIds.map(getFishById).filter(Boolean);
    const plants = tank.plantIds.map(getPlantById).filter(Boolean);

    const healthScore = latestReading
      ? calculateTankHealthScore(
          Object.fromEntries(
            ['ph','ammonia','nitrite','nitrate','temperature','salinity','gh','kh','phosphate','dissolvedOxygen']
              .map((k) => [k, (latestReading as unknown as Record<string,unknown>)[k] as number])
              .filter(([, v]) => v !== undefined)
          ),
          tank.type
        )
      : null;

    const paramSummary = latestReading
      ? Object.entries(latestReading)
          .filter(([k]) => !['id','tankId','timestamp','notes'].includes(k) && latestReading[k as keyof typeof latestReading] !== undefined)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ')
      : 'No readings logged yet';

    const overdueTasks = tasks.filter((t) => new Date(t.nextDue) < new Date());
    const fishInstanceSummary = instances.length > 0
      ? instances.map((i) => {
          const species = getFishById(i.speciesId);
          return `${i.nickname || species?.name || 'Unknown'} (${i.healthStatus})`;
        }).join(', ')
      : 'No individual fish tracked';

    return `Tank: "${tank.name}" (${tank.type}, ${tank.volume} ${tank.volumeUnit})
- Health score: ${healthScore !== null ? healthScore + '/100' : 'N/A'}
- Latest parameters: ${paramSummary}
- Total readings: ${readings.length}
- Species in tank: ${fish.map((f) => f?.name).join(', ') || 'None'}
- Plants: ${plants.map((p) => p?.name).join(', ') || 'None'}
- Individual fish tracked: ${fishInstanceSummary}
- Maintenance tasks: ${tasks.length} total, ${overdueTasks.length} overdue`;
  }).join('\n\n');
}

export default function AIAdvisor() {
  const tanks = useStore((s) => s.tanks);
  const getLatestReading = useStore((s) => s.getLatestReading);
  const getTankReadings = useStore((s) => s.getTankReadings);
  const getTankTasks = useStore((s) => s.getTankTasks);
  const fishInstances = useStore((s) => s.fishInstances);
  const anthropicApiKey = useStore((s) => s.anthropicApiKey);
  const setApiKey = useStore((s) => s.setApiKey);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyDraft, setApiKeyDraft] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const content = (text || input).trim();
    if (!content || isStreaming) return;
    if (!anthropicApiKey) {
      setShowApiKeyInput(true);
      return;
    }

    setError('');
    setInput('');

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    const assistantId = uuidv4();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', timestamp: new Date().toISOString() },
    ]);

    try {
      const tankContext = buildTankContext(tanks, getLatestReading, getTankReadings, getTankTasks, fishInstances);
      const systemPrompt = `You are AquaAdvisor, an expert aquarium assistant with deep knowledge of fishkeeping, water chemistry, fish health, plant care, and aquarium maintenance.

The user's current aquarium data:
${tankContext}

Guidelines:
- Be concise and practical. Lead with actionable advice.
- Reference specific tank names and parameters when relevant.
- If parameters are out of range, prioritize that in your response.
- Use plain language, no excessive jargon.
- For health emergencies, urge immediate action.`;

      const conversationMessages = messages
        .filter((m) => m.content)
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));
      conversationMessages.push({ role: 'user', content });

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicApiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-opus-4-6',
          max_tokens: 1024,
          stream: true,
          system: systemPrompt,
          messages: conversationMessages,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error((errData as { error?: { message?: string } }).error?.message || `API error ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const event = JSON.parse(data);
            if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
              fullText += event.delta.text;
              setMessages((prev) =>
                prev.map((m) => m.id === assistantId ? { ...m, content: fullText } : m)
              );
            }
          } catch {
            // skip malformed events
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setError(msg);
      setMessages((prev) => prev.filter((m) => m.id !== assistantId || m.content));
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSaveApiKey = () => {
    setApiKey(apiKeyDraft.trim());
    setShowApiKeyInput(false);
    setApiKeyDraft('');
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
          <SparklesIcon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-slate-900">AI Advisor</h1>
          <p className="text-xs text-slate-400">Powered by Claude · Knows your tanks</p>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="text-slate-400 hover:text-slate-600 transition-colors p-2"
              title="Clear chat"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              anthropicApiKey
                ? 'text-emerald-500 hover:bg-emerald-50'
                : 'text-slate-400 hover:bg-slate-100'
            )}
            title="Configure API key"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* API Key Setup */}
      {showApiKeyInput && (
        <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-4 shrink-0">
          <p className="text-sm font-semibold text-indigo-800 mb-2">Anthropic API Key</p>
          <p className="text-xs text-indigo-600 mb-3">
            Get your key at{' '}
            <span className="font-mono">console.anthropic.com</span>. Stored locally only.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKeyDraft}
              onChange={(e) => setApiKeyDraft(e.target.value)}
              placeholder={anthropicApiKey ? '••••••••••••••••' : 'sk-ant-...'}
              className="flex-1 text-sm border border-indigo-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveApiKey()}
            />
            <button onClick={handleSaveApiKey} className="btn-primary text-sm">Save</button>
            {anthropicApiKey && (
              <button
                onClick={() => { setApiKey(''); setShowApiKeyInput(false); }}
                className="btn-secondary text-sm text-red-600 border-red-200 hover:bg-red-50"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-4">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">AquaAdvisor</h2>
            <p className="text-slate-500 text-sm mb-6 max-w-sm">
              Ask me anything about your tanks, water chemistry, fish health, or aquarium care. I have full context about your setup.
            </p>
            {!anthropicApiKey && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 flex items-start gap-2 max-w-sm text-left">
                <ExclamationTriangleIcon className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700">
                  Add your Anthropic API key (click the gear icon above) to start chatting.
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-left text-xs bg-white border border-slate-200 hover:border-violet-300 hover:bg-violet-50 rounded-xl p-3 transition-all text-slate-600 font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={clsx('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                <SparklesIcon className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={clsx(
                'max-w-[80%] rounded-2xl px-4 py-3 text-sm',
                msg.role === 'user'
                  ? 'bg-ocean-500 text-white rounded-br-sm'
                  : 'bg-white border border-slate-100 shadow-sm text-slate-800 rounded-bl-sm'
              )}
            >
              {msg.role === 'assistant' && !msg.content ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              )}
              <p className={clsx(
                'text-[10px] mt-1',
                msg.role === 'user' ? 'text-ocean-100' : 'text-slate-400'
              )}>
                {format(parseISO(msg.timestamp), 'h:mm a')}
              </p>
            </div>
          </div>
        ))}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
            <ExclamationTriangleIcon className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-100 bg-white px-4 py-3 shrink-0">
        {messages.length > 0 && !isStreaming && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
            {SUGGESTED_QUESTIONS.slice(0, 3).map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="shrink-0 text-xs bg-slate-100 hover:bg-violet-100 hover:text-violet-700 text-slate-600 rounded-full px-3 py-1.5 transition-colors whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={anthropicApiKey ? 'Ask about your tanks...' : 'Add API key to start chatting'}
            rows={1}
            disabled={isStreaming || !anthropicApiKey}
            className="flex-1 resize-none text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-400 max-h-32 disabled:bg-slate-50 disabled:text-slate-400"
            style={{ minHeight: '44px' }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isStreaming || !anthropicApiKey}
            className="shrink-0 w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
