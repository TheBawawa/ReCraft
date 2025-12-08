import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';
import FeedPost from "./FeedPost";
import EditPost from "./EditPost";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ButtonGroup } from "react-bootstrap";

// YouTube URL embed helper
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;

  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  if (url.includes("/embed/")) return url;

  return null;
};

export default function PostTemplate({ post }) {
  if (!post) return null;

  const { id, mediaData, mediaType, text, tags, userId, createdAt, cap } = post;
  const [saved, setSaved] = useState(false);
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState(userId); 

  // GET USERNAME
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

  // SAVE POST
  const handleSave = async (e) => {
    e.stopPropagation();
    if (currentUser) {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, { savedPosts: arrayUnion(id) });
        setSaved(true);
        alert("Saved!");
      } catch (error) {
        console.error(error);
        alert("Failed to save post.");
      }
    } else {
      try {
        const raw = localStorage.getItem("savedPosts");
        const list = raw ? JSON.parse(raw) : [];
        let next;
        if (saved) {
          next = list.filter(p => p.id !== id);
        } else {
          next = [...list.filter(p => p.id !== id), { id, mediaData, mediaType, text, tags, userId, createdAt: createdAt?.seconds || null }];
        }
        localStorage.setItem("savedPosts", JSON.stringify(next));
        setSaved(!saved);
      } catch (error) {
        console.error(error);
        alert("Saving failed.");
      }
    }
  };

  // Share post
  const handleShare = async (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/post/${id}`;
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
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
        onClick={handleShow}
      >
        {/* Media */}
        {mediaData && (
          mediaType === "video/link" ? (
            <iframe
              width="100%"
              height="200px"
              src={getYouTubeEmbedUrl(mediaData)}
              style={{ borderRadius: "12px" }}
              allowFullScreen
              title="video"
            />
          ) : mediaType?.startsWith("video/") ? (
            <video
              src={mediaData}
              controls
              style={{ width: "100%", maxHeight: "200px", borderRadius: "12px" }}
            />
          ) : (
            <img
              src={mediaData}
              alt="post"
              style={{ width: "100%", maxHeight: "200px", borderRadius: "12px", objectFit: "cover" }}
            />
          )
        )}

        {/* Text */}
        <h4 className="mt-3">{text}</h4>

        {/* Tags */}
        {tags?.length > 0 && tags.map(t => (
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

        {/* Buttons */}
        <div className="mt-3">
          <button className="btn btn-secondary me-2" onClick={handleSave} disabled={saved}>
            {saved ? "Saved" : "Save"}
          </button>
          <button className="btn btn-info" onClick={handleShare}>Share</button>
        </div>

        <small className="text-muted">
          Posted by {username} on {dateText}
        </small>
      </div>

      <Modal show={show} onHide={handleClose} size="xl" style={{ border: "5px solid black" }}>
        <ButtonGroup>
          {isOwner && (
            <Button
              style={{ width: "4%", marginTop: "1%", marginLeft: "70%", marginRight: "0"}}
              onClick={() => navigate(`/edit-post/${id}`, { state: { post } })}
            >
              Edit
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={handleClose}
            style={{ width: "4%", marginTop: "1%", marginLeft: "1%", marginRight: "2%" }}
          >
            X
          </Button>
        </ButtonGroup>

        <Modal.Body>
          <FeedPost title={text} mediaDt={mediaData} mediaTp={mediaType} usName={username} likeCount={0} capT={cap} />
        </Modal.Body>
      </Modal>
    </>
  );
}