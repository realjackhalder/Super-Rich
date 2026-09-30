'use client';

import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, Loader2, TrendingUp, ShieldAlert, ArrowRight } from 'lucide-react';

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
      content: `Greetings. I am the SuperRich Currency Intelligence Analyst.

Currently tracking **${targetCurrency}/${baseCurrency}** at **${currentRate}** in open parallel clearing markets.

How may I assist you with exchange rate forecasts, parallel spread metrics, or cross-border remittance timing today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    `Current market outlook for ${targetCurrency}/${baseCurrency}`,
    `Why is there a gap between central bank peg and parallel rate?`,
    `Best timing for Thailand-Myanmar cross-border remittance`,
    `How does the gold market correlate with ${targetCurrency} in Yangon?`
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
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: `The parallel exchange rate for ${targetCurrency}/${baseCurrency} remains liquid around ${currentRate}. Real-world cash transactions clearing at OTC counters typically hold a ~0.5% buy/sell spread.`
          }
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: `Market Briefing: ${targetCurrency}/${baseCurrency} is trading near ${currentRate}. Open-market depth remains active across Yangon, Mandalay, Bangkok, and Singapore settlement corridors.`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#FAF9F5] border border-black/15 rounded-2xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden text-left">
        {/* Header (NDS Editorial Style) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/10 bg-[#FFFFFF]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#141413] text-[#FAF9F5] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#FAF9F5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-xl text-[#141413]">
                  SuperRich Currency Intelligence
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1B6B38]/10 text-[#1B6B38] font-semibold">
                  LIVE ANALYST
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#8C8A84]">
                Telemetry Context: {targetCurrency} / {baseCurrency} &bull; Clearing: {currentRate}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full text-[#63625D] hover:text-[#141413] hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Macro Sentiment Banner */}
        <div className="px-6 py-2 bg-[#F2EFE9] border-b border-black/10 flex items-center justify-between text-[11px] font-mono text-[#63625D]">
          <div className="flex items-center space-x-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#1B6B38]" />
            <span>Parallel Market Liquidity: High &bull; Spreads Stable</span>
          </div>
          <span className="text-[#8C8A84] hidden sm:inline">Qwen 3.8-27B Macro Engine</span>
        </div>

        {/* Chat message body */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4 text-xs no-scrollbar bg-[#FAF9F5]">
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={i}
                className={`flex space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-[#FFFFFF] border border-black/10 flex items-center justify-center text-[#141413] flex-shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                    isUser
                      ? 'bg-[#141413] text-[#FAF9F5]'
                      : 'bg-[#FFFFFF] border border-black/10 text-[#403F3B] shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans text-xs space-y-2">
                    {msg.content}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-full bg-[#EAE6DD] border border-black/10 flex items-center justify-center text-[#141413] flex-shrink-0 mt-0.5 font-mono text-[10px]">
                    YOU
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-full bg-[#FFFFFF] border border-black/10 flex items-center justify-center text-[#141413] flex-shrink-0">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="bg-[#FFFFFF] border border-black/10 rounded-2xl px-4 py-3 text-xs text-[#8C8A84] font-mono flex items-center space-x-2">
                <span>Formulating macroeconomic intelligence briefing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-5 py-2.5 bg-[#FFFFFF] border-t border-black/10 flex items-center space-x-2 overflow-x-auto no-scrollbar font-mono text-[11px]">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1 rounded-full bg-[#F2EFE9] text-[#63625D] hover:text-[#141413] hover:bg-[#EAE6DD] whitespace-nowrap transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-[#FFFFFF] border-t border-black/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder={`Ask anything about ${targetCurrency}/${baseCurrency} spreads, policy, or trends...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-[#FAF9F5] border border-black/15 text-[#141413] text-xs rounded-full px-4 py-2.5 outline-none font-sans focus:border-black transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 rounded-full bg-[#141413] text-[#FAF9F5] hover:bg-black disabled:opacity-40 transition-colors text-xs font-mono uppercase tracking-wider flex items-center space-x-1 cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
