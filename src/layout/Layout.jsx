// src/layout/Layout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, Topbar } from "../components/UIComponents";
import "../styles/App.css";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  // values match your original UI. adjust if your original sidebar width differs.
  const sidebarWidth = collapsed ? "60px" : "230px";
  const topbarHeight = "64px";

  // Set CSS variables on the root container so CSS can use them for layout offsets.
  return (
    <div
      className="layout-container"
      style={{
        // React allows custom CSS properties as strings
        "--sidebar-width": sidebarWidth,
        "--topbar-height": topbarHeight,
      }}
    >
      <Sidebar collapsed={collapsed} />

      <div className="right-section">
        <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
