// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";

// Pages
import Dashboard from "./pages/Dashboard";
import AdminApprovalList from "./pages/AdminApprovalList"; // Event Management (Admin)
import UserManagement from "./pages/UserManagement";
import Reports from "./pages/Reports";
import Feedback from "./pages/Feedback";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      {/* Use /* so Layout matches ALL paths like /events, /admin/events, etc. */}
      <Route path="/*" element={<Layout />}>
        {/* Default dashboard at / */}
        <Route index element={<Dashboard />} />

        {/* Event Management routes */}
        <Route path="admin/events" element={<AdminApprovalList />} />

        {/* Other pages */}
        <Route path="users" element={<UserManagement />} />
        <Route path="reports" element={<Reports />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
