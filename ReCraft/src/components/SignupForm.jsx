import React from "react";
import { Link } from "react-router-dom";

function SignupForm() {
  return (
    <div className="p-3">
      <h2>Sign Up</h2>
      <p>Signup form goes here.</p>

      <Link to="/Login" className="btn btn-link p-0">
        Back to Login
      </Link>
    </div>
  );
}

export default SignupForm;
