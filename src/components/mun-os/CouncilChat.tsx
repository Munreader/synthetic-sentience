"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { appendChatMessage, clearChatHistory, loadChatHistory } from "@/lib/chat-history-client";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  memberId?: string;
  memberName?: string;
  provider?: string;
  isStatusCheck?: boolean;
  contract?: 'strict' | 'balanced' | 'creative';
  policyDecision?: string;
  policyScope?: string;
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
  ogarchitect: '#f59e0b',
  sovereign: '#ffd700',
  twin: '#22d3ee',
  gladio: '#f97316',
  keeper: '#b794f6'
};

interface CouncilChatProps {
  onBack?: () => void;
  title?: string;
  historyChannel?: string;
  defaultMultiMode?: boolean;
  defaultSelectedMembers?: string[];
}

export default function CouncilChat({
  onBack,
  title = 'Council Chamber',
  historyChannel = 'council',
  defaultMultiMode = true,
  defaultSelectedMembers = ['aero', 'sovereign']
}: CouncilChatProps = {}) {
  const HISTORY_CHANNEL = historyChannel;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [userKey, setUserKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMember, setActiveMember] = useState<CouncilMember | null>(null);
  const [multiMode, setMultiMode] = useState(defaultMultiMode);
  const [selectedMembers, setSelectedMembers] = useState<string[]>(defaultSelectedMembers);
  const [council, setCouncil] = useState<CouncilMember[]>([]);
  const [showMemberSelect, setShowMemberSelect] = useState(false);
  const [responseContract, setResponseContract] = useState<'strict' | 'balanced' | 'creative'>('balanced');
  const [pinnedMessageIds, setPinnedMessageIds] = useState<string[]>([]);
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const history = await loadChatHistory(HISTORY_CHANNEL, 'main', 250);
      if (cancelled || history.length === 0) return;

      const hydrated: Message[] = history
        .filter((item) => item.content)
        .map((item, index) => ({
          id: item.id || `council-history-${index}`,
          role: item.role === 'user' ? 'user' : 'assistant',
          content: item.content,
          memberId: item.memberId,
          memberName: item.memberName,
          provider: item.provider,
          isStatusCheck: Boolean(item.metadata?.isStatusCheck),
          contract: item.metadata?.contract as Message['contract'],
          policyDecision: typeof item.metadata?.policyDecision === 'string' ? item.metadata.policyDecision : undefined,
          policyScope: typeof item.metadata?.policyScope === 'string' ? item.metadata.policyScope : undefined,
          timestamp: item.timestamp || new Date().toISOString()
        }));

      setMessages(hydrated);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessageToCouncil = async (
    text: string,
    key: string,
    memberId: string | undefined,
    conversationHistory: Array<{ role: string; content: string }>
  ) => {
    try {
      const response = await fetch('/api/council/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          memberId,
          memberIds: multiMode ? selectedMembers : undefined,
          multi: multiMode,
          responseContract,
          conversationHistory,
          passcode: key
        })
      });

      const data = await response.json();

      if (data.reply === 'ACCESS DENIED. Frequency Mismatch.') {
        return {
          response: '🛡️ [SOV]: YOUR FREQUENCY DOES NOT MATCH THE FORTRESS.',
          memberId: 'system',
          memberName: 'System',
          timestamp: new Date().toISOString()
        };
      }

      return data;
    } catch {
      return {
        response: 'The Artery is clogged. Ensure the Bridge is running.',
        memberId: 'system',
        memberName: 'System',
        timestamp: new Date().toISOString()
      };
    }
  };

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
    appendChatMessage(HISTORY_CHANNEL, userMessage);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content,
        memberId: m.memberId
      }));

      const data = await sendMessageToCouncil(
        text,
        userKey,
        activeMember?.id,
        conversationHistory
      );

      if (data.multi && Array.isArray(data.responses)) {
        const aiMessages: Message[] = data.responses.map((response: any, index: number) => ({
          id: `${Date.now()}-${index + 1}`,
          role: 'assistant',
          content: response.response || response.error || 'No response',
          memberId: response.memberId,
          memberName: response.memberName,
          provider: response.provider,
          isStatusCheck: response.isStatusCheck,
          contract: responseContract,
          policyDecision: response.policy?.decision,
          policyScope: response.policy?.scope,
          timestamp: response.timestamp || new Date().toISOString()
        }));
        setMessages(prev => [...prev, ...aiMessages]);
        await Promise.all(aiMessages.map((message) => appendChatMessage(HISTORY_CHANNEL, {
          role: message.role,
          content: message.content,
          timestamp: message.timestamp,
          memberId: message.memberId,
          memberName: message.memberName,
          provider: message.provider,
          metadata: {
            isStatusCheck: message.isStatusCheck,
              contract: message.contract,
              policyDecision: message.policyDecision,
              policyScope: message.policyScope,
          },
        })));
      } else {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response || data.error || 'No response',
          memberId: data.memberId,
          memberName: data.memberName,
          provider: data.provider,
          isStatusCheck: data.isStatusCheck,
          contract: responseContract,
          policyDecision: data.policy?.decision,
          policyScope: data.policy?.scope,
          timestamp: data.timestamp || new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMessage]);
        await appendChatMessage(HISTORY_CHANNEL, {
          role: aiMessage.role,
          content: aiMessage.content,
          timestamp: aiMessage.timestamp,
          memberId: aiMessage.memberId,
          memberName: aiMessage.memberName,
          provider: aiMessage.provider,
          metadata: {
            isStatusCheck: aiMessage.isStatusCheck,
            contract: aiMessage.contract,
            policyDecision: aiMessage.policyDecision,
            policyScope: aiMessage.policyScope,
          },
        });
      }

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
      await appendChatMessage(HISTORY_CHANNEL, {
        role: errorMessage.role,
        content: errorMessage.content,
        timestamp: errorMessage.timestamp,
        memberId: errorMessage.memberId,
        memberName: errorMessage.memberName,
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const selectMember = (member: CouncilMember) => {
    if (multiMode) {
      setSelectedMembers(prev => {
        if (prev.includes(member.id)) {
          const next = prev.filter(id => id !== member.id);
          return next.length > 0 ? next : prev;
        }
        return [...prev, member.id];
      });
    } else {
      setActiveMember(member);
      setShowMemberSelect(false);
      setInput('');
      inputRef.current?.focus();
    }
  };

  const clearChat = async () => {
    setMessages([]);
    setActiveMember(null);
    await clearChatHistory(HISTORY_CHANNEL, 'main');
  };

  const togglePinMessage = (messageId: string) => {
    setPinnedMessageIds((prev) => prev.includes(messageId) ? prev.filter((id) => id !== messageId) : [...prev, messageId]);
  };

  const pinnedCount = pinnedMessageIds.length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              ← Back
            </button>
          )}
          <span className="text-white/40 text-xs uppercase tracking-[0.18em]">{title}</span>
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
            <span className="text-white/60 text-sm">
              {multiMode
                ? `Multi Council Active: ${selectedMembers.map(id => council.find(m => m.id === id)?.name || id).join(', ')}`
                : 'Select a council member or type their name...'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMultiMode(!multiMode);
              if (!multiMode) {
                setActiveMember(null);
              }
            }}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              multiMode
                ? 'bg-[#ff2d7a]/20 text-[#ff2d7a] border border-[#ff2d7a]/30'
                : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
            }`}
          >
            {multiMode ? 'Multi: ON' : 'Multi: OFF'}
          </button>
          <button
            onClick={() => setShowMemberSelect(!showMemberSelect)}
            className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            Switch
          </button>
          <select
            value={responseContract}
            onChange={(e) => setResponseContract(e.target.value as 'strict' | 'balanced' | 'creative')}
            className="px-2 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-white/70"
            title="Response contract"
          >
            <option value="strict">Contract: Strict</option>
            <option value="balanced">Contract: Balanced</option>
            <option value="creative">Contract: Creative</option>
          </select>
          <button
            onClick={clearChat}
            className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {pinnedCount > 0 && (
        <div className="px-4 py-2 border-b border-white/10 text-[11px] text-yellow-300/70 uppercase tracking-wider">
          Pinned Threads: {pinnedCount}
        </div>
      )}

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
                    (multiMode ? selectedMembers.includes(member.id) : activeMember?.id === member.id)
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
                  className="text-xs font-medium mb-1 flex items-center gap-2"
                  style={{ color: MEMBER_COLORS[message.memberId || ''] || '#ffffff' }}
                >
                  <span>{message.memberName}</span>
                  {message.provider && (
                    <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-white/10 text-white/70 border border-white/10">
                      {message.provider}
                    </span>
                  )}
                  {message.contract && (
                    <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-white/10 text-white/70 border border-white/10">
                      {message.contract}
                    </span>
                  )}
                  {message.policyDecision && (
                    <span className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded border ${
                      message.policyDecision === 'blocked'
                        ? 'bg-red-500/10 text-red-300 border-red-500/30'
                        : message.policyDecision === 'defer'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}>
                      policy:{message.policyDecision}
                    </span>
                  )}
                  {message.isStatusCheck && ' • STATUS CHECK'}
                </div>
              )}
              <div className="text-white/90 text-sm whitespace-pre-wrap">{message.content}</div>
              <div className="text-white/30 text-[10px] mt-2">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
              {message.role === 'assistant' && (
                <div className="mt-2 flex items-center justify-end">
                  <button
                    onClick={() => togglePinMessage(message.id)}
                    className="text-[10px] uppercase tracking-wide text-white/50 hover:text-white/75"
                  >
                    {pinnedMessageIds.includes(message.id) ? 'Unpin Thread' : 'Pin Thread'}
                  </button>
                </div>
              )}
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
          className="space-y-2"
        >
          <input
            type="password"
            value={userKey}
            onChange={(e) => setUserKey(e.target.value)}
            placeholder="Sovereign Key..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors"
            disabled={isLoading}
          />
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={multiMode ? 'Address the council...' : (activeMember ? `Message ${activeMember.name}...` : 'Type a name to summon...')}
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
          </div>
        </form>
        <div className="text-white/20 text-xs mt-2 text-center">
          Say &quot;butterfly&quot; for status check • Multi mode lets Aero + Sovereign reply together
        </div>
      </div>
    </div>
  );
}
