import { useState } from "react";
import Sidebar from "../shared/Sidebar";
import { Notification } from "../shared/UIComponents";
import AdminOverview from "./AdminOverview";
import AdminUsers from "./AdminUsers";
import AdminBookings from "./AdminBookings";
import AdminReports from "./AdminReports";

const NAV_ITEMS = [
  {
    label: "Overview",
    items: [{ id: "overview", icon: "📊", label: "Dashboard" }],
  },
  {
    label: "Management",
    items: [
      { id: "users", icon: "👥", label: "User Management" },
      { id: "bookings", icon: "📅", label: "All Bookings" },
      { id: "reports", icon: "📈", label: "Reports & Analytics" },
    ],
  },
  {
    label: "System",
    items: [
      { id: "settings", icon: "⚙️", label: "Platform Settings" },
      { id: "logs", icon: "📋", label: "Activity Logs" },
    ],
  },
];

export default function AdminDashboard({ user: initialUser, onLogout }) {
  const [user, setUser] = useState(initialUser || { name: "Admin", email: "admin@eduvos.ac.za", role: "admin" });
  const [activeTab, setActiveTab] = useState("overview");
  const [notification, setNotification] = useState(null);

  const notify = (message, type = "info") => setNotification({ message, type });

  // Admin login — simple gate for demo
  const [authed, setAuthed] = useState(!!initialUser || true); // set to false in production

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--navy)" }}>
        <div className="card" style={{ maxWidth: 400, width: "100%", margin: 24 }}>
          <div className="card-body">
            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", marginBottom: 6 }}>Admin Access</h2>
            <p style={{ color: "var(--gray-500)", fontSize: "0.85rem", marginBottom: 20 }}>Enter admin credentials to continue</p>
            <div className="form-group"><label className="form-label">Email</label><input className="form-control" placeholder="admin@eduvos.ac.za" /></div>
            <div className="form-group"><label className="form-label">Password</label><input type="password" className="form-control" /></div>
            <button className="btn btn-secondary w-full" onClick={() => setAuthed(true)}>Sign In as Admin</button>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <AdminOverview onNotify={notify} onNavigate={setActiveTab} />;
      case "users": return <AdminUsers onNotify={notify} />;
      case "bookings": return <AdminBookings onNotify={notify} />;
      case "reports": return <AdminReports onNotify={notify} />;
      case "settings": return <AdminSettings onNotify={notify} />;
      default: return <AdminOverview onNotify={notify} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="main-layout">
      {notification && <Notification {...notification} onClose={() => setNotification(null)} />}

      <Sidebar
        items={NAV_ITEMS}
        activeItem={activeTab}
        onItemClick={setActiveTab}
        user={user}
        onLogout={onLogout}
        portalLabel="Admin Dashboard"
        portalColor="#1a4a7a"
      />

      <div className="main-content">
        <div className="top-bar">
          <span style={{ fontWeight: 600, color: "var(--navy)", fontSize: "0.95rem" }}>
            {NAV_ITEMS.flatMap(s => s.items).find(i => i.id === activeTab)?.label || "Admin Dashboard"}
          </span>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span className="badge badge-danger" style={{ fontSize: "0.75rem" }}>⚙️ Admin</span>
            <button className="btn btn-ghost btn-sm">🔔</button>
            <div style={{ width: 34, height: 34, background: "var(--navy)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: "0.85rem" }}>A</div>
          </div>
        </div>
        <div className="page-content">{renderContent()}</div>
      </div>
    </div>
  );
}

function AdminSettings({ onNotify }) {
  return (
    <div>
      <h1 className="page-title">Platform Settings</h1>
      <p className="page-subtitle">Configure platform-wide settings</p>
      <div className="card" style={{ maxWidth: 600 }}>
        <div className="card-body">
          <div className="form-group"><label className="form-label">Platform Name</label><input className="form-control" defaultValue="Eduvos Mbombela Tutoring Platform" /></div>
          <div className="form-group"><label className="form-label">Support Email</label><input className="form-control" defaultValue="support@eduvos.ac.za" /></div>
          <div className="form-group"><label className="form-label">Max Booking Advance (days)</label><input type="number" className="form-control" defaultValue={30} /></div>
          <div className="form-group"><label className="form-label">Tutor Approval Required</label>
            <select className="form-control"><option>Yes — Manual Review</option><option>No — Auto Approve</option></select>
          </div>
          <button className="btn btn-primary" onClick={() => onNotify("Settings saved!", "success")}>Save Settings</button>
        </div>
      </div>
    </div>
  );
}
