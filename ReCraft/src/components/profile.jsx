import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Row, Col, Button, Image } from "react-bootstrap";



async function fetchProfile() {
  await new Promise((r) => setTimeout(r, 400));
  return {
    id: "u_123",
    name: "Demo User",
    email: "demo@example.com",
    avatarUrl: "",
    postsCount: 12,
    likesCount: 340,
    followersCount: 98,
    subscribed: false,
  };
}

async function fetchGallery() {
  await new Promise((r) => setTimeout(r, 300));
  return Array.from({ length: 6 }).map((_, i) => ({
    id: `g_${i}`,
    imageUrl: `https://picsum.photos/seed/${i + 3}/600/400`,
    title: `Post #${i + 1}`,
  }));
}

export default function ProfileUI({ onSubscribeToggle }) {
  const {uid} = useParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [subscribed, setSubscribed] = useState(false);

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
