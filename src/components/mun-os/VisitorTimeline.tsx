"use client";
// VisitorTimeline - Personal timeline for visitors to post and share
// Part of VISITOR MODE - Unlocked for all users

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimelinePost {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  likes: number;
  likedBy: string[];
}

interface VisitorTimelineProps {
  onBack: () => void;
  userId: string;
  userName: string;
}

const STORAGE_KEY = "mun-visitor-timeline";

export function getTimelinePosts(): TimelinePost[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveTimelinePosts(posts: TimelinePost[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export default function VisitorTimeline({ onBack, userId, userName }: VisitorTimelineProps) {
  const [posts, setPosts] = useState<TimelinePost[]>(() => getTimelinePosts());
  const [newPost, setNewPost] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = () => {
    if (!newPost.trim()) return;

    setIsPosting(true);

    const post: TimelinePost = {
      id: `post-${Date.now()}`,
      userId,
      userName,
      content: newPost.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: [],
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    saveTimelinePosts(updatedPosts);
    setNewPost("");

    setTimeout(() => setIsPosting(false), 500);
  };

  const handleLike = (postId: string) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const alreadyLiked = post.likedBy.includes(userId);
        return {
          ...post,
          likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
          likedBy: alreadyLiked
            ? post.likedBy.filter(id => id !== userId)
            : [...post.likedBy, userId],
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    saveTimelinePosts(updatedPosts);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  // Filter to show only user's posts (their own timeline)
  const myPosts = posts.filter(post => post.userId === userId);

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex flex-col" style={{ background: "linear-gradient(180deg, #0a0612 0%, #0d0818 50%, #080510 100%)" }}>

      {/* Atmospheric Background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse at 50% 0%, rgba(0, 212, 255, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 100%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)
        `
      }} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 px-4 py-3 flex items-center justify-between border-b border-white/5"
      >
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-xs tracking-wider uppercase">Back</span>
        </motion.button>

        <h1 className="text-base font-semibold tracking-[0.2em] uppercase" style={{ color: "#00d4ff", textShadow: "0 0 20px rgba(0, 212, 255, 0.5)" }}>
          MY TIMELINE
        </h1>

        <div className="w-16" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">

        {/* Post Composer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-4 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)",
            border: "1px solid rgba(0, 212, 255, 0.3)",
          }}
        >
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(0, 212, 255, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <span className="text-lg">👤</span>
            </div>

            {/* Input */}
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full bg-transparent text-white text-sm outline-none resize-none placeholder-white/30"
                rows={3}
                maxLength={280}
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-white/30 text-xs">{newPost.length}/280</span>
                <motion.button
                  onClick={handlePost}
                  disabled={!newPost.trim() || isPosting}
                  className="px-4 py-2 rounded-xl text-xs tracking-wider uppercase font-medium transition-all disabled:opacity-30"
                  style={{
                    background: newPost.trim()
                      ? "linear-gradient(135deg, rgba(0, 212, 255, 0.3) 0%, rgba(168, 85, 247, 0.2) 100%)"
                      : "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(0, 212, 255, 0.4)",
                    color: "#00d4ff",
                  }}
                  whileHover={newPost.trim() ? { scale: 1.02 } : {}}
                  whileTap={newPost.trim() ? { scale: 0.98 } : {}}
                >
                  {isPosting ? "Posting..." : "Post"}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Timeline Posts */}
        <div className="flex flex-col gap-3">
          <p className="text-white/30 text-[10px] tracking-widest uppercase px-1">Your Posts ({myPosts.length})</p>

          <AnimatePresence>
            {myPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <span className="text-4xl mb-4 block">📝</span>
                <p className="text-white/40 text-sm">No posts yet</p>
                <p className="text-white/20 text-xs mt-1">Share your first thought above!</p>
              </motion.div>
            ) : (
              myPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative p-4 rounded-2xl"
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  {/* Post Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)",
                      }}
                    >
                      <span className="text-sm">👤</span>
                    </div>
                    <div>
                      <p className="text-white/80 text-sm font-medium">{post.userName}</p>
                      <p className="text-white/30 text-[10px]">{formatTime(post.timestamp)}</p>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-white/70 text-sm leading-relaxed mb-3">{post.content}</p>

                  {/* Post Actions */}
                  <div className="flex items-center gap-4">
                    <motion.button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1 text-xs"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className={post.likedBy.includes(userId) ? "text-pink-400" : "text-white/30"}>
                        {post.likedBy.includes(userId) ? "❤️" : "🤍"}
                      </span>
                      <span className="text-white/40">{post.likes}</span>
                    </motion.button>

                    <span className="text-white/20 text-[10px]">• 13.13 MHz</span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.5) 100%)"
      }} />
    </div>
  );
}
