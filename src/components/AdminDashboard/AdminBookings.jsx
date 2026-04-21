import { useState } from "react";
import { StatusBadge, SearchBar, StatCard } from "../shared/UIComponents";

// ─── Admin Bookings ───────────────────────────────────────────────────────────
const MOCK_BOOKINGS = [
  { id: 1, student: "Amahle M.", tutor: "Dr. Sarah Mokoena", subject: "Mathematics", date: "2025-04-16", time: "14:00", type: "Online", status: "accepted", amount: 250 },
  { id: 2, student: "Sipho D.", tutor: "Mr. J. Dlamini", subject: "Physics", date: "2025-04-17", time: "10:00", type: "In Person", status: "pending", amount: 220 },
  { id: 3, student: "Nomsa K.", tutor: "Ms. Z. Sithole", subject: "English", date: "2025-04-15", time: "09:00", type: "Online", status: "completed", amount: 200 },
  { id: 4, student: "Thabo M.", tutor: "Prof. T. Nkosi", subject: "CS", date: "2025-04-10", time: "16:00", type: "Online", status: "completed", amount: 300 },
  { id: 5, student: "Zanele P.", tutor: "Ms. N. Dube", subject: "Accounting", date: "2025-04-18", time: "11:00", type: "On Campus", status: "accepted", amount: 240 },
];

