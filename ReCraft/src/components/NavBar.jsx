import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { auth } from "../firebase";

// Search bar
function SearchBar({ onSearch }) {
  return (
    <input
      type="text"
      placeholder="Search by text or tag..."
      onChange={(e) => onSearch(e.target.value)}
      style={{
        width: "500px",
        padding: "8px 12px",
        borderRadius: "6px",
        border: "1px solid #aaa",
        marginLeft: "20px",
      }}
    />
  );
}

function NavBar({ onSearch }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const user = auth.currentUser;

  const handleLogout = async () => {
    await auth.signOut();
    window.location.reload();
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-light px-4"
      style={{
        borderBottom: "3px solid black",
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
        height: "60px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Link
        to="/"
        className="navbar-brand fw-bold text-dark"
        style={{ fontSize: "1.4rem" }}
      >
        ReCraft
      </Link>

      <SearchBar onSearch={onSearch} />

      <div className="ms-auto me-3">
        <Link
          to="/"
          className="text-dark fw-semibold me-3 text-decoration-none"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="text-dark fw-semibold text-decoration-none"
        >
          About
        </Link>
      </div>

      <div className="position-relative">
        <div
          className="profile-icon"
          onClick={() => setOpen(!open)}
          style={{
            cursor: "pointer",
            padding: "6px 10px",
            borderRadius: "50%",
            backgroundColor: "#eee",
          }}
        >
          <i className="bi bi-person-fill" style={{ fontSize: "1.5rem" }}></i>
        </div>

        {open && (
          <div
            style={{
              position: "absolute",
              right: 0,
              marginTop: "10px",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "10px",
              width: "150px",
              zIndex: 2000,
            }}
          >
            {!user ? (
              <>
                <p
                  className="dropdown-item"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </p>
                <p
                  className="dropdown-item"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </p>
              </>
            ) : (
              <>
                <p
                  className="dropdown-item"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/profile/${user.uid}`)}
                >
                  My Profile
                </p>
                <p
                  className="dropdown-item text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={handleLogout}
                >
                  Logout
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;