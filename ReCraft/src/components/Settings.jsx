import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Image } from "react-bootstrap";
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
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadUser() {
      if (!user) {
        setError("You must be logged in to view settings.");
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setUsername(snap.data().username || "");
          if (snap.data().avatarUrl) setAvatarPreview(snap.data().avatarUrl);
        }

        setName(user.displayName || "");
        setEmail(user.email || "");
      } catch {
        setError("Failed to load settings");
      }

      setLoading(false);
    }

    loadUser();
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview the image
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);

    setNewAvatarFile(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // Update display name
      if (name !== user.displayName) {
        await updateProfile(user, { displayName: name });
      }

      // Update password
      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      // Update avatar in Firestore only
      let avatarUrl = avatarPreview;
      if (newAvatarFile) {
        // Convert image to Base64
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(newAvatarFile);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (err) => reject(err);
        });

        // Size check < 800 KB
        const sizeInBytes = (base64.length * 3) / 4;
        if (sizeInBytes > 800 * 1024) throw new Error("Image must be 800KB or less");

        avatarUrl = base64;
      }

      await updateDoc(doc(db, "users", user.uid), {
        avatarUrl: avatarUrl || null,
      });

      setSuccess("Settings updated!");
      setNewPassword("");
      setNewAvatarFile(null);
    } catch (err) {
      setError(err.message || "Failed to update settings");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div style={{ background: "#fffef6", minHeight: "100vh", padding: "20px" }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={6} lg={5}>
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Body className="p-4">
                <h2 className="fw-bold text-center mb-3">Settings</h2>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSave}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" value={username} disabled />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} disabled />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Check
                    className="mb-3"
                    label="Show password"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />

                  <Form.Group className="mb-4">
                    <Form.Label>Profile Picture</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </Form.Group>

                  {avatarPreview && (
                    <div className="text-center mb-3">
                      <Image
                        src={avatarPreview}
                        roundedCircle
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        alt="Avatar Preview"
                      />
                    </div>
                  )}

                  <Button type="submit" className="w-100" disabled={saving}>
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
