import React from "react";
import { useNavigate } from "react-router-dom";
//*import PostTemplate from "../components/PostTemplate"
import "../App.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage" style={styles.page}>
      <h1>ReCraft</h1>
      <p>Team 2</p>
      <p className="read-the-docs">
        Ana Paredes — Diya Brown — Rui Wang — Jessica Williamson
      </p>

      {/* Temporal buttons */}
      <button className="circle-btn" onClick={() => navigate("/login")}>
        TEMPORAL ANA
      </button>

      {/* Your post layout */}
    </div>
  );
}

const styles = {
  homepage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "40px",
  },
};

export default HomePage;