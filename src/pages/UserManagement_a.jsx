// src/pages/UserManagement_a.jsx
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar, Topbar } from "../components/UIComponents";
import "../styles/App.css";

const allUsers = [
  { id: 1, name: "Alice Johnson", email: "alice.j@example.com", events: 3, status: "Active" },
  { id: 2, name: "Bob Williams", email: "bob.w@example.com", events: 1, status: "Pending" },
  { id: 3, name: "Charlie Brown", email: "charlie.b@example.com", events: 0, status: "Blocked" },
  { id: 4, name: "Diana Miller", email: "diana.m@example.com", events: 5, status: "Active" },
  { id: 5, name: "Ethan Davis", email: "ethan.d@example.com", events: 2, status: "Active" },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function UserManagement_a() {
  const param = useQuery().get("q") || "";
  const [query, setQuery] = useState(param);

  const filtered =
    query && query.trim()
      ? allUsers.filter(
          (u) =>
            u.name.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase())
        )
      : allUsers;

  return (
    <div className="app-layout">
      {/* fixed sidebar on the left */}
      <Sidebar />

      {/* 👉 shift this whole block to the right so sidebar doesn’t cover content */}
      <div className="main-layout" style={{ marginLeft: "260px" }}>
        <Topbar />

        <main className="content-area">
          <div className="page">
            <div className="page-header">
              <h1>User Management</h1>
              <div className="page-actions">
                <input
                  className="small-search"
                  placeholder="Search users..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn primary">Invite User</button>
              </div>
            </div>

            <div className="table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Registered Events</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.events}</td>
                      <td>
                        <span
                          className={`badge ${
                            u.status === "Active"
                              ? "green"
                              : u.status === "Pending"
                              ? "yellow"
                              : "red"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td>
                        <button className="icon-btn">✉️</button>
                        <button className="icon-btn">🔒</button>
                        <button className="icon-btn">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
