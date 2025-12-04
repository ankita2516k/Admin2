import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Filler, Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

const activity = [
  { id: 1, text: "Event 'Summer Fest' approved", time: "10 mins ago" },
  { id: 2, text: "New user 'Alice Johnson' registered", time: "30 mins ago" },
  { id: 3, text: "Feedback received for 'Winter Gala'", time: "1 hour ago" },
  { id: 4, text: "Organizer account approved", time: "2 hours ago" },
  { id: 5, text: "Payment processed ($50)", time: "4 hours ago" },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const q = useQuery().get("q") || "";
  const query = q.trim().toLowerCase();

  useEffect(() => {
    const t = setTimeout(()=> setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const filteredActivity = query ? activity.filter(a => a.text.toLowerCase().includes(query)) : activity;

  const chartData = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun"],
    datasets: [{
      label: "Registrations",
      data: [150,220,180,300,260,420],
      borderColor: "#0b78d1",
      backgroundColor: "rgba(11,120,209,0.12)",
      tension:0.35,
      fill:true
    }]
  };

  return (
    <div className="page dashboard-page">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon">📅</div><div><div className="stat-value">2,500</div><div className="muted">Total Events</div></div></div>
        <div className="stat-card"><div className="stat-icon">👥</div><div><div className="stat-value">18,900</div><div className="muted">Users Registered</div></div></div>
      </div>

      <div className="charts-area">
        <div className="chart-card">
          <h3>Monthly Event Registrations</h3>
          {loading ? <div className="chart-skeleton"><div className="skeleton"/><div className="skeleton short"/></div> :
            <div style={{height:340}}><Line data={chartData} options={{responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}}} /></div>
          }
        </div>

        <aside className="activity-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {filteredActivity.map(a => (
              <div key={a.id} className="activity-item">
                <div>{a.text}</div>
                <small className="muted">{a.time}</small>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
