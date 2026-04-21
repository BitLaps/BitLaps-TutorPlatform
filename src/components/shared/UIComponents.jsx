/**
 * Shared reusable UI components for the Eduvos platform.
 * Import these throughout all portal components.
 */

import { useState, useEffect } from "react";

// ─── Notification Toast ───────────────────────────────────────────────────────
export function Notification({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };
  return (
    <div className={`notification ${type}`}>
      <span>{icons[type]}</span>
      <span>{message}</span>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", marginLeft: "auto", fontSize: "1rem" }}>✕</button>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
export function StarRating({ value = 0, onChange, readOnly = false, size = "1rem" }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hovered || value) ? "filled" : "empty"}`}
          style={{ fontSize: size, cursor: readOnly ? "default" : "pointer" }}
          onClick={() => !readOnly && onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
        >★</span>
      ))}
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
export function Avatar({ name = "", size = "md", color = "navy", src }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  if (src) return <img src={src} alt={name} className={`avatar avatar-${size}`} />;
  return <div className={`avatar avatar-${size} avatar-${color}`}>{initials || "?"}</div>;
}

// ─── Loading Spinner ──────────────────────────────────────────────────────────
export function Spinner({ color = "currentColor" }) {
  return <span className="loading-spinner" style={{ borderTopColor: color }} />;
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon = "📭", title, message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, variant = "gray" }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    pending: { label: "Pending", variant: "warning" },
    accepted: { label: "Accepted", variant: "success" },
    rejected: { label: "Rejected", variant: "danger" },
    completed: { label: "Completed", variant: "navy" },
    cancelled: { label: "Cancelled", variant: "gray" },
    active: { label: "Active", variant: "success" },
    suspended: { label: "Suspended", variant: "danger" },
    approved: { label: "Approved", variant: "success" },
    pending_approval: { label: "Pending Approval", variant: "warning" },
  };
  const config = map[status] || { label: status, variant: "gray" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >{tab.icon && <span>{tab.icon} </span>}{tab.label}</button>
      ))}
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = "Confirm", danger = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}
      footer={<>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className={`btn ${danger ? "btn-danger" : "btn-primary"}`} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</button>
      </>}
    ><p style={{ color: "var(--gray-600)", fontSize: "0.9rem" }}>{message}</p>
    </Modal>
  );
}

// ─── Search & Filter Bar ──────────────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      {value && <button onClick={() => onChange("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", fontSize: "0.9rem" }}>✕</button>}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ icon, label, value, change, changeType, color = "#e8f7fe" }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color }}>{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {change && <div className={`stat-change ${changeType}`}>{changeType === "up" ? "↑" : "↓"} {change}</div>}
    </div>
  );
}

// ─── Page Header ──────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>{actions}</div>}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export function Pagination({ current, total, onPageChange }) {
  if (total <= 1) return null;
  return (
    <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "24px", alignItems: "center" }}>
      <button className="btn btn-ghost btn-sm" disabled={current === 1} onClick={() => onPageChange(current - 1)}>← Prev</button>
      {Array.from({ length: Math.min(total, 5) }, (_, i) => i + Math.max(1, current - 2)).map((page) => (
        <button key={page} className={`btn btn-sm ${page === current ? "btn-primary" : "btn-ghost"}`} onClick={() => onPageChange(page)}>{page}</button>
      ))}
      <button className="btn btn-ghost btn-sm" disabled={current === total} onClick={() => onPageChange(current + 1)}>Next →</button>
    </div>
  );
}
