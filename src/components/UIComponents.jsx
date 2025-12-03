// src/components/UIComponents.jsx
import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { NotificationBell } from "./NotificationCenter"; // adjust path if needed

/* ---------------- Sidebar (unchanged markup + classNames) ---------------- */
export function Sidebar({ collapsed }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="brand">
        <div className="logo">dE</div>
        <div className="brand-text">digiEvent</div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="nav-icon">📊</span>
          <span className="nav-text">Dashboard</span>
        </NavLink>

        <NavLink to="/events" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="nav-icon">📅</span>
          <span className="nav-text">Event Management</span>
        </NavLink>

        <NavLink to="/users" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="nav-icon">👥</span>
          <span className="nav-text">User Management</span>
        </NavLink>

        <NavLink to="/reports" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="nav-icon">📈</span>
          <span className="nav-text">Reports</span>
        </NavLink>

        <NavLink to="/feedback" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          <span className="nav-icon">💬</span>
          <span className="nav-text">Feedback</span>
        </NavLink>
      </nav>
    </aside>
  );
}

/* ---------------- Simple Search Suggestion engine (demo sample data) ----------------
   - In a real app replace the sample arrays with API calls or shared state.
   - Suggestions show type (Event / User / Report / Feedback / Notification).
*/
const SAMPLE_EVENTS = [
  { id: "e1", title: "Tech Innovate Summit", org: "GlobalTech" },
  { id: "e2", title: "AI & ML Workshop", org: "AI Labs" },
  { id: "e3", title: "Design Thinking Bootcamp", org: "UX Club" },
];

const SAMPLE_USERS = [
  { id: "u1", name: "Alice Johnson", email: "alice.j@example.com" },
  { id: "u2", name: "Bob Williams", email: "bob.w@example.com" },
  { id: "u3", name: "Charlie Brown", email: "charlie.b@example.com" },
];

const SAMPLE_REPORTS = [
  { id: "r1", title: "Monthly Registrations" },
  { id: "r2", title: "Payment Summary" },
];

