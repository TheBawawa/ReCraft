import { useState } from "react";
import { Link } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import "bootstrap-icons/font/bootstrap-icons.css";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="navbar navbar-expand-lg bg-light px-4"
      style={{
        borderBottom: "3px solid black",
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <Link to="/" className="navbar-brand fw-bold text-dark">
        ReCraft
      </Link>

      {/* Links */}
      <div className="ms-auto me-3">
        <Link to="/" className="text-dark fw-semibold me-3 text-decoration-none">
          Home
        </Link>
        <Link to="/about" className="text-dark fw-semibold text-decoration-none">
          About
        </Link>
      </div>

      {/* Profile Icon */}
      <div className="position-relative">
        <div
          className="profile-icon"
          onClick={() => setOpen(!open)}
          title="Profile"
        >
          <i className="bi bi-person-fill" style={{ fontSize: "1.5rem", color: "black" }}></i>
        </div>

        {open && <ProfileDropdown />}
      </div>
    </nav>
  );
}

export default Navbar;