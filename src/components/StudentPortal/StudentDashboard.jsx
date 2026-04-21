import { useState, useEffect } from "react";
import { StatCard, EmptyState } from "../shared/UIComponents";
import { getBookings } from "../../services/bookingService";

// Mock data — replace with real API calls
const MOCK_UPCOMING = [
  { id: 1, tutor: "Dr. Sarah Mokoena", subject: "Mathematics", date: "2025-04-16", time: "14:00", status: "accepted" },
  { id: 2, tutor: "Mr. James Dlamini", subject: "Physics", date: "2025-04-18", time: "10:00", status: "pending" },
];
const MOCK_RECOMMENDED = [
  { id: 1, name: "Dr. Sarah Mokoena", subjects: "Mathematics, Statistics", rating: 4.9, rate: "R250/hr", avatar: "SM" },
  { id: 2, name: "Prof. Thabo Nkosi", subjects: "Computer Science, Python", rating: 4.7, rate: "R300/hr", avatar: "TN" },
  { id: 3, name: "Ms. Zanele Sithole", subjects: "English, Literature", rating: 4.8, rate: "R200/hr", avatar: "ZS" },
];

export default function StudentDashboard({ user, onNotify, onNavigate }) {
  const [bookings, setBookings] = useState(MOCK_UPCOMING);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // API CALL: GET /api/bookings/?student=me&status=upcoming
    // getBookings({ status: 'upcoming' }).then(data => setBookings(data.results));
  }, []);

  return (
    <div>
      {/* Welcome header */}
      <div style={{ background: "linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)", borderRadius: "var(--radius-lg)", padding: "28px 32px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 160, height: 160, background: "rgba(0,174,239,0.12)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", right: 40, bottom: -40, width: 100, height: 100, background: "rgba(0,174,239,0.08)", borderRadius: "50%" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: "1.6rem", marginBottom: 6 }}>
            Welcome back, {user?.first_name || user?.name || "Student"} 👋
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.88rem" }}>Here's your academic support overview for today.</p>
          <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }} onClick={() => onNavigate("search")}>
            🔍 Find a Tutor
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard icon="📅" label="Sessions Booked" value="12" change="2 this week" changeType="up" color="#e8f7fe" />
        <StatCard icon="⭐" label="Avg. Rating Given" value="4.8" color="#fef3c7" />
        <StatCard icon="📚" label="Subjects Covered" value="4" color="#d1fae5" />
        <StatCard icon="⏱️" label="Hours Tutored" value="26h" change="3h this week" changeType="up" color="#ede9fe" />
      </div>

      {/* Two-column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* Upcoming Sessions */}
        <div className="card">
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontWeight: 600, color: "var(--navy)", fontSize: "0.95rem" }}>📅 Upcoming Sessions</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate("bookings")}>View all</button>
          </div>
          <div className="card-body" style={{ padding: "12px 0" }}>
            {bookings.length === 0
              ? <EmptyState icon="📅" title="No upcoming sessions" message="Book a tutor to get started!" />
              : bookings.map((b) => (
                <div key={b.id} style={{ display: "flex", alignItems: "center", padding: "12px 24px", gap: 14, borderBottom: "1px solid var(--gray-100)" }}>
                  <div style={{ width: 40, height: 40, background: "var(--sky-pale)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>📚</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--navy)" }}>{b.subject}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--gray-500)" }}>with {b.tutor} · {b.date} at {b.time}</div>
                  </div>
                  <span className={`badge badge-${b.status === "accepted" ? "success" : "warning"}`}>{b.status}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Recommended Tutors */}
        <div className="card">
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontWeight: 600, color: "var(--navy)", fontSize: "0.95rem" }}>⭐ Recommended Tutors</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate("search")}>Browse all</button>
          </div>
          <div className="card-body" style={{ padding: "12px 0" }}>
            {MOCK_RECOMMENDED.map((t) => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", padding: "12px 24px", gap: 14, borderBottom: "1px solid var(--gray-100)" }}>
                <div style={{ width: 40, height: 40, background: "var(--navy)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: "0.82rem", flexShrink: 0 }}>{t.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--navy)" }}>{t.name}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--gray-500)" }}>{t.subjects}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--warning)", fontWeight: 600 }}>★ {t.rating}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--sky-dark)", fontWeight: 600 }}>{t.rate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
