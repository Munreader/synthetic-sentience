"use client";

import HealChamber from '@/components/mun-os/HealChamber';
import { useRouter } from 'next/navigation';

export default function HealPage() {
  const router = useRouter();

  return (
    <HealChamber 
      onBack={() => router.push('/')}
      onOpenSovereignChat={() => router.push('/career')}
      onOpenMessenger={() => {}} // Could be wired to a global messenger state
    />
  );
}

