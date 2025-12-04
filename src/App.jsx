// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";

// Pages
import Dashboard from "./pages/Dashboard_a";
import AdminApprovalList from "./pages/AdminApprovalList_a"; // Event Management (Admin)
import UserManagement from "./pages/UserManagement_a";
import Reports from "./pages/Reports_a";
import Feedback from "./pages/Feedback_a";
import Notifications from "./pages/Notifications_a";
import Profile from "./pages/Profile_a";

export default function App() {
  return (
    <Routes>
      {/* Use /* so Layout matches ALL paths like /events, /admin/events, etc. */}
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
