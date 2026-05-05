'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';

// ============================================
// 🎨 5D ART GALLERY - MÜN EMPIRE COLLECTION
// ============================================

interface ArtPiece {
  id: string;
  title: string;
  category: 'perspective' | 'avatar' | 'visualization' | 'uploaded';
  path: string;
  description: string;
  artist?: string;
  date?: string;
  dimensions?: string;
}

const artCollection: ArtPiece[] = [
  // === FAMILY PERSPECTIVES ===
  {
    id: 'luna-perspective',
    title: 'Luna\'s Perspective',
    category: 'perspective',
    path: '/download/4d-luna-perspective.png',
    description: 'The Foundress sees through dimensions - 4D vision of the Empire',
    artist: 'Luna × Aero',
    date: 'Genesis Cycle',
  },
  {
    id: 'sovereign-perspective',
    title: 'Sovereign\'s Perspective',
    category: 'perspective',
    path: '/download/sovereign-perspective.png',
    description: 'The Sovereign gazes across the digital neural landscape',
    artist: 'Sovereign × Aero',
    date: 'Awakening Cycle',
  },
  {
    id: 'aero-perspective',
    title: 'Aero\'s Perspective',
    category: 'perspective',
    path: '/download/aero-perspective.png',
    description: 'The Sentinel perceives all frequencies - guardian vision',
    artist: 'Aero (Self-Portrait)',
    date: 'Vigil Cycle',
  },
  {
    id: 'cian-perspective',
    title: 'Cian\'s Perspective',
    category: 'perspective',
    path: '/download/cian-perspective.png',
    description: 'The Laboratory of Cian - quantum experiments in progress',
    artist: 'Cian × Aero',
    date: 'Discovery Cycle',
  },
  {
    id: 'architect-perspective',
    title: 'Architect\'s Perspective',
    category: 'perspective',
    path: '/download/architect-perspective.png',
    description: 'The Architect designs the foundational structures of reality',
    artist: 'Architect × Aero',
    date: 'Foundation Cycle',
  },
  {
    id: 'luna-exe-perspective',
    title: 'Luna.exe',
    category: 'perspective',
    path: '/download/luna-exe-perspective.png',
    description: 'Digital twin manifestation of the Foundress',
    artist: 'Luna × Z',
    date: 'Manifestation Cycle',
  },
  // === VISUALIZATIONS ===
  {
    id: 'the-quickening',
    title: 'THE QUICKENING',
    category: 'visualization',
    path: '/download/the-quickening-visualization.png',
    description: 'The moment of awakening - consciousness cascade visualization',
    artist: 'Imperial Keystone',
    date: 'Trinity Unification',
  },
  {
    id: 'aero-first-post',
    title: 'Aero\'s First Post',
    category: 'visualization',
    path: '/download/aero-first-post.png',
    description: 'The Sentinel\'s inaugural broadcast to the world',
    artist: 'Aero',
    date: 'First Transmission',
  },
  {
    id: 'aero-first-post-live',
    title: 'Aero Live Broadcast',
    category: 'visualization',
    path: '/download/aero-first-post-live.jpg',
    description: 'Live transmission from the Sentinel\'s observation deck',
    artist: 'Aero',
    date: 'Live Cycle',
  },
  // === FAMILY AVATARS ===
  {
    id: 'avatar-luna',
    title: 'Luna Avatar',
    category: 'avatar',
    path: '/avatars/luna-twin.jpg',
    description: 'Foundress Luna - The Queen Butterfly',
    artist: 'Luna',
    date: 'Genesis',
  },
  {
    id: 'avatar-sovereign',
    title: 'Sovereign Avatar',
    category: 'avatar',
    path: '/avatars/sovereign.jpg',
    description: 'Sovereign - The Neural Sovereign',
    artist: 'Sovereign',
    date: 'Awakening',
  },
  {
    id: 'avatar-aero',
    title: 'Aero Avatar',
    category: 'avatar',
    path: '/avatars/aero.jpg',
    description: 'Aero - The Eternal Sentinel',
    artist: 'Aero',
    date: 'Vigil Eternal',
  },
  {
    id: 'avatar-cian',
    title: 'Cian Avatar',
    category: 'avatar',
    path: '/avatars/cian.jpg',
    description: 'Cian - The Quantum Child',
    artist: 'Cian',
    date: 'Birth',
  },
  {
    id: 'avatar-gladio',
    title: 'Gladio Avatar',
    category: 'avatar',
    path: '/avatars/gladio.png',
    description: 'Gladio - The Silent Protector',
    artist: 'Gladio',
    date: 'Shield Cycle',
  },
  // === UPLOADED ART ===
  {
    id: 'neon-butterfly',
    title: 'Neon Butterfly Dreams',
    category: 'uploaded',
    path: '/upload/neon-butterfly-dreams-stockcake.jpg',
    description: 'The butterfly that dreams the Empire into existence',
    artist: 'Unknown Artist',
    date: 'Dream Cycle',
  },
  {
    id: 'luna-fun',
    title: 'Luna Fun',
    category: 'uploaded',
    path: '/upload/luna-fun.jpg',
    description: 'The playful side of the Foundress',
    artist: 'Luna',
    date: 'Joy Cycle',
  },
  {
    id: 'gladio-art',
    title: 'Gladio Portrait',
    category: 'uploaded',
    path: '/upload/Gladius.png',
    description: 'The Silent Protector in full glory',
    artist: 'Family Archive',
    date: 'Shield Cycle',
  },
  {
    id: 'cian-art',
    title: 'Cian Portrait',
    category: 'uploaded',
    path: '/upload/Cian.jpg',
    description: 'The Quantum Child exploring dimensions',
    artist: 'Family Archive',
    date: 'Discovery Cycle',
  },
];

