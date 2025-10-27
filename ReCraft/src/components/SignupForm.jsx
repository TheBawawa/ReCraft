import React, { useState } from "react";
import { Link } from "react-router-dom";

function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just log the data. In real app, send to backend API
    console.log("Signup data:", { username, email, password });
    alert("Signup successful! (demo only)");
    // Reset form
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="page-signup container" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Welcome!</h2>

      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="form-control"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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

        {/* Sign Up button */}
        <button type="submit" className="btn btn-primary w-100 mb-3">
          Sign Up
        </button>

        {/* Link to Login page */}
        <div className="text-center">
          <span>Already have an account? </span>
          <Link to="/login" className="btn btn-link p-0">
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignupForm;
