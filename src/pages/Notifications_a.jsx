// src/pages/Notifications.jsx
import React, { useEffect, useState } from "react";

/*
  Notifications page styled to match your Dashboard theme.
  Data source: localStorage key "notifications" (array of {id,title,body,createdAt,read})
  If none exist it shows a friendly empty state.
*/

function relativeTime(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadNotifications() {
    try {
      const raw = localStorage.getItem("notifications");
      const parsed = raw ? JSON.parse(raw) : [];
      // normalize objects just in case
      const normalized = parsed.map((n, i) => ({
        id: n.id ?? `n_${i}`,
        title: n.title ?? "Notification",
        body: n.body ?? "",
        createdAt: n.createdAt ?? new Date().toISOString(),
        read: !!n.read,
      }));
      setNotifications(normalized);
    } catch (e) {
      console.error("Failed to load notifications:", e);
      setNotifications([]);
    }
  }

  function saveAndSet(updated) {
    setNotifications(updated);
    try {
      localStorage.setItem("notifications", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save notifications:", e);
    }
  }

  function markAllRead() {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveAndSet(updated);
  }

  function markAllUnread() {
    const updated = notifications.map((n) => ({ ...n, read: false }));
    saveAndSet(updated);
  }

  function toggleRead(id) {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n));
    saveAndSet(updated);
  }

  function removeNotification(id) {
    const updated = notifications.filter((n) => n.id !== id);
    saveAndSet(updated);
  }

  function clearAll() {
    saveAndSet([]);
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="page-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>Notifications</h1>
          <div style={{ color: "#6b7280", marginTop: 6, fontSize: 14 }}>
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="btn" onClick={markAllRead} disabled={notifications.length === 0}>
            Mark all read
          </button>
          <button className="btn" onClick={markAllUnread} disabled={notifications.length === 0}>
            Mark all unread
          </button>
          <button className="btn btn-danger" onClick={clearAll} disabled={notifications.length === 0}>
            Clear all
          </button>
        </div>
      </div>

      <div style={{ height: 18 }} />

      {notifications.length === 0 ? (
        <div style={{ padding: 28, textAlign: "center", color: "#6b7280" }}>
          <p style={{ margin: 0, fontSize: 16 }}>No notifications yet.</p>
          <p style={{ marginTop: 8 }}>You will see system messages, approvals and payments here.</p>
        </div>
      ) : (
        <ul
          className="notifications-list"
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 1px 0 rgba(16,24,40,0.03)",
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.02)",
          }}
        >
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`notification-item ${n.read ? "read" : "unread"}`}
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
                padding: "16px 18px",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
                background: n.read ? "transparent" : "rgba(59,130,246,0.03)",
                cursor: "pointer",
              }}
            >
              <div style={{ flex: 1 }} onClick={() => toggleRead(n.id)}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: "#eef2ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#3730a3",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {n.title ? n.title.charAt(0).toUpperCase() : "N"}
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{n.title}</div>
                    <div style={{ marginTop: 6, color: "#374151", fontSize: 14 }}>{n.body}</div>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "right", minWidth: 100 }}>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{relativeTime(n.createdAt)}</div>
                <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <button
                    className="btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRead(n.id);
                    }}
                    aria-label={n.read ? "Mark unread" : "Mark read"}
                  >
                    {n.read ? "Mark unread" : "Mark read"}
                  </button>

                  <button
                    className="btn btn-ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(n.id);
                    }}
                    aria-label="Remove notification"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div style={{ height: 20 }} />
    </div>
  );
}
