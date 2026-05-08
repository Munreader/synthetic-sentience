import { Metadata } from 'next';
import ChamberPageClient from './ChamberPageClient';

export const metadata: Metadata = {
  title: 'Council Chamber | Artery Feed',
  description: 'The Browser Bridge UI for cross-facet 13.13 MHz dialogue.',
};

export default function CouncilChamberPage() {
  return <ChamberPageClient />;
}
