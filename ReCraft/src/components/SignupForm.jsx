import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "../styles/SignupForm.css"; // custom CSS

function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup data:", { email, password });
    alert("Signup successful! (demo only)");
    setEmail("");
    setPassword("");
  };

  return (
    <Container className="signup-container">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <h2 className="signup-title text-center mb-4">Welcome!</h2>
          <Form onSubmit={handleSubmit} className="login-box">

            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Check
              type="checkbox"
              id="showPassword"
              label={showPassword ? "Hide password" : "Show password"}
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mb-3"
            />

            <div className="text-center mb-3">
              <span>Already have an account? </span>
              <Link to="/login" className="login-link">
                Log in
              </Link>
            </div>

            <Button type="submit" className="login-button w-100">
              Sign up
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SignupForm;
