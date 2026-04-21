import { Avatar } from "./UIComponents";

export default function Sidebar({ items, activeItem, onItemClick, user, onLogout, portalLabel, portalColor = "var(--sky)" }) {
  return (
    <nav className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon" style={{ background: portalColor }}>🎓</div>
        <div className="sidebar-logo-text">
          <h2>Eduvos</h2>
          <span>{portalLabel}</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="sidebar-nav">
        {items.map((section, si) => (
          <div key={si} className="sidebar-section">
            {section.label && <div className="sidebar-section-label">{section.label}</div>}
            {section.items.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeItem === item.id ? "active" : ""}`}
                onClick={() => onItemClick(item.id)}
                style={activeItem === item.id ? { background: portalColor } : {}}
              >
                <span className="nav-item-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    marginLeft: "auto", background: "rgba(239,68,68,0.9)", color: "#fff",
                    borderRadius: "10px", padding: "1px 7px", fontSize: "0.7rem", fontWeight: 700
                  }}>{item.badge}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <Avatar name={user?.name || user?.email || "User"} size="sm" color="sky" />
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || user?.email || "User"}</div>
            <div className="sidebar-user-role">{user?.role || portalLabel}</div>
          </div>
        </div>
        <button className="nav-item" onClick={onLogout} style={{ marginTop: 4 }}>
          <span className="nav-item-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
