import { useState } from "react";
import AuthPage from "../shared/AuthPage";
import Sidebar from "../shared/Sidebar";
import { Notification } from "../shared/UIComponents";
import StudentDashboard from "./StudentDashboard";
import TutorSearch from "./TutorSearch";
import TutorProfile from "./TutorProfile";
import StudentBookings from "./StudentBookings";
import StudentMessages from "./StudentMessages";

const NAV_ITEMS = [
  {
    label: "Main",
    items: [
      { id: "dashboard", icon: "🏠", label: "Dashboard" },
      { id: "search", icon: "🔍", label: "Find Tutors" },
      { id: "bookings", icon: "📅", label: "My Bookings" },
      { id: "messages", icon: "💬", label: "Messages", badge: 2 },
    ],
  },
  {
    label: "Account",
    items: [
      { id: "profile", icon: "👤", label: "My Profile" },
      { id: "settings", icon: "⚙️", label: "Settings" },
    ],
  },
];

export default function StudentPortal({ user: initialUser, onLogout }) {
  const [user, setUser] = useState(initialUser);
  const [activeTab, setActiveTab] = useState(user ? "dashboard" : "auth");
  const [selectedTutorId, setSelectedTutorId] = useState(null);
  const [notification, setNotification] = useState(null);

  const notify = (message, type = "info") => setNotification({ message, type });

  const handleLogin = (userData) => {
    setUser(userData);
    setActiveTab("dashboard");
  };

  if (!user || activeTab === "auth") {
    return (
      <AuthPage
        role="student"
        onSuccess={handleLogin}
        tagline={<>Learn Smarter.<br /><span>Achieve More.</span></>}
        features={[
          { icon: "🔍", text: "Search tutors by subject, grade, and availability" },
          { icon: "📅", text: "Book sessions at your convenience" },
          { icon: "⭐", text: "Rate and review your tutors" },
          { icon: "💬", text: "Communicate directly with tutors" },
        ]}
      />
    );
  }

  const renderContent = () => {
    if (selectedTutorId) {
      return <TutorProfile tutorId={selectedTutorId} onBack={() => setSelectedTutorId(null)} onNotify={notify} />;
    }
    switch (activeTab) {
      case "dashboard": return <StudentDashboard user={user} onNotify={notify} onNavigate={setActiveTab} />;
      case "search": return <TutorSearch onViewProfile={(id) => setSelectedTutorId(id)} onNotify={notify} />;
      case "bookings": return <StudentBookings user={user} onNotify={notify} />;
      case "messages": return <StudentMessages user={user} onNotify={notify} />;
      case "profile": return <StudentProfilePage user={user} onNotify={notify} />;
      default: return <StudentDashboard user={user} onNotify={notify} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="main-layout">
      {notification && <Notification {...notification} onClose={() => setNotification(null)} />}

      <Sidebar
        items={NAV_ITEMS}
        activeItem={activeTab}
        onItemClick={(id) => { setSelectedTutorId(null); setActiveTab(id); }}
        user={user}
        onLogout={onLogout}
        portalLabel="Student Portal"
        portalColor="var(--sky)"
      />

      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div>
            <span style={{ fontWeight: 600, color: "var(--navy)", fontSize: "0.95rem" }}>
              {selectedTutorId ? "Tutor Profile" : NAV_ITEMS.flatMap(s => s.items).find(i => i.id === activeTab)?.label || "Student Portal"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="btn btn-ghost btn-sm">🔔</button>
            <div style={{ width: 34, height: 34, background: "var(--sky)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: "0.85rem" }}>
              {(user?.name || user?.email || "S")[0].toUpperCase()}
            </div>
          </div>
        </div>

        <div className="page-content">{renderContent()}</div>
      </div>
    </div>
  );
}

// Simple inline profile page
function StudentProfilePage({ user, onNotify }) {
  return (
    <div>
      <h1 className="page-title">My Profile</h1>
      <p className="page-subtitle">Manage your personal information</p>
      <div className="card" style={{ maxWidth: 600 }}>
        <div className="card-body">
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid var(--gray-100)" }}>
            <div style={{ width: 72, height: 72, background: "var(--sky)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1.8rem", fontWeight: 700 }}>
              {(user?.name || "S")[0]}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: "var(--navy)", fontSize: "1.1rem" }}>{user?.name || "Student"}</div>
              <div style={{ color: "var(--gray-500)", fontSize: "0.85rem" }}>{user?.email}</div>
              <div style={{ marginTop: 6 }}><span className="badge badge-sky">Student</span></div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-control" defaultValue={user?.name || ""} placeholder="Your full name" />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-control" defaultValue={user?.email || ""} disabled />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-control" defaultValue={user?.phone || ""} placeholder="+27 71 234 5678" />
          </div>
          <button className="btn btn-primary" onClick={() => onNotify("Profile updated successfully", "success")}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
