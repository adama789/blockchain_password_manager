import React from "react";
import HeroBadge from "./HeroBadge";
import HeroTitle from "./HeroTitle";
import HeroDescription from "./HeroDescription";
import HeroButtons from "./HeroButtons";

function HeroSection({ onConnect }) {
  return (
    <div className="relative z-10 flex flex-col h-full">
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4">
        <HeroBadge />
        <HeroTitle />
        <HeroDescription />
        <HeroButtons onConnect={onConnect} />
      </main>
    </div>
  );
}

export default HeroSection;