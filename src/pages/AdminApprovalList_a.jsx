// src/pages/AdminApprovalList_a.jsx
import React, { useEffect, useState } from "react";
import { Sidebar, Topbar } from "../components/UIComponents";
import "../styles/App.css";

/*
  Event Management (AdminApprovalList_a)
  - Sidebar + Topbar layout (content shifted right)
  - Approve / Reject (with mandatory reason) / Delete
  - Download Report (CSV of all events)
*/

export default function AdminApprovalList_a() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending"); // all | pending | approved | rejected
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [rejectModal, setRejectModal] = useState(null); // { id, title, reason }
  const [actionLoading, setActionLoading] = useState(false);

  // Inject CSS only once
  useEffect(() => {
    if (document.getElementById("ae-admin-approval-styles")) return;
    const css = `
      .ae-wrap { padding: 20px 28px; box-sizing: border-box; }
      .ae-header { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:18px; }
      .ae-title { margin:0; font-size:26px; font-weight:700; color:inherit; }
      .ae-sub { margin:6px 0 0; color:#6b7280; font-size:13px; }

      .ae-actions { display:flex; gap:10px; align-items:center; }
      .ae-btn { padding:8px 12px; border-radius:10px; border:1px solid transparent; cursor:pointer; font-weight:600; }
      .ae-btn-muted { background:#fff; border:1px solid rgba(14,45,68,0.04); color:inherit; }
      .ae-btn-primary { background:#2563eb; color:#fff; }

      .ae-stats { display:grid; grid-template-columns: repeat(4, 1fr); gap:14px; margin:12px 0 18px; }
      .ae-card { background:#fff; border-radius:10px; padding:14px; box-shadow:0 8px 20px rgba(15,23,36,0.04); cursor:pointer; }
      .ae-card-active { border-left:4px solid #1d4ed8; box-shadow:0 14px 40px rgba(29,78,216,0.10); }

      .ae-card .label { color:#6b7280; font-size:13px; }
      .ae-card .value { font-size:20px; font-weight:700; margin-top:6px; }

      .ae-toolbar { display:flex; gap:12px; align-items:center; justify-content:space-between; margin-bottom:14px; }
      .ae-search { flex:1; display:flex; gap:8px; align-items:center; background:#fff; padding:8px 10px; border-radius:10px; border:1px solid rgba(14,45,68,0.04); }
      .ae-search input { border:0; outline:0; width:100%; font-size:14px; background:transparent; }

      .ae-table-card { background:#fff; border-radius:10px; box-shadow:0 8px 20px rgba(15,23,36,0.04); overflow:hidden; margin-top:8px; }
      .ae-table { width:100%; border-collapse:collapse; font-size:14px; }
      .ae-table thead th { padding:12px 16px; color:#5b6b7a; border-bottom:1px solid rgba(14,45,68,0.03); }
      .ae-table tbody td { padding:14px 16px; border-bottom:1px solid rgba(14,45,68,0.02); }

      .ae-ev-title { font-weight:700; }
      .ae-ev-desc { color:#6b7280; margin-top:6px; font-size:13px; }

      .ae-pill { padding:6px 10px; border-radius:999px; font-weight:700; font-size:12px; text-transform:capitalize; }
      .ae-pill.pending { background:#fff7ed; color:#92400e; }
      .ae-pill.approved { background:#ecfdf5; color:#065f46; }
      .ae-pill.rejected { background:#fff1f2; color:#9f1239; }

      .ae-actions-row { display:flex; gap:8px; align-items:center; }
      .ae-small { padding:6px 10px; border-radius:8px; font-weight:700; cursor:pointer; border:1px solid transparent; }
      .ae-small.approve { background:#10b981; color:#fff; }
      .ae-small.reject { background:#ef4444; color:#fff; }
      .ae-small.delete { background:transparent; color:#ef4444; border:1px solid rgba(239,68,68,0.2); }

      .ae-empty { padding:28px; text-align:center; color:#6b7280; }

      /* Simple modal for rejection reason */
      .ae-modal-wrap { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; z-index:1200; }
      .ae-modal-backdrop { position:absolute; inset:0; background:rgba(15,23,42,0.55); }
      .ae-modal { position:relative; z-index:1210; background:#fff; border-radius:12px; max-width:520px; width:95%; box-shadow:0 24px 60px rgba(15,23,42,0.25); padding:18px 20px 16px; }
      .ae-modal-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }
      .ae-modal-title { font-weight:700; font-size:18px; }
      .ae-modal-close { border:none; background:transparent; font-size:18px; cursor:pointer; }
      .ae-modal-body { margin-top:6px; }
      .ae-textarea { width:100%; min-height:120px; padding:8px 10px; border-radius:8px; border:1px solid rgba(15,23,42,0.12); resize:vertical; }
      .ae-modal-footer { display:flex; justify-content:flex-end; margin-top:12px; gap:10px; }

      @media (max-width: 880px) {
        .ae-stats { grid-template-columns: repeat(2, 1fr); }
        .ae-table thead th:nth-child(2),
        .ae-table tbody td:nth-child(2) { display:none; }
      }
    `;
    const tag = document.createElement("style");
    tag.id = "ae-admin-approval-styles";
    tag.innerHTML = css;
    document.head.appendChild(tag);
  }, []);

  // Mock events (you can replace with real API later)
  useEffect(() => {
    async function loadMock() {
      try {
        const mock = [
          {
            id: "1",
            title: "Tech Innovate Summit",
            organizerName: "GlobalTech",
            startDate: "2025-09-15",
            status: "pending",
            description: "A summit about tech innovations.",
          },
          {
            id: "2",
            title: "Future of AI Conference",
            organizerName: "Cognito Events",
            startDate: "2025-10-22",
            status: "pending",
            description: "AI conference for developers.",
          },
          {
            id: "3",
            title: "Digital Marketing Expo",
            organizerName: "BrandBoost",
            startDate: "2025-11-01",
            status: "approved",
            description: "Marketing talks and workshops.",
          },
          {
            id: "4",
            title: "Startup Pitch Battle",
            organizerName: "Venture Catalyst",
            startDate: "2025-08-05",
            status: "rejected",
            rejectionReason: "Duplicate event",
            description: "Startups pitch to investors.",
          },
          {
            id: "5",
            title: "Campus Hackathon",
            organizerName: "UniTech",
            startDate: "2025-12-10",
            status: "pending",
            description: "24-hour hackathon for students.",
          },
        ];
        setEvents(mock);
      } catch (e) {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    }
    loadMock();
  }, []);

  // Filtered events for current tab + search
  function filtered() {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      const matchTab =
        activeTab === "all" ? true : (e.status || "pending") === activeTab;
      if (!matchTab) return false;
      if (!q) return true;
      return (
        (e.title || "").toLowerCase().includes(q) ||
        (e.organizerName || "").toLowerCase().includes(q)
      );
    });
  }

  const items = filtered().slice((page - 1) * pageSize, page * pageSize);
  const total = filtered().length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function formatDate(d) {
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d;
    }
  }

  // ---- ACTIONS ----

  function handleApprove(id) {
    if (actionLoading) return;
    setActionLoading(true);
    // simulate async
    setTimeout(() => {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === id ? { ...ev, status: "approved", rejectionReason: undefined } : ev
        )
      );
      setActionLoading(false);
    }, 200);
  }

  function openRejectModal(ev) {
    if (actionLoading) return;
    setRejectModal({
      id: ev.id,
      title: ev.title,
      reason: ev.rejectionReason || "",
    });
  }

  function submitRejection() {
    if (!rejectModal) return;
    const reason = (rejectModal.reason || "").trim();
    if (reason.length < 3) {
      alert("Please enter a rejection reason (at least 3 characters).");
      return;
    }
    setActionLoading(true);
    setTimeout(() => {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === rejectModal.id
            ? { ...ev, status: "rejected", rejectionReason: reason }
            : ev
        )
      );
      setActionLoading(false);
      setRejectModal(null);
    }, 200);
  }

  function handleDelete(id) {
    if (actionLoading) return;
    const ok = window.confirm("Are you sure you want to delete this event?");
    if (!ok) return;
    setActionLoading(true);
    setTimeout(() => {
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
      setActionLoading(false);
    }, 200);
  }

  function handleDownloadReport() {
    if (!events.length) {
      alert("No events to export.");
      return;
    }
    const header = ["Title", "Organizer", "Date", "Status", "Rejection Reason"];
    const rows = events.map((e) => [
      `"${e.title.replace(/"/g, '""')}"`,
      `"${(e.organizerName || "").replace(/"/g, '""')}"`,
      `"${formatDate(e.startDate)}"`,
      `"${(e.status || "").toUpperCase()}"`,
      `"${(e.rejectionReason || "").replace(/"/g, '""')}"`,
    ]);
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "event-report.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app-layout">
      <Sidebar />

      {/* CONTENT SHIFTED RIGHT */}
      <div className="main-layout" style={{ marginLeft: "260px" }}>
        <Topbar />

        <main className="content-area">
          <div className="ae-wrap">
            <div className="ae-header">
              <div>
                <h2 className="ae-title">Event Management</h2>
                <div className="ae-sub">
                  Review events submitted by organizers. Approve, reject (with
                  reason) or delete.
                </div>
              </div>

              <div className="ae-actions">
                <button
                  className="ae-btn ae-btn-primary"
                  onClick={handleDownloadReport}
                  disabled={!events.length}
                >
                  Download Report
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="ae-stats">
              {["all", "pending", "approved", "rejected"].map((tab) => (
                <div
                  key={tab}
                  className={`ae-card ${
                    activeTab === tab ? "ae-card-active" : ""
                  }`}
                  onClick={() => {
                    setActiveTab(tab);
                    setPage(1);
                  }}
                >
                  <div className="label">
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </div>
                  <div className="value">
                    {events.filter((e) =>
                      tab === "all" ? true : (e.status || "pending") === tab
                    ).length}
                  </div>
                </div>
              ))}
            </div>

            {/* Search */}
            <div className="ae-toolbar">
              <div className="ae-search">
                <input
                  placeholder="Search events or organizers..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            {/* Table */}
            <div className="ae-table-card">
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
                  {loading && (
                    <tr>
                      <td colSpan={5} className="ae-empty">
                        Loading events…
                      </td>
                    </tr>
                  )}

                  {error && !loading && (
                    <tr>
                      <td colSpan={5} className="ae-empty">
                        {error}
                      </td>
                    </tr>
                  )}

                  {!loading && !error && items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="ae-empty">
                        No events found.
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    !error &&
                    items.map((ev) => (
                      <tr key={ev.id}>
                        <td>
                          <div className="ae-ev-title">{ev.title}</div>
                          <div className="ae-ev-desc">{ev.description}</div>
                          {ev.rejectionReason && (
                            <div
                              style={{
                                marginTop: 6,
                                fontSize: 12,
                                color: "#9f1239",
                              }}
                            >
                              Reason: {ev.rejectionReason}
                            </div>
                          )}
                        </td>

                        <td>{ev.organizerName}</td>
                        <td>{formatDate(ev.startDate)}</td>

                        <td>
                          <span className={`ae-pill ${ev.status || "pending"}`}>
                            {ev.status || "pending"}
                          </span>
                        </td>

                        <td>
                          <div className="ae-actions-row">
                            <button
                              className="ae-small approve"
                              onClick={() => handleApprove(ev.id)}
                              disabled={
                                actionLoading || ev.status === "approved"
                              }
                            >
                              {ev.status === "approved" ? "Approved" : "Approve"}
                            </button>
                            <button
                              className="ae-small reject"
                              onClick={() => openRejectModal(ev)}
                              disabled={actionLoading}
                            >
                              Reject
                            </button>
                            <button
                              className="ae-small delete"
                              onClick={() => handleDelete(ev.id)}
                              disabled={actionLoading}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Simple pager text (optional) */}
            <div
              style={{
                padding: "10px 16px",
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
                fontSize: 13,
                color: "#6b7280",
              }}
            >
              <span>
                Page {page} of {totalPages} • {total} events
              </span>
            </div>
          </div>
        </main>
      </div>

      {/* REJECTION MODAL */}
      {rejectModal && (
        <div className="ae-modal-wrap">
          <div
            className="ae-modal-backdrop"
            onClick={() => !actionLoading && setRejectModal(null)}
          />
          <div className="ae-modal">
            <div className="ae-modal-header">
              <div className="ae-modal-title">
                Reject event – {rejectModal.title}
              </div>
              <button
                className="ae-modal-close"
                onClick={() => !actionLoading && setRejectModal(null)}
              >
                ×
              </button>
            </div>
            <div className="ae-modal-body">
              <p style={{ fontSize: 13, marginBottom: 6 }}>
                Please enter the reason for rejection. This cannot be empty.
              </p>
              <textarea
                className="ae-textarea"
                value={rejectModal.reason}
                onChange={(e) =>
                  setRejectModal((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
              />
            </div>
            <div className="ae-modal-footer">
              <button
                className="ae-btn ae-btn-muted"
                onClick={() => !actionLoading && setRejectModal(null)}
              >
                Cancel
              </button>
              <button
                className="ae-btn ae-btn-primary"
                onClick={submitRejection}
                disabled={actionLoading}
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
