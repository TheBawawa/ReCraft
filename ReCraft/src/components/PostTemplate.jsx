import React from "react";

// Helper function to convert YouTube URLs to embed format
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  
  // Handle youtube.com/watch?v=... format
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }
  
  // Handle youtu.be/... format
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }
  
  // If already an embed URL, return as is
  if (url.includes('/embed/')) {
    return url;
  }
  
  return null;
};

function PostTemplate({ post }) {
  if (!post) return null;

  const { mediaData, mediaType, text, tags, userId, createdAt } = post;

  return (
    <div id="MainPost-Box" className="post-box mt-4">
      {/* Media */}
      {mediaData && (
        <div>
          {mediaType === "video/link" ? (
            // Handle video links (YouTube, etc.)
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
                    style={{ maxWidth: "90%", borderRadius: "8px" }}
                  />
                );
              } else {
                // Fallback for non-YouTube links
                return (
                  <a href={mediaData} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    Watch Video
                  </a>
                );
              }
            })()
          ) : mediaType?.startsWith("video/") ? (
            // Handle base64 video files
            <video
              id="MM-Img"
              src={mediaData}
              controls
              style={{ maxWidth: "90%" }}
            />
          ) : (
            // Handle images (base64)
            <img id="MM-Img" src={mediaData} alt="Post Media" />
          )}
        </div>
      )}

      {/* Post Text */}
      {text && <p className="post-name">{text}</p>}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                backgroundColor: "#1b9aaa",
                color: "#fff",
                padding: "4px 8px",
                borderRadius: "5px",
                marginRight: "5px",
                fontSize: "0.85rem",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Optional: User Info */}
      <div style={{ marginTop: "8px", fontSize: "0.75rem", color: "#555" }}>
        Posted by: {userId}{" "}
        {createdAt?.toDate
          ? `on ${createdAt.toDate().toLocaleDateString()}`
          : ""}
      </div>
    </div>
  );
}

export default PostTemplate;
