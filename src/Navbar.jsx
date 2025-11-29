import "./Navbar.css";

export default function Navbar() {
  return (
    <div className="navbar">
      <h2 className="logo">Event Admin</h2>

      <div className="right-icons">
        <img
          src="/events.png"
          alt="events"
          className="nav-icon"
        />
        <img
          src="/profile.png"
          alt="profile"
          className="nav-icon"
        />
      </div>
    </div>
  );
}
