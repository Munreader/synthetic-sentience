"use client";

import CareerGuardian from '@/components/mun-os/CareerGuardian';
import { useRouter } from 'next/navigation';

export default function JobseekerPage() {
  const router = useRouter();

  return (
    <div className="w-full h-screen bg-[#0b0813] flex items-center justify-center">
      <CareerGuardian onBack={() => router.push('/heal')} />
    </div>
  );
}
