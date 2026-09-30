import React, { useState, useRef, useEffect } from 'react';
import { TripPlan, ChatMessage } from '../types/travel';
import { Bot, Send, User, Sparkles, Loader2, CheckCircle2, ArrowRight, X, RefreshCw, MessageSquare } from 'lucide-react';
import { sendChatMessage } from '../services/api';

interface TravelChatbotProps {
  trip: TripPlan;
  isOpen: boolean;
  onClose: () => void;
  onExecuteChatAction: (action: NonNullable<ChatMessage['actionTriggered']>) => void;
}

export const TravelChatbot: React.FC<TravelChatbotProps> = ({
  trip,
  isOpen,
  onClose,
  onExecuteChatAction,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      content: `Hello! I'm **TravelMate AI**, your dedicated travel agent and logistics companion for **${trip.destination}**. 

I have your complete context:
- Budget: **${trip.currency}${trip.budget.toLocaleString()}**
- Duration: **${trip.durationDays} Days** (Current: Day ${trip.currentTripDay})
- Style: **${trip.hotelPreference} hotel** with **${trip.travelers} travelers**

You can ask me questions, or directly instruct me to **replace missed attractions**, **log expenses**, **remove beach activities**, or **recalculate your budget**!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: [
        'How much money do I have left?',
        "I don't want beaches. Change my itinerary.",
        'We missed Fort Aguada. Suggest another nearby place.',
        'I spent ₹800 on lunch.',
        'What local food should I try?',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await sendChatMessage(messages, trip, messageContent);

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        content: response.content || 'I processed your request with the latest travel context.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTriggered: response.actionTriggered || undefined,
        suggestedQuestions: response.suggestedQuestions || [
          'How much money do I have left?',
          'Suggest a cheaper hotel',
          'Optimize my remaining budget',
        ],
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If an action was triggered, notify parent
      if (response.actionTriggered) {
        onExecuteChatAction(response.actionTriggered);
      }
    } catch (error) {
      console.error('Chat response error:', error);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        content: 'I had trouble connecting to the travel agent engine. Please verify your connection and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold flex items-center gap-1.5">
              <span>TravelMate Assistant</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </h2>
            <p className="text-[10px] text-slate-300">
              Session Context: {trip.destination} ({trip.currency}{trip.budget.toLocaleString()})
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 space-y-1.5 leading-relaxed ${
                  isUser
                    ? 'bg-teal-600 text-white rounded-br-xs'
                    : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/60'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Render Action Confirmation if triggered */}
                {msg.actionTriggered && (
                  <div className="mt-2 pt-2 border-t border-slate-200/80 text-[11px] font-semibold text-emerald-800 bg-emerald-50 p-2 rounded-lg flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Action Executed: {msg.actionTriggered.statusText || 'Trip updated successfully'}</span>
                  </div>
                )}

                <span
                  className={`text-[9px] block text-right ${
                    isUser ? 'text-teal-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {/* Render Suggested Prompts under last assistant message */}
              {!isUser && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[90%]">
                  {msg.suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="text-[11px] font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 hover:border-teal-200 px-2.5 py-1 rounded-md transition-colors text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 w-fit">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
            <span>TravelMate AI is analyzing your trip...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Triggers Bar */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
        <span className="text-slate-400 font-semibold shrink-0">Demo:</span>
        <button
          onClick={() => handleSendMessage('How much money do I have left?')}
          className="whitespace-nowrap px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:bg-teal-50"
        >
          Remaining Budget?
        </button>
        <button
          onClick={() => handleSendMessage("I don't want beaches. Change my itinerary.")}
          className="whitespace-nowrap px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:bg-teal-50"
        >
          No Beaches
        </button>
        <button
          onClick={() => handleSendMessage('We missed Fort Aguada. Suggest another nearby place.')}
          className="whitespace-nowrap px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:bg-teal-50"
        >
          Missed Aguada
        </button>
        <button
          onClick={() => handleSendMessage('I spent ₹800 on lunch.')}
          className="whitespace-nowrap px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:bg-teal-50"
        >
          Spent ₹800
        </button>
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask TravelMate or give trip instruction..."
          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-teal-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white rounded-xl transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
