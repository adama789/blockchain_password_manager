import React from "react";

function HeroTitle() {
  return (
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-snug mb-10 max-w-4xl">
      Decentralized Password Manager
      <br />
      <span className="bg-gradient-to-r from-primary via-secondary to-accent text-transparent bg-clip-text">
        on Solana Blockchain
      </span>
    </h1>
  );
}

export default HeroTitle;