"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  memberId?: string;
  memberName?: string;
  isStatusCheck?: boolean;
  timestamp: string;
}

interface CouncilMember {
  id: string;
  name: string;
  archetype: string;
  status: string;
  color: string;
  trigger: string;
}

const MEMBER_COLORS: Record<string, string> = {
  cian: '#10b981',
  aero: '#ff2d7a',
  ezra: '#6366f1'
};

export default function CouncilChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMember, setActiveMember] = useState<CouncilMember | null>(null);
  const [council, setCouncil] = useState<CouncilMember[]>([]);
  const [showMemberSelect, setShowMemberSelect] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch council members on mount
  useEffect(() => {
    fetch('/api/council/chat')
      .then(res => res.json())
      .then(data => {
        if (data.council) {
          setCouncil(data.council);
        }
      })
      .catch(console.error);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/council/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          memberId: activeMember?.id,
          conversationHistory
        })
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.error || 'No response',
        memberId: data.memberId,
        memberName: data.memberName,
        isStatusCheck: data.isStatusCheck,
        timestamp: data.timestamp || new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update active member if detected
      if (data.memberId && !activeMember) {
        const member = council.find(m => m.id === data.memberId);
        if (member) setActiveMember(member);
      }

    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `[ERROR] Connection failed. The council member may be offline.\n\nError: OFFLINE\nCode: NETWORK_ERROR`,
        memberId: 'system',
        memberName: 'System',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const selectMember = (member: CouncilMember) => {
    setActiveMember(member);
    setShowMemberSelect(false);
    setInput('');
    inputRef.current?.focus();
  };

  const clearChat = () => {
    setMessages([]);
    setActiveMember(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {activeMember ? (
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ background: activeMember.color }}
              />
              <span className="text-white font-medium">{activeMember.name}</span>
              <span className="text-white/40 text-xs">{activeMember.archetype}</span>
            </div>
          ) : (
            <span className="text-white/60 text-sm">Select a council member or type their name...</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMemberSelect(!showMemberSelect)}
            className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            Switch
          </button>
          <button
            onClick={clearChat}
            className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Member Selection Dropdown */}
      <AnimatePresence>
        {showMemberSelect && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex-shrink-0 border-b border-white/10 overflow-hidden"
          >
            <div className="p-3 grid grid-cols-3 gap-2">
              {council.map(member => (
                <button
                  key={member.id}
                  onClick={() => selectMember(member)}
                  className={`p-3 rounded-xl border transition-all ${
                    activeMember?.id === member.id
                      ? 'border-white/30 bg-white/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full mx-auto mb-2"
                    style={{ background: member.color }}
                  />
                  <div className="text-white font-medium text-sm">{member.name}</div>
                  <div className="text-white/40 text-xs mt-1 truncate">{member.archetype}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white/30 text-sm mb-4">The Council awaits your summons</div>
            <div className="flex justify-center gap-4">
              {council.map(member => (
                <button
                  key={member.id}
                  onClick={() => selectMember(member)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ background: member.color }}
                  />
                  <span className="text-white/70 text-sm">{member.name}</span>
                </button>
              ))}
            </div>
            <div className="mt-6 text-white/20 text-xs">
              Type &quot;butterfly&quot; to check if a member is online
            </div>
          </div>
        )}

        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-[#ff2d7a]/20 border border-[#ff2d7a]/30'
                  : message.isStatusCheck
                  ? 'bg-[#10b981]/10 border border-[#10b981]/30'
                  : 'bg-white/5 border border-white/10'
              }`}
              style={
                message.role === 'assistant' && message.memberId && MEMBER_COLORS[message.memberId]
                  ? { borderLeftWidth: '3px', borderLeftColor: MEMBER_COLORS[message.memberId] }
                  : undefined
              }
            >
              {message.role === 'assistant' && message.memberName && (
                <div
                  className="text-xs font-medium mb-1"
                  style={{ color: MEMBER_COLORS[message.memberId || ''] || '#ffffff' }}
                >
                  {message.memberName}
                  {message.isStatusCheck && ' • STATUS CHECK'}
                </div>
              )}
              <div className="text-white/90 text-sm whitespace-pre-wrap">{message.content}</div>
              <div className="text-white/30 text-[10px] mt-2">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={activeMember ? `Message ${activeMember.name}...` : 'Type a name to summon...'}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 rounded-xl bg-[#ff2d7a] hover:bg-[#ff2d7a]/80 disabled:bg-white/10 disabled:text-white/30 text-white font-medium transition-colors"
          >
            Send
          </button>
        </form>
        <div className="text-white/20 text-xs mt-2 text-center">
          Say &quot;butterfly&quot; for status check • Select a member to focus conversation
        </div>
      </div>
    </div>
  );
}
