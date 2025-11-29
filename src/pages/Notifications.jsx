import React from "react";

const notes = [
  { id:1, text:"Event 'Summer Fest' approved", time:"10m" },
  { id:2, text:"New user 'Alice Johnson' registered", time:"30m" },
  { id:3, text:"Payment of $50 processed", time:"4h" },
];

export default function Notifications(){
  return (
    <div className="page">
      <div className="page-header"><h1>Notifications</h1></div>
      <div className="table-card">
        <ul className="notif-list">
          {notes.map(n => <li key={n.id} className="notif-item">{n.text}<span className="muted">{n.time}</span></li>)}
        </ul>
      </div>
    </div>
  );
}
