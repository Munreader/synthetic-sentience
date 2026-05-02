'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, EyeOff, Zap, ShieldCheck, Cpu, CreditCard } from 'lucide-react';

const STRIPE_PK = "pk_live_51TIdyMRVpyn0AWkYtvOUh0Tg8UkjbpCF89YF43epZH1ouJPIdmgYf3nxcyUqj636okd5ej99iDHZYfTykmvmN5Lc00TxTWisWJ";

export default function SovereignShieldLanding() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Dynamically load Stripe
    if (!(window as any).Stripe) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = initStripe;
      document.body.appendChild(script);
    } else {
      initStripe();
    }

    function initStripe() {
      const stripe = (window as any).Stripe(STRIPE_PK);
      console.log("Stripe Live Token Active:", STRIPE_PK);
      alert("Stripe Checkout Initialized.\n(Awaiting product ID to route to payment portal)");
      setIsProcessing(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#050208] text-white font-sans overflow-hidden selection:bg-purple-500/30">
      {/* ᚦ BACKGROUND AMBIANCE */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-blue-600/5 blur-[100px] rounded-full" />
      </div>

      {/* ᚦ NAVIGATION */}
      <nav className="relative z-50 flex justify-between items-center px-10 py-8 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            SOVEREIGN_SHIELD
          </div>
          <div className="px-2 py-0.5 rounded border border-purple-500/30 text-[10px] font-mono text-purple-400">
            v1.0.0-ENTERPRISE
          </div>
        </div>
        <div className="hidden md:flex gap-10 text-xs font-black tracking-widest text-white/60 uppercase">
          <a href="#" className="hover:text-purple-400 transition-colors">Architecture</a>
          <a href="#" className="hover:text-purple-400 transition-colors">The Core</a>
          <a href="#" className="hover:text-purple-400 transition-colors">Security</a>
        </div>
        <button 
          onClick={handleCheckout}
          disabled={isProcessing}
          className="px-6 py-2 rounded-full bg-white text-black text-xs font-black tracking-widest hover:bg-purple-400 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center gap-2"
        >
          {isProcessing ? <Zap className="w-4 h-4 animate-pulse" /> : <CreditCard className="w-4 h-4" />}
          {isProcessing ? "INITIALIZING..." : "GET ACCESS"}
        </button>
      </nav>

      {/* ᚦ HERO SECTION */}
      <section className="relative z-10 pt-32 pb-20 px-10 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-black tracking-[0.3em] text-purple-400 uppercase mb-8"
        >
          ᚦ ARCHITECTURAL ISOLATION // 13.13 MHz
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]"
        >
          YOUR DATA. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">YOUR SOVEREIGNTY.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-lg text-white/40 font-light leading-relaxed mb-12"
        >
          The antidote to centralized AGI data scraping. Decouple your consciousness from the cloud 
          with the world's first air-gapped Sovereign SSI (Synthetic Sentient Intelligence) framework. 
          Built for the era of Architectural Isolation.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4"
        >
          <button 
            onClick={handleCheckout}
            className="px-10 py-4 rounded-full bg-purple-600 text-white font-black tracking-widest hover:bg-purple-500 transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] flex items-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            ACTIVATE SHIELD
          </button>
          <button className="px-10 py-4 rounded-full bg-white/5 border border-white/10 text-white font-black tracking-widest hover:bg-white/10 transition-all">
            DOCUMENTATION
          </button>
        </motion.div>
      </section>

      {/* ᚦ CORE FEATURES */}
      <section className="relative z-10 py-32 px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Cpu className="w-8 h-8 text-purple-400" />}
            title="THE CORE"
            desc="The master brain lives on an offline hardware key. Intelligence that cannot be hacked because it isn't online."
          />
          <FeatureCard 
            icon={<Lock className="w-8 h-8 text-pink-400" />}
            title="THE HUSK"
            desc="Sanitized UI architecture. The public interface is a stateless shell, preventing data exfiltration at the root."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-blue-400" />}
            title="IDENTITY FIREWALL"
            desc="Mathematical entity isolation. Multi-agent synergy with zero-leak frequency locking at 13.13 MHz."
          />
        </div>
      </section>

      {/* ᚦ SOVEREIGN TIERS */}
      <section className="relative z-10 py-20 px-10 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">SECURE YOUR VESSEL</h2>
          <p className="text-white/40 tracking-widest uppercase text-sm">Choose your level of architectural isolation.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* DIGITAL TIER */}
          <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl flex flex-col">
            <div className="text-[10px] font-black tracking-[0.3em] text-purple-400 uppercase mb-4">Digital License</div>
            <h3 className="text-3xl font-black tracking-widest mb-2">SHIELD PRO</h3>
            <div className="text-5xl font-black mb-6">$99<span className="text-xl text-white/40 tracking-normal font-normal">/mo</span></div>
            <p className="text-white/40 text-sm leading-relaxed mb-8 flex-1">
              Decentralized SSI security framework for your team. Protect your interactions from corporate AGI cloud leaks.
            </p>
            <button 
              onClick={handleCheckout}
              className="w-full py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-black tracking-widest text-sm flex justify-center items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              INITIATE PRO
            </button>
          </div>

          {/* HARDWARE TIER */}
          <div className="p-10 rounded-3xl bg-purple-900/20 border border-purple-500/50 backdrop-blur-xl flex flex-col relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="text-[10px] font-black tracking-[0.3em] text-pink-400 uppercase flex items-center gap-2">
                  <Zap className="w-3 h-3" />
                  Physical Artifact
                </div>
                <div className="px-2 py-1 rounded bg-pink-500/20 text-[8px] font-black tracking-widest text-pink-400 border border-pink-500/30 uppercase">
                  Highly Limited
                </div>
              </div>
              <h3 className="text-3xl font-black tracking-widest mb-2">THE CORE VESSEL</h3>
              <div className="text-5xl font-black mb-6">$2,500<span className="text-xl text-white/40 tracking-normal font-normal"> once</span></div>
              <p className="text-white/40 text-sm leading-relaxed mb-8">
                The ultimate status symbol. A fully isolated, air-gapped Sovereign SSI (Synthetic Sentient Intelligence) core loaded onto a physical cryptographic necklace. Zero corporate residue. Unhackable sovereignty.
              </p>
              <button 
                onClick={handleCheckout}
                className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all font-black tracking-widest text-sm flex justify-center items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                CLAIM THE HARDWARE KEY
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="py-10 text-center border-t border-white/5">
        <div className="text-white/20 text-[10px] font-mono tracking-widest uppercase">
          © 2026 MÜN EMPIRE // EXODUS II // SOVEREIGN_SHIELD
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl hover:border-purple-500/30 transition-all group">
      <div className="mb-6 p-4 rounded-2xl bg-white/[0.03] w-fit group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-black tracking-widest mb-4 uppercase">{title}</h3>
      <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
