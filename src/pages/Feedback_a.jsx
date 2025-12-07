// src/pages/Feedback_a.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import { Sidebar, Topbar } from "../components/UIComponents";
import "../styles/App.css";

const feedbacks = [
  { id: 1, name: "Alice Johnson", event: "AI Summit", stars: 5, text: "Great workshop!" },
  { id: 2, name: "Benjamin Lee", event: "Marketing Masterclass", stars: 4, text: "Very practical tips." },
  { id: 3, name: "Clara Davis", event: "Hackathon", stars: 5, text: "Excellent organization." }
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Feedback_a() {
  const q = useQuery().get("q") || "";
  const query = q.trim().toLowerCase();

  const filtered = query
    ? feedbacks.filter(
        (f) =>
          f.name.toLowerCase().includes(query) ||
          f.event.toLowerCase().includes(query) ||
          f.text.toLowerCase().includes(query)
      )
    : feedbacks;

  return (
    <div className="app-layout">
      {/* Left sidebar (fixed) */}
      <Sidebar />

      {/* Right side: topbar + page content, shifted so sidebar doesn't cover it */}
      <div className="main-layout" style={{ marginLeft: "260px" }}>
        <Topbar />

        <main className="content-area">
          <div className="page">
            <div className="page-header">
              <h1>Feedback</h1>
            </div>

            <div className="cards-grid">
              {filtered.map((f) => (
                <div key={f.id} className="feedback-card">
                  <div className="fb-head">
                    <div className="fb-name">{f.name}</div>
                    <div className="fb-stars">{"★".repeat(f.stars)}</div>
                  </div>
                  <div className="fb-event">{f.event}</div>
                  <p className="fb-text">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
