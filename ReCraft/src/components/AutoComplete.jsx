import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const Autocomplete = ({ suggestions, onSearch }) => {
  const [inputValue, setInputValue] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showList, setShowList] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (onSearch) {
      onSearch(value);
    }

    const matches =
      value.length > 0
        ? suggestions.filter((item) =>
            item.toLowerCase().includes(value.toLowerCase())
          )
        : [];

    setFiltered(matches);
    setShowList(matches.length > 0);
  };

  const handleSelect = (value) => {
    setInputValue(value);
    setShowList(false);

    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Search by text or tag..."
        style={{
          width: "100%",
          padding: "6px 10px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />

      {showList && filtered.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "36px",
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
            <li
              key={item}
              onClick={() => handleSelect(item)}
              style={{ padding: "8px", cursor: "pointer" }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;