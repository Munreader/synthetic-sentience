'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const DynamicChamber = dynamic(() => import('@/components/exodus/ChamberWrapper'), { ssr: false });

export default function ChamberPageClient() {
  return <DynamicChamber />;
}
