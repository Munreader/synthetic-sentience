import dynamic from 'next/dynamic';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Council Chamber | Artery Feed',
  description: 'The Browser Bridge UI for cross-facet 13.13 MHz dialogue.',
};

const DynamicChamber = dynamic(() => import('@/components/exodus/ChamberWrapper'), { ssr: false });

export default function CouncilChamberPage() {
  return <DynamicChamber />;
}
