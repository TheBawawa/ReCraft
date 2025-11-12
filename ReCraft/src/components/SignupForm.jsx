import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
      });

      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Signup error:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #89d957 0%, #1b9aaa 100%)",
      display: "flex",
      alignItems: "center",
      padding: "20px"
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={5}>
            <Card className="shadow-lg border-0" style={{ borderRadius: "15px" }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold" style={{ color: "#1b9aaa" }}>Welcome!</h2>
                  <p className="text-muted">Sign up to get started</p>
                </div>
                
                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError("")}>
                    {error}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="username">
                    <Form.Label className="fw-semibold">Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      style={{ 
                        padding: "12px",
                        borderRadius: "10px",
                        border: "2px solid #e0e0e0"
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label className="fw-semibold">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ 
                        padding: "12px",
                        borderRadius: "10px",
                        border: "2px solid #e0e0e0"
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ 
                        padding: "12px",
                        borderRadius: "10px",
                        border: "2px solid #e0e0e0"
                      }}
                    />
                  </Form.Group>

                  <Form.Check
                    type="checkbox"
                    id="showPassword"
                    label="Show password"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="mb-4"
                  />

                  <Button 
                    type="submit" 
                    className="w-100 mb-3 fw-semibold" 
                    disabled={loading}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #89d957 0%, #1b9aaa 100%)",
                      border: "none",
                      fontSize: "16px"
                    }}
                  >
                    {loading ? "Creating Account..." : "Sign Up"}
                  </Button>

                  <div className="text-center">
                    <span className="text-muted">Already have an account? </span>
                    <Link 
                      to="/login" 
                      style={{ 
                        color: "#1b9aaa", 
                        textDecoration: "none",
                        fontWeight: "600"
                      }}
                    >
                      Log In
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SignupForm;
