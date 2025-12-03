// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/app.css";

import App from "./App";
import { NotificationProvider } from "./components/NotificationCenter";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <NotificationProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NotificationProvider>
  </React.StrictMode>
);
