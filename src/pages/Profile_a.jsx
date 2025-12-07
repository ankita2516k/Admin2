// src/pages/Profile_a.jsx
import React, { useEffect, useRef, useState } from "react";
import { Sidebar, Topbar } from "../components/UIComponents";
import "../styles/App.css";

/*
  Profile page:
  - Avatar upload (persists to localStorage.user_avatar)
  - Name, Email, Phone placeholder logic
  - Role is fixed
  - Data persists to localStorage
  - Dispatches a 'profile-updated' event so Topbar avatar updates instantly
*/

const USER_KEY = "user_profile";
const AVATAR_KEY = "user_avatar";

export default function Profile() {
  const fileRef = useRef(null);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Administrator",
  });

  const [avatarSrc, setAvatarSrc] = useState(null);

  // Load saved profile + avatar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setUser((prev) => ({ ...prev, ...saved }));
      }
    } catch {}

    const a = localStorage.getItem(AVATAR_KEY);
    if (a) setAvatarSrc(a);
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  }

  function onUploadClick() {
    if (fileRef.current) fileRef.current.click();
  }

  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (ev) {
      const dataUrl = ev.target.result;
      setAvatarSrc(dataUrl);
      try {
        localStorage.setItem(AVATAR_KEY, dataUrl);
      } catch {}
      window.dispatchEvent(new Event("profile-updated"));
    };
    reader.readAsDataURL(file);
  }

  function removeAvatar() {
    localStorage.removeItem(AVATAR_KEY);
    setAvatarSrc(null);
    window.dispatchEvent(new Event("profile-updated"));
  }

  function saveProfile(e) {
    e.preventDefault();

    const toSave = {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "Administrator",
    };

    try {
      localStorage.setItem(USER_KEY, JSON.stringify(toSave));
      alert("Profile saved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    }
  }

  return (
    <div className="app-layout">
      <Sidebar />

      {/* 🔑 Shift content to the right so sidebar doesn’t cover it */}
      <div className="main-layout" style={{ marginLeft: "260px" }}>
        <Topbar />

        <main className="content-area">
          <div style={{ padding: 24 }}>
            <h1 style={{ margin: "6px 0 20px 0", fontSize: 28 }}>My Profile</h1>

            <div
              style={{
                maxWidth: 900,
                background: "#fff",
                borderRadius: 12,
                padding: 28,
                boxShadow: "0 8px 24px rgba(16,24,40,0.04)",
              }}
            >
              <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
                {/* Left — Avatar */}
                <div style={{ width: 240, textAlign: "center" }}>
                  <div style={{ marginBottom: 12 }}>
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt="avatar"
                        style={{
                          width: 140,
                          height: 140,
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "3px solid rgba(0,0,0,0.06)",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 140,
                          height: 140,
                          borderRadius: "50%",
                          background: "#eef2ff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 36,
                          color: "#3730a3",
                        }}
                      >
                        U
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <label
                      className="btn"
                      style={{
                        cursor: "pointer",
                        padding: "10px 14px",
                        borderRadius: 8,
                        background: "#7c3aed",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    >
                      Upload New Photo
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        style={{ display: "none" }}
                      />
                    </label>

                    <button
                      onClick={removeAvatar}
                      className="btn"
                      style={{
                        padding: "10px 12px",
                        borderRadius: 8,
                        background: "#fff",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Right — Form */}
                <div style={{ flex: 1 }}>
                  <form onSubmit={saveProfile}>
                    {/* Name */}
                    <div style={{ marginBottom: 14 }}>
                      <label
                        style={{
                          display: "block",
                          fontWeight: 700,
                          marginBottom: 6,
                        }}
                      >
                        Name
                      </label>
                      <input
                        name="name"
                        value={user.name}
                        onChange={onChange}
                        placeholder="Your name"
                        className="input"
                        style={{
                          width: "100%",
                          height: 36,
                          padding: "6px 10px",
                          borderRadius: 6,
                          border: "1px solid rgba(0,0,0,0.12)",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: 14 }}>
                      <label
                        style={{
                          display: "block",
                          fontWeight: 700,
                          marginBottom: 6,
                        }}
                      >
                        Email
                      </label>
                      <input
                        name="email"
                        value={user.email}
                        onChange={onChange}
                        placeholder="you@example.com"
                        className="input"
                        style={{
                          width: "100%",
                          height: 36,
                          padding: "6px 10px",
                          borderRadius: 6,
                          border: "1px solid rgba(0,0,0,0.12)",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    {/* Phone */}
                    <div style={{ marginBottom: 14 }}>
                      <label
                        style={{
                          display: "block",
                          fontWeight: 700,
                          marginBottom: 6,
                        }}
                      >
                        Phone
                      </label>
                      <input
                        name="phone"
                        value={user.phone}
                        onChange={onChange}
                        placeholder="+91 9876543210"
                        className="input"
                        style={{
                          width: "100%",
                          height: 36,
                          padding: "6px 10px",
                          borderRadius: 6,
                          border: "1px solid rgba(0,0,0,0.12)",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    {/* Role (read-only) */}
                    <div style={{ marginBottom: 18 }}>
                      <label
                        style={{
                          display: "block",
                          fontWeight: 700,
                          marginBottom: 6,
                        }}
                      >
                        Role
                      </label>
                      <input
                        name="role"
                        value={user.role}
                        readOnly
                        className="input"
                        style={{
                          width: "100%",
                          height: 36,
                          padding: "6px 10px",
                          borderRadius: 6,
                          border: "1px solid rgba(0,0,0,0.06)",
                          background: "#f8fafc",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn"
                      style={{
                        background: "#10b981",
                        color: "#fff",
                        padding: "10px 20px",
                        borderRadius: 10,
                        fontWeight: 700,
                      }}
                    >
                      Save Profile Picture & Details
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
