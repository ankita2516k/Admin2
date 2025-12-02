// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";

// Pages (matching the filenames in your src/pages folder)
import Dashboard from "./pages/Dashboard";
import EventManagement from "./pages/EventManagement";
import UserManagement from "./pages/UserManagement";
import Reports from "./pages/Reports";
import Feedback from "./pages/Feedback";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/events" element={<EventManagement />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        
      </Route>
    </Routes>
  );
}
