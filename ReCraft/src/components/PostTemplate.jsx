import React, { useEffect, useState } from "react";

const STORAGE_KEY = "savedPosts";

// YouTube
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

  const { id, mediaData, mediaType, text, tags, userId, createdAt } = post;

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const list = JSON.parse(raw);
      setSaved(list.some((p) => p.id === id));
    } catch {
    }
  }, [id]);

  // Save / Saved
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
    <div
      id="MainPost-Box"
      className="post-box mt-4"
      style={{
        backgroundColor: "#F8FFE5",
        width: "75%",
        marginLeft: "auto",
        marginRight: "auto",
        border: "5px solid black",
        marginBottom: "40px",
        borderRadius: "16px",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {mediaData && (
        <div style={{ padding: "20px" }}>
          {mediaType === "video/link" ? (
            (() => {
              const embedUrl = getYouTubeEmbedUrl(mediaData);
              if (embedUrl) {
                return (
                  <iframe
                    id="MM-Img"
                    width="100%"
                    height="400"
                    src={embedUrl}
                    title="Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ maxWidth: "900px", borderRadius: "8px" }}
                  />
                );
              }
              return (
                <a
                  href={mediaData}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Watch Video
                </a>
              );
            })()
          ) : mediaType?.startsWith("video/") ? (
            <video
              id="MM-Img"
              src={mediaData}
              controls
              style={{ maxWidth: "900px", width: "100%", borderRadius: "8px" }}
            />
          ) : (
            <img
              id="MM-Img"
              src={mediaData}
              alt="Post Media"
              style={{ maxWidth: "900px", width: "100%", borderRadius: "8px" }}
            />
          )}
        </div>
      )}

      {text && (
        <p className="post-name" style={{ fontSize: "1.1rem", padding: "0 20px" }}>
          {text}
        </p>
      )}

      {tags && tags.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                backgroundColor: "#1b9aaa",
                color: "#fff",
                padding: "4px 10px",
                borderRadius: "12px",
                marginRight: "8px",
                fontSize: "0.9rem",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: "16px",
          marginBottom: "16px",
          fontSize: "0.85rem",
          color: "#555",
        }}
      >
        <div>
          Posted by: {userId || "unknown user"}
          {dateText ? ` on ${dateText}` : ""}
        </div>

        <div style={{ marginTop: "10px" }}>
          <button
            className="btn btn-sm btn-outline-dark me-2"
            onClick={handleToggleSave}
          >
            {saved ? "Saved" : "Save"}
          </button>
          <button className="btn btn-sm btn-outline-secondary" onClick={handleShare}>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}