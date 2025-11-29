import React from "react";
import { useLocation } from "react-router-dom";

const initial = [
  { id:1, name:"Tech Innovate Summit", organizer:"GlobalTech", date:"2024-09-15", status:"Approved" },
  { id:2, name:"Future of AI Conference", organizer:"Cognito Events", date:"2024-10-22", status:"Pending" },
  { id:3, name:"Digital Marketing Expo", organizer:"BrandBoost Agency", date:"2024-11-01", status:"Approved" },
  { id:4, name:"Startup Pitch Battle", organizer:"Venture Catalyst", date:"2024-08-05", status:"Rejected" },
  { id:5, name:"Wellness & Health Fair", organizer:"Community Wellness Co.", date:"2024-12-10", status:"Approved" },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function EventManagement() {
  const q = useQuery().get("q") || "";
  const query = q.trim().toLowerCase();

  const filtered = query
    ? initial.filter(e => e.name.toLowerCase().includes(query) || e.organizer.toLowerCase().includes(query))
    : initial;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Event Management</h1>
        <div className="page-actions">
          <button className="btn">Download Report</button>
          <button className="btn primary">+ Add Event</button>
        </div>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr><th>Event Name</th><th>Organizer</th><th>Date</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td>{e.organizer}</td>
                <td>{e.date}</td>
                <td><span className={`badge ${e.status==="Approved"?"green": e.status==="Pending"?"yellow":"red"}`}>{e.status}</span></td>
                <td>
                  <button className="icon-btn">✏️</button>
                  <button className="icon-btn">✅</button>
                  <button className="icon-btn">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
