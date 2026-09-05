'use client';

import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, AlertCircle, Loader2 } from 'lucide-react';

export default function AIAssistantModal({
  isOpen,
  onClose,
  targetCurrency = 'USD',
  baseCurrency = 'MMK',
  currentRate = 4595
}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm your **SuperRich AI Market Advisor** powered by **Qwen 3.8-27B**.
How can I assist you with **${targetCurrency} / ${baseCurrency}** exchange rates, volatility, or cross-border currency conversion today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quotaNotice, setQuotaNotice] = useState(null);

  if (!isOpen) return null;

  const quickPrompts = [
    `Market outlook for ${targetCurrency}/${baseCurrency}`,
    `Is now a good time to convert ${targetCurrency} to ${baseCurrency}?`,
    `Calculate 1,000 ${targetCurrency} at current market rates`,
    `Compare spreads for ${targetCurrency} vs ${baseCurrency}`
  ];

  const handleSend = async (userText) => {
    const text = userText || input;
    if (!text.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          targetCurrency,
          baseCurrency,
          currentRate
        })
      });

      const data = await res.json();
      if (data.success && data.content) {
        setMessages([...newMessages, { role: 'assistant', content: data.content }]);
        if (data.quotaNotice) {
          setQuotaNotice(data.quotaNotice);
        }
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: `Sorry, could not retrieve AI analysis: ${data.error || 'Unknown error'}`
          }
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: `Connection error: ${err.message}. Please check your network or API keys.`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#0e1014] border border-[#222733] rounded-2xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1c202a] bg-[#12141a]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#a3e635]/10 border border-[#a3e635]/30 flex items-center justify-center text-[#a3e635]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-bold text-sm tracking-wide">
                  SuperRich AI Analyst
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1e2319] border border-[#a3e635]/40 text-[#a3e635]">
                  Qwen 3.8-27B
                </span>
              </div>
              <p className="text-[11px] text-[#6b7280]">
                Connected to ExperientialLabs AI &bull; {targetCurrency}/{baseCurrency} context
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1a1e27] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quota / Card Notice if applicable */}
        {quotaNotice && (
          <div className="bg-[#1c1a14] border-b border-[#3b331f] px-4 py-2 flex items-center space-x-2 text-xs text-[#fef08a]">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#eab308]" />
            <span className="text-[11px]">{quotaNotice}</span>
          </div>
        )}

        {/* Chat message body */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-xs no-scrollbar">
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={i}
                className={`flex space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-[#1a1f2c] border border-[#2b3345] flex items-center justify-center text-[#a3e635] flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-xl p-3.5 leading-relaxed ${
                    isUser
                      ? 'bg-[#1b2518] border border-[#a3e635]/30 text-white'
                      : 'bg-[#141720] border border-[#232836] text-[#d1d5db]'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans text-xs space-y-2">
                    {msg.content}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-[#1f2937] border border-[#374151] flex items-center justify-center text-[#9ca3af] flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-lg bg-[#1a1f2c] border border-[#2b3345] flex items-center justify-center text-[#a3e635] flex-shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-[#141720] border border-[#232836] rounded-xl px-4 py-3 text-xs text-[#9ca3af] flex items-center space-x-2">
                <span>Analyzing market trends with Qwen 3.8-27B...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#101217] border-t border-[#1a1d25] flex items-center space-x-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="flex-shrink-0 text-[11px] font-medium text-[#9ca3af] hover:text-[#a3e635] hover:border-[#a3e635]/40 bg-[#161922] border border-[#222735] px-2.5 py-1.5 rounded-lg transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#12141a] border-t border-[#1c202a]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask AI about ${targetCurrency}/${baseCurrency} rates or trends...`}
              disabled={isLoading}
              className="flex-1 bg-[#181b24] border border-[#292f40] focus:border-[#a3e635] rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-[#a3e635] text-black font-bold flex items-center justify-center hover:bg-[#bef264] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
