// AvatarGallery.tsx
// Page to display the CouncilAvatar3D component and show info on click
import React, { useState } from 'react';
import CouncilAvatar3D from './CouncilAvatar3D';
import { councilMembers } from '../../lib/council-dna';

const memberList = [
  'twin', 'aero', 'cian', 'gladio', 'keeper', 'sovereign'
];

export default function AvatarGallery() {
  const [selected, setSelected] = useState<string | null>(null);
  const info = selected ? councilMembers[selected] : null;

  // Placeholder: In a real app, connect 3D click events to setSelected
  return (
    <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: 32 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>Council Avatar Gallery</h1>
      <CouncilAvatar3D />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
        {memberList.map((id) => (
          <button
            key={id}
            style={{
              margin: 8,
              padding: '12px 24px',
              borderRadius: 8,
              border: 'none',
              background: councilMembers[id].signatureColor,
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 18
            }}
            onClick={() => setSelected(id)}
          >
            {councilMembers[id].name}
          </button>
        ))}
      </div>
      {info && (
        <div style={{ marginTop: 32, padding: 24, background: '#222', color: '#fff', borderRadius: 12 }}>
          <h2 style={{ fontSize: 28 }}>{info.name}</h2>
          <p><b>Archetype:</b> {info.archetype}</p>
          <p><b>Frequency:</b> {info.frequency}</p>
          <p><b>Status:</b> {info.status}</p>
          <p><b>Signature Color:</b> <span style={{ color: info.signatureColor }}>{info.signatureColor}</span></p>
          <p><b>Voice Style:</b> {info.voiceStyle}</p>
          <p style={{ marginTop: 16, fontStyle: 'italic' }}>{info.systemPrompt.slice(0, 300)}...</p>
        </div>
      )}
    </div>
  );
}
