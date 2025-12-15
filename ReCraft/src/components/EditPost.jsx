import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const passedPost = location.state?.post;

  const [post, setPost] = useState(passedPost || null);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [editedText, setEditedText] = useState("");
  const [editedCaption, setEditedCaption] = useState("");
  const [editedTags, setEditedTags] = useState([]);
  const [editedImageFile, setEditedImageFile] = useState(null);
  const [editedVideoLink, setEditedVideoLink] = useState("");

  const availableTags = ["Plastic", "Paper", "Glass", "Metal", "Fabric"];

  
  useEffect(() => {
    const fetchPost = async () => {
      if (!passedPost) {
        const ref = doc(db, "posts", id);
        const snap = await getDoc(ref);
        if (snap.exists()) setPost({ id, ...snap.data() });
      }
    };
    fetchPost();
  }, [id, passedPost]);

  
  useEffect(() => {
    if (post) {
      setEditedText(post.text || "");
      setEditedCaption(post.cap || "");
      setEditedTags(post.tags || []);
      setEditedVideoLink(post.mediaType === "video/link" ? post.mediaData : "");
      setLoading(false);
    }
  }, [post]);

  if (loading) return <h2>Loading...</h2>;

  // Ownership check
  const user = auth.currentUser;
  const isOwner = user?.uid === post.userId;
  if (!isOwner) return <h2>You cannot edit this post.</h2>;

  const handleTagToggle = (tag) => {
    setEditedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  
  const handleSubmit = async () => {
    if (!editedText && !editedCaption && !editedImageFile && !editedVideoLink) {
      alert("Please add text, image, or video!");
      return;
    }

    
    let mediaData = post.mediaData;
    let mediaType = post.mediaType;

    
    if (editedImageFile) {
      const maxSize = 800 * 1024;
      if (editedImageFile.size > maxSize) {
        alert("Image too large! Max 800KB.");
        return;
      }
      mediaData = await fileToBase64(editedImageFile);
      mediaType = editedImageFile.type;
    } else if (editedVideoLink) {
      mediaData = editedVideoLink;
      mediaType = "video/link";
    }

    try {
      const postRef = doc(db, "posts", post.id);
      await updateDoc(postRef, {
        text: editedText,
        cap: editedCaption,
        tags: editedTags,
        mediaData,
        mediaType,
      });

      alert("Post updated successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to update post.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #89d957 0%, #1b9aaa 100%)",
        padding: "40px 0",
        paddingTop: "10%",
      }}
    >
      <Container>
        <Card className="shadow-lg border-0 rounded-4 p-4">
          <h2 className="fw-bold mb-4 text-center">Edit Post</h2>

          <Form>
            {/* -------- CURRENT IMAGE PREVIEW -------- */}
            {post.mediaData &&
              post.mediaType?.startsWith("image/") &&
              !editedImageFile && (
                <img
                  src={post.mediaData}
                  alt="Current"
                  className="mb-3"
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              )}

            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setEditedImageFile(e.target.files[0])}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Or Link a Video</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={editedVideoLink}
                onChange={(e) => setEditedVideoLink(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Post Title</Form.Label>
              <Form.Control
                type="text"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Post Caption</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={editedCaption}
                onChange={(e) => setEditedCaption(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <Row>
                {availableTags.map((tag) => (
                  <Col xs="auto" key={tag}>
                    <Button
                      variant={
                        editedTags.includes(tag)
                          ? "primary"
                          : "outline-secondary"
                      }
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Button>
                  </Col>
                ))}
              </Row>
            </Form.Group>

            <div className="text-center mt-3">
              <Button variant="dark" onClick={handleSubmit}>
                Update Post
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
}
