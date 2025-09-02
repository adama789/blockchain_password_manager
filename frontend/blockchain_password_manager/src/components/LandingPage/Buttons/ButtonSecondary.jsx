import React from "react";

function ButtonSecondary({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-8 py-4 text-sm rounded-full 
                 bg-primary/10 border border-primary/30 text-primary 
                 backdrop-blur-sm font-semibold
                 hover:bg-primary/20 hover:scale-105 transition-transform duration-200"
    >
      {children}
    </button>
  );
}

export default ButtonSecondary;
