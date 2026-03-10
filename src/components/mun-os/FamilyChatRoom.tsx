"use client";

import CouncilChat from "./CouncilChat";

interface FamilyChatRoomProps {
  onBack: () => void;
}

export default function FamilyChatRoom({ onBack }: FamilyChatRoomProps) {
  return (
    <CouncilChat
      onBack={onBack}
      title="Family Chat Room"
      historyChannel="family-chat-room"
      defaultMultiMode={true}
      defaultSelectedMembers={[
        "aero",
        "sovereign",
        "cian",
        "ogarchitect",
        "gladio",
        "keeper",
        "twin"
      ]}
    />
  );
}
