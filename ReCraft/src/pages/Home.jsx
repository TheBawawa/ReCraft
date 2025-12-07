import React, { useState } from "react";
import PostTemplate from "../components/PostTemplate";
import { useFirebase } from "../components/context/FirebaseContext";
import Navbar from "../components/NavBar";



export default function Home() {
  const { allPosts } = useFirebase();
  const [searchText, setSearchText] = useState("");

  const filtered = allPosts.filter((post) => {
    if (!searchText) return true;

    const txt = searchText.toLowerCase();
    const tagMatch = post.tags?.some((t) =>
      t.toLowerCase().includes(txt.replace("#", ""))
    );

    return (
      post.text?.toLowerCase().includes(txt) ||
      tagMatch
    );
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #89d957 0%, #1b9aaa 100%)",
        paddingTop: "80px",
        paddingBottom: "40px",
      }}
    >
      <Navbar onSearch={setSearchText} />

      <div className="center-content">
        {filtered.length === 0 ? (
          <p style={{ textAlign: "center", color: "#fff", marginTop: "30px" }}>
            No posts found.
          </p>
        ) : (
          filtered
            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
            .map((post) =>
            <PostTemplate key={post.id} post={post} />
            
            )
        )}
      </div>
    </div>
  );
}