// src/App.jsx
import React, { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";

// Layout pieces (moved here from src/layout/Layout.jsx)
import { Sidebar, Topbar } from "./components/UIComponents";
import { NotificationDrawer } from "./components/NotificationCenter";
import "./styles/App.css";

// Pages
import Dashboard from "./pages/Dashboard_a";
import AdminApprovalList from "./pages/AdminApprovalList_a"; // Event Management (Admin)
import UserManagement from "./pages/UserManagement_a";
import Reports from "./pages/Reports_a";
import Feedback from "./pages/Feedback_a";
import Notifications from "./pages/Notifications_a";
import Profile from "./pages/Profile_a";

// 🔹 This is your old Layout.jsx, now inside App.jsx
function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  // values match your original UI
  const sidebarWidth = collapsed ? "60px" : "230px";
  const topbarHeight = "64px";

  return (
    <div
      className="layout-container"
      style={{
        "--sidebar-width": sidebarWidth,
        "--topbar-height": topbarHeight,
      }}
    >
      <Sidebar collapsed={collapsed} />

      <div className="right-section">
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className="content-area">
          <Outlet />
          <NotificationDrawer />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Layout wraps all routes */}
      <Route path="/*" element={<Layout />}>
        {/* Default dashboard at / */}
        <Route index element={<Dashboard />} />

        {/* Event Management routes */}
        <Route path="admin/events_a" element={<AdminApprovalList />} />

        {/* Other pages */}
        <Route path="users_a" element={<UserManagement />} />
        <Route path="reports_a" element={<Reports />} />
        <Route path="feedback_a" element={<Feedback />} />
        <Route path="notifications_a" element={<Notifications />} />
        <Route path="profile_a" element={<Profile />} />
      </Route>
    </Routes>
  );
}
