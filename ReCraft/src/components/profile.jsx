import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Row, Col, Button, Image } from "react-bootstrap";
import { doc, getDoc, collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase"; 

export default function ProfileUI({ onSubscribeToggle }) {
  const { uid } = useParams(); // get user id from route
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [subscribed, setSubscribed] = useState(false);


async function fetchProfile(uid) {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error("User profile not found");

    const data = docSnap.data();
    return {
      id: uid,
      username: data.username || "",
      name: data.name || "",
      email: data.email || "",
      avatarUrl: data.avatarUrl || "",
      postsCount: data.postsCount || 0,
      likesCount: data.likesCount || 0,
      followersCount: data.followersCount || 0,
      subscribed: data.subscribed || false,
    };
  } catch (err) {
    console.error("Error fetching profile:", err);
    return null;
  }
}


async function fetchGallery() {
  try {
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("userId", "==", uid), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const galleryData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          imageUrl: data.imageUrl,
          title: data.title,
        };
      });

      return galleryData;
    } catch (err) {
      console.error("Error fetching gallery:", err);
      return [];
    }
}
  useEffect(() => {
    let mounted = true;
    (async () => {
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
                  {profile?.avatarUrl ? (
                    <Image
                      src={profile.avatarUrl}
                      alt="avatar"
                      className="w-100 h-100 object-fit-cover"
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
                <h3 className="fw-bold mb-1">{profile?.name}</h3>
                <p className="text-muted mb-1">@{profile?.username}</p> {/* username */}
                <p className="text-muted mb-2">{profile?.email}</p>

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
                      <h6 className="fw-bold mb-0">{profile?.postsCount}</h6>
                      <small className="text-muted">Posts</small>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div>
                      <h6 className="fw-bold mb-0">{profile?.likesCount}</h6>
                      <small className="text-muted">Likes</small>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div>
                      <h6 className="fw-bold mb-0">{profile?.followersCount}</h6>
                      <small className="text-muted">Followers</small>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Gallery Section */}
        <Card className="shadow-sm border-0 rounded-4">
          <Card.Body>
            <h4 className="fw-bold mb-4 text-center text-md-start">Gallery</h4>

            <Row className="g-4">
              {gallery.map((item) => (
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
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-lg md:text-xl font-medium">{label}</span>
      <span className="text-sm md:text-base text-black/70">{value}</span>
    </div>
  );
}