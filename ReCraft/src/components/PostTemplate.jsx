import React, { useState } from "react";
import { auth, db } from "../firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

//YouTube URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const watch = url.match(/[?&]v=([^&]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;

  const short = url.match(/youtu\.be\/([^?]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;

  return url.includes("/embed/") ? url : null;
};

export default function PostTemplate({ post }) {
  if (!post) return null;

  const { id, mediaData, mediaType, text, tags, userId, createdAt } = post;
  const [saved, setSaved] = useState(false);

  // SAVE POST
  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Please login first!");

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      savedPosts: arrayUnion(id),
    });

    setSaved(true);
    alert("Saved!");
  };

  // SHARE POST
  const handleShare = async () => {
    try {
      await navigator.share({
        title: "ReCraft Project",
        text: text,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div
      style={{
        width: "70%",
        margin: "30px auto",
        background: "white",
        borderRadius: "14px",
        padding: "20px",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.15)",
      }}
    >
      {/* Media */}
      {mediaData && (
        <>
          {mediaType === "video/link" ? (
            <iframe
              width="100%"
              height="350"
              src={getYouTubeEmbedUrl(mediaData)}
              style={{ borderRadius: "12px" }}
              allowFullScreen
            />
          ) : (
            <img
              src={mediaData}
              alt="post"
              style={{ width: "100%", borderRadius: "12px" }}
            />
          )}
        </>
      )}

      {/* text */}
      <h4 className="mt-3">{text}</h4>

      {/* tags */}
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

      {/* buttons */}
      <div className="mt-3">
        <button
          className="btn btn-secondary me-2"
          onClick={handleSave}
          disabled={saved}
        >
          {saved ? "Saved" : "Save"}
        </button>

        <button className="btn btn-info" onClick={handleShare}>
          Share
        </button>
      </div>

      <small className="text-muted">
        Posted by {userId} on{" "}
        {createdAt?.toDate ? createdAt.toDate().toLocaleDateString() : ""}
      </small>
    </div>
  );
}