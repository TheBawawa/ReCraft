import React from "react";
import PostTemplate from "../components/PostTemplate";
import { useFirebase } from "../components/context/FirebaseContext";

function Home() {
  const { allPosts } = useFirebase();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #89d957 0%, #1b9aaa 100%)", padding: "40px 0" }}>
      <div className="center-content">
        {allPosts.length === 0 ? (
          <p style={{ textAlign: "center", color: "#fff", fontSize: "1.2rem" }}>No posts yet. App is running!</p>
        ) : (
          allPosts
            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
            .map((post) => <PostTemplate key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}

export default Home;
