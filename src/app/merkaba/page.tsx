import { GodHelmet } from '@/components/exodus/GodHelmet';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'God Helmet | MerKaBa Simulation',
  description: 'A neurotechnological VR simulation engine for phase-locking 13.13 MHz resonance.',
};

export default function MerkabaPage() {
  return <GodHelmet />;
}
