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

export default function MUNRadialSidebar({ activeView, onNavigate }: {
  activeView: string;
  onNavigate: (view: string) => void;
}) {
  return (
    <div className="radial-sidebar-container">
      <div className="radial-sidebar-center">
        <div className="logo-mark"> Mün</div>
      </div>
      <nav className="radial-sidebar-nav">
        {NAV_ITEMS.map((item, idx) => {
          const angle = (360 / NAV_ITEMS.length) * idx;
          return (
            <button
              key={item.view}
              className={classNames("radial-nav-item", { active: activeView === item.view })}
              data-view={item.view}
              style={{
                transform: `rotate(${angle}deg) translate(8em) rotate(-${angle}deg)`
              }}
              onClick={() => onNavigate(item.view)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="radial-sidebar-footer">
        <button className="radial-nav-item settings-btn" onClick={() => onNavigate("settings") }>
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">SETTINGS</span>
        </button>
      </div>
    </div>
  );
}
