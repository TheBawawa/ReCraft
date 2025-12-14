import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import Autocomplete from "./AutoComplete";

const suggestions = [
  "Plastic Bottles",
  "Paper",
  "Plastic",
  "Plastic Bottles",
  "Soda Cans",
  "Platic Bags",
  "Tubs",
  "Jugs",
  "Aluminum Cans",
  "Steel Cans",
  "Containers",
  "Metal",
];

function NavBar({ onSearch }) {
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribeUser = null;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      // Clear avatar on logout
      if (!user) {
        setAvatarUrl("");
        if (unsubscribeUser) unsubscribeUser();
        return;
      }

      // LIVE Firestore listener (FIX)
      const userRef = doc(db, "users", user.uid);
      unsubscribeUser = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
          setAvatarUrl(snap.data().avatarUrl || "");
        } else {
          setAvatarUrl("");
        }
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) unsubscribeUser();
    };
  }, []);

  const handleLogout = async () => {
  await auth.signOut();
  navigate("/");
  };

  return (
    <nav
      className="navbar navbar-expand-lg bg-light px-4"
      style={{
        borderBottom: "3px solid black",
        position: "fixed",
        top: 0,
        width: "100%",
        height: "60px",
        zIndex: 3000,
      }}
    >
      <Link to="/" className="navbar-brand fw-bold text-dark">
        ReCraft
      </Link>

      <div style={{ marginLeft: "20px", width: "500px" }}>
        <Autocomplete suggestions={suggestions} onSearch={onSearch} />
      </div>

      <div className="ms-auto me-3">
        <Link to="/" className="text-dark fw-semibold me-3 text-decoration-none">
          Home
        </Link>
        <Link to="/about" className="text-dark fw-semibold text-decoration-none">
          About
        </Link>
      </div>

      <div className="position-relative">
        <div
          className="profile-icon"
          onClick={() => setOpen(!open)}
          style={{
            cursor: "pointer",
            padding: "6px",
            borderRadius: "50%",
            backgroundColor: "#eee",
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="profile"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <i className="bi bi-person-fill" style={{ fontSize: "1.5rem" }} />
          )}
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
              zIndex: 5000,
            }}
          >
            {!auth.currentUser ? (
              <>
                <p className="dropdown-item" onClick={() => navigate("/login")}>
                  Login
                </p>
                <p className="dropdown-item" onClick={() => navigate("/signup")}>
                  Sign Up
                </p>
              </>
            ) : (
              <>
                <p
                  className="dropdown-item"
                  onClick={() =>
                    navigate(`/profile/${auth.currentUser.uid}`)
                  }
                >
                  My Profile
                </p>
                <p
                  className="dropdown-item"
                  onClick={() => navigate("/settings")}
                >
                  Settings
                </p>
                <p
                  className="dropdown-item text-danger"
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