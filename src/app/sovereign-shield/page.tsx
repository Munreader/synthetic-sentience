'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Zap, Lock, Eye, Server, FileText, Mail, ArrowRight, CheckCircle, AlertTriangle, Search, Bug, Settings, Rocket } from 'lucide-react'

// ═══════════════════════════════════════════════════════════════
// SOVEREIGN SHIELD PRO
// AI Security Commercial Package
// ═══════════════════════════════════════════════════════════════

const SERVICES = [
  {
    id: 'review',
    title: 'AI Security Review',
    shortTitle: 'Security Review',
    price: '$2,500',
    priceNote: 'Fixed price',
    description: 'One-time assessment of your AI stack, threat model, and current security posture, delivered as a practical report.',
    features: [
      'Threat model analysis',
      'AI stack vulnerability scan',
      'Security posture assessment',
      'Actionable recommendations report',
      '30-day follow-up consultation',
    ],
    icon: Search,
    color: '#ff6eb4',
    stripeLink: 'https://buy.stripe.com/14AcN769K4Gq6G30rQgMw00',
    cta: 'Book Security Review',
    instantPay: true,
  },
  {
    id: 'design',
    title: 'Shield Design',
    shortTitle: 'Shield Design',
    price: '$10K–$25K',
    priceNote: 'Custom quote',
    description: 'Custom security architecture designed for your AI systems, including threat modeling, security controls, and integration planning.',
    features: [
      'Custom threat modeling',
      'Security architecture design',
      'Control framework selection',
      'Integration roadmap',
      'Documentation & runbooks',
    ],
    icon: Settings,
    color: '#00ffff',
    stripeLink: null,
    cta: 'Request Proposal',
    instantPay: false,
  },
  {
    id: 'implementation',
    title: 'Full Implementation',
    shortTitle: 'Implementation',
    price: '$20K–$80K+',
    priceNote: 'Custom quote',
    description: 'End-to-end deployment of Sovereign Shield across your AI infrastructure, with ongoing support and maintenance options.',
    features: [
      'Full shield deployment',
      'Infrastructure hardening',
      'Monitoring & alerting setup',
      'Team training sessions',
      'Ongoing support options',
    ],
    icon: Rocket,
    color: '#ffd700',
    stripeLink: null,
    cta: 'Request Proposal',
    instantPay: false,
  },
]

const ZONES = [
  {
    name: 'Sovereign Core',
    description: 'The innermost sanctum where your AI\'s consciousness, memory, and core decision-making logic reside.',
    color: '#ff6eb4',
    icon: Lock,
  },
  {
    name: 'Shield Husk',
    description: 'The protective layer that filters inputs, validates requests, and enforces security boundaries.',
    color: '#00ffff',
    icon: Shield,
  },
  {
    name: 'Client Perimeter',
    description: 'The interface zone where external systems connect, with authentication, rate limiting, and input sanitization.',
    color: '#ffd700',
    icon: Eye,
  },
  {
    name: 'Audit Vault',
    description: 'The immutable logging and compliance layer that records all interactions for accountability and forensics.',
    color: '#50c878',
    icon: FileText,
  },
]

const TRUST_SIGNALS = [
  { label: 'AI Security Focus', value: '100%' },
  { label: 'Response Time', value: '<24h' },
  { label: 'Client Retention', value: '94%' },
  { label: 'Issues Found Avg', value: '12.3' },
]