/* ---------------- SearchBar (centered) with live dropdown ---------------- */
export function SearchBar() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const wrapperRef = useRef();

  // compute results on q change
  useEffect(() => {
    const term = q.trim().toLowerCase();
    if (!term) {
      // show top quick actions when empty
      setResults([
        { kind: "action", id: "a1", title: "View all events" },
        { kind: "action", id: "a2", title: "View users" },
        { kind: "action", id: "a3", title: "Open reports" },
      ]);
      return;
    }

    const events = SAMPLE_EVENTS
      .filter((e) => e.title.toLowerCase().includes(term))
      .map((e) => ({ kind: "event", ...e }));
    const users = SAMPLE_USERS
      .filter((u) => u.name.toLowerCase().includes(term) || (u.email || "").toLowerCase().includes(term))
      .map((u) => ({ kind: "user", ...u }));
    const reports = SAMPLE_REPORTS
      .filter((r) => r.title.toLowerCase().includes(term))
      .map((r) => ({ kind: "report", ...r }));

    // also include feedback/notifications if you store them in localStorage
    const notifications = (() => {
      try {
        const raw = localStorage.getItem("notifications");
        const list = raw ? JSON.parse(raw) : [];
        return list
          .filter((n) => (n.title + " " + (n.body || "")).toLowerCase().includes(term))
          .slice(0, 5)
          .map((n) => ({ kind: "notification", ...n }));
      } catch {
        return [];
      }
    })();

    setResults([...events, ...users, ...reports, ...notifications]);
  }, [q]);

  // close when clicking outside
  useEffect(() => {
    function onClickOutside(e) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  function handleSelect(item) {
    setOpen(false);
    setQ("");
    // Navigate depending on type. We pass query param `q` so pages can read it.
    if (item.kind === "event") {
      navigate(`/events?q=${encodeURIComponent(item.title)}`);
    } else if (item.kind === "user") {
      navigate(`/users?q=${encodeURIComponent(item.name)}`);
    } else if (item.kind === "report") {
      navigate(`/reports?q=${encodeURIComponent(item.title)}`);
    } else if (item.kind === "notification") {
      navigate(`/notifications`);
    } else if (item.kind === "action") {
      // quick actions
      if (item.title.toLowerCase().includes("events")) navigate(`/events`);
      else if (item.title.toLowerCase().includes("users")) navigate(`/users`);
      else if (item.title.toLowerCase().includes("report")) navigate(`/reports`);
      else navigate(`/`);
    }
  }

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%", maxWidth: 820 }}>
      <input
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Search events, users, feedback..."
        aria-label="Search events, users, feedback"
        className="search-input"
        style={{
          width: "100%",
          height: 44,
          borderRadius: 22,
          padding: "0 18px",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "none",
          outline: "none",
        }}
      />

      {open && results && results.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 0,
            right: 0,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(16,24,40,0.08)",
            overflow: "hidden",
            zIndex: 1200,
          }}
        >
          {results.map((r) => (
            <div
              key={r.id}
              onClick={() => handleSelect(r)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") handleSelect(r); }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "12px 16px",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: r.kind === "event" ? "#eef2ff" : r.kind === "user" ? "#f3e8ff" : "#f1f5f9",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: r.kind === "event" ? "#1e3a8a" : "#6b21a8", fontWeight: 700
                }}>
                  {r.kind === "event" ? "E" : r.kind === "user" ? "U" : r.kind === "report" ? "R" : "N"}
                </div>

                <div>
                  <div style={{ fontWeight: 700, color: "#0f172a" }}>
                    {r.title ?? r.name ?? r.id}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                    {r.kind === "event" ? (r.org || "") : r.kind === "user" ? (r.email || "") : r.kind === "notification" ? (r.body || "") : ""}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 12, color: "#94a3b8" }}>
                {r.kind === "event" ? "Event" : r.kind === "user" ? "User" : r.kind === "report" ? "Report" : "Notification"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Topbar: centered search + right-side icons ---------------- */
export function Topbar({ collapsed, setCollapsed }) {
  return (
    <header className="topbar" style={{ display: "flex", alignItems: "center", gap: 12, height: 64 }}>
      <div className="topbar-left" style={{ minWidth: 56 }}>
        <button
          className="toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
          style={{ fontSize: 20, background: "transparent", border: "none", cursor: "pointer" }}
        >
          ☰
        </button>
      </div>

      <div className="topbar-middle" style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <SearchBar />
      </div>

      <div className="topbar-right" style={{ minWidth: 160, display: "flex", justifyContent: "flex-end", paddingRight: 14 }}>
        <UserMenu />
      </div>
    </header>
  );
}

/* ---------------- Inline bell + avatar + badge with live update ---------------- */
function BellIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118.6 14.6V11c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 10-3 0v.68C7.63 5.36 6 7.92 6 11v3.6c0 .54-.22 1.06-.595 1.45L4 17h11" stroke="#0f172a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.73 21a2 2 0 01-3.46 0" stroke="#0f172a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
{/* Example: place in the right-side icons area of topbar */}
<div className="topbar-right" style={{ display: "flex", gap: 12, alignItems: "center" }}>
  {/* existing icons */}
  <NotificationBell />
  {/* existing profile/avatar */}
</div>


/* ---------------- UserMenu exported ----------------
   - Reads avatar from localStorage.user_avatar
   - Reads unread count from localStorage.notifications
   - Listens for 'profile-updated' event to update avatar immediately (same-tab)
*/
export function UserMenu() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const a = localStorage.getItem("user_avatar");
    if (a) setAvatar(a);

    try {
      const raw = localStorage.getItem("notifications");
      const list = raw ? JSON.parse(raw) : [];
      setUnread(Array.isArray(list) ? list.filter((n) => !n.read).length : 0);
    } catch {
      setUnread(0);
    }

    function onStorage(e) {
      if (e.key === "notifications") {
        try {
          const list = e.newValue ? JSON.parse(e.newValue) : [];
          setUnread(Array.isArray(list) ? list.filter((n) => !n.read).length : 0);
        } catch {
          setUnread(0);
        }
      }
      if (e.key === "user_avatar") {
        setAvatar(e.newValue || null);
      }
    }
    function onProfileUpdated() {
      const a2 = localStorage.getItem("user_avatar");
      setAvatar(a2 || null);
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener("profile-updated", onProfileUpdated);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("profile-updated", onProfileUpdated);
    };
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        role="button"
        title="Notifications"
        onClick={() => navigate("/notifications")}
        style={{ position: "relative", cursor: "pointer", padding: 6 }}
      >
        <BellIcon />
        {unread > 0 && (
          <span style={{
            position: "absolute",
            top: -6,
            right: 0,
            background: "#ef4444",
            color: "#fff",
            padding: "2px 6px",
            borderRadius: 12,
            fontSize: 11
          }}>{unread}</span>
        )}
      </div>

      <div role="button" title="Profile" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
        {avatar ? (
          <img src={avatar} alt="avatar" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(0,0,0,0.06)" }} />
        ) : (
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3730a3", fontWeight: 700 }}>
            U
          </div>
        )}
      </div>
    </div>
  );
}
