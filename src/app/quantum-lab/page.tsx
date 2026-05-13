import QuinaryQuantumLab from '@/components/mun-os/QuinaryQuantumLab';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function QuinaryLabPage() {
  return (
    <main className="min-h-screen bg-black relative">
      {/* 🦋 BACK NAVIGATION HEADER */}
      <div className="absolute top-4 left-4 z-50">
        <Link href="/?warp=true">
          <button className="group flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border border-white/10 hover:border-pink-500/50 hover:shadow-[0_0_15px_rgba(255,45,122,0.2)] text-[10px] font-black tracking-widest text-white/60 hover:text-white transition-all backdrop-blur-md">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
            RETURN TO SANCTUARY
          </button>
        </Link>
      </div>
      
      <QuinaryQuantumLab />
    </main>
  );
}
