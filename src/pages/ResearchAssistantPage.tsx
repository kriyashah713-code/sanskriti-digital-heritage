import React, { useState, useRef, useEffect } from 'react';
import { PageId } from '../components/Header';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  Compass,
  ArrowRight,
  BookOpen,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';

interface ResearchAssistantPageProps {
  onNavigate: (page: PageId, monumentId?: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isError?: boolean;
}

export const ResearchAssistantPage: React.FC<ResearchAssistantPageProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Welcome to the Sanskriti Heritage Research Scholar desk. I am an AI research assistant specialised in Indian temple architecture, lithic engineering, epigraphy, archaeo-astronomy, and conservation history.

You can ask me questions about the six core monuments (Rani ki Vav, Taj Mahal, Hampi, Konark Sun Temple, Ajanta Caves, Modhera Sun Temple), or explore broader architectural styles like Maru-Gurjara, Dravidian, Kalinga, and rock-cut traditions.`,
      timestamp: 'Just now',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sampleQuestions = [
    'How do the 24 wheels of Konark function as precise astronomical sundials?',
    'Explain the subterranean hydro-engineering and Vishnu iconography of Rani ki Vav.',
    'What acoustic engineering makes the granite musical pillars of Hampi ring with notes?',
    'How does Modhera Sun Temple align with the sun rays on the equinox?',
    'What mineral pigments and binders were used in the Ajanta Caves tempera murals?',
    'How do the timber well caisson foundations of the Taj Mahal remain stable?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) {
      setInputPrompt('');
    }
    setIsLoading(true);

    try {
      // Build conversation history for server-side Gemini
      const history = messages
        .filter((m) => !m.isError && m.id !== 'welcome')
        .map((m) => ({
          role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
          parts: [{ text: m.text }],
        }));

      const res = await fetch('/api/gemini/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          history,
        }),
      });

      const data = await res.json();

      if (data.success && data.text) {
        const assistantMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Genuine server error / key missing notification without fake response
        const errorMessage: ChatMessage = {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          isError: true,
          text:
            data.message ||
            'Unable to contact the server-side Gemini research engine. Please ensure your GEMINI_API_KEY is configured in the AI Studio Secrets panel.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        isError: true,
        text: `Network communication failure: ${err.message || 'Unable to reach the research endpoint.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#09110d] text-[#f7f3eb] py-8 px-6 flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col space-y-6">
        {/* Header */}
        <div className="border-b border-[#c5a059]/15 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#c5a059] uppercase">
              <span>Gemini 3.8 Flash Powered</span>
              <span aria-hidden="true">·</span>
              <span>Scholarly Architectural Inquiries</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-[#f7f3eb]">
              AI Heritage Research Scholar
            </h1>
          </div>

          <div className="inline-flex items-center gap-2 text-xs text-[#9eb0a5] bg-[#101b15] px-3 py-1.5 rounded-sm border border-[#c5a059]/20">
            <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
            <span>Zero Fake AI Responses Guarantee</span>
          </div>
        </div>

        {/* Chat History Container */}
        <div className="flex-1 bg-[#0c1611] border border-[#c5a059]/20 rounded-sm p-6 overflow-y-auto min-h-[460px] max-h-[620px] space-y-6 shadow-inner">
          {messages.map((message) => {
            const isUser = message.sender === 'user';
            return (
              <div
                key={message.id}
                className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-sm bg-[#c5a059]/20 border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-sm p-4 space-y-2 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#182920] border border-[#c5a059]/30 text-[#f7f3eb]'
                      : message.isError
                      ? 'bg-amber-950/40 border border-amber-600/30 text-amber-200'
                      : 'bg-[#101b15] border border-[#c5a059]/15 text-[#dbe6df]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-[#7d9084] pb-1 border-b border-white/5">
                    <span className="font-semibold text-[#c5a059]">
                      {isUser ? 'Visiting Scholar' : 'Sanskriti Research Engine'}
                    </span>
                    <span>{message.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-line font-editorial text-base sm:text-lg">
                    {message.text}
                  </div>

                  {!isUser && !message.isError && (
                    <div className="pt-2 flex items-center justify-end">
                      <button
                        onClick={() => handleCopy(message.id, message.text)}
                        className="inline-flex items-center gap-1 text-[11px] text-[#889a8f] hover:text-[#c5a059] transition-colors cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === message.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Monograph</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-sm bg-[#16251e] border border-white/10 flex items-center justify-center text-[#c7d5cd] shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3.5 justify-start items-center">
              <div className="w-8 h-8 rounded-sm bg-[#c5a059]/20 border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-[#101b15] border border-[#c5a059]/20 p-3.5 rounded-sm text-xs text-[#c5a059] flex items-center gap-2">
                <span>Synthesising historical epigraphy and architectural treatise...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Research Prompts */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-[#9eb0a5]">
            <BookOpen className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Select a curated architectural inquiry or type your own:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="text-[11px] text-[#c5cfc8] bg-[#101b15] hover:bg-[#16271e] hover:text-[#f7f3eb] border border-[#c5a059]/20 hover:border-[#c5a059]/50 px-3 py-1.5 rounded-xs transition-colors cursor-pointer text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask about dynasties, stone masonry joinery, astronomical orientations, or conservation..."
            disabled={isLoading}
            className="w-full bg-[#101b15] border border-[#c5a059]/30 focus:border-[#c5a059] text-sm text-[#f7f3eb] placeholder-[#7d8f84] pl-4 pr-24 py-3.5 rounded-sm outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className={`absolute right-2 px-4 py-2 rounded-xs font-semibold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              isLoading || !inputPrompt.trim()
                ? 'bg-[#18261e] text-[#55665c] cursor-not-allowed'
                : 'bg-[#c5a059] hover:bg-[#d8b56d] text-[#09110d] cursor-pointer'
            }`}
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
