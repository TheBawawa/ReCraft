import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "../firebase";

// Profile dropdown component showing different options based on authentication status
function ProfileDropdown() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/"); // redirect to home page after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div
      className="dropdown-menu show p-2"
      style={{
        position: "absolute",
        top: "55px",
        right: 0,
        backgroundColor: "white",
        border: "2px solid black",
        borderRadius: "8px",
        width: "150px",
        textAlign: "center",
      }}
    >
      {!user ? (
        <>
          <Link to="/signup" className="dropdown-item fw-semibold text-dark">
            Sign Up
          </Link>
          <Link to="/login" className="dropdown-item fw-semibold text-dark">
            Log In
          </Link>
        </>
      ) : (
        <>
          <Link to={`/profile/${user.uid}`} className="dropdown-item fw-semibold text-dark">
            Profile
          </Link>
          <Link to="/settings" className="dropdown-item fw-semibold text-dark">
            Settings
          </Link>
          <div
            onClick={handleLogout}
            className="dropdown-item fw-semibold text-dark"
            style={{ cursor: "pointer" }}
          >
            Log Out
          </div>
        </>
      )}
    </div>
  );
}

export default ProfileDropdown;
