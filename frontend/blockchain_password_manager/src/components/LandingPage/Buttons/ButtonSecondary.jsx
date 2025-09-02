import React from "react";

function ButtonSecondary({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-8 py-3 rounded-full border border-primary text-primary bg-white/5 
                 hover:bg-primary/10 hover:scale-105 transition font-semibold"
    >
      {children}
    </button>
  );
}

export default ButtonSecondary;
