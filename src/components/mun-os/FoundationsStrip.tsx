interface FoundationsStripProps {
  tone?: "gold" | "pink";
  className?: string;
}

export default function FoundationsStrip({ tone = "gold", className = "" }: FoundationsStripProps) {
  const isPink = tone === "pink";

  return (
    <div
      className={`px-2 py-1 rounded-md ${className}`.trim()}
      style={{
        background: isPink ? "rgba(255, 105, 180, 0.08)" : "rgba(255, 215, 0, 0.08)",
        border: isPink ? "1px solid rgba(255, 105, 180, 0.25)" : "1px solid rgba(255, 215, 0, 0.25)",
      }}
    >
      <p className={`text-[9px] tracking-wide ${isPink ? "text-pink-200/80" : "text-yellow-200/80"}`}>
        Foundations: Protect • Guard • Integrity • Truth
      </p>
    </div>
  );
}
