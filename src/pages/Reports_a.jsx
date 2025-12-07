// src/pages/Reports_a.jsx
import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Sidebar, Topbar } from "../components/UIComponents";
import "../styles/App.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Reports() {
  const donutData = {
    labels: ["Conferences", "Workshops", "Meetups", "Webinars"],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: ["#0b78d1", "#f59e0b", "#ef4444", "#6b7280"]
      }
    ]
  };

  return (
    <div className="app-layout">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Right side: Topbar + page content, shifted so sidebar doesn't cover it */}
      <div className="main-layout" style={{ marginLeft: "260px" }}>
        <Topbar />

        <main className="content-area">
          {/* Reports UI */}
          <div className="page">
            <div className="page-header">
              <h1>Reports &amp; Analytics</h1>
            </div>

            <div className="grid-2">
              <div className="chart-card">
                <h3>Event Attendance</h3>
                {/* placeholder box for a chart — replace with a real chart component if needed */}
                <div
                  style={{
                    height: 260,
                    borderRadius: 8,
                    background: "#fbfbfe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#9aa3b2"
                  }}
                >
                  Attendance chart placeholder
                </div>
              </div>

              <div className="chart-card">
                <h3>Event Category Distribution</h3>
                <div style={{ height: 260 }}>
                  <Doughnut data={donutData} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
