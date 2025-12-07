// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard_a";
import AdminApprovalList from "./pages/AdminApprovalList_a";
import UserManagement from "./pages/UserManagement_a";
import Reports from "./pages/Reports_a";
import Feedback from "./pages/Feedback_a";
import Notifications from "./pages/Notifications_a";
import Profile from "./pages/Profile_a";

import "./styles/App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/admin/events_a" element={<AdminApprovalList />} />
      <Route path="/users_a" element={<UserManagement />} />
      <Route path="/reports_a" element={<Reports />} />
      <Route path="/feedback_a" element={<Feedback />} />
      <Route path="/notifications_a" element={<Notifications />} />
      <Route path="/profile_a" element={<Profile />} />
    </Routes>
  );
}
