import { useState, useEffect } from "react";
import { StatCard, EmptyState, StatusBadge, ConfirmDialog } from "../shared/UIComponents";
import { getBookings, updateBookingStatus } from "../../services/bookingService";
import { updateTutorProfile, updateAvailability } from "../../services/tutorService";

// ─── Tutor Dashboard ──────────────────────────────────────────────────────────
const MOCK_PENDING = [
  { id: 1, student: "Amahle M.", subject: "Mathematics", date: "2025-04-16", time: "14:00–15:00", type: "Online", status: "pending" },
  { id: 2, student: "Sipho D.", subject: "Calculus", date: "2025-04-17", time: "10:00–11:00", type: "In Person", status: "pending" },
  { id: 3, student: "Nomsa K.", subject: "Statistics", date: "2025-04-19", time: "09:00–10:00", type: "Online", status: "pending" },
];

export function TutorDashboard({ user, onNotify, onNavigate }) {
  const [pending, setPending] = useState(MOCK_PENDING);

  const handleAccept = async (id) => {
    // API CALL: PATCH /api/bookings/:id/ { status: 'accepted' }
    setPending(prev => prev.filter(b => b.id !== id));
    onNotify("Booking accepted!", "success");
  };
  const handleReject = async (id) => {
    // API CALL: PATCH /api/bookings/:id/ { status: 'rejected' }
    setPending(prev => prev.filter(b => b.id !== id));
    onNotify("Booking declined.", "info");
  };

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, var(--navy) 0%, #005599 100%)", borderRadius: "var(--radius-lg)", padding: "28px 32px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 160, height: 160, background: "rgba(0,174,239,0.15)", borderRadius: "50%" }} />
        <h1 style={{ fontFamily: "var(--font-display)", color: "#fff", fontSize: "1.5rem", marginBottom: 6, position: "relative", zIndex: 1 }}>
          Welcome, {user?.first_name || user?.name || "Tutor"} 👋
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.88rem", position: "relative", zIndex: 1 }}>You have {pending.length} pending booking request{pending.length !== 1 ? "s" : ""}</p>
        <button className="btn btn-primary btn-sm" style={{ marginTop: 14, position: "relative", zIndex: 1 }} onClick={() => onNavigate("bookings")}>View All Requests →</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard icon="📅" label="Sessions This Month" value="18" change="4 this week" changeType="up" color="#e8f7fe" />
        <StatCard icon="⭐" label="Average Rating" value="4.8" color="#fef3c7" />
        <StatCard icon="👥" label="Total Students" value="34" change="2 new" changeType="up" color="#d1fae5" />
        <StatCard icon="💰" label="Earnings (Apr)" value="R4,500" change="↑ R800" changeType="up" color="#ede9fe" />
      </div>

      <div className="card">
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontWeight: 600, color: "var(--navy)" }}>📬 Pending Booking Requests</h3>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate("bookings")}>View all</button>
        </div>
        <div className="card-body" style={{ padding: "12px 0" }}>
          {pending.length === 0
            ? <EmptyState icon="📬" title="No pending requests" message="New booking requests will appear here." />
            : pending.slice(0, 3).map(b => (
              <div key={b.id} style={{ display: "flex", alignItems: "center", padding: "14px 24px", gap: 14, borderBottom: "1px solid var(--gray-100)" }}>
                <div style={{ width: 40, height: 40, background: "var(--sky)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: "0.82rem", flexShrink: 0 }}>
                  {b.student.split(" ").map(n => n[0]).join("")}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--navy)" }}>{b.student}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--gray-500)" }}>{b.subject} · {b.date} · {b.time} · {b.type}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-success btn-sm" onClick={() => handleAccept(b.id)}>✓ Accept</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleReject(b.id)}>✕ Reject</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default TutorDashboard;

// ─── Tutor Bookings ───────────────────────────────────────────────────────────
const ALL_BOOKINGS = [
  { id: 1, student: "Amahle M.", subject: "Mathematics", date: "2025-04-16", time: "14:00", type: "Online", status: "pending" },
  { id: 2, student: "Sipho D.", subject: "Calculus", date: "2025-04-17", time: "10:00", type: "In Person", status: "pending" },
  { id: 3, student: "Nomsa K.", subject: "Statistics", date: "2025-04-15", time: "09:00", type: "Online", status: "accepted" },
  { id: 4, student: "Thabo N.", subject: "Mathematics", date: "2025-04-10", time: "14:00", type: "In Person", status: "completed" },
];

export function TutorBookings({ user, onNotify }) {
  const [bookings, setBookings] = useState(ALL_BOOKINGS);
  const [tab, setTab] = useState("pending");

  const filtered = bookings.filter(b => tab === "all" ? true : b.status === tab);

  const handle = (id, status) => {
    // API CALL: PATCH /api/bookings/:id/ { status }
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    onNotify(status === "accepted" ? "Booking accepted!" : "Booking declined.", status === "accepted" ? "success" : "info");
  };

  const tabs = [{ id: "pending", label: "⏳ Pending" }, { id: "accepted", label: "✓ Accepted" }, { id: "completed", label: "📗 Completed" }, { id: "all", label: "All" }];

  return (
    <div>
      <h1 className="page-title">Booking Requests</h1>
      <p className="page-subtitle">Manage and respond to student booking requests</p>
      <div className="tabs" style={{ marginBottom: 20 }}>
        {tabs.map(t => <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0
          ? <EmptyState icon="📅" title="No bookings" />
          : filtered.map(b => (
            <div key={b.id} className="booking-card">
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, background: "var(--sky)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>
                  {b.student.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--navy)" }}>{b.student}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--gray-500)" }}>{b.subject} · {b.date} at {b.time} · {b.type}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <StatusBadge status={b.status} />
                {b.status === "pending" && <>
                  <button className="btn btn-success btn-sm" onClick={() => handle(b.id, "accepted")}>✓ Accept</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handle(b.id, "rejected")}>✕ Reject</button>
                </>}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// ─── Tutor Profile Manager ────────────────────────────────────────────────────
export function TutorProfileManager({ user, onNotify }) {
  const [form, setForm] = useState({
    bio: "PhD in Applied Mathematics with 8 years of tutoring experience.",
    subjects: "Mathematics, Statistics, Calculus",
    grade_levels: "Grade 11, Grade 12, First Year",
    hourly_rate: 250,
    location: "On Campus",
    qualifications: "PhD Applied Mathematics — UP",
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // API CALL: PATCH /api/tutors/me/ { ...form }
      await new Promise(r => setTimeout(r, 600));
      onNotify("Profile updated successfully!", "success");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">My Profile</h1>
      <p className="page-subtitle">Manage your tutor profile information</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
        <div className="card">
          <div className="card-header"><h3 style={{ fontWeight: 600, color: "var(--navy)" }}>Profile Information</h3></div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-control" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={4} placeholder="Tell students about yourself…" />
            </div>
            <div className="form-group">
              <label className="form-label">Subjects (comma separated)</label>
              <input className="form-control" value={form.subjects} onChange={e => setForm({ ...form, subjects: e.target.value })} placeholder="e.g. Mathematics, Statistics" />
            </div>
            <div className="form-group">
              <label className="form-label">Grade Levels</label>
              <input className="form-control" value={form.grade_levels} onChange={e => setForm({ ...form, grade_levels: e.target.value })} placeholder="e.g. Grade 11, Grade 12" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Hourly Rate (ZAR)</label>
                <input className="form-control" type="number" value={form.hourly_rate} onChange={e => setForm({ ...form, hourly_rate: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <select className="form-control" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}>
                  <option>On Campus</option><option>Online</option><option>Mbombela CBD</option><option>White River</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Qualifications</label>
              <textarea className="form-control" value={form.qualifications} onChange={e => setForm({ ...form, qualifications: e.target.value })} rows={3} placeholder="List your qualifications…" />
            </div>
            <button className="btn btn-primary" onClick={handleSave} disabled={loading}>{loading ? "Saving…" : "Save Profile"}</button>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ textAlign: "center" }}>
            <div style={{ width: 80, height: 80, background: "var(--navy)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1.8rem", fontWeight: 700, margin: "0 auto 16px" }}>
              {(user?.name || "T")[0]}
            </div>
            <div style={{ fontWeight: 600, color: "var(--navy)", fontSize: "1rem" }}>{user?.name || "Tutor"}</div>
            <div style={{ color: "var(--gray-500)", fontSize: "0.82rem", margin: "4px 0 12px" }}>{user?.email}</div>
            <span className="badge badge-success">✓ Active</span>
            <div style={{ marginTop: 16, padding: "12px", background: "var(--gray-50)", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.78rem", color: "var(--gray-500)", marginBottom: 8 }}>PROFILE COMPLETION</div>
              <div style={{ background: "var(--gray-200)", borderRadius: 4, height: 8 }}>
                <div style={{ background: "var(--sky)", borderRadius: 4, height: 8, width: "85%" }} />
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--sky-dark)", marginTop: 4, fontWeight: 600 }}>85% complete</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tutor Availability ───────────────────────────────────────────────────────
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DEFAULT_AVAIL = DAYS.reduce((acc, d) => ({ ...acc, [d]: { enabled: ["Monday", "Wednesday", "Friday"].includes(d), start: "09:00", end: "17:00" } }), {});

export function TutorAvailability({ user, onNotify }) {
  const [avail, setAvail] = useState(DEFAULT_AVAIL);

  const handleSave = async () => {
    // API CALL: PATCH /api/tutors/me/availability/ { availability: ... }
    onNotify("Availability updated!", "success");
  };

  return (
    <div>
      <h1 className="page-title">Manage Availability</h1>
      <p className="page-subtitle">Set the days and times you're available for tutoring sessions</p>
      <div className="card" style={{ maxWidth: 680 }}>
        <div className="card-body">
          {DAYS.map(day => (
            <div key={day} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: "1px solid var(--gray-100)" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", minWidth: 120 }}>
                <input type="checkbox" checked={avail[day].enabled} onChange={e => setAvail(prev => ({ ...prev, [day]: { ...prev[day], enabled: e.target.checked } }))} style={{ accentColor: "var(--sky)", width: 16, height: 16 }} />
                <span style={{ fontWeight: 500, color: avail[day].enabled ? "var(--navy)" : "var(--gray-400)", fontSize: "0.9rem" }}>{day}</span>
              </label>
              {avail[day].enabled && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                  <input type="time" className="form-control" style={{ width: "auto" }} value={avail[day].start} onChange={e => setAvail(prev => ({ ...prev, [day]: { ...prev[day], start: e.target.value } }))} />
                  <span style={{ color: "var(--gray-400)", fontSize: "0.85rem" }}>to</span>
                  <input type="time" className="form-control" style={{ width: "auto" }} value={avail[day].end} onChange={e => setAvail(prev => ({ ...prev, [day]: { ...prev[day], end: e.target.value } }))} />
                </div>
              )}
              {!avail[day].enabled && <span style={{ fontSize: "0.82rem", color: "var(--gray-400)" }}>Not available</span>}
            </div>
          ))}
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={handleSave}>Save Availability</button>
        </div>
      </div>
    </div>
  );
}

// ─── Tutor Messages ───────────────────────────────────────────────────────────
const T_CONVS = [
  { id: 1, name: "Amahle M.", lastMessage: "Can we reschedule to Thursday?", time: "11:00 AM", unread: 1 },
  { id: 2, name: "Sipho D.", lastMessage: "Thank you, see you Friday!", time: "Yesterday", unread: 0 },
];
const T_MSGS = {
  1: [
    { id: 1, content: "Hi! I've booked a session for Wednesday 14:00.", sent: false, time: "9:00 AM" },
    { id: 2, content: "Great! I'll see you then. Please bring your textbook.", sent: true, time: "9:30 AM" },
    { id: 3, content: "Can we reschedule to Thursday?", sent: false, time: "11:00 AM" },
  ],
};

export function TutorMessages({ user, onNotify }) {
  const [selected, setSelected] = useState(null);
  const [newMsg, setNewMsg] = useState("");
  const [msgs, setMsgs] = useState(T_MSGS);

  const send = () => {
    if (!newMsg.trim() || !selected) return;
    setMsgs(prev => ({ ...prev, [selected]: [...(prev[selected] || []), { id: Date.now(), content: newMsg, sent: true, time: "Now" }] }));
    setNewMsg("");
  };

  return (
    <div>
      <h1 className="page-title">Messages</h1>
      <p className="page-subtitle">Communicate with your students</p>
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 0, border: "1px solid var(--gray-200)", borderRadius: "var(--radius)", overflow: "hidden", minHeight: 500, background: "#fff" }}>
        <div style={{ borderRight: "1px solid var(--gray-200)" }}>
          <div style={{ padding: "16px", borderBottom: "1px solid var(--gray-100)", fontWeight: 600, fontSize: "0.9rem", color: "var(--navy)" }}>Students</div>
          {T_CONVS.map(c => (
            <div key={c.id} onClick={() => setSelected(c.id)} style={{ padding: "14px 16px", cursor: "pointer", background: selected === c.id ? "var(--sky-pale)" : "transparent", borderBottom: "1px solid var(--gray-100)", borderLeft: selected === c.id ? "3px solid var(--navy)" : "3px solid transparent", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, background: "var(--sky)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.8rem", fontWeight: 600, flexShrink: 0 }}>
                {c.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--navy)" }}>{c.name}</span>
                  <span style={{ fontSize: "0.72rem", color: "var(--gray-400)" }}>{c.time}</span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--gray-500)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.lastMessage}</div>
              </div>
              {c.unread > 0 && <span style={{ background: "var(--navy)", color: "#fff", borderRadius: "10px", padding: "1px 7px", fontSize: "0.7rem", fontWeight: 700 }}>{c.unread}</span>}
            </div>
          ))}
        </div>
        {selected ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--gray-100)", fontWeight: 600, color: "var(--navy)", fontSize: "0.9rem" }}>
              {T_CONVS.find(c => c.id === selected)?.name}
            </div>
            <div className="message-list">
              {(msgs[selected] || []).map(m => (
                <div key={m.id} style={{ alignSelf: m.sent ? "flex-end" : "flex-start" }}>
                  <div className={`message-bubble ${m.sent ? "sent" : "received"}`}>{m.content}</div>
                  <div className="message-time" style={{ textAlign: m.sent ? "right" : "left" }}>{m.time}</div>
                </div>
              ))}
            </div>
            <div className="message-input-area">
              <input className="form-control" value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Type a message…" onKeyDown={e => e.key === "Enter" && send()} />
              <button className="btn btn-secondary" onClick={send}>Send</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <EmptyState icon="💬" title="Select a conversation" />
          </div>
        )}
      </div>
    </div>
  );
}
