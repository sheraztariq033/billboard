import React, { useState } from 'react';
import { MessageSquare, Send, Bot, User, Check, ShieldCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const AiHelpChatWidget: React.FC = () => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Assalam-o-Alaikum! Welcome to OMNI-GRID Pakistan Help Center. How can I assist you with billboard bookings, FBR taxes, or dynamic pricing today?', timestamp: 'Just now' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    const newMsgs = [...messages, { sender: 'user', text: userMsg, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
    setMessages(newMsgs);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = "I'm checking that request in our edge database. Would you like me to generate a campaign spec sheet or check local traffic impressions?";
      
      const lower = userMsg.toLowerCase();
      if (lower.includes('tax') || lower.includes('fbr') || lower.includes('wht')) {
        reply = "Our tax engine calculates PRA 16% PST & FBR Section 153 Withholding Tax (3% Corporate, 10% Individual). You can export a verified Form 164 Certificate directly from the dashboard!";
      } else if (lower.includes('price') || lower.includes('rate') || lower.includes('cost')) {
        reply = "OMNI-GRID dynamically applies a 20% surge rate when billboard occupancy exceeds 80%, and a 15% premium during peak Ramadan season. Let me know if you'd like a custom package quotation!";
      } else if (lower.includes('map') || lower.includes('location') || lower.includes('explore')) {
        reply = "You can view all available high-impact DOOH and static billboards on our interactive Leaflet GIS map on the 'Explore Inventory' tab.";
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: reply, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsTyping(false);
      showToast('Support message received', 'info');
    }, 1200);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col h-[380px]">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Interactive Help Center</h3>
            <p className="text-xs text-slate-400">Ask questions about campaign booking & Pakistani tax compliances.</p>
          </div>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'bot' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div className={`p-3 rounded-2xl max-w-[80%] text-xs ${
              msg.sender === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'bg-slate-950 border border-slate-805 text-slate-200 rounded-tl-none'
            }`}>
              <p className="leading-relaxed">{msg.text}</p>
              <span className="text-[9px] text-slate-500 block text-right mt-1 font-semibold">{msg.timestamp}</span>
            </div>
            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300 font-bold text-[10px]">
                U
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Bot className="w-4 h-4 text-indigo-400 animate-bounce" />
            <span>AI Assistant is typing...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-slate-800">
        <input
          type="text"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
