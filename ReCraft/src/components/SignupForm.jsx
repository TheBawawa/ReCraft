import React from "react";
import { Link } from "react-router-dom";

function SignupForm() {
  return (
    <div className="p-4 mx-auto" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-4">Sign Up</h2>
      <p className="text-center">Signup form goes here.</p>

      <div className="text-center">
        <Link to="/login" className="btn btn-link p-0">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default SignupForm;