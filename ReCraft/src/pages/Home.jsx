import React from "react";
import { useNavigate } from "react-router-dom";
import PostTemplate from "../components/PostTemplate";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="center-content">
      <h1 style={{ color: "var(--blue-gray)" }}>ReCraft</h1>
      <p style={{ color: "var(--coral)" }}>Team 2</p>
      <p style={{ color: "var(--blue-gray)" }}>
        Ana Paredes — Diya Brown — Rui Wang — Jessica Williamson
      </p>

      <button className="circle-btn" onClick={() => navigate("/login")}>
        TEMPORAL ANA
      </button>

      <PostTemplate />
    </div>
  );
}

export default Home;