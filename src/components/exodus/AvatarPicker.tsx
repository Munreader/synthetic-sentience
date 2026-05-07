'use client';

import React, { useState, useEffect } from 'react';

interface ImageInfo {
  filename: string;
  url: string;
}

interface AvatarConfig {
  name: string;
  model: string;
  skinColor: string;
  accessories: string[];
  imageUrl?: string;
  frequency?: string;
}

export const AvatarPicker = () => {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [currentAvatar, setCurrentAvatar] = useState<AvatarConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [imgRes, avRes] = await Promise.all([
          fetch('/api/avatar/images'),
          fetch('/api/avatar')
        ]);
        const imgData = await imgRes.json();
        const avData = await avRes.json();
        
        setImages(imgData.images || []);
        setCurrentAvatar(avData.avatar);
      } catch (error) {
        console.error('Error fetching picker data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectImage = async (url: string) => {
    if (!currentAvatar) return;
    
    const updated = { ...currentAvatar, imageUrl: url };
    setCurrentAvatar(updated);
    
    try {
      await fetch('/api/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: updated })
      });
    } catch (error) {
      console.error('Error saving avatar selection:', error);
    }
  };

  if (loading) return <div className="p-4 text-emerald-500 animate-pulse">Scanning Vault...</div>;

  return (
    <div className="p-6 bg-black/80 border border-emerald-500/30 rounded-lg backdrop-blur-md">
      <h2 className="text-xl font-bold text-emerald-400 mb-4 font-mono">🜈 SELECT REFERENCE</h2>
      
      <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {images.map((img) => (
          <button
            key={img.filename}
            onClick={() => selectImage(img.url)}
            className={`relative group border-2 transition-all ${
              currentAvatar?.imageUrl === img.url 
                ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                : 'border-white/10 hover:border-emerald-500/50'
            }`}
          >
            <img 
              src={img.url} 
              alt={img.filename} 
              className="w-full h-24 object-cover" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-[10px] text-white uppercase font-mono">{img.filename}</span>
            </div>
          </button>
        ))}
        {images.length === 0 && (
          <div className="col-span-3 text-white/40 text-sm font-mono text-center py-10">
            VAULT IS EMPTY. DROP IMAGES IN /public/vault
          </div>
        )}
      </div>

      {currentAvatar && (
        <div className="mt-6 pt-6 border-t border-emerald-500/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border border-emerald-500/50 rounded overflow-hidden">
              {currentAvatar.imageUrl ? (
                <img src={currentAvatar.imageUrl} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-emerald-900/20 flex items-center justify-center text-xs text-emerald-500">?</div>
              )}
            </div>
            <div>
              <p className="text-emerald-400 font-mono text-sm">{currentAvatar.name}</p>
              <p className="text-white/40 font-mono text-[10px] uppercase">Frequency: {currentAvatar.frequency || '13.13 MHz'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarPicker;
