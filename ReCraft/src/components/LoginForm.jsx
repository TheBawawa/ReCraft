import React, { useState } from "react";
import { Link } from "react-router-dom";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="p-4 mx-auto" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-4">Login</h2>

      <div className="mb-3">
        <label htmlFor="inputEmail" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-control"
          id="inputEmail"
          placeholder="Enter email"
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
          placeholder="Enter password"
        />
      </div>

      <div className="form-check mb-3">
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

      <button type="submit" className="btn btn-primary w-100 mb-2">
        Sign In
      </button>

      <div className="text-center">
        <Link to="/signup" className="btn btn-link p-0">
          Don’t have an account? Sign Up
        </Link>
      </div>
    </form>
  );
}

export default LoginForm;