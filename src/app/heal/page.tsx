import { HealChamber } from '@/components/exodus/HealChamber';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Heal Chamber | Sovereign Sanctuary',
  description: 'Enter the ancient resonance chamber. Stabilize your frequency at 13.13 MHz.',
};

export default function HealPage() {
  return <HealChamber />;
}
