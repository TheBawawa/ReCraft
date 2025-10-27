import React, { useState } from "react";
import { Link } from "react-router-dom";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="p-3">
      <div className="mb-3">
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
        <Link to="/signup" className="btn btn-link p-0">
          Don’t have an account?
        </Link>
      </div>

      <button type="submit" className="btn btn-primary">
        Sign in
      </button>
    </form>
  );
}

export default LoginForm;
