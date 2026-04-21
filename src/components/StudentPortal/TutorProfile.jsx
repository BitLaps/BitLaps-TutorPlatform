import { useState, useEffect } from "react";
import { StarRating, Modal, Spinner, EmptyState } from "../shared/UIComponents";
import { getTutorById } from "../../services/tutorService";
import { createBooking } from "../../services/bookingService";
import { submitRating } from "../../services/adminService";

const MOCK_TUTOR = {
  id: 1, name: "Dr. Sarah Mokoena", subjects: ["Mathematics", "Statistics", "Calculus"],
  grade_levels: ["Grade 11", "Grade 12", "First Year", "Second Year"],
  location: "On Campus", rating: 4.9, review_count: 47, hourly_rate: 250, verified: true,
  bio: "PhD in Applied Mathematics from the University of Pretoria with over 8 years of tutoring experience. I specialise in exam preparation, concept clarification, and building mathematical confidence. My approach is student-centred — I adapt my teaching to each student's learning style.",
  qualifications: ["PhD Applied Mathematics — UP", "BSc Honours Mathematics — UKZN", "National Senior Certificate — Matric"],
  availability: [
    { day: "Monday", slots: ["09:00–12:00", "14:00–17:00"] },
    { day: "Wednesday", slots: ["10:00–13:00"] },
    { day: "Friday", slots: ["09:00–11:00", "13:00–16:00"] },
  ],
  reviews: [
    { id: 1, student: "Amahle M.", rating: 5, review: "Excellent tutor! Really helped me understand calculus. I went from 45% to 78%.", date: "2025-03-20" },
    { id: 2, student: "Sipho D.", rating: 5, review: "Patient, thorough, and explains concepts really clearly. Highly recommend.", date: "2025-03-10" },
    { id: 3, student: "Nomsa K.", rating: 4, review: "Very knowledgeable. Sometimes goes a bit fast but accommodates when you ask.", date: "2025-02-28" },
  ],
};

