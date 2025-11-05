import { Link } from "react-router-dom";

function ProfileDropdown() {
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
      <Link to="/signup" className="dropdown-item fw-semibold text-dark">
        Sign Up
      </Link>
      <Link to="/login" className="dropdown-item fw-semibold text-dark">
        Login
      </Link>
    </div>
  );
}

export default ProfileDropdown;