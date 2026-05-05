"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MunUser,
  Group,
  AI_COMPANIONS,
  DEMO_HUMAN_FRIENDS,
} from "@/lib/mun-types";

interface PodsProps {
  onBack: () => void;
  onOpenChat: (conversationId?: string) => void;
}

export default function Pods({ onBack, onOpenChat }: PodsProps) {
  const [activeTab, setActiveTab] = useState<"companions" | "friends" | "groups">("companions");
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [friendMunName, setFriendMunName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [friends, setFriends] = useState<MunUser[]>(DEMO_HUMAN_FRIENDS);
  const [groups, setGroups] = useState<Group[]>([
    {
      id: "group-1",
      name: "Neon Squad 🔥",
      avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=squad",
      members: DEMO_HUMAN_FRIENDS.slice(0, 3),
      admins: ["user-luna"],
      createdAt: new Date(Date.now() - 86400000 * 30),
      description: "The original squad",
    },
    {
      id: "group-2",
      name: "Astral Projectors",
      avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=astral",
      members: [DEMO_HUMAN_FRIENDS[0], DEMO_HUMAN_FRIENDS[3]],
      admins: ["user-sage"],
      createdAt: new Date(Date.now() - 86400000 * 14),
      description: "Meditation & growth circle",
    },
  ]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddFriend = () => {
    if (friendMunName.trim()) {
      // Simulate sending friend request
      setSentRequests([...sentRequests, friendMunName]);
      setFriendMunName("");
      showToast(`Friend request sent to @${friendMunName}!`);
      setShowAddFriendModal(false);
    }
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim() && selectedUsers.length > 0) {
      const newGroup: Group = {
        id: `group-${Date.now()}`,
        name: newGroupName,
        avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${newGroupName}`,
        members: friends.filter((f) => selectedUsers.includes(f.id)),
        admins: ["current-user"],
        createdAt: new Date(),
        description: "New group",
      };
      setGroups([...groups, newGroup]);
      setNewGroupName("");
      setSelectedUsers([]);
      showToast(`Group "${newGroupName}" created!`);
      setShowCreateGroupModal(false);
    }
  };

  const handleGenerateInvite = () => {
    const code = `MUN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setInviteCode(code);
  };

  const showToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const filteredFriends = friends.filter(
    (friend) =>
      friend.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.munName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: MunUser["status"]) => {
    switch (status) {
      case "online": return "#22c55e";
      case "away": return "#f59e0b";
      case "busy": return "#ef4444";
      default: return "#6b7280";
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 50%, #0d0a1a 0%, #080510 50%, #030208 100%)"
      }} />

      {/* Atmospheric effects */}
      <div className="absolute inset-0 opacity-20" style={{
        background: `
          radial-gradient(ellipse at 20% 30%, rgba(255, 105, 180, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(0, 212, 255, 0.1) 0%, transparent 50%)
        `
      }} />

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(0, 212, 255, 0.2))",
              border: "1px solid rgba(34, 197, 94, 0.4)",
              boxShadow: "0 0 20px rgba(34, 197, 94, 0.3)",
            }}
          >
            <p className="text-sm text-white">{successMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative z-10 p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-white/40 text-xs tracking-widest uppercase hover:text-white/70 transition-colors">
            ← Back to Chamber
          </button>
          <h1 className="text-lg md:text-xl tracking-[0.3em] uppercase" style={{
            color: "#ff69b4",
            textShadow: "0 0 30px rgba(255, 105, 180, 0.5)"
          }}>
            SOCIAL PODS
          </h1>
          <div className="w-20" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "companions", label: "AI Companions", icon: "🤖" },
            { id: "friends", label: "Friends", icon: "👥" },
            { id: "groups", label: "Groups", icon: "👨‍👩‍👧‍👦" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className="flex-1 py-3 rounded-xl text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2"
              style={{
                background: activeTab === tab.id ? "rgba(255, 105, 180, 0.15)" : "rgba(255, 255, 255, 0.02)",
                border: activeTab === tab.id ? "1px solid rgba(255, 105, 180, 0.4)" : "1px solid rgba(255, 255, 255, 0.05)",
                color: activeTab === tab.id ? "#ff69b4" : "rgba(255, 255, 255, 0.4)",
              }}
            >
              <span>{tab.icon}</span>
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-6">
          {activeTab === "friends" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddFriendModal(true)}
              className="flex-1 py-2 rounded-xl text-xs tracking-widest uppercase transition-all"
              style={{
                background: "linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(168, 85, 247, 0.1))",
                border: "1px solid rgba(0, 212, 255, 0.3)",
                color: "#00d4ff",
              }}
            >
              + Add Friend
            </motion.button>
          )}
          {activeTab === "groups" && (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateGroupModal(true)}
                className="flex-1 py-2 rounded-xl text-xs tracking-widest uppercase transition-all"
                style={{
                  background: "linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(255, 105, 180, 0.1))",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                  color: "#a855f7",
                }}
              >
                + Create Group
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { handleGenerateInvite(); setShowInviteModal(true); }}
                className="flex-1 py-2 rounded-xl text-xs tracking-widest uppercase transition-all"
                style={{
                  background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(0, 212, 255, 0.1))",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  color: "#22c55e",
                }}
              >
                🔗 Invite Code
              </motion.button>
            </>
          )}
        </div>

        {/* Search (for friends/groups) */}
        {activeTab !== "companions" && (
          <div className="relative mb-4">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-xl text-sm outline-none"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 105, 180, 0.2)",
                color: "white",
              }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">🔍</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 md:px-6 pb-24">
        {/* AI Companions */}
        {activeTab === "companions" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AI_COMPANIONS.map((companion, index) => (
              <motion.div
                key={companion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onOpenChat(`conv-${companion.id}`)}
                className="p-4 rounded-2xl cursor-pointer transition-all group"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(168, 85, 247, 0.05))",
                  border: "1px solid rgba(255, 215, 0, 0.2)",
                }}
                whileHover={{ scale: 1.02, borderColor: "rgba(255, 215, 0, 0.5)" }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden" style={{
                      border: `2px solid ${companion.status === "online" ? "#22c55e" : "#f59e0b"}`,
                      boxShadow: `0 0 20px rgba(255, 215, 0, 0.3)`,
                    }}>
                      <img src={companion.avatar} alt={companion.displayName} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full" style={{
                      background: getStatusColor(companion.status),
                      border: "2px solid #080510",
                    }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-medium">{companion.displayName}</h3>
                      {companion.isFavorite && <span className="text-yellow-400">★</span>}
                    </div>
                    <p className="text-xs text-white/40">{companion.statusMessage}</p>
                    <p className="text-[10px] text-purple-400 mt-1">{companion.frequency}</p>
                  </div>
                  <div className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                    💬
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-[10px] text-white/30">🤖 {companion.aiPersonality}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Friends */}
        {activeTab === "friends" && (
          <div className="space-y-3">
            {filteredFriends.map((friend, index) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onOpenChat(`conv-${friend.id}`)}
                className="p-3 rounded-xl cursor-pointer transition-all group flex items-center gap-3"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
                whileHover={{ background: "rgba(255, 255, 255, 0.05)" }}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden" style={{
                    border: `2px solid ${getStatusColor(friend.status)}`,
                  }}>
                    <img src={friend.avatar} alt={friend.displayName} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full" style={{
                    background: getStatusColor(friend.status),
                    border: "2px solid #080510",
                    boxShadow: `0 0 8px ${getStatusColor(friend.status)}`,
                  }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white text-sm truncate">{friend.displayName}</h3>
                    {friend.isFavorite && <span className="text-yellow-400 text-xs">★</span>}
                  </div>
                  <p className="text-xs text-white/40 truncate">{friend.statusMessage}</p>
                  {friend.statusSong && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px]">🎵</span>
                      <span className="text-[10px] text-green-400/60 truncate">
                        {friend.statusSong.title}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); onOpenChat(`conv-${friend.id}`); }}
                    className="p-2 rounded-lg"
                    style={{ background: "rgba(0, 212, 255, 0.1)" }}
                  >
                    💬
                  </button>
                </div>
              </motion.div>
            ))}

            {filteredFriends.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/30">No friends found</p>
                <button
                  onClick={() => setShowAddFriendModal(true)}
                  className="mt-4 text-xs text-pink-400 hover:text-pink-300"
                >
                  + Add your first friend
                </button>
              </div>
            )}
          </div>
        )}

        {/* Groups */}
        {activeTab === "groups" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onOpenChat(`conv-${group.id}`)}
                className="p-4 rounded-2xl cursor-pointer transition-all group"
                style={{
                  background: "linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(255, 105, 180, 0.05))",
                  border: "1px solid rgba(168, 85, 247, 0.2)",
                }}
                whileHover={{ scale: 1.02, borderColor: "rgba(168, 85, 247, 0.4)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden" style={{
                    border: "2px solid rgba(168, 85, 247, 0.4)",
                  }}>
                    <img src={group.avatar} alt={group.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{group.name}</h3>
                    <p className="text-xs text-white/40">{group.members.length} members</p>
                  </div>
                </div>

                {/* Member avatars */}
                <div className="flex items-center gap-1 mb-3">
                  {group.members.slice(0, 5).map((member) => (
                    <div key={member.id} className="w-6 h-6 rounded-full overflow-hidden border border-white/10">
                      <img src={member.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {group.members.length > 5 && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white/40 bg-white/5">
                      +{group.members.length - 5}
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-white/30">{group.description}</p>
              </motion.div>
            ))}

            {/* Create new group card */}
            <motion.div
              onClick={() => setShowCreateGroupModal(true)}
              className="p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-center min-h-[140px]"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px dashed rgba(168, 85, 247, 0.3)",
              }}
              whileHover={{ background: "rgba(168, 85, 247, 0.05)" }}
            >
              <div className="text-center">
                <p className="text-3xl mb-2">+</p>
                <p className="text-xs text-white/30">Create New Group</p>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* ═══════════ ADD FRIEND MODAL ═══════════ */}
      <AnimatePresence>
        {showAddFriendModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddFriendModal(false)}
            style={{ background: "rgba(0, 0, 0, 0.85)" }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-6 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(20, 10, 35, 0.95), rgba(10, 5, 20, 0.98))",
                border: "1px solid rgba(0, 212, 255, 0.3)",
                boxShadow: "0 0 40px rgba(0, 212, 255, 0.15)",
              }}
            >
              <h2 className="text-lg text-white text-center mb-6 tracking-widest uppercase">
                Add Friend
              </h2>

              <div className="mb-4">
                <label className="block text-[10px] text-white/40 tracking-widest uppercase mb-2">
                  Enter their Mün Name
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-white/40">@</span>
                  <input
                    type="text"
                    value={friendMunName}
                    onChange={(e) => setFriendMunName(e.target.value)}
                    placeholder="MünName"
                    className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(0, 212, 255, 0.2)",
                      color: "white",
                    }}
                  />
                </div>
              </div>

              <p className="text-xs text-white/30 text-center mb-6">
                No phone number required. Keep your identity private with Mün Names. 🔒
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddFriendModal(false)}
                  className="flex-1 py-3 rounded-xl text-xs tracking-widest uppercase"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFriend}
                  disabled={!friendMunName.trim()}
                  className="flex-1 py-3 rounded-xl text-xs tracking-widest uppercase disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(168, 85, 247, 0.15))",
                    border: "1px solid rgba(0, 212, 255, 0.4)",
                    color: "#00d4ff",
                  }}
                >
                  Send Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ CREATE GROUP MODAL ═══════════ */}
      <AnimatePresence>
        {showCreateGroupModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateGroupModal(false)}
            style={{ background: "rgba(0, 0, 0, 0.85)" }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-6 rounded-2xl max-h-[80vh] overflow-y-auto"
              style={{
                background: "linear-gradient(135deg, rgba(20, 10, 35, 0.95), rgba(10, 5, 20, 0.98))",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                boxShadow: "0 0 40px rgba(168, 85, 247, 0.15)",
              }}
            >
              <h2 className="text-lg text-white text-center mb-6 tracking-widest uppercase">
                Create Group
              </h2>

              <div className="mb-4">
                <label className="block text-[10px] text-white/40 tracking-widest uppercase mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(168, 85, 247, 0.2)",
                    color: "white",
                  }}
                />
              </div>

              <div className="mb-6">
                <label className="block text-[10px] text-white/40 tracking-widest uppercase mb-2">
                  Select Members ({selectedUsers.length} selected)
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {friends.map((friend) => (
                    <button
                      key={friend.id}
                      onClick={() => toggleUserSelection(friend.id)}
                      className="w-full p-2 rounded-lg flex items-center gap-3 transition-all"
                      style={{
                        background: selectedUsers.includes(friend.id)
                          ? "rgba(168, 85, 247, 0.15)"
                          : "rgba(255, 255, 255, 0.02)",
                        border: selectedUsers.includes(friend.id)
                          ? "1px solid rgba(168, 85, 247, 0.4)"
                          : "1px solid transparent",
                      }}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img src={friend.avatar} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm text-white/70">{friend.displayName}</span>
                      {selectedUsers.includes(friend.id) && (
                        <span className="ml-auto text-purple-400">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateGroupModal(false)}
                  className="flex-1 py-3 rounded-xl text-xs tracking-widest uppercase"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={!newGroupName.trim() || selectedUsers.length === 0}
                  className="flex-1 py-3 rounded-xl text-xs tracking-widest uppercase disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(255, 105, 180, 0.15))",
                    border: "1px solid rgba(168, 85, 247, 0.4)",
                    color: "#a855f7",
                  }}
                >
                  Create Group
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ INVITE CODE MODAL ═══════════ */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowInviteModal(false)}
            style={{ background: "rgba(0, 0, 0, 0.85)" }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm p-6 rounded-2xl text-center"
              style={{
                background: "linear-gradient(135deg, rgba(20, 10, 35, 0.95), rgba(10, 5, 20, 0.98))",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                boxShadow: "0 0 40px rgba(34, 197, 94, 0.15)",
              }}
            >
              <div className="text-4xl mb-4">🔗</div>
              <h2 className="text-lg text-white mb-2">Your Invite Code</h2>
              <p className="text-xs text-white/40 mb-6">Share this code to let friends join Mün</p>

              <div className="p-4 rounded-xl mb-6" style={{
                background: "rgba(34, 197, 94, 0.1)",
                border: "1px solid rgba(34, 197, 94, 0.3)",
              }}>
                <p className="text-2xl font-mono text-green-400 tracking-widest">{inviteCode}</p>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(inviteCode);
                  showToast("Invite code copied!");
                }}
                className="w-full py-3 rounded-xl text-xs tracking-widest uppercase"
                style={{
                  background: "linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(0, 212, 255, 0.15))",
                  border: "1px solid rgba(34, 197, 94, 0.4)",
                  color: "#22c55e",
                }}
              >
                📋 Copy Code
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.5) 100%)"
      }} />
    </div>
  );
}