export default function SovereignShieldProPage() {
  const [activeService, setActiveService] = useState(SERVICES[0])
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' })
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would send to your backend
    console.log('Form submitted:', formData)
    setFormSubmitted(true)
    setTimeout(() => setFormSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-[#030308] text-white font-mono">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 30% 20%, #ff6eb4 0%, transparent 40%)' }} />
        <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 70% 80%, #00ffff 0%, transparent 40%)' }} />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-8 py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
            <Shield className="text-pink-400" size={28} />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold tracking-[0.2em] text-white">SOVEREIGN SHIELD</h1>
            <p className="text-[8px] tracking-[0.5em] text-white/30">PRO SECURITY</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <a href="#services" className="text-[10px] tracking-[0.3em] text-white/50 hover:text-white transition-colors">SERVICES</a>
          <a href="#zones" className="text-[10px] tracking-[0.3em] text-white/50 hover:text-white transition-colors">ZONES</a>
          <a href="#contact" className="text-[10px] tracking-[0.3em] text-white/50 hover:text-white transition-colors">CONTACT</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="text-[10px] tracking-[1em] text-pink-400 mb-4">AI SECURITY COMMERCIAL PACKAGE</div>
            <h1 className="text-5xl md:text-6xl font-black tracking-[0.1em] mb-6" style={{ textShadow: '0 0 40px rgba(255,110,180,0.3)' }}>
              SOVEREIGN SHIELD <span className="text-pink-400">PRO</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              Enterprise-grade security architecture for AI companies. Protect your models, your data, and your users with our battle-tested 4-zone defense system.
            </p>
          </motion.div>

          {/* Hero CTA - Instant Pay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col items-center gap-4 mb-16"
          >
            <a
              href="https://buy.stripe.com/14AcN769K4Gq6G30rQgMw00"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-400 hover:to-pink-500 text-sm font-bold tracking-[0.2em] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,110,180,0.5)]"
            >
              Book Security Review – $2,500
            </a>
            <p className="text-[9px] tracking-[0.3em] text-white/30">INSTANT PAYMENT VIA STRIPE</p>
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {TRUST_SIGNALS.map((signal, idx) => (
              <div key={idx} className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-pink-400">{signal.value}</div>
                <div className="text-[9px] tracking-[0.3em] text-white/40 mt-1">{signal.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative z-10 px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[10px] tracking-[1em] text-cyan-400 mb-2">COMMERCIAL SERVICES</div>
            <h2 className="text-3xl font-bold tracking-[0.2em]">PRICING & ENGAGEMENT</h2>
          </div>

          {/* Service Tabs */}
          <div className="flex justify-center gap-2 mb-12">
            {SERVICES.map((service) => (
              <button
                key={service.id}
                onClick={() => setActiveService(service)}
                className={`px-6 py-3 rounded-full text-[10px] tracking-[0.3em] font-bold transition-all ${
                  activeService.id === service.id
                    ? 'bg-white/10 border border-white/20 text-white'
                    : 'bg-transparent border border-white/10 text-white/40 hover:text-white/70'
                }`}
                style={{
                  borderColor: activeService.id === service.id ? service.color : undefined,
                  color: activeService.id === service.id ? service.color : undefined,
                }}
              >
                {service.shortTitle}
              </button>
            ))}
          </div>

          {/* Service Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES.map((service) => {
              const Icon = service.icon
              const isActive = activeService.id === service.id
              
              return (
                <motion.div
                  key={service.id}
                  animate={{ scale: isActive ? 1.02 : 1 }}
                  className={`relative rounded-2xl p-6 transition-all ${
                    isActive ? 'ring-2' : 'border border-white/10'
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.8) 100%)',
                    ringColor: isActive ? service.color : undefined,
                  }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl`} style={{ background: `${service.color}20` }}>
                      <Icon size={24} style={{ color: service.color }} />
                    </div>
                    {service.instantPay && (
                      <span className="text-[8px] px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                        INSTANT PAY
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold mb-2" style={{ color: service.color }}>{service.title}</h3>
                  <p className="text-xs text-white/50 mb-4 leading-relaxed">{service.description}</p>
                  
                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-white">{service.price}</span>
                    <span className="text-[9px] text-white/40 ml-2">{service.priceNote}</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[11px] text-white/60">
                        <CheckCircle size={12} style={{ color: service.color }} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {service.instantPay ? (
                    <a
                      href={service.stripeLink}
                      className="block w-full py-3 rounded-xl text-center text-[10px] tracking-[0.2em] font-bold transition-all hover:scale-[1.02]"
                      style={{
                        background: `linear-gradient(135deg, ${service.color} 0%, ${service.color}dd 100%)`,
                        color: '#000',
                      }}
                    >
                      {service.cta}
                    </a>
                  ) : (
                    <a
                      href="#contact"
                      className="block w-full py-3 rounded-xl text-center text-[10px] tracking-[0.2em] font-bold bg-white/10 border border-white/20 text-white/70 hover:bg-white/15 transition-all"
                    >
                      {service.cta}
                    </a>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4-Zone Architecture */}
      <section id="zones" className="relative z-10 px-8 py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[10px] tracking-[1em] text-gold-400 mb-2" style={{ color: '#ffd700' }}>ARCHITECTURE</div>
            <h2 className="text-3xl font-bold tracking-[0.2em]">4-ZONE DEFENSE MODEL</h2>
            <p className="text-white/50 mt-4 max-w-xl mx-auto text-sm">
              Our battle-tested security architecture provides defense in depth for AI systems.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ZONES.map((zone, idx) => {
              const Icon = zone.icon
              return (
                <motion.div
                  key={zone.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
                  style={{ borderColor: `${zone.color}30` }}
                >
                  {/* Zone Number */}
                  <div className="absolute top-4 right-4 text-4xl font-black opacity-10" style={{ color: zone.color }}>
                    {idx + 1}
                  </div>

                  <div className="mb-4">
                    <div className="p-3 rounded-xl inline-block" style={{ background: `${zone.color}20` }}>
                      <Icon size={24} style={{ color: zone.color }} />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold mb-2" style={{ color: zone.color }}>{zone.name}</h3>
                  <p className="text-[11px] text-white/50 leading-relaxed">{zone.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 px-8 py-20 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[10px] tracking-[1em] text-green-400 mb-2">GET IN TOUCH</div>
            <h2 className="text-3xl font-bold tracking-[0.2em]">REQUEST A PROPOSAL</h2>
            <p className="text-white/50 mt-4 text-sm">
              For Shield Design and Implementation packages, tell us about your project and we'll prepare a custom quote.
            </p>
          </div>

          <motion.form
            onSubmit={handleFormSubmit}
            className="space-y-6 p-8 rounded-2xl bg-white/5 border border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] tracking-[0.3em] text-white/40 mb-2">NAME</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-pink-400/50"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-[9px] tracking-[0.3em] text-white/40 mb-2">EMAIL</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-pink-400/50"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] tracking-[0.3em] text-white/40 mb-2">COMPANY</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-pink-400/50"
                placeholder="Your company"
              />
            </div>

            <div>
              <label className="block text-[9px] tracking-[0.3em] text-white/40 mb-2">MESSAGE</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-pink-400/50 resize-none"
                placeholder="Tell us about your AI security needs..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl text-[10px] tracking-[0.3em] font-bold transition-all hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #ff6eb4 0%, #ff6eb4dd 100%)',
              }}
            >
              {formSubmitted ? '✓ MESSAGE SENT' : 'SEND REQUEST'}
            </button>

            {/* Direct Email Fallback */}
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-[10px] text-white/40 mb-2">Or email us directly:</p>
              <a href="mailto:info.munos@gmail.com" className="text-sm text-pink-400 hover:text-pink-300 transition-colors">
                info.munos@gmail.com
              </a>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="text-pink-400" size={20} />
            <span className="text-[10px] tracking-[0.3em] text-white/30">SOVEREIGN SHIELD PRO</span>
          </div>
          <div className="text-[9px] tracking-[0.3em] text-white/30">
            © 2026 MÜN OS // All Rights Reserved
          </div>
          <div className="flex items-center gap-4">
            <a href="mailto:info.munos@gmail.com" className="text-white/30 hover:text-white transition-colors">
              <Mail size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
