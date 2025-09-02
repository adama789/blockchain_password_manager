import React from "react";

function ButtonSecondary({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-8 py-3 rounded-full border border-primary text-primary 
                 bg-dark/50 hover:bg-primary/10 hover:text-white
                 hover:scale-105 transition-transform duration-200 font-semibold"
    >
      {children}
    </button>
  );
}

export default ButtonSecondary;