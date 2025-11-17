import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Row, Col, Button, Image, Spinner } from "react-bootstrap";
import { doc, getDoc, collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase";

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
  {
    id: "p1",
    imageUrl: "https://picsum.photos/seed/plastic/600/400",
    title: "Bottle Pencil Holder",
    tags: ["Plastic", "Paper"],
  },
  {
    id: "p2",
    imageUrl: "https://picsum.photos/seed/paper/600/400",
    title: "Newspaper Gift Bag",
    tags: ["Paper"],
  },
  {
    id: "p3",
    imageUrl: "https://picsum.photos/seed/glass/600/400",
    title: "Glass Jar Lantern",
    tags: ["Glass", "Metal"],
  },
  {
    id: "p4",
    imageUrl: "https://picsum.photos/seed/fabric/600/400",
    title: "T-shirt Tote Bag",
    tags: ["Fabric"],
  },
];

export default function ProfileUI({ onSubscribeToggle }) {
  const { uid } = useParams();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [subscribed, setSubscribed] = useState(false);

  // Tag filter
  const [selectedTag, setSelectedTag] = useState("All");
  async function fetchProfile(userId) {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.warn("User profile not found, using demo profile");
        return DEMO_PROFILE(userId);
      }

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
    } catch (err) {
      console.error("Error fetching profile, using demo:", err);
      return DEMO_PROFILE(userId);
    }
  }

  async function fetchGallery(userId) {
    try {
      const postsRef = collection(db, "posts");
      const q = query(
        postsRef,
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.warn("No posts found, using demo gallery");
        return DEMO_GALLERY;
      }

      const galleryData = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          imageUrl: data.imageUrl,
          title: data.title,
          tags: data.tags || [],
        };
      });

      return galleryData;
    } catch (err) {
      console.error("Error fetching gallery, using demo:", err);
      return DEMO_GALLERY;
    }
  }

  // --------------- Load data ---------------

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      const [p, g] = await Promise.all([fetchProfile(uid), fetchGallery(uid)]);
      if (!mounted) return;

      setProfile(p);
      setSubscribed(!!p.subscribed);
      setGallery(g);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [uid]);

  // --------------- Tag filter logic ---------------

  const availableTags = [
    "All",
    ...Array.from(
      new Set(
        gallery.flatMap((item) => item.tags || [])
      )
    ),
  ];

  const filteredGallery =
    selectedTag === "All"
      ? gallery
      : gallery.filter((item) => (item.tags || []).includes(selectedTag));

  // --------------- Subscribe button ---------------

  const handleToggleSubscribe = async () => {
    const next = !subscribed;
    setSubscribed(next);
    try {
      await onSubscribeToggle?.(next);
    } catch (err) {
      setSubscribed(!next);
      alert("Subscribe action failed.");
    }
  };

  // --------------- Render ---------------

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #89d957 0%, #1b9aaa 100%)",
        }}
        className="d-flex align-items-center justify-content-center"
      >
        <Spinner animation="border" role="status" variant="light">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #89d957 0%, #1b9aaa 100%)",
        padding: "40px 0",
      }}
    >
      <Container>
        {/* Profile Header Section */}
        <Card className="shadow-lg border-0 rounded-4 mb-5">
          <Card.Body>
            <Row className="align-items-center text-center text-md-start">
              {/* Profile Image */}
              <Col xs={12} md="auto" className="mb-3 mb-md-0">
                <div
                  className="d-inline-block bg-light rounded-circle border"
                  style={{
                    width: "120px",
                    height: "120px",
                    overflow: "hidden",
                  }}
                >
                  {profile.avatarUrl ? (
                    <Image
                      src={profile.avatarUrl}
                      alt="avatar"
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                      roundedCircle
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 text-muted fw-semibold">
                      PFP
                    </div>
                  )}
                </div>
              </Col>

              {/* User Info */}
              <Col md>
                <h3 className="fw-bold mb-1">{profile.name}</h3>
                <p className="text-muted mb-1">@{profile.username}</p>
                <p className="text-muted mb-2">{profile.email}</p>

                {/* Subscribe Button */}
                <Button
                  variant={subscribed ? "dark" : "outline-dark"}
                  onClick={handleToggleSubscribe}
                  className="fw-semibold px-4"
                >
                  {subscribed ? "Subscribed" : "Subscribe"}
                </Button>
              </Col>

              {/* Stats */}
              <Col md="auto" className="text-center text-md-end mt-3 mt-md-0">
                <Row className="g-2">
                  <Col xs={4}>
                    <div>
                      <h6 className="fw-bold mb-0">{profile.postsCount}</h6>
                      <small className="text-muted">Posts</small>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div>
                      <h6 className="fw-bold mb-0">{profile.likesCount}</h6>
                      <small className="text-muted">Likes</small>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div>
                      <h6 className="fw-bold mb-0">{profile.followersCount}</h6>
                      <small className="text-muted">Followers</small>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Gallery Section + Tag Filter */}
        <Card className="shadow-sm border-0 rounded-4">
          <Card.Body>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
              <h4 className="fw-bold mb-2 mb-md-0 text-center text-md-start">
                Gallery
              </h4>

              {availableTags.length > 1 && (
                <div className="d-flex align-items-center justify-content-center justify-content-md-end">
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
              <p className="text-muted text-center">
                No projects for this tag yet. Try another one.
              </p>
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