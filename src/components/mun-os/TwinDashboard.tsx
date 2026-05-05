"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Icons for modules
const FridgeIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="4" y1="10" x2="20" y2="10" />
    <line x1="10" y1="6" x2="10" y2="6.01" />
    <line x1="10" y1="14" x2="10" y2="14.01" />
  </svg>
);

const HeartIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const CalendarIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const DumbbellIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5L17.5 17.5" />
    <path d="M3 10V7a2 2 0 0 1 2-2h3" />
    <path d="M21 14v3a2 2 0 0 1-2 2h-3" />
    <path d="M6.5 17.5L17.5 6.5" />
    <path d="M3 14v3a2 2 0 0 0 2 2h3" />
    <path d="M21 10V7a2 2 0 0 0-2-2h-3" />
  </svg>
);

const WalletIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const ShirtIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
  </svg>
);

// Module Card Component
interface ModuleCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
  delay: number;
}

function ModuleCard({ title, icon, color, children, delay }: ModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative rounded-xl overflow-hidden cursor-pointer"
      style={{
        background: "rgba(10, 10, 26, 0.85)",
        border: `1px solid ${color}30`,
        boxShadow: `0 0 20px ${color}15`,
      }}
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{
        boxShadow: `0 0 30px ${color}30`,
        borderColor: `${color}50`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-medium text-sm">{title}</h3>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-white/5 pt-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Kitchen Commander Content
function KitchenCommander() {
  const fridgeItems = [
    { name: "Almond Milk", expiry: "2 days", status: "warning" },
    { name: "Greek Yogurt", expiry: "5 days", status: "ok" },
    { name: "Spinach", expiry: "Today!", status: "urgent" },
    { name: "Eggs", expiry: "12 days", status: "ok" },
  ];

  return (
    <div className="space-y-3">
      <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Fridge Inventory</div>
      {fridgeItems.map((item, i) => (
        <div key={i} className="flex items-center justify-between text-sm">
          <span className="text-white/80">{item.name}</span>
          <span
            className={
              item.status === "urgent"
                ? "text-red-400"
                : item.status === "warning"
                ? "text-yellow-400"
                : "text-emerald-400"
            }
          >
            {item.expiry}
          </span>
        </div>
      ))}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-white/40">
          <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <span>1 item expiring today</span>
        </div>
      </div>
    </div>
  );
}

// Wellness Warden Content
function WellnessWarden() {
  const waterGlasses = 6;
  const totalGlasses = 8;

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Water Intake</div>
        <div className="flex gap-1">
          {[...Array(totalGlasses)].map((_, i) => (
            <div
              key={i}
              className="w-6 h-8 rounded border border-cyan-400/30 flex items-end justify-center overflow-hidden"
            >
              <motion.div
                className="w-full bg-cyan-400/50"
                initial={{ height: 0 }}
                animate={{ height: i < waterGlasses ? "100%" : "0%" }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              />
            </div>
          ))}
        </div>
        <div className="text-xs text-cyan-400 mt-1">{waterGlasses}/{totalGlasses} glasses</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-white/5">
          <div className="text-xs text-white/40">Sleep</div>
          <div className="text-lg font-bold text-violet-400">7.5h</div>
        </div>
        <div className="p-3 rounded-lg bg-white/5">
          <div className="text-xs text-white/40">Movement</div>
          <div className="text-lg font-bold text-pink-400">45m</div>
        </div>
      </div>
    </div>
  );
}

// Agenda Architect Content
function AgendaArchitect() {
  const events = [
    { time: "9:00 AM", title: "Team Standup", color: "#ff2d7a" },
    { time: "11:30 AM", title: "Design Review", color: "#b794f6" },
    { time: "2:00 PM", title: "Client Call", color: "#22d3ee" },
    { time: "5:00 PM", title: "Gym Session", color: "#10b981" },
  ];

  return (
    <div className="space-y-2">
      <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Today&apos;s Events</div>
      {events.map((event, i) => (
        <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
          <div
            className="w-1 h-8 rounded-full"
            style={{ background: event.color }}
          />
          <div className="flex-1">
            <div className="text-sm text-white/90">{event.title}</div>
            <div className="text-xs text-white/40">{event.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Fitness Partner Content
function FitnessPartner() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-lg bg-white/5 text-center">
          <div className="text-xs text-white/40">Steps</div>
          <div className="text-lg font-bold text-emerald-400">8,432</div>
        </div>
        <div className="p-3 rounded-lg bg-white/5 text-center">
          <div className="text-xs text-white/40">Workouts</div>
          <div className="text-lg font-bold text-pink-400">3</div>
        </div>
        <div className="p-3 rounded-lg bg-white/5 text-center">
          <div className="text-xs text-white/40">Cal</div>
          <div className="text-lg font-bold text-orange-400">1,840</div>
        </div>
      </div>

      <div>
        <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Weekly Progress</div>
        <div className="flex gap-1 items-end h-12">
          {[65, 80, 45, 90, 70, 55, 30].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t bg-gradient-to-t from-pink-500/50 to-violet-500/50"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-white/30 mt-1">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
    </div>
  );
}

// Bill Bishop Content
function BillBishop() {
  const bills = [
    { name: "Netflix", amount: "$15.99", due: "Tomorrow", autopay: true },
    { name: "Electric", amount: "$89.50", due: "3 days", autopay: false },
    { name: "Internet", amount: "$79.99", due: "7 days", autopay: true },
  ];

  return (
    <div className="space-y-3">
      <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Upcoming Bills</div>
      {bills.map((bill, i) => (
        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
          <div>
            <div className="text-sm text-white/90">{bill.name}</div>
            <div className="text-xs text-white/40">Due: {bill.due}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-white">{bill.amount}</div>
            {bill.autopay && (
              <div className="text-[10px] text-emerald-400">Autopay</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Personal Stylist Content
function PersonalStylist() {
  const weather = {
    temp: "72F",
    condition: "Partly Cloudy",
    outfit: "Light layers recommended. A breezy shirt with comfortable pants.",
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
        <div className="text-3xl">☀️</div>
        <div>
          <div className="text-lg font-bold text-white">{weather.temp}</div>
          <div className="text-xs text-white/50">{weather.condition}</div>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-white/5">
        <div className="text-xs text-white/50 uppercase tracking-wider mb-1">Today&apos;s Outfit</div>
        <div className="text-sm text-white/80">{weather.outfit}</div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 p-2 rounded-lg bg-violet-500/20 text-center">
          <div className="text-xs text-white/50">Top</div>
          <div className="text-sm text-white/80">Linen Shirt</div>
        </div>
        <div className="flex-1 p-2 rounded-lg bg-pink-500/20 text-center">
          <div className="text-xs text-white/50">Bottom</div>
          <div className="text-sm text-white/80">Chinos</div>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function TwinDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(true); // Start mounted

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const modules = [
    { title: "Kitchen Commander", icon: <FridgeIcon color="#22d3ee" />, color: "#22d3ee" },
    { title: "Wellness Warden", icon: <HeartIcon color="#ff2d7a" />, color: "#ff2d7a" },
    { title: "Agenda Architect", icon: <CalendarIcon color="#b794f6" />, color: "#b794f6" },
    { title: "Fitness Partner", icon: <DumbbellIcon color="#10b981" />, color: "#10b981" },
    { title: "Bill Bishop", icon: <WalletIcon color="#f97316" />, color: "#f97316" },
    { title: "Personal Stylist", icon: <ShirtIcon color="#ec4899" />, color: "#ec4899" },
  ];

  const renderModuleContent = (title: string) => {
    switch (title) {
      case "Kitchen Commander":
        return <KitchenCommander />;
      case "Wellness Warden":
        return <WellnessWarden />;
      case "Agenda Architect":
        return <AgendaArchitect />;
      case "Fitness Partner":
        return <FitnessPartner />;
      case "Bill Bishop":
        return <BillBishop />;
      case "Personal Stylist":
        return <PersonalStylist />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold text-white">Luna Twin</h2>
            <p className="text-xs text-white/50">Your Personal Assistant</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/50">{getGreeting()}, Sovereign</div>
            <div className="text-lg font-mono text-cyan-400">
              {mounted ? formatTime(currentTime) : "--:--:--"}
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="flex gap-2">
          {[
            { label: "Tasks", value: "12", color: "#ff2d7a" },
            { label: "Alerts", value: "3", color: "#f97316" },
            { label: "Messages", value: "5", color: "#22d3ee" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex-1 p-2 rounded-lg text-center"
              style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
            >
              <div className="text-lg font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-[10px] text-white/50">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modules Grid */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {modules.map((module, i) => (
          <ModuleCard key={module.title} {...module} delay={i * 0.1}>
            {renderModuleContent(module.title)}
          </ModuleCard>
        ))}
      </div>
    </div>
  );
}
