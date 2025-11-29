// src/pages/Profile.jsx
import React from "react";

export default function Profile() {
  const user = {
    name: "Ankita Sharma",
    email: "ankita@example.com",
    phone: "+91 9876543210",
    role: "Administrator",
    avatarUrl: "",
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>My Profile</h2>

      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        }}
      >
        {/* Avatar */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="profile"
              style={{ width: 120, height: 120, borderRadius: "50%" }}
            />
          ) : (
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "#EDF2F7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 40,
                fontWeight: 700,
                color: "#2D3748",
                margin: "0 auto"
              }}
            >
              {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ fontSize: 16 }}>
          <div style={{ marginBottom: 10 }}>
            <strong>Name:</strong> {user.name}
          </div>
          <div style={{ marginBottom: 10 }}>
            <strong>Email:</strong> {user.email}
          </div>
          <div style={{ marginBottom: 10 }}>
            <strong>Phone:</strong> {user.phone}
          </div>
          <div style={{ marginBottom: 10 }}>
            <strong>Role:</strong> {user.role}
          </div>

          <button
            style={{
              marginTop: 20,
              padding: "10px 20px",
              background: "#4F46E5",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
