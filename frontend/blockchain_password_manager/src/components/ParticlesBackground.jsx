import React from "react";
import Particles from "../components/ReactBits/Particles/Particles";

function ParticlesBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Particles
        className="w-full h-full"
        particleColors={["#a855f7", "#6366f1", "#ec4899"]}
        particleCount={120}
        particleSpread={10}
        speed={0.15}
        particleBaseSize={200}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
      />
    </div>
  );
}

export default ParticlesBackground;