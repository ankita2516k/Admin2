// src/pages/AdminApprovalList.jsx
import React, { useEffect, useState } from "react";

/*
  AdminApprovalList — updated to inherit app layout so it looks like other pages.
  - Does NOT force a page background (it inherits the global/app layout)
  - Stats cards clickable to change tab
  - Keeps fetchEvents() preserved
  - Mock data while backend is down
*/

export default function AdminApprovalList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending"); // all | pending | approved | rejected
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rejectModal, setRejectModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Inject compact, non-invasive CSS so this page matches surrounding layout.
  useEffect(() => {
    if (document.getElementById("ae-admin-approval-styles")) return;
    const css = `
/* AE scoped styles (minimal & non-invasive) */
.ae-wrap { padding: 20px 28px; box-sizing: border-box; }
.ae-header { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:18px; }
.ae-title { margin:0; font-size:26px; font-weight:700; color:inherit; }
.ae-sub { margin:6px 0 0; color:var(--muted,#6b7280); font-size:13px; }

.ae-actions { display:flex; gap:10px; align-items:center; }
.ae-btn { padding:8px 12px; border-radius:10px; border:1px solid transparent; cursor:pointer; font-weight:600; }
.ae-btn-muted { background:var(--card-bg,#fff); border:1px solid rgba(14,45,68,0.04); color:inherit; }
.ae-btn-primary { background:var(--accent,#2563eb); color:#fff; }

.ae-stats { display:grid; grid-template-columns: repeat(4, 1fr); gap:14px; margin:12px 0 18px; }
.ae-card { background:var(--card-bg,#fff); border-radius:10px; padding:14px; box-shadow: 0 8px 20px rgba(15,23,36,0.04); cursor:default; transition: box-shadow .12s ease, transform .12s ease; }
.ae-card[role="button"] { cursor:pointer; }
.ae-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(15,23,36,0.06); }
.ae-card-active { box-shadow: 0 14px 40px rgba(29,78,216,0.10); border-left:4px solid var(--accent,#1d4ed8); }

.ae-card .label { color:var(--muted,#6b7280); font-size:13px; }
.ae-card .value { font-size:20px; font-weight:700; margin-top:6px; }

.ae-toolbar { display:flex; gap:12px; align-items:center; justify-content:space-between; margin-bottom:14px; }
.ae-search { flex:1; display:flex; gap:8px; align-items:center; background:var(--card-bg,#fff); padding:8px 10px; border-radius:10px; border:1px solid rgba(14,45,68,0.04); }
.ae-search input { border:0; outline:0; width:100%; font-size:14px; padding:6px 4px; background:transparent; color:inherit; }

.ae-tabs { display:flex; gap:8px; margin-left:14px; }
.ae-tab { padding:8px 12px; border-radius:999px; border:0; cursor:pointer; font-weight:600; background:#f3f6f9; color:inherit; }
.ae-tab.active { background:var(--accent,#1d4ed8); color:#fff; }

.ae-table-card { background:var(--card-bg,#fff); border-radius:10px; box-shadow:0 8px 20px rgba(15,23,36,0.04); overflow:hidden; margin-top:8px; }
.ae-table { width:100%; border-collapse:collapse; font-size:14px; color:inherit; }
.ae-table thead th { text-align:left; padding:12px 16px; background:transparent; color:var(--muted,#5b6b7a); font-weight:700; font-size:13px; border-bottom:1px solid rgba(14,45,68,0.03); }
.ae-table tbody td { padding:14px 16px; border-bottom:1px solid rgba(14,45,68,0.02); vertical-align:middle; }

.ae-ev-title { font-weight:700; }
.ae-ev-desc { color:var(--muted,#6b7280); margin-top:6px; font-size:13px; }

.ae-pill { display:inline-block; padding:6px 10px; border-radius:999px; font-weight:700; font-size:12px; }
.ae-pill.pending { background:#fff7ed; color:#92400e; }
.ae-pill.approved { background:#ecfdf5; color:#065f46; }
.ae-pill.rejected { background:#fff1f2; color:#9f1239; }

.ae-actions-row { display:flex; gap:8px; align-items:center; }
.ae-small { padding:6px 10px; border-radius:8px; font-weight:700; cursor:pointer; border:1px solid transparent; }
.ae-small.approve { background:#10b981; color:#fff; }
.ae-small.reject { background:#ef4444; color:#fff; }
.ae-small.delete { background:transparent; color:#ef4444; border:1px solid rgba(239,68,68,0.08); }

.ae-pager { display:flex; justify-content:space-between; align-items:center; padding:12px 16px; }
.ae-pager .info { color:var(--muted,#6b7280); font-size:13px; }

.ae-empty { padding:28px; text-align:center; color:var(--muted,#6b7280); }

/* modal */
.ae-modal-wrap { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; z-index:1200; }
.ae-modal-backdrop { position:absolute; inset:0; background:rgba(3,7,18,0.45); }
.ae-modal { position:relative; background:var(--card-bg,#fff); border-radius:10px; width:min(720px, 96%); z-index:1210; box-shadow:0 20px 60px rgba(2,6,23,0.12); overflow:hidden; }
.ae-modal .head { display:flex; justify-content:space-between; padding:12px 14px; border-bottom:1px solid rgba(14,45,68,0.03); }
.ae-modal .body { padding:14px; }
.ae-textarea { width:100%; min-height:140px; padding:10px; border-radius:8px; border:1px solid rgba(14,45,68,0.04); font-size:14px; }

@media (max-width: 880px) {
  .ae-stats { grid-template-columns: repeat(2, 1fr); }
  .ae-table thead th:nth-child(2), .ae-table tbody td:nth-child(2) { display:none; }
  .ae-header { flex-direction:column; align-items:flex-start; gap:12px; }
}
    `;
    const tag = document.createElement("style");
    tag.id = "ae-admin-approval-styles";
    tag.innerHTML = css;
    document.head.appendChild(tag);
  }, []);

  // Mock data while backend is down
  useEffect(() => {
    // fetchEvents(); // preserved, but not called while mocking
    const mock = [
      { id: "1", title: "Tech Innovate Summit", organizerName: "GlobalTech", startDate: "2025-09-15", status: "pending", description: "A summit about tech innovations." },
      { id: "2", title: "Future of AI Conference", organizerName: "Cognito Events", startDate: "2025-10-22", status: "pending", description: "AI conference for developers." },
      { id: "3", title: "Digital Marketing Expo", organizerName: "BrandBoost", startDate: "2025-11-01", status: "approved", description: "Marketing talks and workshops." },
      { id: "4", title: "Startup Pitch Battle", organizerName: "Venture Catalyst", startDate: "2025-08-05", status: "rejected", rejectionReason: "Duplicate event", description: "Startups pitch to investors." },
      { id: "5", title: "Campus Hackathon", organizerName: "UniTech", startDate: "2025-12-10", status: "pending", description: "24-hour hackathon for students." },
    ];
    setTimeout(() => { setEvents(mock); setLoading(false); }, 200);
  }, []);

  // Original fetchEvents() - preserved
  async function fetchEvents() {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/admin/events");
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // derived counts & filtering
  const counts = {
    total: events.length,
    pending: events.filter((e) => (e.status || "pending") === "pending").length,
    approved: events.filter((e) => e.status === "approved").length,
    rejected: events.filter((e) => e.status === "rejected").length,
  };

  function filtered() {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      const matchTab = activeTab === "all" ? true : ((e.status || "pending") === activeTab);
      if (!matchTab) return false;
      if (!q) return true;
      return (e.title || "").toLowerCase().includes(q) || (e.organizerName || "").toLowerCase().includes(q);
    });
  }

  const total = filtered().length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const items = filtered().slice((page - 1) * pageSize, page * pageSize);

  // actions
  async function approve(id) {
    if (!window.confirm("Approve this event?")) return;
    setActionLoading(true);
    try {
      setEvents((p) => p.map((ev) => (ev.id === id ? { ...ev, status: "approved", rejectionReason: undefined } : ev)));
    } finally {
      setActionLoading(false);
    }
  }

  function openReject(id, title) {
    setRejectModal({ id, title, reason: "" });
  }

  async function submitReject() {
    if (!rejectModal || !rejectModal.reason || rejectModal.reason.trim().length < 3) {
      alert("Enter a rejection reason (min 3 chars).");
      return;
    }
    setActionLoading(true);
    try {
      setEvents((p) => p.map((ev) => (ev.id === rejectModal.id ? { ...ev, status: "rejected", rejectionReason: rejectModal.reason } : ev)));
      setRejectModal(null);
    } finally {
      setActionLoading(false);
    }
  }

  function deleteRequest(id) {
    setDeleteConfirm(id);
  }
  async function confirmDelete() {
    if (!deleteConfirm) return;
    setActionLoading(true);
    try {
      setEvents((p) => p.filter((ev) => ev.id !== deleteConfirm));
      setDeleteConfirm(null);
    } finally {
      setActionLoading(false);
    }
  }

  function formatDate(d) {
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d;
    }
  }

  // Render
  return (
    <div className="ae-wrap">
      <div className="ae-header">
        <div>
          <h2 className="ae-title">Event Management</h2>
          <div className="ae-sub">Review events submitted by organizers. Approve, reject (reason required) or delete.</div>
        </div>

        <div className="ae-actions">
          <button className="ae-btn ae-btn-primary" onClick={() => { /* export */ }}>Download Report</button>
        </div>
      </div>

      {/* clickable stats that act as navigation */}
      <div className="ae-stats" role="region" aria-label="summary">
        <div
          role="button"
          tabIndex={0}
          onClick={() => { setActiveTab("all"); setPage(1); }}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (setActiveTab("all"), setPage(1))}
          className={`ae-card ${activeTab === "all" ? "ae-card-active" : ""}`}
          aria-pressed={activeTab === "all"}
        >
          <div className="label">Total</div>
          <div className="value">{counts.total}</div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => { setActiveTab("pending"); setPage(1); }}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (setActiveTab("pending"), setPage(1))}
          className={`ae-card ${activeTab === "pending" ? "ae-card-active" : ""}`}
          aria-pressed={activeTab === "pending"}
        >
          <div className="label">Pending</div>
          <div className="value">{counts.pending}</div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => { setActiveTab("approved"); setPage(1); }}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (setActiveTab("approved"), setPage(1))}
          className={`ae-card ${activeTab === "approved" ? "ae-card-active" : ""}`}
          aria-pressed={activeTab === "approved"}
        >
          <div className="label">Approved</div>
          <div className="value">{counts.approved}</div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => { setActiveTab("rejected"); setPage(1); }}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (setActiveTab("rejected"), setPage(1))}
          className={`ae-card ${activeTab === "rejected" ? "ae-card-active" : ""}`}
          aria-pressed={activeTab === "rejected"}
        >
          <div className="label">Rejected</div>
          <div className="value">{counts.rejected}</div>
        </div>
      </div>

      <div className="ae-toolbar">
        <div className="ae-search" role="search" aria-label="search events">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.45 }}>
            <path d="M21 21l-4.35-4.35" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="11" cy="11" r="6" stroke="#374151" strokeWidth="2" />
          </svg>
          <input placeholder="Search events or organizers..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} />
        </div>
      </div>

      <div className="ae-table-card" role="table" aria-label="event list">
        <table className="ae-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Organizer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && <tr><td colSpan={5} className="ae-empty">Loading events…</td></tr>}
            {!loading && items.length === 0 && <tr><td colSpan={5} className="ae-empty">No events found.</td></tr>}

            {!loading && items.map((ev) => (
              <tr key={ev.id}>
                <td>
                  <div className="ae-ev-title">{ev.title}</div>
                  <div className="ae-ev-desc">{ev.description}</div>
                </td>
                <td>{ev.organizerName}</td>
                <td>{ev.startDate ? formatDate(ev.startDate) : "-"}</td>
                <td><span className={`ae-pill ${ev.status || "pending"}`}>{ev.status || "pending"}</span></td>
                <td>
                  <div className="ae-actions-row">
                    <button className="ae-small approve" onClick={() => approve(ev.id)} disabled={actionLoading || ev.status === "approved"}>
                      {ev.status === "approved" ? "Approved" : "Approve"}
                    </button>
                    <button className="ae-small reject" onClick={() => openReject(ev.id, ev.title)} disabled={actionLoading || ev.status === "rejected"}>Reject</button>
                    <button className="ae-small delete" onClick={() => deleteRequest(ev.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="ae-pager">
          <div className="ae-pager">
           <div className="info">
             Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
           </div>
          </div>

          <div className="controls">
            <button className="ae-btn ae-btn-muted" onClick={() => setPage(1)} disabled={page === 1}>First</button>
            <button className="ae-btn ae-btn-muted" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
            <div style={{ fontWeight: 700, padding: "6px 10px" }}>{page} / {totalPages}</div>
            <button className="ae-btn ae-btn-muted" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
            <button className="ae-btn ae-btn-muted" onClick={() => setPage(totalPages)} disabled={page === totalPages}>Last</button>
          </div>
        </div>
      </div>

      {rejectModal && (
        <div className="ae-modal-wrap" role="dialog" aria-modal="true">
          <div className="ae-modal-backdrop" onClick={() => setRejectModal(null)} />
          <div className="ae-modal">
            <div className="head">
              <div style={{ fontWeight: 700 }}>Reject — {rejectModal.title}</div>
              <button className="ae-close" onClick={() => setRejectModal(null)}>✕</button>
            </div>
            <div className="body">
              <div style={{ marginBottom: 8, fontWeight: 700 }}>Rejection reason (required)</div>
              <textarea className="ae-textarea" value={rejectModal.reason} onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })} />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
                <button className="ae-btn ae-btn-muted" onClick={() => setRejectModal(null)}>Cancel</button>
                <button className="ae-btn ae-btn-primary" onClick={submitReject}>Submit rejection</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="ae-modal-wrap" role="dialog" aria-modal="true">
          <div className="ae-modal-backdrop" onClick={() => setDeleteConfirm(null)} />
          <div className="ae-modal">
            <div className="head">
              <div style={{ fontWeight: 700 }}>Delete event?</div>
              <button className="ae-close" onClick={() => setDeleteConfirm(null)}>✕</button>
            </div>
            <div className="body">
              <div style={{ marginBottom: 12 }}>Are you sure you want to permanently delete this event? This cannot be undone.</div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button className="ae-btn ae-btn-muted" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="ae-btn ae-btn-primary" onClick={confirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// NOTE: helper functions declared below so they are accessible inside the component
async function approve(id) {
  // unused stub (actual approve is defined inside component)
  return;
}