export function AdminBookings({ onNotify }) {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = bookings.filter(b => {
    const matchSearch = !search ||
      b.student.toLowerCase().includes(search.toLowerCase()) ||
      b.tutor.toLowerCase().includes(search.toLowerCase()) ||
      b.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCancel = (id) => {
    // API CALL: PATCH /api/admin/bookings/:id/ { status: 'cancelled' }
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" } : b));
    onNotify("Booking cancelled.", "info");
  };

  return (
    <div>
      <h1 className="page-title">All Bookings</h1>
      <p className="page-subtitle">View and manage all platform booking sessions</p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard icon="📅" label="Total Bookings" value={bookings.length} color="#e8f7fe" />
        <StatCard icon="⏳" label="Pending" value={bookings.filter(b => b.status === "pending").length} color="#fef3c7" />
        <StatCard icon="✓" label="Accepted" value={bookings.filter(b => b.status === "accepted").length} color="#d1fae5" />
        <StatCard icon="✅" label="Completed" value={bookings.filter(b => b.status === "completed").length} color="#ede9fe" />
        <StatCard icon="💰" label="Total Value" value={`R${bookings.reduce((s, b) => s + b.amount, 0).toLocaleString()}`} color="#fee2e2" />
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search student, tutor or subject…" />
          <select className="form-control" style={{ width: "auto", minWidth: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <span style={{ marginLeft: "auto", fontSize: "0.82rem", color: "var(--gray-500)" }}>{filtered.length} booking{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Tutor</th>
              <th>Subject</th>
              <th>Date & Time</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id}>
                <td style={{ color: "var(--gray-400)", fontSize: "0.78rem" }}>#{b.id}</td>
                <td style={{ fontWeight: 500 }}>{b.student}</td>
                <td style={{ fontSize: "0.83rem" }}>{b.tutor}</td>
                <td><span className="badge badge-sky">{b.subject}</span></td>
                <td style={{ fontSize: "0.82rem" }}>{b.date} · {b.time}</td>
                <td style={{ fontSize: "0.82rem" }}>{b.type}</td>
                <td style={{ fontWeight: 700, color: "var(--success)" }}>R{b.amount}</td>
                <td><StatusBadge status={b.status} /></td>
                <td>
                  {!["completed", "cancelled"].includes(b.status) && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminBookings;

// ─── Admin Reports ────────────────────────────────────────────────────────────
const MONTHLY_DATA = [
  { month: "Nov", sessions: 42, students: 28, revenue: 9800 },
  { month: "Dec", sessions: 38, students: 25, revenue: 8600 },
  { month: "Jan", sessions: 67, students: 44, revenue: 15200 },
  { month: "Feb", sessions: 89, students: 61, revenue: 20100 },
  { month: "Mar", sessions: 112, students: 78, revenue: 25400 },
  { month: "Apr", sessions: 98, students: 68, revenue: 22200 },
];

const SUBJECT_DATA = [
  { subject: "Mathematics", sessions: 145, pct: 35 },
  { subject: "Physics", sessions: 87, pct: 21 },
  { subject: "Computer Science", sessions: 72, pct: 17 },
  { subject: "English", sessions: 58, pct: 14 },
  { subject: "Accounting", sessions: 45, pct: 11 },
  { subject: "Other", sessions: 8, pct: 2 },
];

export function AdminReports({ onNotify }) {
  const maxSessions = Math.max(...MONTHLY_DATA.map(m => m.sessions));

  return (
    <div>
      <h1 className="page-title">Reports & Analytics</h1>
      <p className="page-subtitle">Platform performance metrics and insights</p>
      {/* API CALL: GET /api/admin/reports/ */}

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard icon="📅" label="Total Sessions (YTD)" value="446" change="↑ 23% vs last year" changeType="up" color="#e8f7fe" />
        <StatCard icon="💰" label="Platform Revenue (YTD)" value="R101,300" change="↑ 31%" changeType="up" color="#d1fae5" />
        <StatCard icon="👥" label="New Users (Apr)" value="23" change="↑ 12%" changeType="up" color="#ede9fe" />
        <StatCard icon="⭐" label="Avg Session Rating" value="4.8" color="#fef3c7" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* Sessions Bar Chart */}
        <div className="card">
          <div className="card-header"><h3 style={{ fontWeight: 600, color: "var(--navy)", fontSize: "0.95rem" }}>📊 Monthly Sessions</h3></div>
          <div className="card-body">
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 180, padding: "10px 0" }}>
              {MONTHLY_DATA.map(m => (
                <div key={m.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--gray-500)", fontWeight: 600 }}>{m.sessions}</div>
                  <div style={{ width: "100%", background: "var(--sky)", borderRadius: "4px 4px 0 0", height: `${(m.sessions / maxSessions) * 130}px`, transition: "height 0.4s ease", minHeight: 4 }} />
                  <div style={{ fontSize: "0.72rem", color: "var(--gray-500)" }}>{m.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subject Distribution */}
        <div className="card">
          <div className="card-header"><h3 style={{ fontWeight: 600, color: "var(--navy)", fontSize: "0.95rem" }}>📚 Sessions by Subject</h3></div>
          <div className="card-body">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {SUBJECT_DATA.map((s, i) => (
                <div key={s.subject}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: 4 }}>
                    <span style={{ fontWeight: 500, color: "var(--navy)" }}>{s.subject}</span>
                    <span style={{ color: "var(--gray-500)" }}>{s.sessions} ({s.pct}%)</span>
                  </div>
                  <div style={{ background: "var(--gray-100)", borderRadius: 4, height: 8 }}>
                    <div style={{ background: i === 0 ? "var(--sky)" : i === 1 ? "var(--navy)" : `hsl(${200 + i * 20}, 70%, 50%)`, borderRadius: 4, height: 8, width: `${s.pct}%`, transition: "width 0.5s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Table */}
        <div className="card" style={{ gridColumn: "1 / -1" }}>
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ fontWeight: 600, color: "var(--navy)", fontSize: "0.95rem" }}>💰 Monthly Revenue Breakdown</h3>
            <button className="btn btn-outline btn-sm" onClick={() => onNotify("Report exported!", "success")}>⬇ Export CSV</button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Month</th><th>Sessions</th><th>Students</th><th>Revenue</th><th>Avg per Session</th></tr>
              </thead>
              <tbody>
                {MONTHLY_DATA.map(m => (
                  <tr key={m.month}>
                    <td style={{ fontWeight: 500 }}>{m.month} 2025</td>
                    <td>{m.sessions}</td>
                    <td>{m.students}</td>
                    <td style={{ fontWeight: 700, color: "var(--success)" }}>R{m.revenue.toLocaleString()}</td>
                    <td style={{ color: "var(--gray-600)" }}>R{Math.round(m.revenue / m.sessions)}</td>
                  </tr>
                ))}
                <tr style={{ background: "var(--gray-50)", fontWeight: 700 }}>
                  <td>TOTAL</td>
                  <td>{MONTHLY_DATA.reduce((s, m) => s + m.sessions, 0)}</td>
                  <td>—</td>
                  <td style={{ color: "var(--success)" }}>R{MONTHLY_DATA.reduce((s, m) => s + m.revenue, 0).toLocaleString()}</td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
