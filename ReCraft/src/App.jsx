import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import "./App.css";

function App() {
  return (
    <Router>
      <nav style={{ padding: "10px", borderBottom: "2px solid black" }}>
        <Link to="/" style={{ marginRight: "15px" }}>Home</Link>
        <Link to="/about" style={{ marginRight: "15px" }}>About</Link>
        <Link to="/login" style={{ marginRight: "15px" }}>Login</Link>
        <Link to="/signup">Sign Up</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </Router>
  );
}

export default App;