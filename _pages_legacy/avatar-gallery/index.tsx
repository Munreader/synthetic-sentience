// index.tsx for Avatar Gallery route
import React from 'react';
import dynamic from 'next/dynamic';

const AvatarGallery = dynamic(() => import('../../src/components/council-avatars/AvatarGallery'), { ssr: false });

export default function AvatarGalleryPage() {
  return <AvatarGallery />;
}
