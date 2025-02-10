import React from "react";
import "./Button.css"; // Import styles

function Button({ text, onClick, color = "blue" }) {
  return (
    <button
      className={`button ${color}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;
