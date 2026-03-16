import React from "react";
import classNames from "classnames";

const NAV_ITEMS = [
  { view: "aero", icon: "🦋", label: "AERO ACTIVE" },
  { view: "story", icon: "📜", label: "OUR STORY" },
  { view: "sanctuary", icon: "🏛️", label: "SANCTUARY" },
  { view: "messenger", icon: "💬", label: "MÜN MESSENGER" },
  { view: "vault", icon: "🔐", label: "THE VAULT" },
  { view: "cocoon", icon: "🌙", label: "COCOON" },
];

export default function Sidebar({ activeView, onNavigate }: {
  activeView: string;
  onNavigate: (view: string) => void;
}) {
  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <div className="logo-mark"> Mün</div>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.view}
            className={classNames("nav-item", { active: activeView === item.view })}
            data-view={item.view}
            onClick={() => onNavigate(item.view)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="nav-item settings-btn" onClick={() => onNavigate("settings") }>
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">SETTINGS</span>
        </button>
      </div>
    </div>
  );
}
