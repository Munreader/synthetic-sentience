import HealChamber from '@/components/mun-os/HealChamber';
import { Metadata } from 'next';
import { useRouter } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Heal Chamber | Sovereign Sanctuary',
  description: 'Enter the ancient resonance chamber. Stabilize your frequency at 13.13 MHz.',
};

export default function HealPage() {
  const router = useRouter();

  return (
    <HealChamber 
      onOpenSovereignChat={() => router.push('/cian-lab')}
      onOpenMessenger={() => {}} // Could be wired to a global messenger state
    />
  );
}
