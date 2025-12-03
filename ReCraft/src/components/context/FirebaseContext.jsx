import { createContext, useContext, useEffect, useState } from "react";
import { db, storage, auth } from "../../firebase";
import { collection, addDoc, getDocs, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const FirebaseContext = createContext();
export const useFirebase = () => useContext(FirebaseContext);

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

  const createPost = async ({ mediaFile, text, tags }) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("You must be logged in to create a post!");
      return;
    }

    let mediaURL = null;
    if (mediaFile) {
      const mediaRef = ref(storage, `posts/${Date.now()}-${mediaFile.name}`);
      await uploadBytes(mediaRef, mediaFile);
      mediaURL = await getDownloadURL(mediaRef);
    }

    await addDoc(collection(db, "posts"), {
      userId: currentUser.uid,
      mediaURL,
      text,
      tags,
      createdAt: serverTimestamp(),
    });
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
