/**
 * Dr. Aria — AI Medical Chatbot
 * Floating Hinglish symptom-checker that detects probable disease
 * and guides users to the right prediction module.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bot, X, Send, Stethoscope, AlertTriangle, Activity,
  Loader2, MessageCircle, Sparkles, ArrowRight, Heart,
  ChevronDown
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  detected_disease?: string | null;
  suggest_report?: boolean;
  suggest_disease_tab?: string | null;
  urgency?: string;
  quick_replies?: string[];
}

interface AIChatbotProps {
  onSuggestDisease?: (disease: string) => void;
}

const DISEASE_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  heart:    { label: 'Heart',    emoji: '❤️',  color: 'text-red-600 bg-red-50 border-red-200' },
  diabetes: { label: 'Diabetes', emoji: '🩸',  color: 'text-amber-700 bg-amber-50 border-amber-200' },
  kidney:   { label: 'Kidney',   emoji: '🫘',  color: 'text-blue-600 bg-blue-50 border-blue-200' },
  liver:    { label: 'Liver',    emoji: '🫁',  color: 'text-orange-600 bg-orange-50 border-orange-200' },
  stroke:   { label: 'Stroke',   emoji: '🧠',  color: 'text-purple-600 bg-purple-50 border-purple-200' },
  other:    { label: 'Other',    emoji: '🏥',  color: 'text-gray-600 bg-gray-50 border-gray-200' },
};

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: 'Namaste! 🙏 Main Dr. Aria hoon, aapka AI Health Assistant.\n\nKoi bhi takleef ho — pet dard, bukhar, thakan, chest pain, sugar concern, ya kuch bhi — mujhe seedha batayein. Main samjhunga aur best guidance dunga.\n\n⚠️ Emergency (accident/behoshi) mein turant 108 call karein.',
  timestamp: new Date(),
  urgency: 'normal',
  quick_replies: [
    'Pet dard ho raha hai 🤢',
    'Bukhar aa raha hai 🌡️',
    'Chest mein dard ya pressure 💔',
    'Bahut thakan ho rahi hai 😴',
    'Sugar / Diabetes concern hai 🩸',
    'Kuch aur problem hai 🏥',
  ],
};

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export function AIChatbot({ onSuggestDisease }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedDisease, setDetectedDisease] = useState<string | null>(null);
  const [sessionId] = useState(() => generateId());
  const [hasUnread, setHasUnread] = useState(false);
  const [pulseActive, setPulseActive] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pulse animation every 4s on closed button
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setPulseActive(p => !p);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build history for API (last 8 messages)
      const history = [...messages, userMsg]
        .slice(-8)
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/ai/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, sessionId }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        const d = data.data;

        // Normalize urgency — Gemini might return old format ('Low','High','Emergency')
        const normalizeUrgency = (u: string): string => {
          if (!u) return 'normal';
          const lower = u.toLowerCase();
          if (lower === 'emergency' || lower === 'high') return 'emergency';
          if (lower === 'urgent' || lower === 'moderate') return 'urgent';
          return 'normal';
        };

        const botMsg: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: d.reply,
          timestamp: new Date(),
          detected_disease: d.detected_disease,
          suggest_report: d.suggest_report,
          suggest_disease_tab: d.suggest_disease_tab,
          urgency: normalizeUrgency(d.urgency),
          quick_replies: d.quick_replies || [],
        };
        setMessages(prev => [...prev, botMsg]);

        if (d.detected_disease && d.detected_disease !== 'other') {
          setDetectedDisease(d.detected_disease);
        } else if (d.detected_disease === 'other') {
          setDetectedDisease('other');
        }

        if (!isOpen) setHasUnread(true);
      }
    } catch {
      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'assistant',
        content: 'Maafi chahta hoon, abhi connection mein thodi problem hai. Please thodi der baad try karein. 🙏',
        timestamp: new Date(),
        urgency: 'normal',
        quick_replies: ['Dobara try karein', 'Seedha report upload karein'],
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, isOpen, sessionId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  const diseaseInfo = detectedDisease ? DISEASE_LABELS[detectedDisease] : null;

  return (
    <>
      {/* ── Floating Trigger Button ─────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {/* Tooltip when closed */}
        {!isOpen && (
          <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full shadow-lg animate-bounce-slow whitespace-nowrap">
            Dr. Aria — AI Medical Assistant 🩺
          </div>
        )}

        <button
          onClick={() => setIsOpen(o => !o)}
          className="relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            background: isOpen
              ? '#dc2626'
              : 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
          }}
          aria-label="Open Dr. Aria AI Chatbot"
        >
          {/* Pulse ring */}
          {!isOpen && (
            <span
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: 'rgba(5,150,105,0.3)' }}
            />
          )}

          {hasUnread && !isOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              1
            </span>
          )}

          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Stethoscope className="w-7 h-7 text-white" />
          )}
        </button>
      </div>

      {/* ── Chat Panel ─────────────────────────────────────────── */}
      <div
        className="fixed bottom-24 right-6 z-50 flex flex-col transition-all duration-300 origin-bottom-right"
        style={{
          width: 'min(380px, calc(100vw - 24px))',
          height: '540px',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)',
          pointerEvents: isOpen ? 'auto' : 'none',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.18)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{ background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Dr. Aria</span>
                <span className="text-xs bg-white/20 text-white px-1.5 py-0.5 rounded-full">AI</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                <span className="text-white/80 text-xs">Medical Assistant • Online</span>
              </div>
            </div>
          </div>

          {/* Detected disease badge */}
          {diseaseInfo && (
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border font-semibold bg-white/90 ${diseaseInfo.color}`}>
              <span>{diseaseInfo.emoji}</span>
              <span>{diseaseInfo.label}</span>
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div
          className="flex-1 overflow-y-auto p-3 space-y-3"
          style={{ background: '#f8fafc' }}
        >
          {messages.map((msg) => (
            <div key={msg.id}>
              {/* Message bubble */}
              <div className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mb-1">
                    <span className="text-sm">🩺</span>
                  </div>
                )}
                <div
                  className="max-w-[80%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={{
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #059669, #0d9488)'
                      : 'white',
                    color: msg.role === 'user' ? 'white' : '#1e293b',
                    borderRadius: msg.role === 'user'
                      ? '18px 18px 4px 18px'
                      : '18px 18px 18px 4px',
                    boxShadow: msg.role === 'assistant' ? '0 1px 6px rgba(0,0,0,0.08)' : 'none',
                    border: msg.role === 'assistant' ? '1px solid #e2e8f0' : 'none',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {msg.content}
                </div>
              </div>
              <div className={`text-xs text-gray-400 mt-0.5 ${msg.role === 'user' ? 'text-right mr-2' : 'text-left ml-9'}`}>
                {formatTime(msg.timestamp)}
              </div>

              {/* Emergency Alert Card */}
              {msg.urgency === 'emergency' && (
                <div className="ml-9 mt-2 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-700 font-bold text-xs">🚨 EMERGENCY ALERT</p>
                    <p className="text-red-600 text-xs mt-0.5">Turant nazdiki hospital emergency ya ambulance (102) call karein!</p>
                  </div>
                </div>
              )}

              {/* Urgent Warning */}
              {msg.urgency === 'urgent' && (
                <div className="ml-9 mt-2 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-amber-700 text-xs font-medium">⚠️ Aaj hi doctor se milna zaroori hai. Ignore na karein.</p>
                </div>
              )}

              {/* Suggest Report Card */}
              {msg.suggest_report && msg.suggest_disease_tab && msg.suggest_disease_tab !== 'other' && (
                <div className="ml-9 mt-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold text-xs">Lab Report Upload Karein</span>
                  </div>
                  <p className="text-emerald-600 text-xs mb-2.5">
                    {DISEASE_LABELS[msg.suggest_disease_tab]?.emoji} {DISEASE_LABELS[msg.suggest_disease_tab]?.label} Disease ke liye aapki lab report analyse kar sakte hain.
                  </p>
                  <button
                    onClick={() => {
                      onSuggestDisease?.(msg.suggest_disease_tab!);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                  >
                    <span>{DISEASE_LABELS[msg.suggest_disease_tab]?.label} Report Upload Karein</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Other disease card */}
              {msg.suggest_disease_tab === 'other' && (
                <div className="ml-9 mt-2 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
                  <span className="text-lg">🏥</span>
                  <div>
                    <p className="text-blue-700 font-semibold text-xs">General Physician se Milein</p>
                    <p className="text-blue-600 text-xs mt-0.5">Yeh condition humari 5 disease models se alag ho sakti hai. Qualified doctor se thorough checkup karwayein.</p>
                  </div>
                </div>
              )}

              {/* Quick Reply Chips */}
              {msg.quick_replies && msg.quick_replies.length > 0 && msg.id === messages[messages.length - 1]?.id && !isLoading && (
                <div className="ml-9 mt-2 flex flex-wrap gap-1.5">
                  {msg.quick_replies.map((qr, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(qr)}
                      className="text-xs bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 px-2.5 py-1.5 rounded-full transition-all duration-200 font-medium"
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <span className="text-sm">🩺</span>
              </div>
              <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-emerald-400"
                      style={{
                        animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="shrink-0 bg-white border-t border-slate-100 p-3">
          <div className="flex items-center gap-2 bg-slate-50 rounded-2xl px-3 py-2 border border-slate-200 focus-within:border-emerald-400 focus-within:bg-white transition-all">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Apni takleef batayein..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage(inputText)}
              disabled={!inputText.trim() || isLoading}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: inputText.trim() && !isLoading
                  ? 'linear-gradient(135deg, #059669, #0d9488)'
                  : '#e2e8f0',
              }}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 text-white" />
              )}
            </button>
          </div>
          <p className="text-center text-gray-400 text-[10px] mt-1.5">
            AI assistant — doctor ki jagah nahi hai 🩺
          </p>
        </div>
      </div>

      {/* Bounce animation styles */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
      `}</style>
    </>
  );
}
