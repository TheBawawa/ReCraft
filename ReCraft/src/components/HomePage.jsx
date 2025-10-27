import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <h1>ReCraft</h1>
      <p>Team 2</p>
      <p className="read-the-docs">
        Ana Paredes — Diya Brown — Rui Wang — Jessica Williamson
      </p>

      {/* Temporal buttons to visualize each work */}
      <button className="circle-btn" onClick={() => navigate("/login")}>
        TEMPORAL ANA
      </button>
    </div>
  );
}

export default HomePage;
