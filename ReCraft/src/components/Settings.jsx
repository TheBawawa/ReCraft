import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { auth, db } from "../firebase";
import { updatePassword, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function Settings() {
  const user = auth.currentUser;

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      if (!user) return;
      setLoading(true);
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.username || "");
        }
        setName(user.displayName || "");
        setEmail(user.email || "");
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user info");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // Update display name
      if (name && name !== user.displayName) {
        await updateProfile(user, { displayName: name });
      }

      // Update password
      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      setSuccess("Settings updated successfully!");
      setNewPassword("");
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh" }} className="d-flex align-items-center justify-content-center">
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #89d957 0%, #1b9aaa 100%)",
        display: "flex",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={5}>
            <Card className="shadow-lg border-0" style={{ borderRadius: "15px" }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold" style={{ color: "#1b9aaa" }}>Settings</h2>
                  <p className="text-muted">Update your profile info</p>
                </div>

                {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
                {success && <Alert variant="success" dismissible onClose={() => setSuccess("")}>{success}</Alert>}

                <Form onSubmit={handleSave}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={username}
                      disabled
                      style={{
                        padding: "12px",
                        borderRadius: "10px",
                        border: "2px solid #e0e0e0",
                        backgroundColor: "#f8f9fa",
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label className="fw-semibold">Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        padding: "12px",
                        borderRadius: "10px",
                        border: "2px solid #e0e0e0",
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      disabled
                      style={{
                        padding: "12px",
                        borderRadius: "10px",
                        border: "2px solid #e0e0e0",
                        backgroundColor: "#f8f9fa",
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label className="fw-semibold">New Password</Form.Label>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{
                        padding: "12px",
                        borderRadius: "10px",
                        border: "2px solid #e0e0e0",
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
                    className="w-100 fw-semibold"
                    disabled={saving}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #89d957 0%, #1b9aaa 100%)",
                      border: "none",
                      fontSize: "16px",
                    }}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
