import React from "react";

function ButtonPrimary({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-accent 
                 text-white font-semibold shadow-glow
                 hover:scale-105 hover:opacity-90 transition-transform duration-200"
    >
      {children}
    </button>
  );
}

export default ButtonPrimary;