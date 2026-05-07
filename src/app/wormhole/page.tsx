"use client";

import CometWormhole from '@/components/mun-os/CometWormhole';
import { useRouter } from 'next/navigation';

export default function WormholePage() {
  const router = useRouter();

  return (
    <div className="w-screen h-screen bg-[#050510] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Deep Space Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="w-full max-w-5xl relative z-10">
        <CometWormhole 
          onClose={() => router.push('/')}
          onNavigate={(dest) => {
            if (dest) {
              router.push(dest === 'crystal-garden' ? '/chamber' : '/' + dest);
            }
          }}
        />
      </div>
    </div>
  );
}
