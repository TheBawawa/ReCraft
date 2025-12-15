import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import FeedPost from "./FeedPost";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { ButtonGroup } from "react-bootstrap";

const STORAGE_KEY = "savedPosts";


const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;

  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  if (url.includes("/embed/")) return url;

  return url; // fallback (prevents iframe src=null)
};

/* -----------------------------
   COMPONENT
----------------------------- */
export default function PostTemplate({ post }) {
  if (!post) return null;

  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  const {
    id,
    mediaData,
    mediaType,
    text,
    tags,
    userId,
    createdAt,
    cap,
  } = post;

  const [saved, setSaved] = useState(false);
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState(userId);

  const isOwner = currentUser && currentUser.uid === userId;

 
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUsername(data?.username || userId);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    if (userId) fetchUsername();
  }, [userId]);

  
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const list = JSON.parse(raw);
      setSaved(list.some((p) => p.id === id));
    } catch {
    }
  }, [id]);

 
  const handleToggleSave = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];

      let next;
      if (saved) {
        next = list.filter((p) => p.id !== id);
      } else {

        const item = {
          id,
          mediaData,
          mediaType,
          text,
          tags: tags || [],
          userId,
          createdAt: createdAt?.seconds || null,
        };
        next = [...list.filter((p) => p.id !== id), item];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSaved(!saved);
    } catch (e) {
      console.error("Save failed", e);
      alert("Saving failed (local demo only).");
    }
  };

  /* -----------------------------
     SHARE POST
  ----------------------------- */
  const handleShare = async () => {
    const url = `${window.location.origin}/post/${id || ""}`;
    
    const textShare = text || "Check out this ReCraft project!";

    try {
      if (navigator.share) {
        await navigator.share({ title: "ReCraft project", text: textShare, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      } else {
        window.prompt("Copy this link:", url);
      }
    } catch (e) {
      console.error("Share error", e);
    }
  };

  const dateText = createdAt?.toDate
    ? createdAt.toDate().toLocaleDateString()
    : createdAt
    ? new Date(createdAt * 1000).toLocaleDateString()
    : "";

  
  return (
    <>
      <div
        style={{
          width: "350px",
          margin: "15px",
          background: "white",
          borderRadius: "14px",
          padding: "20px",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.15)",
          cursor: "pointer",
        }}
        
      >
        {/* MEDIA HANDLING */}
        {mediaData && (
          mediaType === "video/link" ? (
            <iframe
              width="100%"
              height="200px"
              src={getYouTubeEmbedUrl(mediaData)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={{ borderRadius: "12px", objectFit: "cover" }}
              allowFullScreen
              title="video"
            />
          ) : mediaType?.startsWith("video/") ? (
            <video
              src={mediaData}
              controls
              style={{ width: "100%", maxHeight: "100%", borderRadius: "12px" }}
            />
          ) : (
            <img
              src={mediaData}
              alt="post"
              style={{width: "100%", height: "200px", borderRadius: "12px", objectFit: "cover",}}
           />
          )
        )}

        <h4 className="mt-3" onClick={() => setShow(true)}>{text}</h4>

        {/* TAGS */}
        {tags?.length > 0 &&
          tags.map((t) => (
            <span
              key={t}
              style={{
                background: "#1b9aaa",
                color: "white",
                padding: "4px 10px",
                borderRadius: "6px",
                marginRight: "6px",
                fontSize: "0.85rem",
              }}
            >
              #{t}
            </span>
          ))}

        {/* BUTTONS */}
        <div className="mt-3">
          <button
            className="btn btn-secondary me-2"
            onClick={handleToggleSave}
            disabled={saved}
          >
            {saved ? "Saved" : "Save"}
          </button>

          <button className="btn btn-info" onClick={handleShare}>
            Share
          </button>
        </div>

        <small className="text-muted">
          Posted by {username} on {dateText}
        </small>
      </div>

      {/* MODAL */}
      <Modal show={show} onHide={() => setShow(false)} size="xl" centered style={ {marginTop: "4%",}}>
        <div style={{marginLeft: "auto", marginLeft: "90%", width: "100%"}}>
          <ButtonGroup>
          {isOwner && (
            <Button style={{ marginTop: "5%", width: "100%"}}
              onClick={() => navigate(`/edit-post/${id}`, { state: { post } })}
            >Edit
            </Button>
          )}

          <Button
            variant="secondary"
            onClick={() => setShow(false)}
            style={{  marginTop: "5%", marginLeft: "1%", width: "100%" }}
          >
            X
          </Button>
          </ButtonGroup>
       </div>

        <Modal.Body>
          <FeedPost
            title={text}
            mediaDt={mediaData}
            mediaTp={mediaType}
            usName={username}
            likeCount={0}
            capT={cap}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}