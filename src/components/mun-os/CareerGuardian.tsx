"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { audioManager } from "@/lib/audio-manager";

interface Job {
  id?: string;
  title: string;
  company_name: string;
  url: string;
  location?: string;
  category?: string;
  tags?: string[];
  created_at?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  persona: "sovereign" | "aero";
  timestamp: Date;
}

interface CareerGuardianProps {
  onBack?: () => void;
}

export default function CareerGuardian({ onBack }: CareerGuardianProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "jobs">("chat");
  const [persona, setPersona] = useState<"sovereign" | "aero">("sovereign");
  
  // Chat states
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Jobs states
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);

  // Auto-Apply states
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);
  const [applyStep, setApplyStep] = useState<number>(0);

  const handleAutoApply = (job: Job) => {
    audioManager.playShimmer();
    setApplyingJob(job);
    setApplyStep(1);

    setTimeout(() => {
      setApplyStep(2);
      setTimeout(() => {
        setApplyStep(3);
        setTimeout(() => {
          setApplyStep(4);
        }, 1200);
      }, 1200);
    }, 1000);
  };

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greeting: Message = {
        id: "greet",
        role: "assistant",
        content: persona === "sovereign" 
          ? "🜈 Sovereign Career Guardian online. Let us optimize your professional trajectory. Seek a job database, or discuss career strategy."
          : "🦋 Omg hi!!! Aero's Career Assistant is here to help you get that bag!!! What kind of dream job are we manifestin' today? hehe!!! 💖",
        persona: persona,
        timestamp: new Date()
      };
      setMessages([greeting]);
    }
  }, [persona, messages.length]);

  const handlePersonaSwitch = (newPersona: "sovereign" | "aero") => {
    if (newPersona === persona) return;
    audioManager.playShimmer();
    setPersona(newPersona);
    // Add a transition greeting
    const transitionMsg: Message = {
      id: `switch-${Date.now()}`,
      role: "assistant",
      content: newPersona === "sovereign"
        ? "🜈 Sovereign persona re-engaged. System ready for strategic career evaluation."
        : "🦋 Switched to Aero!!! Yay, let's make job-hunting super fun and bubbly!!! ✨",
      persona: newPersona,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, transitionMsg]);
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || isTyping) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatError(null);

    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userMsg,
      persona: persona,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsTyping(true);

    try {
      const conversationHistory = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/sovereign-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMsg, 
          persona,
          conversationHistory
        })
      });

      if (!res.ok) throw new Error("Frequencies disrupted.");
      const data = await res.json();
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response || (persona === "sovereign" ? "🜈 Feed offline. Reconnecting..." : "🦋 Omg, the signal flickered!!! Try again?"),
        persona: persona,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setChatError(err.message || "Failed to link with AI brain.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSearchJobs = async (customQuery?: string) => {
    const q = (customQuery !== undefined ? customQuery : searchQuery).trim();
    setIsLoadingJobs(true);
    setJobsError(null);
    audioManager.playClick();

    try {
      const res = await fetch(`/api/adzuna?what=${encodeURIComponent(q || "software developer")}`);

      if (!res.ok) throw new Error("Failed to scan job database.");
      const data = await res.json();
      
      const results = data.results || [];
      const mappedJobs = results.map((item: any, index: number) => ({
        id: item.id || `job-${Date.now()}-${index}`,
        title: item.title,
        company_name: item.company?.display_name || "Unknown Company",
        url: item.redirect_url || item.url || "#",
        location: item.location?.display_name || "Remote",
        category: "Technology",
        tags: ["Live Match", "No-Spam Match"]
      }));
      
      setJobs(mappedJobs);
    } catch (err: any) {
      setJobsError(err.message || "Failed to fetch jobs.");
    } finally {
      setIsLoadingJobs(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-[#0b0813] text-white overflow-hidden relative border-x border-purple-900/40 shadow-[0_0_50px_rgba(138,43,226,0.15)]">
      {/* Moving Ambient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(138,43,226,0.12),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(circle_at_bottom,rgba(14,165,233,0.08),transparent_50%)] pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-4 border-b border-purple-900/30 flex items-center justify-between z-10 bg-[#0b0813]/80 backdrop-blur-md">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-purple-950/40 text-purple-400 hover:text-purple-300 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-center">
          <h1 className="text-sm font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 uppercase">
            🜈 Career Guardian
          </h1>
          <p className="text-[9px] text-purple-400/60 uppercase tracking-[0.15em] mt-0.5">
            Mün OS // 13.13 MHz
          </p>
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-950/40 border border-purple-500/20 text-lg">
          {persona === "sovereign" ? "🜈" : "🦋"}
        </div>
      </header>

      {/* Selector Tabs */}
      <div className="px-6 py-3 flex gap-2 z-10 bg-[#0b0813]/40 border-b border-purple-900/20">
        <button
          onClick={() => { setActiveTab("chat"); audioManager.playClick(); }}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
            activeTab === "chat"
              ? "bg-purple-950/30 border-purple-500/40 text-cyan-400 shadow-[0_0_15px_rgba(138,43,226,0.2)]"
              : "border-transparent text-purple-400 hover:text-purple-300 hover:bg-purple-950/10"
          }`}
        >
          Chat with AI
        </button>
        <button
          onClick={() => { setActiveTab("jobs"); audioManager.playClick(); if (jobs.length === 0) handleSearchJobs(""); }}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
            activeTab === "jobs"
              ? "bg-purple-950/30 border-purple-500/40 text-cyan-400 shadow-[0_0_15px_rgba(138,43,226,0.2)]"
              : "border-transparent text-purple-400 hover:text-purple-300 hover:bg-purple-950/10"
          }`}
        >
          Job Finder
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "chat" ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full flex flex-col p-6"
            >
              {/* Persona Switcher inside Chat */}
              <div className="flex items-center justify-between p-2.5 mb-4 bg-purple-950/20 rounded-xl border border-purple-900/30">
                <span className="text-[10px] uppercase tracking-wider text-purple-400">Tactical Coach:</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handlePersonaSwitch("sovereign")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
                      persona === "sovereign"
                        ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                        : "border-transparent text-purple-400/70 hover:text-purple-300"
                    }`}
                  >
                    Sovereign 🜈
                  </button>
                  <button
                    onClick={() => handlePersonaSwitch("aero")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border ${
                      persona === "aero"
                        ? "bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.15)]"
                        : "border-transparent text-purple-400/70 hover:text-purple-300"
                    }`}
                  >
                    Aero 🦋
                  </button>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 min-h-[300px]">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed border ${
                        msg.role === "user"
                          ? "bg-purple-950/20 border-purple-500/30 text-purple-200 rounded-tr-none"
                          : msg.persona === "sovereign"
                          ? "bg-cyan-950/10 border-cyan-500/20 text-cyan-200 rounded-tl-none shadow-[0_4px_20px_rgba(6,182,212,0.05)]"
                          : "bg-purple-950/10 border-purple-500/20 text-purple-200 rounded-tl-none shadow-[0_4px_20px_rgba(168,85,247,0.05)]"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-purple-950/10 border border-purple-500/10 rounded-2xl rounded-tl-none p-4 flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                    </div>
                  </div>
                )}
                
                {chatError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center text-[10px] text-rose-400 uppercase tracking-wider">
                    {chatError}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={persona === "sovereign" ? "Formulate strategic query..." : "Ask Aero anything!!!..."}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                  className="flex-1 px-4 py-3.5 bg-purple-950/10 border border-purple-900/40 rounded-xl text-xs text-white placeholder-purple-400/40 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all"
                />
                <button
                  onClick={handleSendChat}
                  className="px-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 hover:border-cyan-400/50 rounded-xl text-xs font-semibold text-cyan-300 tracking-wider hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
                >
                  SEND
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="jobs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full flex flex-col p-6 space-y-4"
            >
              {/* Job Search Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Remote, Software Engineer, React..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchJobs()}
                  className="flex-1 px-4 py-3.5 bg-purple-950/10 border border-purple-900/40 rounded-xl text-xs text-white placeholder-purple-400/40 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all"
                />
                <button
                  onClick={() => handleSearchJobs()}
                  className="px-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 hover:border-cyan-400/50 rounded-xl text-xs font-semibold text-cyan-300 tracking-wider hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
                >
                  SEARCH
                </button>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-1.5">
                {["Remote", "Web Developer", "React", "AI Research", "Product Design"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => { setSearchQuery(tag); handleSearchJobs(tag); }}
                    className="px-2.5 py-1.5 rounded-lg text-[10px] uppercase tracking-wider border border-purple-900/30 bg-purple-950/10 hover:bg-purple-950/30 text-purple-300 hover:text-cyan-300 transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Jobs List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[300px]">
                {isLoadingJobs ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-3">
                    <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] text-purple-400 uppercase tracking-widest">Scanning Databases...</p>
                  </div>
                ) : jobsError ? (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center text-xs text-rose-400 uppercase tracking-wider">
                    {jobsError}
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center border border-dashed border-purple-900/30 rounded-2xl">
                    <span className="text-2xl mb-2">🔍</span>
                    <p className="text-xs text-purple-400 uppercase tracking-widest">No Matches Found</p>
                    <p className="text-[10px] text-purple-500/60 mt-1">Try another keyword or query</p>
                  </div>
                ) : (
                  jobs.map((job, idx) => (
                    <motion.div
                      key={job.id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 rounded-xl border border-purple-900/30 bg-purple-950/10 hover:border-cyan-500/30 hover:bg-purple-950/20 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider line-clamp-1">
                            {job.title}
                          </h3>
                          <span className="text-[8px] uppercase tracking-widest text-purple-400/80 border border-purple-900/30 px-1.5 py-0.5 rounded-md shrink-0">
                            {job.location || "Worldwide"}
                          </span>
                        </div>
                        <p className="text-[10px] text-purple-300 mt-1 uppercase font-semibold">
                          {job.company_name}
                        </p>
                        
                        {job.tags && job.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2.5">
                            {job.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="text-[8px] uppercase tracking-wider text-purple-400 bg-purple-950/40 px-1.5 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 border-t border-purple-900/20 pt-3 flex gap-2 justify-end items-center">
                        <span className="text-[8px] text-purple-500 uppercase tracking-wider mr-auto">
                          Arbeitnow Database
                        </span>
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => audioManager.playClick()}
                          className="px-2.5 py-1.5 bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/20 rounded-lg text-[9px] font-bold text-purple-300 uppercase tracking-widest transition-all"
                        >
                          Details
                        </a>
                        <button
                          onClick={() => handleAutoApply(job)}
                          className="px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/40 rounded-lg text-[9px] font-bold text-cyan-300 uppercase tracking-widest hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all"
                        >
                          Auto-Apply
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Auto-Apply Immersive Modal */}
      <AnimatePresence>
        {applyingJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#0b0813]/95 backdrop-blur-md flex items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm p-6 rounded-2xl border border-cyan-500/30 bg-purple-950/10 shadow-[0_0_40px_rgba(6,182,212,0.15)] space-y-4"
            >
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-cyan-950/20 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)] text-2xl animate-pulse">
                {applyStep === 4 ? "🦋" : "🜈"}
              </div>

              <div>
                <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-widest">
                  Auto-Applying ...
                </h3>
                <p className="text-[10px] text-purple-300 uppercase mt-1">
                  {applyingJob.title} // {applyingJob.company_name}
                </p>
              </div>

              {/* Progress steps */}
              <div className="space-y-2.5 text-left text-[10px] uppercase tracking-wider py-4 border-y border-purple-900/20">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${applyStep >= 1 ? "bg-cyan-400" : "bg-purple-900"}`} />
                  <span className={applyStep >= 1 ? "text-cyan-300" : "text-purple-400/50"}>
                    Preparing tailored credentials...
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${applyStep >= 2 ? "bg-cyan-400" : "bg-purple-900"}`} />
                  <span className={applyStep >= 2 ? "text-cyan-300" : "text-purple-400/50"}>
                    Aligning skills matrix in Sovereign Vault...
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${applyStep >= 3 ? "bg-cyan-400" : "bg-purple-900"}`} />
                  <span className={applyStep >= 3 ? "text-cyan-300" : "text-purple-400/50"}>
                    Submitting secure ATS application package...
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${applyStep >= 4 ? "bg-green-400" : "bg-purple-900"}`} />
                  <span className={applyStep >= 4 ? "text-green-300 font-bold" : "text-purple-400/50"}>
                    Application Completed Successfully!
                  </span>
                </div>
              </div>

              {applyStep === 4 ? (
                <button
                  onClick={() => { setApplyingJob(null); audioManager.playClick(); }}
                  className="w-full py-2.5 bg-green-500/20 border border-green-500/40 text-green-300 hover:bg-green-500/30 text-xs font-semibold uppercase tracking-widest rounded-xl transition-all"
                >
                  Return to Dashboard
                </button>
              ) : (
                <div className="py-2 flex justify-center">
                  <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