export default function TutorProfile({ tutorId, onBack, onNotify }) {
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [showRating, setShowRating] = useState(false);

  useEffect(() => {
    // API CALL: GET /api/tutors/:id/
    // getTutorById(tutorId).then(setTutor).catch(e => onNotify(e.message, 'error')).finally(() => setLoading(false));
    setTimeout(() => { setTutor(MOCK_TUTOR); setLoading(false); }, 500);
  }, [tutorId]);

  if (loading) return <div style={{ textAlign: "center", padding: 80 }}><Spinner /></div>;
  if (!tutor) return <EmptyState icon="❌" title="Tutor not found" />;

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 20 }}>← Back to Search</button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
        {/* Left: Profile Info */}
        <div>
          {/* Header Card */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-body">
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ width: 80, height: 80, background: "var(--navy)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1.7rem", fontWeight: 700, flexShrink: 0 }}>
                  {tutor.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <h2 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", fontSize: "1.5rem" }}>{tutor.name}</h2>
                    {tutor.verified && <span className="badge badge-success">✓ Verified</span>}
                  </div>
                  <div style={{ color: "var(--gray-500)", fontSize: "0.88rem", margin: "4px 0" }}>{tutor.subjects.join(" · ")}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    <StarRating value={Math.round(tutor.rating)} readOnly />
                    <span style={{ fontSize: "0.85rem", color: "var(--gray-600)" }}>{tutor.rating} ({tutor.review_count} reviews)</span>
                    <span className="badge badge-sky">📍 {tutor.location}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", color: "var(--sky-dark)", fontWeight: 700 }}>R{tutor.hourly_rate}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}>per hour</div>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header"><h3 style={{ fontWeight: 600, color: "var(--navy)" }}>About</h3></div>
            <div className="card-body">
              <p style={{ color: "var(--gray-600)", fontSize: "0.9rem", lineHeight: 1.7 }}>{tutor.bio}</p>
            </div>
          </div>

          {/* Qualifications */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header"><h3 style={{ fontWeight: 600, color: "var(--navy)" }}>Qualifications</h3></div>
            <div className="card-body">
              {tutor.qualifications.map((q, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < tutor.qualifications.length - 1 ? "1px solid var(--gray-100)" : "none" }}>
                  <span style={{ color: "var(--sky)", fontSize: "0.85rem" }}>🎓</span>
                  <span style={{ fontSize: "0.88rem", color: "var(--gray-700)" }}>{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="card">
            <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontWeight: 600, color: "var(--navy)" }}>Reviews ({tutor.review_count})</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowRating(true)}>Leave a Review</button>
            </div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {tutor.reviews.map((r) => (
                <div key={r.id} style={{ borderBottom: "1px solid var(--gray-100)", paddingBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--navy)" }}>{r.student}</span>
                    <span style={{ fontSize: "0.78rem", color: "var(--gray-400)" }}>{r.date}</span>
                  </div>
                  <StarRating value={r.rating} readOnly size="0.82rem" />
                  <p style={{ fontSize: "0.85rem", color: "var(--gray-600)", marginTop: 6, lineHeight: 1.5 }}>{r.review}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Booking Sidebar */}
        <div style={{ position: "sticky", top: 80 }}>
          <div className="card">
            <div className="card-body">
              <h3 style={{ fontWeight: 600, color: "var(--navy)", marginBottom: 16 }}>Book a Session</h3>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: "0.8rem", color: "var(--gray-500)", marginBottom: 8, fontWeight: 500 }}>AVAILABILITY</div>
                {tutor.availability.map((a) => (
                  <div key={a.day} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--navy)" }}>{a.day}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 3 }}>
                      {a.slots.map(s => <span key={s} className="badge badge-sky" style={{ fontSize: "0.72rem" }}>{s}</span>)}
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary w-full" onClick={() => setShowBooking(true)}>📅 Request Booking</button>
              <button className="btn btn-outline w-full" style={{ marginTop: 10 }}>💬 Send Message</button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} tutor={tutor} onNotify={onNotify} />

      {/* Rating Modal */}
      <RatingModal isOpen={showRating} onClose={() => setShowRating(false)} tutor={tutor} onNotify={onNotify} />
    </div>
  );
}

function BookingModal({ isOpen, onClose, tutor, onNotify }) {
  const [form, setForm] = useState({ subject: "", date: "", start_time: "", end_time: "", session_type: "online", notes: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // API CALL: POST /api/bookings/
      // await createBooking({ tutor_id: tutor.id, ...form });
      onNotify("Booking request sent! The tutor will confirm shortly.", "success");
      onClose();
    } catch (e) {
      onNotify(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Book ${tutor?.name}`}
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? <Spinner /> : "Send Request"}</button></>}
    >
      <div className="form-group">
        <label className="form-label">Subject</label>
        <select className="form-control" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
          <option value="">Select subject…</option>
          {tutor?.subjects.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Date</label>
          <input type="date" className="form-control" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Session Type</label>
          <select className="form-control" value={form.session_type} onChange={e => setForm({ ...form, session_type: e.target.value })}>
            <option value="online">Online</option>
            <option value="in_person">In Person</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Start Time</label>
          <input type="time" className="form-control" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">End Time</label>
          <input type="time" className="form-control" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Notes (Optional)</label>
        <textarea className="form-control" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Topics you'd like to cover…" rows={3} />
      </div>
    </Modal>
  );
}

function RatingModal({ isOpen, onClose, tutor, onNotify }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = async () => {
    if (!rating) { onNotify("Please select a star rating", "warning"); return; }
    try {
      // API CALL: POST /api/ratings/
      // await submitRating({ tutor_id: tutor.id, rating, review });
      onNotify("Review submitted! Thank you.", "success");
      onClose();
    } catch (e) {
      onNotify(e.message, "error");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave a Review"
      footer={<><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={handleSubmit}>Submit Review</button></>}
    >
      <p style={{ fontSize: "0.88rem", color: "var(--gray-600)", marginBottom: 20 }}>Share your experience with {tutor?.name}</p>
      <div className="form-group">
        <label className="form-label">Rating</label>
        <StarRating value={rating} onChange={setRating} size="2rem" />
      </div>
      <div className="form-group">
        <label className="form-label">Review</label>
        <textarea className="form-control" value={review} onChange={e => setReview(e.target.value)} placeholder="Describe your tutoring experience…" rows={4} />
      </div>
    </Modal>
  );
}
