import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const Autocomplete = ({ suggestions }) => {
  const [inputValue, setInputValue] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showList, setShowList] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const matches =
      value.length > 0
        ? suggestions.filter((item) =>
            item.toLowerCase().includes(value.toLowerCase())
          )
        : [];

    setFiltered(matches);
    setShowList(true);
  };

  const handleSelect = (value) => {
    setInputValue(value);
    setShowList(false);
  };

  return (
    <div style={{ width: "250px", position: "relative" }}>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Search..."
        style={{ width: "100%", padding: "8px" }}
      />

      {showList && filtered.length > 0 && (
        <ul
          style={{ position: "absolute", top: "40px",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #ccc",
            listStyle: "none",
            margin: 0,
            padding: 0,
            maxHeight: "150px",
            overflowY: "auto",
            zIndex: 100,
          }}
        >
          {filtered.map((item) => (
            <li key={item} onClick={() => handleSelect(item)} style={{padding: "8px", cursor: "pointer",}}> {item} </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;