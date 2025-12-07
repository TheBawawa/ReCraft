import { createContext, useContext, useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, getDocs, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";

const FirebaseContext = createContext();
export const useFirebase = () => useContext(FirebaseContext);

// Helper function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export default function FirebaseProvider({ children }) {
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    const postsRef = collection(db, "posts");
    try {
      const unsub = onSnapshot(postsRef, (snapshot) => {
        const arr = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAllPosts(arr);
      });
      return () => unsub();
    } catch (err) {
      console.error("FirebaseProvider error:", err);
      setAllPosts([]);
    }
  }, []);

  const createPost = async ({ imageFile, videoLink, text, cap, tags }) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("You must be logged in to create a post!");
      return;
    }

    let mediaData = null;
    let mediaType = null;
    
    // Handle image file upload (convert to base64)
    if (imageFile) {
      // Check file size (limit to 800KB to stay under Firestore's 1MB limit)
      const maxSize = 800 * 1024; // 800KB in bytes
      if (imageFile.size > maxSize) {
        alert("File is too large! Please choose an image smaller than 800KB.");
        throw new Error("File size exceeds limit");
      }

      // Convert file to base64
      mediaData = await fileToBase64(imageFile);
      mediaType = imageFile.type; // e.g., "image/jpeg", "image/png"
    }
    // Handle video link
    else if (videoLink) {
      mediaData = videoLink;
      mediaType = "video/link"; // Custom type to indicate it's a URL
    }

    // Add post to Firestore - Firestore will auto-generate the document ID
    const docRef = await addDoc(collection(db, "posts"), {
      userId: currentUser.uid,  // Current user's ID
      mediaData,                // base64 image or video URL
      mediaType,                // MIME type or "video/link"
      text,
      cap,
      tags,
      createdAt: serverTimestamp(),
    });

    console.log("Post created with ID:", docRef.id); // The auto-generated post ID
  };

  const getUserPosts = async (userId) => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  return (
    <FirebaseContext.Provider value={{ allPosts, createPost, getUserPosts }}>
      {children}
    </FirebaseContext.Provider>
  );
}
