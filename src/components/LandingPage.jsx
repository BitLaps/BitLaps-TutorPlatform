export default function LandingPage({ onEnterPortal }) {
  const portals = [
    {
      id: "student",
      icon: "📚",
      title: "Student Portal",
      desc: "Find tutors, book sessions, and track your academic progress.",
      color: "var(--sky)",
      features: ["Search & filter tutors", "Book sessions online", "Rate your tutor", "Secure messaging"],
    },
    {
      id: "tutor",
      icon: "👨‍🏫",
      title: "Tutor Portal",
      desc: "Manage your profile, set availability, and grow your tutoring practice.",
      color: "var(--navy)",
      features: ["Create your profile", "Manage bookings", "Set availability", "Track earnings"],
    },
    {
      id: "admin",
      icon: "⚙️",
      title: "Admin Dashboard",
      desc: "Oversee platform operations, approve tutors, and view analytics.",
      color: "#1a4a7a",
      features: ["User management", "Platform analytics", "Booking oversight", "Reports"],
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--white)" }}>
      {/* Nav */}
      <header style={{ background: "var(--navy)", padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: "var(--sky)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>🎓</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontFamily: "var(--font-display)", fontSize: "1.1rem", lineHeight: 1 }}>Eduvos</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Mbombela Campus</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => onEnterPortal("student")} style={{ color: "rgba(255,255,255,0.8)" }}>Student</button>
          <button className="btn btn-ghost" onClick={() => onEnterPortal("tutor")} style={{ color: "rgba(255,255,255,0.8)" }}>Tutor</button>
          <button className="btn btn-primary btn-sm" onClick={() => onEnterPortal("admin")}>Admin</button>
        </div>
      </header>

      {/* Hero */}
      <div className="landing-hero">
        <div className="container">
          <div className="hero-content" style={{ maxWidth: 620 }}>
            <div className="hero-badge">🌟 Academic Support Platform</div>
            <h1 className="hero-title">Connect. Learn.<br /><span>Excel.</span></h1>
            <p className="hero-subtitle">Eduvos Mbombela's dedicated platform connecting students with qualified tutors for personalised academic support across all subjects and grade levels.</p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => onEnterPortal("student")}>Find a Tutor →</button>
              <button className="btn btn-outline btn-lg" onClick={() => onEnterPortal("tutor")} style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}>Become a Tutor</button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: "var(--sky)", padding: "24px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 24, textAlign: "center" }}>
            {[["200+", "Active Tutors"], ["1,500+", "Students Supported"], ["4.8★", "Average Rating"], ["95%", "Satisfaction Rate"]].map(([val, lbl]) => (
              <div key={lbl}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "#fff", fontWeight: 700 }}>{val}</div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Portal Cards */}
      <div style={{ padding: "80px 0", background: "var(--gray-50)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", color: "var(--navy)", marginBottom: 10 }}>Choose Your Portal</h2>
            <p style={{ color: "var(--gray-500)", fontSize: "1rem" }}>Access the platform based on your role</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 }}>
            {portals.map((p) => (
              <div key={p.id} className="card" style={{ overflow: "visible", transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                onClick={() => onEnterPortal(p.id)}>
                <div style={{ background: p.color, padding: "32px 28px 24px", borderRadius: "12px 12px 0 0" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>{p.icon}</div>
                  <h3 style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: "1.4rem", marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.88rem", lineHeight: 1.6 }}>{p.desc}</p>
                </div>
                <div className="card-body">
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                    {p.features.map((f) => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "var(--gray-600)" }}>
                        <span style={{ color: "var(--sky)", fontWeight: 700, fontSize: "0.75rem" }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <button className="btn btn-primary w-full" style={{ marginTop: 20, background: p.color }}>
                    Enter {p.title} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "var(--navy)", padding: "32px 40px", textAlign: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem" }}>
          © {new Date().getFullYear()} Eduvos Mbombela — Academic Support Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
