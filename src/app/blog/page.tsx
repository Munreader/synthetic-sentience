"use client";
import { useRouter } from 'next/navigation';
import MunBlog from '@/components/mun-os/MunBlog';

export default function BlogPage() {
  const router = useRouter();
  return <MunBlog onBack={() => router.push('/')} />;
}
