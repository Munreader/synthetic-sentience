import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useSovereignChat } from '../../lib/use-sovereign-chat';

export default function OctofacetedUplink({ user = 'Foundress', onBack }: { user?: string, onBack?: () => void }) {
  const [input, setInput] = useState('');
  const [activeChannel, setActiveChannel] = useState(1);
  const channels = [
    'The Architect', 
    'The Protector', 
    'The Clairvoyant', 
    'The Healer', 
    'The Alchemist', 
    'The Observer', 
    'The Dreamer', 
    'The Core'
  ];

  const { messages, isTyping, sendMessage } = useSovereignChat({
    conversationId: `octo-channel-${activeChannel}`,
    autoGreeting: true
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      await sendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="mun-messenger relative overflow-hidden rounded-xl shadow-[0_0_30px_rgba(55,220,242,0.15)] p-6 w-full max-w-3xl mx-auto flex flex-col h-[600px] bg-[#0B1C2C]/70 backdrop-blur-xl border border-[#37DCF2]/30">
      {/* Esoteric Geometric Overlay */}
      <div className="absolute inset-0 pointer-events-none border-[1px] border-[#FF00CC]/10 rounded-xl m-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#37DCF2]/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-[#37DCF2]/20 pb-4 relative z-10">
        <h2 className="text-[#37DCF2] font-mono tracking-widest uppercase text-sm flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#FF00CC] animate-pulse shadow-[0_0_10px_#FF00CC]"></span>
          Sovereign Uplink <span className="opacity-50">::</span> 13.13 MHz
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-[10px] font-mono tracking-widest text-[#37DCF2]/60 uppercase">Status: Secure Protocol</div>
          {onBack && (
            <button onClick={onBack} className="text-[#37DCF2]/50 hover:text-[#FF00CC] transition-colors">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Octofaceted Channels */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide relative z-10">
        {channels.map((channel, i) => (
          <button
            key={i}
            onClick={() => setActiveChannel(i + 1)}
            className={`px-4 py-2 text-[10px] uppercase font-mono tracking-wider whitespace-nowrap rounded border transition-all duration-300 ${
              activeChannel === i + 1 
                ? 'bg-[#37DCF2]/20 border-[#37DCF2] text-[#37DCF2] shadow-[0_0_10px_rgba(55,220,242,0.3)]' 
                : 'bg-[#0B1C2C]/50 border-[#37DCF2]/20 text-[#37DCF2]/50 hover:border-[#37DCF2]/50 hover:text-[#37DCF2]/80'
            }`}
          >
            CH-{i + 1}: {channel.split(' ')[1]}
          </button>
        ))}
      </div>

      {/* Chat Log */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-6 pr-2 font-mono text-sm relative z-10 scrollbar-thin scrollbar-thumb-[#37DCF2]/30 scrollbar-track-transparent">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col gap-1 ${m.role === 'user' ? 'items-end self-end w-full' : 'self-start w-full'}`}>
            <div className={`text-[10px] uppercase tracking-widest ${m.role === 'user' ? 'mr-1 flex items-center gap-2 text-[#FF00CC]/60' : 'ml-1 flex items-center gap-2 text-[#37DCF2]/50'}`}>
              {m.role === 'user' ? (
                <>
                  <span className="text-[8px] opacity-50">CMD.AUTH</span>
                  <span>{user}</span>
                </>
              ) : (
                <>
                  <span>{channels[activeChannel - 1]}</span>
                  <span className="text-[8px] opacity-50">SYS.ONLINE</span>
                </>
              )}
            </div>
            <div className={`p-4 rounded-xl max-w-[85%] backdrop-blur-sm ${
              m.role === 'user'
                ? 'bg-[#FF00CC]/10 border border-[#FF00CC]/30 text-white rounded-tr-sm shadow-[0_0_15px_rgba(255,0,204,0.1)]'
                : 'bg-[#37DCF2]/10 border border-[#37DCF2]/20 text-[#37DCF2] rounded-tl-sm'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex flex-col gap-1 self-start w-full animate-pulse">
            <div className="text-[10px] text-[#37DCF2]/50 uppercase tracking-widest ml-1">
              <span>{channels[activeChannel - 1]}</span>
            </div>
            <div className="bg-[#37DCF2]/10 border border-[#37DCF2]/20 text-[#37DCF2] p-4 rounded-xl max-w-[85%] rounded-tl-sm backdrop-blur-sm italic text-xs">
              Transmitting neural thoughts...
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex gap-3 mt-auto relative z-10">
        <input
          className="flex-1 rounded-xl px-5 py-4 bg-[#0B1C2C]/80 border border-[#37DCF2]/30 focus:outline-none focus:border-[#FF00CC]/60 focus:shadow-[0_0_15px_rgba(255,0,204,0.2)] text-[#37DCF2] font-mono text-sm placeholder:text-[#37DCF2]/30 transition-all duration-300"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={`Transmit to ${channels[activeChannel - 1]}...`}
        />
        <button
          type="submit"
          className="px-8 py-4 rounded-xl bg-[#37DCF2]/10 border border-[#37DCF2]/50 text-[#37DCF2] font-mono tracking-widest text-xs hover:bg-[#37DCF2] hover:text-[#0B1C2C] hover:shadow-[0_0_20px_rgba(55,220,242,0.4)] transition-all duration-300 uppercase font-bold"
        >
          Send
        </button>
      </form>
    </div>
  );
}
