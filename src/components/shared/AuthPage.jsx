import { useState } from "react";
import { login, register } from "../../services/authService";
import { Spinner, Notification } from "./UIComponents";

/**
 * AuthPage — shared login/register component for Student and Tutor portals.
 * Props:
 *   role: 'student' | 'tutor'
 *   onSuccess: (user) => void
 *   features: [{ icon, text }]  — shown in left panel
 *   tagline: string
 */
export default function AuthPage({ role, onSuccess, features = [], tagline }) {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", password: "", confirm_password: "",
    phone: "",
  });

  const notify = (message, type = "error") => setNotification({ message, type });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (mode === "login") {
        // POST /api/auth/login/
        const data = await login(form.email, form.password);
        notify("Welcome back! Redirecting…", "success");
        setTimeout(() => onSuccess(data.user), 800);
      } else {
        if (form.password !== form.confirm_password) {
          notify("Passwords do not match"); setLoading(false); return;
        }
        // POST /api/auth/register/
        const data = await register({ ...form, role });
        notify("Account created! Please log in.", "success");
        setTimeout(() => setMode("login"), 1000);
      }
    } catch (err) {
      notify(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const panelColor = role === "student" ? "var(--sky)" : "var(--navy-light)";
  const roleLabel = role === "student" ? "Student Portal" : "Tutor Portal";

  return (
    <div className="auth-page">
      {notification && <Notification {...notification} onClose={() => setNotification(null)} />}

      {/* Left decorative panel */}
      <div className="auth-left">
        <div className="auth-tagline">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, background: "var(--sky)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🎓</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: "1rem", fontFamily: "var(--font-display)" }}>Eduvos</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem" }}>Mbombela Campus</div>
            </div>
          </div>
          <h1>{tagline || <>Unlock Your <span>Academic</span> Potential</>}</h1>
          <p>Connect with qualified tutors and achieve excellence through personalised academic support.</p>
        </div>
        <div className="auth-features">
          {features.map((f, i) => (
            <div key={i} className="auth-feature">
              <div className="auth-feature-icon">{f.icon}</div>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-right">
        <div className="auth-form-container">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <div style={{ width: 8, height: 36, background: "var(--sky)", borderRadius: 4 }} />
            <div>
              <h1 className="auth-title">{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
              <p className="auth-subtitle">{roleLabel} — {mode === "login" ? "Sign in to continue" : "Join Eduvos today"}</p>
            </div>
          </div>

          <div className="auth-tabs">
            <button className={`auth-tab ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>Sign In</button>
            <button className={`auth-tab ${mode === "register" ? "active" : ""}`} onClick={() => setMode("register")}>Register</button>
          </div>

          {/* Register fields */}
          {mode === "register" && (
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="form-control" name="first_name" value={form.first_name} onChange={handleChange} placeholder="John" />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="form-control" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Doe" />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-control" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@eduvos.ac.za" />
          </div>

          {mode === "register" && (
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-control" name="phone" value={form.phone} onChange={handleChange} placeholder="+27 71 234 5678" />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-control" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
          </div>

          {mode === "register" && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input className="form-control" name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} placeholder="••••••••" />
            </div>
          )}

          <button className="btn btn-primary w-full btn-lg" onClick={handleSubmit} disabled={loading} style={{ marginTop: 8 }}>
            {loading ? <><Spinner /> Processing…</> : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          {mode === "login" && (
            <p style={{ textAlign: "center", marginTop: 16, fontSize: "0.82rem", color: "var(--gray-500)" }}>
              Forgot your password? <span className="auth-link">Reset it here</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
