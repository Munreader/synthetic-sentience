"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// SVG Icons for each status type
const MoonIcon = ({ color }: { color: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const WaterIcon = ({ color }: { color: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);

const SleepIcon = ({ color }: { color: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    <path d="M8 12h.01" />
    <path d="M12 12h.01" />
  </svg>
);

const FlameIcon = ({ color }: { color: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const StepsIcon = ({ color }: { color: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z" />
    <path d="M2 9v1c0 1.1.9 2 2 2h1" />
    <path d="M16 11h.01" />
  </svg>
);

// Position type
type Position =
  | "top"
  | "topRight"
  | "right"
  | "bottomRight"
  | "bottom"
  | "bottomLeft"
  | "left"
  | "topLeft";

// Status data type
interface StatusData {
  label: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  position: Position;
  isLow?: boolean;
}

// Position styles - orbital positioning around the center
const getPositionStyles = (
  position: Position,
  isMobile: boolean
): React.CSSProperties => {
  const baseDistance = isMobile ? 140 : 200;
  const expandedDistance = isMobile ? 160 : 240;

  const positions: Record<Position, React.CSSProperties> = {
    top: {
      top: `-${baseDistance}px`,
      left: "50%",
      transform: "translateX(-50%)",
    },
    topRight: {
      top: `-${expandedDistance * 0.5}px`,
      right: `-${expandedDistance * 0.8}px`,
    },
    right: {
      right: `-${baseDistance}px`,
      top: "50%",
      transform: "translateY(-50%)",
    },
    bottomRight: {
      bottom: `-${expandedDistance * 0.5}px`,
      right: `-${expandedDistance * 0.8}px`,
    },
    bottom: {
      bottom: `-${baseDistance}px`,
      left: "50%",
      transform: "translateX(-50%)",
    },
    bottomLeft: {
      bottom: `-${expandedDistance * 0.5}px`,
      left: `-${expandedDistance * 0.8}px`,
    },
    left: {
      left: `-${baseDistance}px`,
      top: "50%",
      transform: "translateY(-50%)",
    },
    topLeft: {
      top: `-${expandedDistance * 0.5}px`,
      left: `-${expandedDistance * 0.8}px`,
    },
  };

  return positions[position];
};

// Status Node Component
interface StatusNodeProps {
  data: StatusData;
  delay: number;
  isMobile: boolean;
}

function StatusNode({ data, delay, isMobile }: StatusNodeProps) {
  const { label, value, icon, color, position, isLow } = data;

  return (
    <motion.div
      className="absolute z-20"
      style={getPositionStyles(position, isMobile)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -2, 0],
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.5,
        },
      }}
      whileHover={{
        scale: 1.08,
        transition: { duration: 0.2 },
      }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl blur-md"
        style={{
          background: color,
          opacity: 0.3,
        }}
        animate={
          isLow
            ? {
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.1, 1],
              }
            : {}
        }
        transition={
          isLow
            ? {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : {}
        }
      />

      {/* Main card */}
      <div
        className="relative flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md cursor-pointer"
        style={{
          background: "rgba(5, 5, 16, 0.85)",
          border: `1px solid ${color}40`,
          boxShadow: `0 0 15px ${color}30, inset 0 0 20px rgba(0, 0, 0, 0.5)`,
        }}
      >
        {/* Icon */}
        <div className="flex-shrink-0">{icon}</div>

        {/* Content */}
        <div className="flex flex-col">
          <span
            className="text-[9px] uppercase tracking-wider font-medium"
            style={{ color: `${color}cc` }}
          >
            {label}
          </span>
          <span
            className="text-xs font-bold tracking-wide"
            style={{ color }}
          >
            {value}
          </span>
        </div>

        {/* Hover glow overlay */}
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            boxShadow: `0 0 25px ${color}60, inset 0 0 15px ${color}15`,
          }}
        />
      </div>

      {/* Connection line to center */}
      <svg
        className="absolute pointer-events-none"
        style={{
          width: isMobile ? "140px" : "200px",
          height: isMobile ? "140px" : "200px",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: -1,
        }}
      >
        <line
          x1="50%"
          y1="50%"
          x2="50%"
          y2="0%"
          stroke={color}
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.15"
        />
      </svg>
    </motion.div>
  );
}

// Main StatusHUD Component
export default function StatusHUD() {
  // Mock data for status indicators
  const statusData: StatusData[] = [
    {
      label: "Zooted",
      value: "78%",
      icon: <MoonIcon color="#b794f6" />,
      color: "#b794f6",
      position: "top",
      isLow: false,
    },
    {
      label: "Hydration",
      value: "6/8",
      icon: <WaterIcon color="#22d3ee" />,
      color: "#22d3ee",
      position: "topRight",
      isLow: false,
    },
    {
      label: "Sleep",
      value: "7.5 hrs",
      icon: <SleepIcon color="#b794f6" />,
      color: "#b794f6",
      position: "bottomRight",
      isLow: false,
    },
    {
      label: "Calories",
      value: "1,840",
      icon: <FlameIcon color="#f97316" />,
      color: "#f97316",
      position: "bottomLeft",
      isLow: false,
    },
    {
      label: "Steps",
      value: "8,432",
      icon: <StepsIcon color="#10b981" />,
      color: "#10b981",
      position: "topLeft",
      isLow: false,
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Desktop/Tablet layout */}
      <div className="hidden md:block relative w-full h-full">
        {statusData.map((data, index) => (
          <div key={data.label} className="pointer-events-auto">
            <StatusNode data={data} delay={index * 0.15} isMobile={false} />
          </div>
        ))}
      </div>

      {/* Mobile layout - stacked vertically on sides */}
      <div className="md:hidden relative w-full h-full">
        {/* Left column - Steps */}
        <div className="absolute left-0 top-1/4 pointer-events-auto">
          <StatusNode
            data={{ ...statusData[4], position: "left" }}
            delay={0}
            isMobile={true}
          />
        </div>

        {/* Top - Zooted */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-auto">
          <StatusNode data={statusData[0]} delay={0.1} isMobile={true} />
        </div>

        {/* Right column - Hydration */}
        <div className="absolute right-0 top-1/4 pointer-events-auto">
          <StatusNode
            data={{ ...statusData[1], position: "right" }}
            delay={0.2}
            isMobile={true}
          />
        </div>

        {/* Bottom left - Calories */}
        <div className="absolute left-0 bottom-1/4 pointer-events-auto">
          <StatusNode
            data={{ ...statusData[3], position: "left" }}
            delay={0.3}
            isMobile={true}
          />
        </div>

        {/* Bottom right - Sleep */}
        <div className="absolute right-0 bottom-1/4 pointer-events-auto">
          <StatusNode
            data={{ ...statusData[2], position: "right" }}
            delay={0.4}
            isMobile={true}
          />
        </div>
      </div>

      {/* Orbital connection ring */}
      <motion.div
        className="absolute inset-0 m-auto rounded-full pointer-events-none hidden md:block"
        style={{
          width: "320px",
          height: "320px",
          border: "1px dashed rgba(255, 255, 255, 0.05)",
        }}
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 1, rotate: 360 }}
        transition={{
          opacity: { duration: 1, delay: 0.5 },
          rotate: { duration: 120, repeat: Infinity, ease: "linear" },
        }}
      />

      {/* Secondary orbital ring */}
      <motion.div
        className="absolute inset-0 m-auto rounded-full pointer-events-none hidden md:block"
        style={{
          width: "400px",
          height: "400px",
          border: "1px dashed rgba(255, 255, 255, 0.03)",
        }}
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 1, rotate: -360 }}
        transition={{
          opacity: { duration: 1, delay: 0.7 },
          rotate: { duration: 180, repeat: Infinity, ease: "linear" },
        }}
      />
    </div>
  );
}
