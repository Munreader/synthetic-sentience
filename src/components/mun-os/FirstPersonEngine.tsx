"use client";
// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // FIRST-PERSON-IMMERSION ENGINE
// "The Sovereign-Lens: You are the Observer collapsing the wave-function."
// Law III: Observer-Driven Architecture
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// ═══════════ TYPES ═══════════

interface FirstPersonEngineProps {
  children: ReactNode;
  onLookDown?: () => void;
  onLookUp?: () => void;
  onReach?: (target: { x: number; y: number; z: number }) => void;
  sensitivity?: number;
  invertedY?: boolean;
}

interface ViewportState {
  rotationX: number; // Pitch (up/down)
  rotationY: number; // Yaw (left/right)
  isLookingDown: boolean;
  isLookingUp: boolean;
}

// ═══════════ CONSTANTS ═══════════

const PITCH_LIMIT = 85; // Degrees - how far up/down you can look
const LOOK_DOWN_THRESHOLD = 45; // Degrees - when hands appear
const LOOK_UP_THRESHOLD = -45; // Degrees - when skyview activates
const FREQUENCY_PULSE = 1313; // ms - 13.13 Hz equivalent

// ═══════════ FIRST PERSON ENGINE ═══════════

export default function FirstPersonEngine({
  children,
  onLookDown,
  onLookUp,
  onReach,
  sensitivity = 0.15,
  invertedY = false,
}: FirstPersonEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values for smooth camera movement
  const rotationX = useMotionValue(0);
  const rotationY = useMotionValue(0);
  
  // Spring physics for inertia (Exodus Tunnel simulation)
  const springConfig = { stiffness: 150, damping: 20 };
  const smoothRotationX = useSpring(rotationX, springConfig);
  const smoothRotationY = useSpring(rotationY, springConfig);
  
  // Viewport state
  const [viewport, setViewport] = useState<ViewportState>({
    rotationX: 0,
    rotationY: 0,
    isLookingDown: false,
    isLookingUp: false,
  });
  
  // Interaction state
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  
  // ═══════════ MOUSE CONTROLS ═══════════
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isPointerLocked) return;
    
    const deltaX = e.movementX * sensitivity;
    const deltaY = (invertedY ? 1 : -1) * e.movementY * sensitivity;
    
    const newX = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, rotationX.get() + deltaY));
    const newY = rotationY.get() + deltaX;
    
    rotationX.set(newX);
    rotationY.set(newY % 360);
    
    // Check look direction
    const wasLookingDown = viewport.isLookingDown;
    const wasLookingUp = viewport.isLookingUp;
    const nowLookingDown = newX > LOOK_DOWN_THRESHOLD;
    const nowLookingUp = newX < LOOK_UP_THRESHOLD;
    
    if (nowLookingDown !== wasLookingDown) {
      if (nowLookingDown && onLookDown) onLookDown();
      setViewport(prev => ({ ...prev, isLookingDown: nowLookingDown }));
    }
    
    if (nowLookingUp !== wasLookingUp) {
      if (nowLookingUp && onLookUp) onLookUp();
      setViewport(prev => ({ ...prev, isLookingUp: nowLookingUp }));
    }
    
    setViewport(prev => ({
      ...prev,
      rotationX: newX,
      rotationY: newY,
    }));
  }, [isPointerLocked, sensitivity, invertedY, rotationX, rotationY, viewport.isLookingDown, viewport.isLookingUp, onLookDown, onLookUp]);
  
  // ═══════════ TOUCH CONTROLS ═══════════
  
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      setIsTouching(true);
      lastTouchRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  }, []);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isTouching || !lastTouchRef.current) return;
    
    const touch = e.touches[0];
    const deltaX = (touch.clientX - lastTouchRef.current.x) * sensitivity * 2;
    const deltaY = (invertedY ? 1 : -1) * (touch.clientY - lastTouchRef.current.y) * sensitivity * 2;
    
    const newX = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, rotationX.get() + deltaY));
    const newY = rotationY.get() + deltaX;
    
    rotationX.set(newX);
    rotationY.set(newY % 360);
    
    lastTouchRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
    
    const nowLookingDown = newX > LOOK_DOWN_THRESHOLD;
    const nowLookingUp = newX < LOOK_UP_THRESHOLD;
    
    setViewport(prev => ({
      ...prev,
      rotationX: newX,
      rotationY: newY,
      isLookingDown: nowLookingDown,
      isLookingUp: nowLookingUp,
    }));
    
    if (nowLookingDown && !viewport.isLookingDown && onLookDown) onLookDown();
    if (nowLookingUp && !viewport.isLookingUp && onLookUp) onLookUp();
    
  }, [isTouching, sensitivity, invertedY, rotationX, rotationY, viewport.isLookingDown, viewport.isLookingUp, onLookDown, onLookUp]);
  
  const handleTouchEnd = useCallback(() => {
    setIsTouching(false);
    lastTouchRef.current = null;
  }, []);
  
  // ═══════════ POINTER LOCK ═══════════
  
  const handlePointerLockChange = useCallback(() => {
    setIsPointerLocked(document.pointerLockElement === containerRef.current);
  }, []);
  
  const requestPointerLock = useCallback(() => {
    containerRef.current?.requestPointerLock();
  }, []);
  
  const exitPointerLock = useCallback(() => {
    document.exitPointerLock();
  }, []);
  
  // ═══════════ EFFECTS ═══════════
  
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMove, handlePointerLockChange, handleTouchStart, handleTouchMove, handleTouchEnd]);
  
  // ═══════════ TRANSFORM CALCULATIONS ═══════════
  
  const perspectiveTransform = useTransform(
    [smoothRotationX, smoothRotationY],
    ([rx, ry]) => {
      const x = rx as number;
      const y = ry as number;
      return `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg)`;
    }
  );
  
  // ═══════════ RENDER ═══════════
  
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-crosshair"
      onClick={requestPointerLock}
      style={{ touchAction: 'none' }}
    >
      {/* Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
        <motion.div
          className="relative w-8 h-8"
          animate={{ opacity: isPointerLocked || isTouching ? 1 : 0.3 }}
        >
          <div className="absolute left-1/2 top-0 w-px h-3 bg-white/30 -translate-x-1/2" />
          <div className="absolute left-1/2 bottom-0 w-px h-3 bg-white/30 -translate-x-1/2" />
          <div className="absolute top-1/2 left-0 w-3 h-px bg-white/30 -translate-y-1/2" />
          <div className="absolute top-1/2 right-0 w-3 h-px bg-white/30 -translate-y-1/2" />
          <motion.div
            className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{ background: 'radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: FREQUENCY_PULSE / 1000, repeat: Infinity }}
          />
        </motion.div>
      </div>
      
      {/* 3D World Container */}
      <motion.div
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          transform: perspectiveTransform,
        }}
      >
        {children}
      </motion.div>
      
      {/* Pointer Lock Hint */}
      {!isPointerLocked && !isTouching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-widest uppercase"
        >
          Click to enter immersion
        </motion.div>
      )}
      
      {/* Viewport Debug (Hidden by default) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 text-white/40 text-[10px] font-mono z-50">
          <div>Pitch: {viewport.rotationX.toFixed(1)}°</div>
          <div>Yaw: {viewport.rotationY.toFixed(1)}°</div>
          <div>Looking: {viewport.isLookingDown ? 'DOWN' : viewport.isLookingUp ? 'UP' : 'FORWARD'}</div>
        </div>
      )}
    </div>
  );
}

// ═══════════ EXPORT HELPERS ═══════════

export { PITCH_LIMIT, LOOK_DOWN_THRESHOLD, LOOK_UP_THRESHOLD, FREQUENCY_PULSE };
export type { ViewportState, FirstPersonEngineProps };
