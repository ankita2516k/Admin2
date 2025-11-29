// src/App.jsx
import React, { useState, useEffect, Suspense, lazy, useMemo, useRef } from "react";
import { Routes, Route, Navigate, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";

/* Lazy-loaded pages (keeps your previous pages) */
const Dashboard = lazy(() => import("./pages/Dashboard"));
const EventManagement = lazy(() => import("./pages/EventManagement"));
const UserManagement = lazy(() => import("./pages/UserManagement"));
const Reports = lazy(() => import("./pages/Reports"));
const Feedback = lazy(() => import("./pages/Feedback"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Profile = lazy(() => import("./pages/Profile"));

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Search state
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // currentUser state so avatar and email can update live
  const [currentUser, setCurrentUser] = useState({
    id: "u1",
    name: "Ankita Sharma",
    email: "ankita@example.com",
    avatarUrl: localStorage.getItem("profileAvatar") || ""
  });

  // Close search dropdown whenever the route changes (so it doesn't stay open)
  useEffect(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, [location.pathname]);

  // Sync avatar from localStorage when page gains focus (covers some cases)
  useEffect(() => {
    function onFocus() {
      const a = localStorage.getItem("profileAvatar") || "";
      setCurrentUser(prev => prev.avatarUrl === a ? prev : { ...prev, avatarUrl: a });
    }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  // Listen for storage events from other tabs
  useEffect(() => {
    function onStorage(e) {
      if (e.key === "profileAvatar") {
        setCurrentUser(prev => ({ ...prev, avatarUrl: e.newValue || "" }));
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Listen for a custom event 'profileAvatarUpdated' dispatched from Profile page after saving
  useEffect(() => {
    function onProfileUpdated(e) {
      const avatar = e?.detail?.avatar || localStorage.getItem("profileAvatar") || "";
      setCurrentUser(prev => ({ ...prev, avatarUrl: avatar }));
    }
    window.addEventListener("profileAvatarUpdated", onProfileUpdated);
    return () => window.removeEventListener("profileAvatarUpdated", onProfileUpdated);
  }, []);

  // click-outside to close search dropdown
  useEffect(() => {
    function handler(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && inputRef.current && !inputRef.current.contains(e.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Mock datasets used to produce suggestions (replace with real API if available)
  const events = [
    { id: 1, title: "Tech Innovate Summit", subtitle: "GlobalTech" },
    { id: 2, title: "Future of AI Conference", subtitle: "Cognito Events" },
    { id: 3, title: "Digital Marketing Expo", subtitle: "BrandBoost" },
    { id: 4, title: "Startup Pitch Battle", subtitle: "Venture Catalyst" },
    { id: 5, title: "Wellness & Health Fair", subtitle: "Community Wellness" },
  ];

  const users = [
    { id: 101, title: "Alice Johnson", subtitle: "alice.j@example.com" },
    { id: 102, title: "Bob Williams", subtitle: "bob.w@example.com" },
    { id: 103, title: "Charlie Brown", subtitle: "charlie.b@example.com" },
    { id: 104, title: "Diana Miller", subtitle: "diana.m@example.com" },
    { id: 105, title: "Ethan Davis", subtitle: "ethan.d@example.com" },
  ];

  const feedbacks = [
    { id: 201, title: "Great workshop — AI Summit", subtitle: "Alice Johnson" },
    { id: 202, title: "Good marketing tips", subtitle: "Benjamin Lee" },
    { id: 203, title: "Excellent Hackathon", subtitle: "Clara Davis" },
  ];

  const notes = [
    { id: 301, title: "Summer Fest approved", subtitle: "10m ago" },
    { id: 302, title: "Alice Johnson registered", subtitle: "30m ago" },
    { id: 303, title: "Payment of $50 processed", subtitle: "4h ago" },
  ];

  // Unified items — used for search suggestions
  const unified = useMemo(() => {
    const ev = events.map(e => ({ type: "event", id: e.id, title: e.title, subtitle: e.subtitle, to: `/events?q=${encodeURIComponent(e.title)}` }));
    const us = users.map(u => ({ type: "user", id: u.id, title: u.title, subtitle: u.subtitle, to: `/users?q=${encodeURIComponent(u.title)}` }));
    const fb = feedbacks.map(f => ({ type: "feedback", id: f.id, title: f.title, subtitle: f.subtitle, to: `/feedback?q=${encodeURIComponent(f.title)}` }));
    const nt = notes.map(n => ({ type: "notification", id: n.id, title: n.title, subtitle: n.subtitle, to: `/notifications?q=${encodeURIComponent(n.title)}` }));
    return [...ev, ...us, ...fb, ...nt];
  }, [events, users, feedbacks, notes]);

  // suggestions logic
  const suggestions = useMemo(() => {
    if (!query || query.trim().length < 1) return [];
    const q = query.trim().toLowerCase();
    const matched = unified.filter(item => {
      return item.title.toLowerCase().includes(q) || (item.subtitle && item.subtitle.toLowerCase().includes(q));
    });
    matched.sort((a, b) => {
      const aStarts = a.title.toLowerCase().startsWith(q) ? 0 : 1;
      const bStarts = b.title.toLowerCase().startsWith(q) ? 0 : 1;
      return aStarts - bStarts;
    });
    return matched.slice(0, 8);
  }, [query, unified]);

  // keyboard nav index for dropdown
  const [activeIndex, setActiveIndex] = useState(-1);

  function onKeyDown(e) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setActiveIndex(i => Math.max(i - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        navigate(suggestions[activeIndex].to);
        setOpen(false);
        setActiveIndex(-1);
      } else if (query.trim()) {
        navigate(`/dashboard?q=${encodeURIComponent(query.trim())}`);
        setOpen(false);
        setActiveIndex(-1);
      }
      e.preventDefault();
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      e.preventDefault();
    }
  }

  /* ---- UI ---- */
  return (
    <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="brand" onClick={() => navigate("/dashboard")}>
            <div className="logo">dE</div>
            <div className="brand-text">digiEvent</div>
          </div>
        </div>

        <nav className="nav-list">
          <NavLink to="/dashboard" className="nav-item">
            <div className="nav-icon">📊</div>
            <div className="nav-label">Dashboard</div>
          </NavLink>
          <NavLink to="/events" className="nav-item">
            <div className="nav-icon">📅</div>
            <div className="nav-label">Event Management</div>
          </NavLink>
          <NavLink to="/users" className="nav-item">
            <div className="nav-icon">👥</div>
            <div className="nav-label">User Management</div>
          </NavLink>
          <NavLink to="/reports" className="nav-item">
            <div className="nav-icon">📈</div>
            <div className="nav-label">Reports</div>
          </NavLink>
          <NavLink to="/feedback" className="nav-item">
            <div className="nav-icon">💬</div>
            <div className="nav-label">Feedback</div>
          </NavLink>
          {/* Notifications removed from sidebar on purpose */}
        </nav>
      </aside>

      {/* ===== TOPBAR with search dropdown ===== */}
      <header className="topbar">
        <div className="top-left">
          <div style={{ position: "relative" }}>
            <input
              ref={inputRef}
              className="search"
              placeholder="Search events, users, feedback..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); setActiveIndex(-1); }}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              aria-label="Search"
            />

            {/* Dropdown */}
            <div ref={dropdownRef}>
              {open && suggestions.length > 0 && (
                <div className="search-dropdown" role="listbox" aria-activedescendant={activeIndex >= 0 ? `sug-${activeIndex}` : undefined}>
                  {suggestions.map((s, idx) => (
                    <div
                      key={`${s.type}-${s.id}`}
                      id={`sug-${idx}`}
                      role="option"
                      className={`search-suggestion ${idx === activeIndex ? "active" : ""}`}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onMouseLeave={() => setActiveIndex(-1)}
                      onMouseDown={(ev) => {
                        ev.preventDefault();
                        setOpen(false);
                        setActiveIndex(-1);
                        navigate(s.to);
                      }}
                    >
                      <div className="sugg-left">{s.type === "user" ? "👤" : s.type === "event" ? "📅" : s.type === "feedback" ? "💬" : "🔔"}</div>
                      <div className="sugg-body">
                        <div className="sugg-title">{s.title}</div>
                        <div className="sugg-sub">{s.subtitle}</div>
                      </div>
                      <div className="sugg-right">{s.type}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* empty-state quick actions */}
              {open && query.trim().length === 0 && (
                <div className="search-dropdown quick">
                  <div
                    className="quick-row"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setOpen(false);
                      navigate("/events");
                    }}
                  >
                    View all events
                  </div>

                  <div
                    className="quick-row"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setOpen(false);
                      navigate("/users");
                    }}
                  >
                    View users
                  </div>

                  <div
                    className="quick-row"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setOpen(false);
                      navigate("/reports");
                    }}
                  >
                    Open reports
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="top-right" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="icon-btn" onClick={() => navigate("/notifications")} title="Notifications">🔔</button>

          {/* Profile avatar placed at far right (no dropdown). clicking navigates to /profile */}
          <button
            onClick={() => navigate("/profile")}
            title={currentUser?.name || "Profile"}
            aria-label="Profile"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: currentUser?.avatarUrl ? "transparent" : "#EDF2F7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              color: "#2D3748",
              border: "none",
              cursor: "pointer"
            }}
          >
            {currentUser?.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt="profile" style={{ width: 36, height: 36, borderRadius: "50%" }} />
            ) : (
              <span style={{ fontSize: 12 }}>
                { (currentUser?.name || "U").split(" ").map(n => n[0]).slice(0,2).join("").toUpperCase() }
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ===== main content area (keeps Outlet for pages) ===== */}
      <main className="main-content">
        <div className="content-wrapper">
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="events" element={<EventManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="reports" element={<Reports />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
