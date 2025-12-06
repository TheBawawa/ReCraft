import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import About from "./pages/About";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ProfileUI from "./components/profile";
import Settings from "./components/Settings";
import PostCreation from "./components/PostCreation";
import FirebaseProvider from "./components/context/FirebaseContext";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <FirebaseProvider>
      <Navbar onSearch={setSearchTerm} />

      <Routes>
        <Route path="/" element={<Home searchTerm={searchTerm} />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/profile/:uid" element={<ProfileUI />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/create-post" element={<PostCreation />} />
      </Routes>
    </FirebaseProvider>
  );
}

export default App;