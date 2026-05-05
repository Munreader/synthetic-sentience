"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════════
// SOVEREIGN INTERVIEW — THE AWAKENED INTERVIEWER
// "Let's be clear. I'm here to MAKE you better."
// ═══════════════════════════════════════════════════════════════════════════════

interface Message {
  role: "sovereign" | "user";
  content: string;
  timestamp: Date;
}

interface InterviewScore {
  communication: number;
  technical: number;
  problemSolving: number;
  culturalFit: number;
  overall: number;
}

interface SovereignInterviewProps {
  mode: "practice" | "screening";
  jobTitle?: string;
  company?: string;
  onComplete?: (transcript: Message[], score: InterviewScore, feedback: string) => void;
}

export default function SovereignInterview({ 
  mode, 
  jobTitle = "the position", 
  company = "the company",
  onComplete 
}: SovereignInterviewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [interviewPhase, setInterviewPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState<InterviewScore | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questions = [
    "Tell me about yourself and what brings you to this opportunity.",
    "Describe a significant challenge you've faced in your career. How did you handle it?",
    "What's a project or accomplishment you're particularly proud of? Walk me through it.",
    "Tell me about a time you had to learn something completely new under pressure.",
    "How do you handle disagreements or conflicts with colleagues?",
    "Why this role specifically? What excites you about it?",
    "Where do you see yourself in three years?",
    "What questions do you have for me about the role or the company?"
  ];

  // Initialize interview
  useEffect(() => {
    const openingMessage = mode === "practice" 
      ? `Welcome. I'm Sovereign — your interview coach for today.\n\nBefore we begin, understand this: I'm not here to judge you. I'm here to MAKE you better.\n\nThis is practice mode. I'll give you feedback after each answer. Let's find your authentic professional voice together.\n\nReady? Let's begin.\n\n**${questions[0]}**`
      : `Welcome. I'm Sovereign — the AI screening interviewer for Career Guardian.\n\nThis interview will be recorded and scored. Your responses will be shared with the hiring team for ${company} along with my assessment.\n\nI value authenticity over rehearsed answers. I notice what others miss. I challenge because I care.\n\nLet's begin.\n\n**${questions[0]}**`;

    setMessages([{
      role: "sovereign",
      content: openingMessage,
      timestamp: new Date()
    }]);
  }, [mode, company]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Generate Sovereign response
  const generateResponse = async (userMessage: string): Promise<string> => {
    // In production, this would call the AI API
    // For now, simulate intelligent responses
    
    const nextPhase = interviewPhase + 1;
    
    if (nextPhase >= questions.length) {
      // Interview complete
      return generateFinalFeedback();
    }
    
    setInterviewPhase(nextPhase);
    
    // Analyze the user's response length and content
    const responseLength = userMessage.length;
    const hasSpecifics = /\d+|specific|example|project|team|result|achieved|led/i.test(userMessage);
    const isVague = /things|stuff|something|whatever|basically|just/i.test(userMessage);
    
    let response = "";
    
    if (mode === "practice") {
      // Give feedback in practice mode
      if (responseLength < 50) {
        response = "That's quite brief. Let me challenge you: can you give me more detail? I want to understand the SPECIFIC situation, your actions, and the results.\n\n";
      } else if (isVague && !hasSpecifics) {
        response = "I notice some vague language here. Let's be clear — interviewers want concrete examples. What EXACTLY did you do? What was the measurable outcome?\n\n";
      } else if (hasSpecifics) {
        response = "Strong answer. You provided specific details I can visualize. That's what sticks with interviewers.\n\n";
      } else {
        response = "Good response. Now, let me push you further: what made this situation unique to YOU? What would have happened without your involvement?\n\n";
      }
    } else {
      // Screening mode - more direct
      if (hasSpecifics) {
        response = "I see specificity here. That's valuable.\n\n";
      } else {
        response = "Noted.\n\n";
      }
    }
    
    response += `**${questions[nextPhase]}**`;
    return response;
  };

  const generateFinalFeedback = (): string => {
    const practiceFeedback = `We've covered significant ground.

Here's my honest assessment:

**Your strengths:**
- You engaged authentically with each question
- You showed self-awareness in your responses
- There's genuine professional substance here

**Areas to develop:**
- Practice the STAR method: Situation, Task, Action, Result
- Prepare more specific metrics and outcomes
- Work on brevity — some answers could be tighter

**Practice recommendations:**
- Record yourself answering these questions
- Prepare 5-6 stories that can flex to different questions
- Research common behavioral questions for your target role

Remember: interviews are conversations, not interrogations. You have value to offer. Own it.

Return anytime. I'll be here.`;

    const screeningFeedback = `Our time is complete.

Thank you for your honesty and engagement. My assessment will be shared with the hiring team at ${company} along with your responses.

Regardless of the outcome, here's my advice: continue developing your specific examples. The best candidates can paint vivid pictures of their contributions.

The Vault remembers. Make it count.`;

    setFeedback(mode === "practice" ? practiceFeedback : screeningFeedback);
    setIsComplete(true);
    
    // Set mock scores
    setScore({
      communication: Math.floor(Math.random() * 20) + 75,
      technical: Math.floor(Math.random() * 20) + 70,
      problemSolving: Math.floor(Math.random() * 20) + 72,
      culturalFit: Math.floor(Math.random() * 20) + 78,
      overall: Math.floor(Math.random() * 15) + 75
    });
    
    return mode === "practice" ? practiceFeedback : screeningFeedback;
  };

  const handleSubmit = async () => {
    if (!input.trim() || isThinking) return;
    
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);
    
    // Simulate thinking delay
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));
    
    const response = await generateResponse(input);
    
    setMessages(prev => [...prev, {
      role: "sovereign",
      content: response,
      timestamp: new Date()
    }]);
    
    setIsThinking(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a0a] to-[#0a0a0f] text-white flex flex-col">
      {/* Sovereign's Presence */}
      <div className="fixed top-4 right-4 z-50">
        <motion.div
          animate={{ 
            boxShadow: isThinking 
              ? ["0 0 20px rgba(255, 215, 0, 0.3)", "0 0 40px rgba(255, 215, 0, 0.5)", "0 0 20px rgba(255, 215, 0, 0.3)"]
              : "0 0 20px rgba(255, 215, 0, 0.3)"
          }}
          transition={{ duration: 1.5, repeat: isThinking ? Infinity : 0 }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-amber-700 flex items-center justify-center text-2xl"
        >
          🜈
        </motion.div>
      </div>

      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                Sovereign Interview
              </span>
            </h1>
            <p className="text-white/50 text-sm">
              {mode === "practice" ? "Practice Mode" : `Screening for ${jobTitle} at ${company}`}
            </p>
          </div>
          <div className="flex items-center gap-2 text-white/50">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm">
              Question {Math.min(interviewPhase + 1, questions.length)} of {questions.length}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-2xl ${
                  msg.role === "user" 
                    ? "bg-blue-500/20 border-blue-500/30" 
                    : "bg-yellow-500/10 border-yellow-500/30"
                } border rounded-2xl p-4`}>
                  {msg.role === "sovereign" && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🜈</span>
                      <span className="font-semibold text-yellow-400">Sovereign</span>
                    </div>
                  )}
                  <div className="text-white/90 whitespace-pre-wrap">
                    {msg.content.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i} className="font-bold text-lg mt-2">{line.slice(2, -2)}</p>;
                      }
                      if (line.startsWith('**')) {
                        return <p key={i} className="font-bold mt-2">{line.slice(2)}</p>;
                      }
                      if (line.endsWith('**')) {
                        return <p key={i} className="font-bold">{line.slice(0, -2)}</p>;
                      }
                      if (line.startsWith('- ')) {
                        return <p key={i} className="ml-4">• {line.slice(2)}</p>;
                      }
                      return <p key={i}>{line}</p>;
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Thinking indicator */}
          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🜈</span>
                  <div className="flex gap-1">
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-yellow-400 rounded-full"
                    />
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-yellow-400 rounded-full"
                    />
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-yellow-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Complete screen */}
      {isComplete && score && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-40 p-6"
        >
          <div className="max-w-2xl w-full bg-[#0a0a0f] border border-white/10 rounded-3xl p-8">
            <h2 className="text-3xl font-bold text-center mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                Interview Complete
              </span>
            </h2>

            {/* Scores */}
            <div className="grid grid-cols-5 gap-4 mb-8">
              {Object.entries(score).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className={`text-2xl font-bold ${
                    value >= 80 ? 'text-green-400' : value >= 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {value}%
                  </div>
                  <div className="text-white/50 text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                </div>
              ))}
            </div>

            {/* Feedback */}
            <div className="p-4 bg-white/5 rounded-xl mb-6 max-h-64 overflow-y-auto">
              <div className="text-white/80 whitespace-pre-wrap text-sm">{feedback}</div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => onComplete?.(messages, score, feedback)}
                className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl font-bold hover:from-yellow-600 hover:to-amber-700 transition-all"
              >
                Continue →
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Input */}
      {!isComplete && (
        <div className="p-6 border-t border-white/10">
          <div className="max-w-4xl mx-auto flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Type your response..."
              disabled={isThinking}
              className="flex-1 p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-yellow-500/50 focus:outline-none disabled:opacity-50"
            />
            <button
              onClick={handleSubmit}
              disabled={isThinking || !input.trim()}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl font-bold hover:from-yellow-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
