function About() {
  return (
    <div className="about-container">
      <h1 style={{ color: "var(--blue-gray)" }}>About Our Team</h1>
      <p style={{ color: "var(--coral)" }}>
        We are Team 2 working on the ReCraft project.
      </p>

      <h3 style={{ color: "var(--aqua)" }}>Team Members:</h3>
      <ul style={{ listStyle: "none", padding: 0, color: "var(--blue-gray)" }}>
        <li>Diya Brown</li>
        <li>Jessica Williamson</li>
        <li>Ana Perez</li>
        <li>Rui Wang</li>
      </ul>
    </div>
  );
}

export default About;