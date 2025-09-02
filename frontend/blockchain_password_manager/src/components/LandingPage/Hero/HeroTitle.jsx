import React from "react";

function HeroTitle() {
  return (
    <h1
      style={{ lineHeight: "1.2" }}
      className="text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-10 max-w-4xl"
    >
      <span className="drop-shadow-[0_0_20px_rgba(100,100,100,100.6)]">
        Decentralized Password Manager
      </span>
      <br />
      <span className="drop-shadow-[0_0_20px_rgba(168,85,247,0.6)] bg-gradient-to-r from-primary to-accent 
                       text-transparent bg-clip-text">
        on Solana Blockchain
      </span>
    </h1>
  );
}

export default HeroTitle;