import { useState, useEffect } from "react";
import { StatusBadge, EmptyState, ConfirmDialog, Tabs } from "../shared/UIComponents";
import { getBookings, cancelBooking } from "../../services/bookingService";

// ─── Student Bookings ─────────────────────────────────────────────────────────
const MOCK_BOOKINGS = [
  { id: 1, tutor: "Dr. Sarah Mokoena", subject: "Mathematics", date: "2025-04-16", time: "14:00–15:00", session_type: "Online", status: "accepted", rate: 250 },
  { id: 2, tutor: "Mr. James Dlamini", subject: "Physics", date: "2025-04-18", time: "10:00–11:00", session_type: "In Person", status: "pending", rate: 220 },
  { id: 3, tutor: "Ms. Zanele Sithole", subject: "English", date: "2025-04-10", time: "09:00–10:00", session_type: "Online", status: "completed", rate: 200 },
  { id: 4, tutor: "Prof. Thabo Nkosi", subject: "Computer Science", date: "2025-04-05", time: "16:00–17:00", session_type: "Online", status: "cancelled", rate: 300 },
];

export function StudentBookings({ user, onNotify }) {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [cancelId, setCancelId] = useState(null);

  // API CALL: GET /api/bookings/?status=...
  // useEffect(() => { getBookings({ status: activeTab }).then(d => setBookings(d.results)); }, [activeTab]);

  const filtered = bookings.filter(b => {
    if (activeTab === "upcoming") return ["pending", "accepted"].includes(b.status);
    if (activeTab === "completed") return b.status === "completed";
    if (activeTab === "cancelled") return b.status === "cancelled";
    return true;
  });

  const handleCancel = async () => {
    // API CALL: DELETE /api/bookings/:id/
    setBookings(prev => prev.map(b => b.id === cancelId ? { ...b, status: "cancelled" } : b));
    onNotify("Booking cancelled.", "info");
  };

  return (
    <div>
      <h1 className="page-title">My Bookings</h1>
      <p className="page-subtitle">Track and manage your tutoring sessions</p>

      <Tabs
        tabs={[
          { id: "upcoming", label: "Upcoming" },
          { id: "completed", label: "Completed" },
          { id: "cancelled", label: "Cancelled" },
          { id: "all", label: "All" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0
          ? <EmptyState icon="📅" title="No bookings" message="Your sessions will appear here." />
          : filtered.map(b => (
            <div key={b.id} className="booking-card">
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 46, height: 46, background: "var(--sky-pale)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>📚</div>
                <div className="booking-info">
                  <div className="booking-title">{b.subject}</div>
                  <div className="booking-details">with {b.tutor} · {b.date} · {b.time} · {b.session_type}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontWeight: 700, color: "var(--sky-dark)", fontSize: "0.9rem" }}>R{b.rate}</span>
                <StatusBadge status={b.status} />
                {["pending", "accepted"].includes(b.status) && (
                  <button className="btn btn-danger btn-sm" onClick={() => setCancelId(b.id)}>Cancel</button>
                )}
              </div>
            </div>
          ))}
      </div>

      <ConfirmDialog
        isOpen={!!cancelId} onClose={() => setCancelId(null)} onConfirm={handleCancel}
        title="Cancel Booking" message="Are you sure you want to cancel this session?" confirmLabel="Yes, Cancel" danger
      />
    </div>
  );
}

export default StudentBookings;

// ─── Student Messages ─────────────────────────────────────────────────────────
const MOCK_CONVERSATIONS = [
  { id: 1, name: "Dr. Sarah Mokoena", lastMessage: "See you on Wednesday at 14:00!", time: "10:23 AM", unread: 1 },
  { id: 2, name: "Mr. James Dlamini", lastMessage: "Please bring your textbook.", time: "Yesterday", unread: 0 },
];
const MOCK_MESSAGES = {
  1: [
    { id: 1, content: "Hi Dr. Mokoena, I'd like to book a session for next week.", sent: true, time: "10:00 AM" },
    { id: 2, content: "Sure! I'm available Wednesday at 14:00. Does that work for you?", sent: false, time: "10:15 AM" },
    { id: 3, content: "Perfect! Wednesday at 14:00 works great, thank you!", sent: true, time: "10:18 AM" },
    { id: 4, content: "See you on Wednesday at 14:00!", sent: false, time: "10:23 AM" },
  ],
};

export function StudentMessages({ user, onNotify }) {
  const [selectedConv, setSelectedConv] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConv) return;
    // API CALL: POST /api/messages/
    setMessages(prev => ({
      ...prev,
      [selectedConv]: [...(prev[selectedConv] || []), { id: Date.now(), content: newMessage, sent: true, time: "Now" }]
    }));
    setNewMessage("");
  };

  return (
    <div>
      <h1 className="page-title">Messages</h1>
      <p className="page-subtitle">Communicate with your tutors</p>
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 0, border: "1px solid var(--gray-200)", borderRadius: "var(--radius)", overflow: "hidden", minHeight: 500, background: "#fff" }}>
        {/* Conversations list */}
        <div style={{ borderRight: "1px solid var(--gray-200)" }}>
          <div style={{ padding: "16px", borderBottom: "1px solid var(--gray-100)", fontWeight: 600, fontSize: "0.9rem", color: "var(--navy)" }}>Conversations</div>
          {MOCK_CONVERSATIONS.map(c => (
            <div key={c.id} onClick={() => setSelectedConv(c.id)} style={{ padding: "14px 16px", cursor: "pointer", background: selectedConv === c.id ? "var(--sky-pale)" : "transparent", borderBottom: "1px solid var(--gray-100)", borderLeft: selectedConv === c.id ? "3px solid var(--sky)" : "3px solid transparent", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, background: "var(--navy)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.8rem", fontWeight: 600, flexShrink: 0 }}>
                {c.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--navy)" }}>{c.name}</span>
                  <span style={{ fontSize: "0.72rem", color: "var(--gray-400)" }}>{c.time}</span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "var(--gray-500)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.lastMessage}</div>
              </div>
              {c.unread > 0 && <span style={{ background: "var(--sky)", color: "#fff", borderRadius: "10px", padding: "1px 7px", fontSize: "0.7rem", fontWeight: 700 }}>{c.unread}</span>}
            </div>
          ))}
        </div>

        {/* Message thread */}
        {selectedConv ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--gray-100)", fontWeight: 600, color: "var(--navy)", fontSize: "0.9rem" }}>
              {MOCK_CONVERSATIONS.find(c => c.id === selectedConv)?.name}
            </div>
            <div className="message-list">
              {(messages[selectedConv] || []).map(m => (
                <div key={m.id} style={{ alignSelf: m.sent ? "flex-end" : "flex-start" }}>
                  <div className={`message-bubble ${m.sent ? "sent" : "received"}`}>{m.content}</div>
                  <div className="message-time" style={{ textAlign: m.sent ? "right" : "left" }}>{m.time}</div>
                </div>
              ))}
            </div>
            <div className="message-input-area">
              <input className="form-control" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message…" onKeyDown={e => e.key === "Enter" && sendMessage()} />
              <button className="btn btn-primary" onClick={sendMessage}>Send</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <EmptyState icon="💬" title="Select a conversation" message="Choose a conversation from the list to start messaging." />
          </div>
        )}
      </div>
    </div>
  );
}
