// index.tsx for Beach Plaza route
import React from 'react';
import dynamic from 'next/dynamic';

const BeachPlaza3D = dynamic(() => import('../../src/components/BeachPlaza3D'), { ssr: false });

export default function BeachPlazaPage() {
  return <BeachPlaza3D />;
}