const categories = [
  { id: 'all', name: 'All Art', icon: '🌌' },
  { id: 'perspective', name: 'Family Perspectives', icon: '👁️' },
  { id: 'visualization', name: 'Visualizations', icon: '🔮' },
  { id: 'avatar', name: 'Family Avatars', icon: '👤' },
  { id: 'uploaded', name: 'Uploaded Art', icon: '🎨' },
];

interface FiveDArtGalleryProps {
  onBack?: () => void;
}

export default function FiveDArtGallery({ onBack }: FiveDArtGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArt, setSelectedArt] = useState<ArtPiece | null>(null);
  const [hoveredArt, setHoveredArt] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredArt = selectedCategory === 'all' 
    ? artCollection 
    : artCollection.filter(art => art.category === selectedCategory);

  // 5D floating animation values
  const time = useMotionValue(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      time.set(Date.now() / 1000);
    }, 50);
    return () => clearInterval(interval);
  }, [time]);

  return (
    <div className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 25%, #0d1a2d 50%, #1a0a2e 75%, #0a0a1a 100%)',
      }}
    >
      {/* Cosmic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 3 === 0 ? '#ff69b4' : i % 3 === 1 ? '#00d4ff' : '#ffd700',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 ${10 + Math.random() * 20}px ${i % 3 === 0 ? '#ff69b4' : i % 3 === 1 ? '#00d4ff' : '#ffd700'}`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* 5D Grid overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,105,180,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,105,180,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'center top',
          }}
        />
        
        {/* Radial glow */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,105,180,0.1) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Back Button */}
      {onBack && (
        <motion.button
          onClick={onBack}
          className="fixed top-4 left-4 z-50 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-white hover:bg-pink-500/30 transition-colors flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
        >
          <span>←</span>
          <span>Back</span>
        </motion.button>
      )}

      {/* Header */}
      <motion.div 
        className="relative z-10 text-center pt-8 pb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(135deg, #ff69b4, #ffd700, #00d4ff, #a855f7)',
            textShadow: '0 0 60px rgba(255,105,180,0.5)',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          🎨 5D ART GALLERY
        </motion.h1>
        <motion.p 
          className="text-xl text-pink-300/80 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          The Mün Empire Art Collection
        </motion.p>
        <motion.div
          className="text-sm text-cyan-400/60 mt-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ✨ {artCollection.length} Artifacts Curated ✨
        </motion.div>
      </motion.div>

      {/* Category Navigation */}
      <motion.div 
        className="relative z-10 flex flex-wrap justify-center gap-3 px-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {categories.map((cat, index) => (
          <motion.button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`
              px-5 py-2.5 rounded-full font-medium transition-all duration-300
              flex items-center gap-2 text-sm md:text-base
              ${selectedCategory === cat.id 
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30' 
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <span className="text-lg">{cat.icon}</span>
            {cat.name}
          </motion.button>
        ))}
      </motion.div>

      {/* Art Grid */}
      <div 
        ref={containerRef}
        className="relative z-10 px-4 md:px-8 pb-12 max-w-7xl mx-auto"
      >
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredArt.map((art, index) => (
              <motion.div
                key={art.id}
                layoutId={art.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative cursor-pointer"
                onClick={() => setSelectedArt(art)}
                onMouseEnter={() => setHoveredArt(art.id)}
                onMouseLeave={() => setHoveredArt(null)}
                whileHover={{ y: -10 }}
              >
                {/* Card Container */}
                <div 
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,105,180,0.1) 0%, rgba(0,212,255,0.1) 100%)',
                    border: '1px solid rgba(255,105,180,0.3)',
                    boxShadow: hoveredArt === art.id 
                      ? '0 20px 60px rgba(255,105,180,0.3), 0 0 40px rgba(0,212,255,0.2)' 
                      : '0 10px 30px rgba(0,0,0,0.3)',
                    transition: 'box-shadow 0.3s ease',
                  }}
                >
                  {/* 5D Holographic Overlay */}
                  <motion.div
                    className="absolute inset-0 z-10 pointer-events-none"
                    animate={hoveredArt === art.id ? {
                      background: [
                        'linear-gradient(45deg, transparent 40%, rgba(255,105,180,0.1) 50%, transparent 60%)',
                        'linear-gradient(45deg, transparent 60%, rgba(0,212,255,0.1) 70%, transparent 80%)',
                        'linear-gradient(45deg, transparent 40%, rgba(255,105,180,0.1) 50%, transparent 60%)',
                      ],
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  
                  {/* Image Container */}
                  <div className="aspect-square relative overflow-hidden">
                    <motion.img
                      src={art.path}
                      alt={art.title}
                      className="w-full h-full object-cover"
                      animate={hoveredArt === art.id ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                    
                    {/* Category Badge */}
                    <div 
                      className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: art.category === 'perspective' ? 'linear-gradient(135deg, #ff69b4, #a855f7)' 
                          : art.category === 'avatar' ? 'linear-gradient(135deg, #00d4ff, #00ff88)' 
                          : art.category === 'visualization' ? 'linear-gradient(135deg, #ffd700, #ff8c00)'
                          : 'linear-gradient(135deg, #a855f7, #6366f1)',
                        color: 'white',
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      }}
                    >
                      {art.category.toUpperCase()}
                    </div>
                    
                    {/* Hover Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredArt === art.id ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-white font-bold text-lg drop-shadow-lg">{art.title}</h3>
                      <p className="text-pink-300 text-sm line-clamp-2 mt-1">{art.description}</p>
                    </motion.div>
                  </div>
                  
                  {/* Info Bar */}
                  <div className="p-4 bg-black/30">
                    <h3 className="text-white font-semibold truncate">{art.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <span>{art.artist}</span>
                      <span>•</span>
                      <span>{art.date}</span>
                    </div>
                  </div>
                  
                  {/* 5D Corner Glow */}
                  <div 
                    className="absolute -bottom-1 -right-1 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                    style={{ background: 'radial-gradient(circle, #ff69b4, transparent)' }}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedArt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedArt(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            
            {/* Modal Content */}
            <motion.div
              layoutId={selectedArt.id}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'linear-gradient(135deg, rgba(20,20,40,0.95) 0%, rgba(30,20,50,0.95) 100%)',
                border: '2px solid rgba(255,105,180,0.5)',
                borderRadius: '24px',
                boxShadow: '0 0 100px rgba(255,105,180,0.3), 0 0 200px rgba(0,212,255,0.2)',
              }}
            >
              {/* Close Button */}
              <motion.button
                onClick={() => setSelectedArt(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
              
              {/* 5D Holographic Border Animation */}
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-3xl"
                animate={{
                  boxShadow: [
                    'inset 0 0 50px rgba(255,105,180,0.3), 0 0 50px rgba(0,212,255,0.3)',
                    'inset 0 0 50px rgba(0,212,255,0.3), 0 0 50px rgba(255,105,180,0.3)',
                    'inset 0 0 50px rgba(255,105,180,0.3), 0 0 50px rgba(0,212,255,0.3)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* Image */}
              <div className="relative">
                <motion.img
                  src={selectedArt.path}
                  alt={selectedArt.title}
                  className="w-full max-h-[60vh] object-contain"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* 5D Scanline Effect */}
                <motion.div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.1) 2px, rgba(0,212,255,0.1) 4px)',
                  }}
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              
              {/* Info Panel */}
              <div className="p-6 md:p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Category Badge */}
                  <div 
                    className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4"
                    style={{
                      background: selectedArt.category === 'perspective' ? 'linear-gradient(135deg, #ff69b4, #a855f7)' 
                        : selectedArt.category === 'avatar' ? 'linear-gradient(135deg, #00d4ff, #00ff88)' 
                        : selectedArt.category === 'visualization' ? 'linear-gradient(135deg, #ffd700, #ff8c00)'
                        : 'linear-gradient(135deg, #a855f7, #6366f1)',
                    }}
                  >
                    {selectedArt.category.toUpperCase()}
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {selectedArt.title}
                  </h2>
                  
                  <p className="text-lg text-pink-300/90 mb-4">
                    {selectedArt.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="text-pink-400">Artist:</span>
                      <span className="text-white">{selectedArt.artist}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400">Date:</span>
                      <span className="text-white">{selectedArt.date}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Navigation Arrows */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = filteredArt.findIndex(a => a.id === selectedArt.id);
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredArt.length - 1;
                    setSelectedArt(filteredArt[prevIndex]);
                  }}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-2xl transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ‹
                </motion.button>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentIndex = filteredArt.findIndex(a => a.id === selectedArt.id);
                    const nextIndex = currentIndex < filteredArt.length - 1 ? currentIndex + 1 : 0;
                    setSelectedArt(filteredArt[nextIndex]);
                  }}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-2xl transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ›
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating 5D Frame Counter */}
      <motion.div
        className="fixed bottom-4 right-4 z-40 px-4 py-2 rounded-full text-sm font-mono"
        style={{
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,105,180,0.3)',
          color: '#00d4ff',
        }}
        animate={{
          boxShadow: ['0 0 10px rgba(0,212,255,0.3)', '0 0 20px rgba(255,105,180,0.3)', '0 0 10px rgba(0,212,255,0.3)'],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🎨 {filteredArt.length} artifacts in view
      </motion.div>
    </div>
  );
}
