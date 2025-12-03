import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import { useFirebase } from "./context/FirebaseContext";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function PostCreation() {
  const { createPost } = useFirebase();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setCurrentUser(user));
    return unsubscribe;
  }, []);

  const [media, setMedia] = useState(null);
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);

  const handleTagToggle = (tag) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      alert("You must be logged in to post!");
      return;
    }
    if (!text && !media) {
      alert("Please add some text or media!");
      return;
    }

    await createPost({ mediaFile: media, text, tags });
    setMedia(null);
    setText("");
    setTags([]);
    alert("Post created successfully!");
    navigate("/"); // go to home
  };

  const availableTags = ["Plastic", "Paper", "Glass", "Metal", "Fabric"];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #89d957 0%, #1b9aaa 100%)", padding: "40px 0" }}>
      <Container>
        <Card className="shadow-lg border-0 rounded-4 p-4">
          <h2 className="fw-bold mb-4 text-center">Create a New Post</h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Upload Image or Video</Form.Label>
              <Form.Control type="file" accept="image/*,video/*" onChange={(e) => setMedia(e.target.files[0])} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Post Information:</Form.Label>
              <Form.Control as="textarea" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your post content here..." />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <Row>
                {availableTags.map((tag) => (
                  <Col xs="auto" key={tag} className="mb-2">
                    <Button variant={tags.includes(tag) ? "primary" : "outline-secondary"} onClick={() => handleTagToggle(tag)}>
                      {tag}
                    </Button>
                  </Col>
                ))}
              </Row>
            </Form.Group>

            <div className="text-center mt-3">
              <Button variant="dark" onClick={handleSubmit}>Post</Button>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
}
