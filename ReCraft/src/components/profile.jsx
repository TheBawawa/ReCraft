import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Button, Image, Spinner } from "react-bootstrap";
import { doc, getDoc, collection, getDocs, query, where, orderBy, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const DEMO_PROFILE = (uid) => ({
  id: uid,
  username: "demo_user",
  name: "Demo User",
  email: "demo@example.com",
  avatarUrl: "",
  postsCount: 4,
  likesCount: 123,
  followersCount: 56,
  subscribed: false,
});

const DEMO_GALLERY = [
  { id: "p1", imageUrl: "https://picsum.photos/seed/plastic/600/400", title: "Bottle Pencil Holder", tags: ["Plastic", "Paper"] },
  { id: "p2", imageUrl: "https://picsum.photos/seed/paper/600/400", title: "Newspaper Gift Bag", tags: ["Paper"] },
  { id: "p3", imageUrl: "https://picsum.photos/seed/glass/600/400", title: "Glass Jar Lantern", tags: ["Glass", "Metal"] },
  { id: "p4", imageUrl: "https://picsum.photos/seed/fabric/600/400", title: "T-shirt Tote Bag", tags: ["Fabric"] },
];

export default function ProfileUI() {
  const { uid } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const [selectedTag, setSelectedTag] = useState("All");

  async function fetchProfile(userId) {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return DEMO_PROFILE(userId);

      const data = docSnap.data();
      return {
        id: userId,
        username: data.username || "",
        name: data.name || "",
        email: data.email || "",
        avatarUrl: data.avatarUrl || "",
        postsCount: data.postsCount ?? 0,
        likesCount: data.likesCount ?? 0,
        followersCount: data.followersCount ?? 0,
        subscribed: data.subscribed ?? false,
      };
    } catch {
      return DEMO_PROFILE(userId);
    }
  }

  async function fetchGallery(userId) {
    try {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      if (snapshot.empty) return DEMO_GALLERY;

      return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          imageUrl: data.mediaData || data.imageUrl,
          title: data.title || data.text || "Untitled",
          tags: data.tags || [],
        };
      });
    } catch {
      return DEMO_GALLERY;
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [p, g] = await Promise.all([fetchProfile(uid), fetchGallery(uid)]);
      setProfile(p);
      setSubscribed(!!p.subscribed);
      setGallery(g);
      setLoading(false);
    })();
  }, [uid]);

  async function handlePfpChange(file) {
    if (!file) return;
    const storageRef = ref(storage, `avatars/${uid}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    await updateDoc(doc(db, "users", uid), { avatarUrl: downloadURL });
    setProfile((prev) => ({ ...prev, avatarUrl: downloadURL }));
  }

  const availableTags = ["All", ...new Set(gallery.flatMap((i) => i.tags || []))];
  const filteredGallery = selectedTag === "All" ? gallery : gallery.filter((i) => (i.tags || []).includes(selectedTag));

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #89d957 0%, #1b9aaa 100%)" }}
           className="d-flex align-items-center justify-content-center">
        <Spinner animation="border" role="status" variant="light" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #89d957 0%, #1b9aaa 100%)", padding: "40px 0" }}>
      <Container>
        <Card className="shadow-lg border-0 rounded-4 mb-5">
          <Card.Body>
            <Row className="align-items-center text-center text-md-start">

              <Col xs={12} md="auto" className="mb-3 mb-md-0">
                <div className="position-relative d-inline-block" style={{ width: "120px", height: "120px" }}>
                  <Image
                    src={profile.avatarUrl || "https://via.placeholder.com/120"}
                    alt="avatar"
                    className="w-100 h-100 rounded-circle"
                    style={{ objectFit: "cover" }}
                  />

                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{
                      background: "rgba(0,0,0,0.5)",
                      color: "white",
                      opacity: 0,
                      borderRadius: "50%",
                      transition: "0.3s",
                      cursor: "pointer",
                    }}
                    onClick={() => document.getElementById("pfpUpload").click()}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                  >
                    Edit
                  </div>

                  <input
                    id="pfpUpload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handlePfpChange(e.target.files[0])}
                  />
                </div>
              </Col>

              <Col md>
                <h3 className="fw-bold mb-1">{profile.name}</h3>
                <p className="text-muted mb-1">@{profile.username}</p>
                <p className="text-muted mb-2">{profile.email}</p>

                <Button
                  variant={subscribed ? "dark" : "outline-dark"}
                  onClick={() => setSubscribed(!subscribed)}
                  className="fw-semibold px-4"
                >
                  {subscribed ? "Subscribed" : "Subscribe"}
                </Button>

                <Button
                  variant="outline-dark"
                  className="fw-semibold px-4 ms-2"
                  onClick={() => navigate("/create-post")}
                >
                  Create Post
                </Button>
              </Col>

              <Col md="auto" className="text-center text-md-end mt-3 mt-md-0">
                <Row className="g-2">
                  <Col xs={4}>
                    <h6 className="fw-bold mb-0">{profile.postsCount}</h6>
                    <small className="text-muted">Posts</small>
                  </Col>
                  <Col xs={4}>
                    <h6 className="fw-bold mb-0">{profile.likesCount}</h6>
                    <small className="text-muted">Likes</small>
                  </Col>
                  <Col xs={4}>
                    <h6 className="fw-bold mb-0">{profile.followersCount}</h6>
                    <small className="text-muted">Followers</small>
                  </Col>
                </Row>
              </Col>

            </Row>
          </Card.Body>
        </Card>

        <Card className="shadow-sm border-0 rounded-4">
          <Card.Body>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
              <h4 className="fw-bold mb-2 mb-md-0 text-center text-md-start">Gallery</h4>

              {availableTags.length > 1 && (
                <div className="d-flex align-items-center">
                  <span className="me-2 fw-semibold">Filter by tag:</span>
                  <select
                    className="form-select form-select-sm w-auto"
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                  >
                    {availableTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {filteredGallery.length === 0 ? (
              <p className="text-muted text-center">No projects for this tag yet.</p>
            ) : (
              <Row className="g-4">
                {filteredGallery.map((item) => (
                  <Col key={item.id} xs={12} sm={6} md={4}>
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                      <Card.Img
                        src={item.imageUrl}
                        alt={item.title}
                        className="img-fluid"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}