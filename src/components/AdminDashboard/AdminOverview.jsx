import { StatCard } from "../shared/UIComponents";

const RECENT_ACTIVITY = [
  { id: 1, type: "registration", msg: "New student registered: Amahle Mokoena", time: "5 min ago", icon: "👤" },
  { id: 2, type: "booking", msg: "Booking confirmed: Dr. Sarah M. & Sipho D.", time: "12 min ago", icon: "📅" },
  { id: 3, type: "tutor", msg: "New tutor pending approval: Mr. K. Mahlangu", time: "1 hr ago", icon: "👨‍🏫" },
  { id: 4, type: "rating", msg: "Review submitted for Dr. Sarah Mokoena (5★)", time: "2 hrs ago", icon: "⭐" },
  { id: 5, type: "cancellation", msg: "Booking cancelled by Nomsa K.", time: "3 hrs ago", icon: "❌" },
];

const TOP_TUTORS = [
  { name: "Dr. Sarah Mokoena", sessions: 18, rating: 4.9, earnings: "R4,500" },
  { name: "Ms. Nomsa Dube", sessions: 15, rating: 4.9, earnings: "R3,600" },
  { name: "Ms. Zanele Sithole", sessions: 14, rating: 4.8, earnings: "R2,800" },
  { name: "Prof. Thabo Nkosi", sessions: 12, rating: 4.6, earnings: "R3,600" },
];

export default function AdminOverview({ onNotify, onNavigate }) {
  return (
    <div>
      {/* Welcome Banner */}
      <div style={{ background: "linear-gradient(135deg, var(--navy) 0%, #1a4a7a 100%)", borderRadius: "var(--radius-lg)", padding: "28px 32px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 180, height: 180, background: "rgba(0,174,239,0.12)", borderRadius: "50%" }} />
        <h1 style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: "1.5rem", marginBottom: 6, position: "relative", zIndex: 1 }}>Platform Overview</h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.88rem", position: "relative", zIndex: 1 }}>Eduvos Mbombela — Academic Support Platform Admin</p>
        <div style={{ display: "flex", gap: 10, marginTop: 14, position: "relative", zIndex: 1 }}>
          <button className="btn btn-primary btn-sm" onClick={() => onNavigate("users")}>👥 Manage Users</button>
          <button className="btn btn-outline btn-sm" style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }} onClick={() => onNavigate("reports")}>📈 View Reports</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard icon="👥" label="Total Users" value="1,847" change="23 this week" changeType="up" color="#e8f7fe" />
        <StatCard icon="👨‍🏫" label="Active Tutors" value="204" change="5 new" changeType="up" color="#d1fae5" />
        <StatCard icon="📚" label="Students Enrolled" value="1,543" change="18 this week" changeType="up" color="#ede9fe" />
        <StatCard icon="📅" label="Sessions This Month" value="312" change="42 this week" changeType="up" color="#fef3c7" />
        <StatCard icon="⭐" label="Avg. Platform Rating" value="4.8" color="#fee2e2" />
        <StatCard icon="⏳" label="Pending Approvals" value="7" color="#fef3c7" />
      </div>

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontWeight: 600, color: "var(--navy)", fontSize: "0.95rem" }}>🔔 Recent Activity</h3>
            <button className="btn btn-ghost btn-sm">View all</button>
          </div>
          <div style={{ padding: "8px 0" }}>
            {RECENT_ACTIVITY.map(a => (
              <div key={a.id} style={{ display: "flex", gap: 12, padding: "12px 24px", borderBottom: "1px solid var(--gray-100)", alignItems: "flex-start" }}>
                <div style={{ width: 34, height: 34, background: "var(--gray-100)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.83rem", color: "var(--gray-700)", lineHeight: 1.4 }}>{a.msg}</div>
                  <div style={{ fontSize: "0.73rem", color: "var(--gray-400)", marginTop: 3 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Tutors */}
        <div className="card">
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontWeight: 600, color: "var(--navy)", fontSize: "0.95rem" }}>🏆 Top Performing Tutors</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate("users")}>View all</button>
          </div>
          <div style={{ padding: "8px 0" }}>
            {TOP_TUTORS.map((t, i) => (
              <div key={t.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 24px", borderBottom: "1px solid var(--gray-100)" }}>
                <div style={{ width: 28, height: 28, background: i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : i === 2 ? "#d97706" : "var(--gray-200)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "0.75rem", flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--navy)" }}>{t.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}>{t.sessions} sessions · ★ {t.rating}</div>
                </div>
                <div style={{ fontWeight: 700, color: "var(--success)", fontSize: "0.85rem" }}>{t.earnings}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
