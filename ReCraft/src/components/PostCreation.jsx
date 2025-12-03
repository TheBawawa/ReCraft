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

  const [imageFile, setImageFile] = useState(null);
  const [videoLink, setVideoLink] = useState("");
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
    if (!text && !imageFile && !videoLink) {
      alert("Please add some text, an image, or a video link!");
      return;
    }

    // Pass both imageFile and videoLink to createPost
    await createPost({ imageFile, videoLink, text, tags });
    
    setImageFile(null);
    setVideoLink("");
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
              <Form.Label>Upload Image</Form.Label>
              <Form.Control 
                type="file" 
                accept="image/*" 
                onChange={(e) => setImageFile(e.target.files[0])} 
              />
              {imageFile && <small className="text-muted">Selected: {imageFile.name}</small>}
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Or Link a Video (YouTube, etc.)</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="https://www.youtube.com/watch?v=..." 
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)} 
              />
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
