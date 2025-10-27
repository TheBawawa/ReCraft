import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/LoginForm.css"

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just log the data. In real app, send to backend API
    console.log("Login data:", {email, password});
    alert("Login successful! (demo only)");
    // Reset form
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="page-signup container" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Hello!</h2>
    
      <form className="page-login">
        <div className="email-box">
          <label htmlFor="inputEmail" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="inputEmail"
            placeholder="Email"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="inputPassword" className="form-label">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            id="inputPassword"
            placeholder="Password"
          />
        </div>

        <div className="mb-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="togglePassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label className="form-check-label" htmlFor="togglePassword">
              {showPassword ? "Hide password" : "Show password"}
            </label>
          </div>
        </div>

        <div className="text-center">
          <span>Don’t have an account? </span>
          <Link to="/signup" className="btn btn-link p-0">
            Sign up
          </Link>
        </div>

        <button type="submit" className="btn btn-primary">
          Sign in
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
