import React from "react";

function PostTemplate({ post }) {
  if (!post) return null;

  const { mediaURL, text, tags, userId, createdAt } = post;

  return (
    <div id="MainPost-Box" className="post-box mt-4">
      {/* Media */}
      {mediaURL && (
        <div>
          {mediaURL.endsWith(".mp4") || mediaURL.endsWith(".mov") ? (
            <video
              id="MM-Img"
              src={mediaURL}
              controls
              style={{ maxWidth: "90%" }}
            />
          ) : (
            <img id="MM-Img" src={mediaURL} alt="Post Media" />
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
