import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { auth, db, storage } from "../firebase";
import { updatePassword, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Settings() {
  const user = auth.currentUser;

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadUser() {
      if (!user) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setUsername(snap.data().username || "");
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

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (name !== user.displayName) {
        await updateProfile(user, { displayName: name });
      }

      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      // Avatar upload added
      if (newAvatar) {
        const storageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(storageRef, newAvatar);
        const downloadURL = await getDownloadURL(storageRef);

        await updateProfile(user, { photoURL: downloadURL });

        await updateDoc(doc(db, "users", user.uid), {
          avatarUrl: downloadURL,
        });
      }

      setSuccess("Settings updated!");
      setNewPassword("");
      setNewAvatar(null);
    } catch (err) {
      setError(err.message || "Failed to update");
    }

    setSaving(false);
  }

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
                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
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

                  {/* Avatar Upload */}
                  <Form.Group className="mb-4">
                    <Form.Label>Profile Picture</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewAvatar(e.target.files[0])}
                    />
                  </Form.Group>

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