import { useState, useEffect } from "react";
import { SearchBar, EmptyState, Spinner, StarRating, Badge } from "../shared/UIComponents";
import { getTutors } from "../../services/tutorService";

const SUBJECTS = ["All Subjects", "Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science", "Economics", "Accounting", "History", "Geography"];
const GRADES = ["All Grades", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12", "First Year", "Second Year", "Third Year", "Honours"];
const LOCATIONS = ["All Locations", "On Campus", "Online", "Mbombela CBD", "White River", "Hazyview", "Nelspruit"];

// Mock data for demonstration — replaced by API
const MOCK_TUTORS = [
  { id: 1, name: "Dr. Sarah Mokoena", subjects: ["Mathematics", "Statistics"], grade_levels: ["Grade 11", "Grade 12", "First Year"], location: "On Campus", rating: 4.9, review_count: 47, hourly_rate: 250, bio: "PhD in Applied Mathematics with 8 years of tutoring experience. Specialising in exam preparation.", availability: "Mon-Fri", verified: true },
  { id: 2, name: "Mr. James Dlamini", subjects: ["Physics", "Mathematics"], grade_levels: ["Grade 10", "Grade 11", "Grade 12"], location: "Online", rating: 4.7, review_count: 32, hourly_rate: 220, bio: "BSc Physics Honours. Passionate about making science accessible and engaging.", availability: "Mon, Wed, Fri", verified: true },
  { id: 3, name: "Ms. Zanele Sithole", subjects: ["English", "Literature"], grade_levels: ["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"], location: "Mbombela CBD", rating: 4.8, review_count: 61, hourly_rate: 200, bio: "BA English Honours. Expert in creative writing, comprehension and essay technique.", availability: "Tues-Sat", verified: false },
  { id: 4, name: "Prof. Thabo Nkosi", subjects: ["Computer Science", "Python", "Web Dev"], grade_levels: ["First Year", "Second Year", "Third Year"], location: "Online", rating: 4.6, review_count: 28, hourly_rate: 300, bio: "Senior lecturer with industry experience. Specialises in programming and software development.", availability: "Evenings", verified: true },
  { id: 5, name: "Ms. Nomsa Dube", subjects: ["Accounting", "Economics"], grade_levels: ["Grade 11", "Grade 12", "First Year"], location: "On Campus", rating: 4.9, review_count: 55, hourly_rate: 240, bio: "CA(SA) qualified with strong track record helping students pass board exams.", availability: "Weekends", verified: true },
  { id: 6, name: "Mr. Sipho Mahlangu", subjects: ["Biology", "Life Sciences"], grade_levels: ["Grade 10", "Grade 11", "Grade 12"], location: "White River", rating: 4.5, review_count: 19, hourly_rate: 190, bio: "BSc Biochemistry student offering tutoring in biological sciences.", availability: "Flexible", verified: false },
];

export default function TutorSearch({ onViewProfile, onNotify }) {
  const [tutors, setTutors] = useState(MOCK_TUTORS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ subject: "", grade: "", location: "", availability: "" });

  useEffect(() => {
    // API CALL: GET /api/tutors/?search=...&subject=...&grade=...&location=...
    // setLoading(true);
    // getTutors({ search, ...filters })
    //   .then(data => setTutors(data.results))
    //   .catch(e => onNotify(e.message, 'error'))
    //   .finally(() => setLoading(false));

    // Client-side filtering on mock data (remove when API is connected)
    const filtered = MOCK_TUTORS.filter((t) => {
      const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.subjects.some(s => s.toLowerCase().includes(search.toLowerCase()));
      const matchSubject = !filters.subject || t.subjects.includes(filters.subject);
      const matchGrade = !filters.grade || t.grade_levels.includes(filters.grade);
      const matchLocation = !filters.location || t.location === filters.location;
      return matchSearch && matchSubject && matchGrade && matchLocation;
    });
    setTutors(filtered);
  }, [search, filters]);

  return (
    <div>
      <h1 className="page-title">Find a Tutor</h1>
      <p className="page-subtitle">Search and filter tutors by subject, grade, and availability</p>

      {/* Search & Filters */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body" style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or subject…" />
          <select className="form-control" style={{ width: "auto", minWidth: 160 }} value={filters.subject} onChange={(e) => setFilters({ ...filters, subject: e.target.value === "All Subjects" ? "" : e.target.value })}>
            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="form-control" style={{ width: "auto", minWidth: 140 }} value={filters.grade} onChange={(e) => setFilters({ ...filters, grade: e.target.value === "All Grades" ? "" : e.target.value })}>
            {GRADES.map(g => <option key={g}>{g}</option>)}
          </select>
          <select className="form-control" style={{ width: "auto", minWidth: 160 }} value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value === "All Locations" ? "" : e.target.value })}>
            {LOCATIONS.map(l => <option key={l}>{l}</option>)}
          </select>
          <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(""); setFilters({ subject: "", grade: "", location: "", availability: "" }); }}>
            Reset
          </button>
        </div>
      </div>

      {/* Results count */}
      <div style={{ marginBottom: 16, color: "var(--gray-500)", fontSize: "0.85rem" }}>
        {loading ? "Searching…" : `${tutors.length} tutor${tutors.length !== 1 ? "s" : ""} found`}
      </div>

      {/* Tutor Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}><Spinner /></div>
      ) : tutors.length === 0 ? (
        <EmptyState icon="🔍" title="No tutors found" message="Try adjusting your search filters." />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {tutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} onClick={() => onViewProfile(tutor.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function TutorCard({ tutor, onClick }) {
  return (
    <div className="tutor-card" onClick={onClick}>
      <div className="tutor-card-header">
        <div style={{ width: 52, height: 52, background: "var(--navy)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "1rem", flexShrink: 0 }}>
          {tutor.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
        </div>
        <div className="tutor-card-info">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="tutor-card-name">{tutor.name}</span>
            {tutor.verified && <span title="Verified" style={{ color: "var(--sky)", fontSize: "0.85rem" }}>✓</span>}
          </div>
          <div className="tutor-card-subjects">{tutor.subjects.join(", ")}</div>
          <div className="tutor-card-rating">
            <StarRating value={Math.round(tutor.rating)} readOnly size="0.85rem" />
            <span style={{ fontSize: "0.78rem", color: "var(--gray-500)", marginLeft: 4 }}>{tutor.rating} ({tutor.review_count})</span>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div className="tutor-card-price">R{tutor.hourly_rate}/hr</div>
        </div>
      </div>

      <p style={{ fontSize: "0.82rem", color: "var(--gray-600)", lineHeight: 1.5, marginBottom: 0 }}>{tutor.bio.slice(0, 100)}…</p>

      <div className="tutor-card-meta">
        <span className="badge badge-sky">📍 {tutor.location}</span>
        <span className="badge badge-gray">⏰ {tutor.availability}</span>
        {tutor.grade_levels.slice(0, 2).map(g => <span key={g} className="badge badge-navy">{g}</span>)}
      </div>
    </div>
  );
}
