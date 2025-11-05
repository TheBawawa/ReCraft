function PostTemplate() {
  return (
    <div
      className="p-4 text-center shadow-sm"
      style={{
        width: "400px",
        border: "4px solid black",
        background: "var(--cream)",
        borderRadius: "12px",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "250px",
          background: "black",
          borderRadius: "8px",
        }}
      ></div>
      <p className="mt-3 fw-bold text-dark">POSTNAME</p>
    </div>
  );
}

export default PostTemplate;