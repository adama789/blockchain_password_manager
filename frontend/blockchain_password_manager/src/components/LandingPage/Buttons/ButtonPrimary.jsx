import React from "react";

function ButtonPrimary({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-8 py-3 rounded-full bg-primary text-white font-semibold 
                 hover:opacity-90 hover:scale-105 transition"
    >
      {children}
    </button>
  );
}

export default ButtonPrimary;
