import { useState } from "react";
import { SearchBar, StatusBadge, ConfirmDialog, Modal, Tabs } from "../shared/UIComponents";
import { getAdminUsers, updateUserStatus, deleteUser } from "../../services/adminService";

const MOCK_USERS = [
  { id: 1, name: "Dr. Sarah Mokoena", email: "sarah.m@eduvos.ac.za", role: "tutor", status: "active", joined: "2024-11-12", sessions: 48 },
  { id: 2, name: "Amahle Mokoena", email: "amahle.m@eduvos.ac.za", role: "student", status: "active", joined: "2025-01-08", sessions: 6 },
  { id: 3, name: "Mr. Khulekani Mahlangu", email: "k.mahlangu@gmail.com", role: "tutor", status: "pending_approval", joined: "2025-04-14", sessions: 0 },
  { id: 4, name: "Sipho Dlamini", email: "sipho.d@eduvos.ac.za", role: "student", status: "active", joined: "2025-02-20", sessions: 3 },
  { id: 5, name: "Ms. Zanele Sithole", email: "zanele.s@gmail.com", role: "tutor", status: "active", joined: "2024-12-01", sessions: 31 },
  { id: 6, name: "Nomsa Khumalo", email: "nomsa.k@eduvos.ac.za", role: "student", status: "suspended", joined: "2025-03-05", sessions: 2 },
  { id: 7, name: "Prof. Thabo Nkosi", email: "thabo.n@eduvos.ac.za", role: "tutor", status: "active", joined: "2024-10-20", sessions: 55 },
];

export default function AdminUsers({ onNotify }) {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  // API CALL: GET /api/admin/users/?role=...&status=...&search=...
  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const handleStatusChange = (userId, newStatus) => {
    // API CALL: PATCH /api/admin/users/:id/ { status: newStatus }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    const labels = { active: "approved", suspended: "suspended", pending_approval: "set to pending" };
    onNotify(`User ${labels[newStatus] || newStatus} successfully.`, newStatus === "active" ? "success" : "info");
    setConfirmAction(null);
  };

  const handleDelete = (userId) => {
    // API CALL: DELETE /api/admin/users/:id/
    setUsers(prev => prev.filter(u => u.id !== userId));
    onNotify("User deleted.", "info");
    setConfirmAction(null);
  };

  return (
    <div>
      <h1 className="page-title">User Management</h1>
      <p className="page-subtitle">Manage students, tutors, and platform access</p>

      {/* Summary badges */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Total", count: users.length, color: "var(--navy)" },
          { label: "Students", count: users.filter(u => u.role === "student").length, color: "var(--sky-dark)" },
          { label: "Tutors", count: users.filter(u => u.role === "tutor").length, color: "var(--success)" },
          { label: "Pending Approval", count: users.filter(u => u.status === "pending_approval").length, color: "var(--warning)" },
        ].map(s => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid var(--gray-200)", borderRadius: "var(--radius-sm)", padding: "10px 18px", display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: s.color, fontWeight: 700 }}>{s.count}</span>
            <span style={{ fontSize: "0.78rem", color: "var(--gray-500)", fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email…" />
          <select className="form-control" style={{ width: "auto", minWidth: 140 }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="tutor">Tutors</option>
            <option value="admin">Admins</option>
          </select>
          <select className="form-control" style={{ width: "auto", minWidth: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="suspended">Suspended</option>
          </select>
          <span style={{ fontSize: "0.82rem", color: "var(--gray-500)", marginLeft: "auto" }}>{filtered.length} user{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Sessions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, background: u.role === "tutor" ? "var(--navy)" : "var(--sky)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: "0.78rem", flexShrink: 0 }}>
                      {u.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{u.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${u.role === "tutor" ? "badge-navy" : u.role === "admin" ? "badge-danger" : "badge-sky"}`} style={{ textTransform: "capitalize" }}>{u.role}</span>
                </td>
                <td><StatusBadge status={u.status} /></td>
                <td style={{ fontSize: "0.82rem" }}>{u.joined}</td>
                <td style={{ fontWeight: 600, color: "var(--navy)", fontSize: "0.88rem" }}>{u.sessions}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => setSelected(u)} title="View">👁️</button>
                    {u.status === "pending_approval" && (
                      <button className="btn btn-success btn-sm" onClick={() => setConfirmAction({ type: "approve", user: u })}>✓ Approve</button>
                    )}
                    {u.status === "active" && (
                      <button className="btn btn-outline btn-sm" style={{ color: "var(--warning)", borderColor: "var(--warning)" }} onClick={() => setConfirmAction({ type: "suspend", user: u })}>Suspend</button>
                    )}
                    {u.status === "suspended" && (
                      <button className="btn btn-success btn-sm" onClick={() => setConfirmAction({ type: "activate", user: u })}>Activate</button>
                    )}
                    <button className="btn btn-danger btn-sm" onClick={() => setConfirmAction({ type: "delete", user: u })} title="Delete">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="User Details"
        footer={<button className="btn btn-ghost" onClick={() => setSelected(null)}>Close</button>}
      >
        {selected && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--gray-100)" }}>
              <div style={{ width: 60, height: 60, background: selected.role === "tutor" ? "var(--navy)" : "var(--sky)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1.4rem", fontWeight: 700 }}>
                {selected.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--navy)" }}>{selected.name}</div>
                <div style={{ color: "var(--gray-500)", fontSize: "0.85rem" }}>{selected.email}</div>
                <div style={{ marginTop: 6 }}><StatusBadge status={selected.status} /></div>
              </div>
            </div>
            {[["Role", selected.role], ["Joined", selected.joined], ["Sessions", selected.sessions]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--gray-100)", fontSize: "0.88rem" }}>
                <span style={{ color: "var(--gray-500)" }}>{k}</span>
                <span style={{ fontWeight: 500, color: "var(--navy)", textTransform: "capitalize" }}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Confirm dialogs */}
      {confirmAction?.type === "approve" && (
        <ConfirmDialog isOpen onClose={() => setConfirmAction(null)} onConfirm={() => handleStatusChange(confirmAction.user.id, "active")}
          title="Approve Tutor" message={`Approve ${confirmAction.user.name} as a tutor on the platform?`} confirmLabel="Approve" />
      )}
      {confirmAction?.type === "suspend" && (
        <ConfirmDialog isOpen onClose={() => setConfirmAction(null)} onConfirm={() => handleStatusChange(confirmAction.user.id, "suspended")}
          title="Suspend User" message={`Suspend ${confirmAction.user.name}? They will lose platform access.`} confirmLabel="Suspend" danger />
      )}
      {confirmAction?.type === "activate" && (
        <ConfirmDialog isOpen onClose={() => setConfirmAction(null)} onConfirm={() => handleStatusChange(confirmAction.user.id, "active")}
          title="Activate User" message={`Reactivate ${confirmAction.user.name}'s account?`} confirmLabel="Activate" />
      )}
      {confirmAction?.type === "delete" && (
        <ConfirmDialog isOpen onClose={() => setConfirmAction(null)} onConfirm={() => handleDelete(confirmAction.user.id)}
          title="Delete User" message={`Permanently delete ${confirmAction.user.name}? This cannot be undone.`} confirmLabel="Delete" danger />
      )}
    </div>
  );
}
