import React, { useState, Suspense, lazy, useMemo, useRef } from "react";
import { Routes, Route, Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";

/* Lazy-loaded pages (keeps your previous pages) */
const Dashboard = lazy(() => import("./pages/Dashboard"));
const EventManagement = lazy(() => import("./pages/EventManagement"));
const UserManagement = lazy(() => import("./pages/UserManagement"));
const Reports = lazy(() => import("./pages/Reports"));
const Feedback = lazy(() => import("./pages/Feedback"));
const Notifications = lazy(() => import("./pages/Notifications"));

/*
  Layout contains sidebar + topbar + search dropdown (global suggestion engine).
  We keep small mock datasets here for suggestion matching — you can replace these
  with API-driven datasets later.
*/

function Layout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

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
    // dashboard activity also available as notifications
    return [...ev, ...us, ...fb, ...nt];
  }, [events, users, feedbacks, notes]);

  // Search state
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  // Compute suggestions: simple case-insensitive contains; highest precedence: title
  const suggestions = useMemo(() => {
    if (!query || query.trim().length < 1) return [];
    const q = query.trim().toLowerCase();
    const matched = unified.filter(item => {
      return item.title.toLowerCase().includes(q) || (item.subtitle && item.subtitle.toLowerCase().includes(q));
    });
    // prioritize exact prefix matches
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
      } else if (query.trim()) {
        // fallback: go to dashboard search
        navigate(`/dashboard?q=${encodeURIComponent(query.trim())}`);
        setOpen(false);
      }
      e.preventDefault();
    } else if (e.key === "Escape") {
      setOpen(false);
      e.preventDefault();
    }
  }

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
          <NavLink to="/notifications" className="nav-item">
            <div className="nav-icon">🔔</div>
            <div className="nav-label">Notifications</div>
          </NavLink>
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
                      // onMouseDown (not click) to prevent input losing focus before navigation
                      ev.preventDefault();
                      navigate(s.to);
                      setOpen(false);
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
                <div className="quick-row" onMouseDown={(e) => (e.preventDefault(), navigate("/events"))}>View all events</div>
                <div className="quick-row" onMouseDown={(e) => (e.preventDefault(), navigate("/users"))}>View users</div>
                <div className="quick-row" onMouseDown={(e) => (e.preventDefault(), navigate("/reports"))}>Open reports</div>
              </div>
            )}
          </div>
        </div>

        <div className="top-right">
          <button className="icon-btn" onClick={() => navigate("/notifications")} title="Notifications">🔔</button>
          <div className="avatar" title="Profile"></div>
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
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
