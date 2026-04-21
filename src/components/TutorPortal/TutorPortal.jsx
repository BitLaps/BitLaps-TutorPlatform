import { useState } from "react";
import AuthPage from "../shared/AuthPage";
import Sidebar from "../shared/Sidebar";
import { Notification } from "../shared/UIComponents";
import TutorDashboard from "./TutorDashboard";
import TutorProfileManager from "./TutorProfileManager";
import TutorBookings from "./TutorBookings";
import TutorAvailability from "./TutorAvailability";
import TutorMessages from "./TutorMessages";

const NAV_ITEMS = [
  {
    label: "Main",
    items: [
      { id: "dashboard", icon: "🏠", label: "Dashboard" },
      { id: "bookings", icon: "📅", label: "Booking Requests", badge: 3 },
      { id: "messages", icon: "💬", label: "Messages", badge: 1 },
    ],
  },
  {
    label: "Profile",
    items: [
      { id: "profile", icon: "👤", label: "My Profile" },
      { id: "availability", icon: "🗓️", label: "Availability" },
      { id: "ratings", icon: "⭐", label: "Ratings & Reviews" },
    ],
  },
  {
    label: "Account",
    items: [{ id: "settings", icon: "⚙️", label: "Settings" }],
  },
];

export default function TutorPortal({ user: initialUser, onLogout }) {
  const [user, setUser] = useState(initialUser);
  const [activeTab, setActiveTab] = useState(user ? "dashboard" : "auth");
  const [notification, setNotification] = useState(null);

  const notify = (message, type = "info") => setNotification({ message, type });

  const handleLogin = (userData) => {
    setUser(userData);
    setActiveTab("dashboard");
  };

  if (!user || activeTab === "auth") {
    return (
      <AuthPage
        role="tutor"
        onSuccess={handleLogin}
        tagline={<>Share Your Knowledge.<br /><span>Inspire Students.</span></>}
        features={[
          { icon: "📝", text: "Build your professional tutor profile" },
          { icon: "📅", text: "Set your own schedule and availability" },
          { icon: "💰", text: "Set your hourly rate and earn flexibly" },
          { icon: "📊", text: "Track your performance and reviews" },
        ]}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <TutorDashboard user={user} onNotify={notify} onNavigate={setActiveTab} />;
      case "bookings": return <TutorBookings user={user} onNotify={notify} />;
      case "messages": return <TutorMessages user={user} onNotify={notify} />;
      case "profile": return <TutorProfileManager user={user} onNotify={notify} />;
      case "availability": return <TutorAvailability user={user} onNotify={notify} />;
      case "ratings": return <TutorRatingsPage user={user} />;
      default: return <TutorDashboard user={user} onNotify={notify} onNavigate={setActiveTab} />;
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
        portalLabel="Tutor Portal"
        portalColor="var(--navy-light)"
      />

      <div className="main-content">
        <div className="top-bar">
          <span style={{ fontWeight: 600, color: "var(--navy)", fontSize: "0.95rem" }}>
            {NAV_ITEMS.flatMap(s => s.items).find(i => i.id === activeTab)?.label || "Tutor Portal"}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="btn btn-ghost btn-sm">🔔</button>
            <div style={{ width: 34, height: 34, background: "var(--navy)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: "0.85rem" }}>
              {(user?.name || user?.email || "T")[0].toUpperCase()}
            </div>
          </div>
        </div>
        <div className="page-content">{renderContent()}</div>
      </div>
    </div>
  );
}

// Tutor Ratings page (inline for brevity)
function TutorRatingsPage({ user }) {
  const MOCK = [
    { id: 1, student: "Amahle M.", rating: 5, review: "Excellent! Really helped me understand calculus.", date: "2025-03-20", subject: "Mathematics" },
    { id: 2, student: "Sipho D.", rating: 5, review: "Patient, thorough, and explains concepts clearly.", date: "2025-03-10", subject: "Mathematics" },
    { id: 3, student: "Nomsa K.", rating: 4, review: "Very knowledgeable. Sometimes goes fast.", date: "2025-02-28", subject: "Statistics" },
  ];
  return (
    <div>
      <h1 className="page-title">Ratings & Reviews</h1>
      <p className="page-subtitle">See what your students are saying</p>
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24 }}>
        <div className="card" style={{ textAlign: "center" }}>
          <div className="card-body">
            <div style={{ fontFamily: "var(--font-display)", fontSize: "3rem", color: "var(--navy)", fontWeight: 700 }}>4.8</div>
            <div style={{ display: "flex", justifyContent: "center", margin: "6px 0" }}>{"★★★★★".split("").map((s, i) => <span key={i} style={{ color: "var(--warning)", fontSize: "1.1rem" }}>{s}</span>)}</div>
            <div style={{ color: "var(--gray-500)", fontSize: "0.82rem" }}>Based on 47 reviews</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {MOCK.map(r => (
            <div key={r.id} className="card">
              <div className="card-body">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div><span style={{ fontWeight: 600, color: "var(--navy)" }}>{r.student}</span> <span className="badge badge-sky" style={{ marginLeft: 6 }}>{r.subject}</span></div>
                  <span style={{ fontSize: "0.78rem", color: "var(--gray-400)" }}>{r.date}</span>
                </div>
                <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= r.rating ? "var(--warning)" : "var(--gray-200)", fontSize: "0.9rem" }}>★</span>)}
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--gray-600)", lineHeight: 1.5 }}>{r.review}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
