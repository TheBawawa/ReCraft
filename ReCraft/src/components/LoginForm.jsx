import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { googleProvider } from "../firebase";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      setEmail("");
      setPassword("");

      navigate(`/profile/${user.uid}`);

    } catch (error) {

      console.error("Login error:", error.message);
      setError(error.message);
      
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      navigate(`/profile/${user.uid}`);
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed");
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
                  <h2 className="fw-bold" style={{ color: "#1b9aaa" }}>Hello!</h2>
                  <p className="text-muted">Log in to your account</p>
                </div>
                
                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError("")}>
                    {error}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
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
                      placeholder="Enter your password"
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
                    {loading ? "Logging In..." : "Log In"}
                  </Button>

                  <Button 
                    onClick={handleGoogleLogin}
                    className="w-100 mb-3 fw-semibold"
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      background: "#ffffff",
                      color: "#000",
                      border: "2px solid #4285F4"
                    }}
                  >
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                      alt="google"
                      style={{ width: "20px", marginRight: "8px" }}
                    />
                    Continue with Google
                  </Button>

                  <div className="text-center">
                    <span className="text-muted">Don't have an account? </span>
                    <Link 
                      to="/signup" 
                      style={{ 
                        color: "#1b9aaa", 
                        textDecoration: "none",
                        fontWeight: "600"
                      }}
                    >
                      Sign Up
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

export default LoginForm;
