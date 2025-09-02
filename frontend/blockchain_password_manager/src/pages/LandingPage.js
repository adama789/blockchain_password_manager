import React, { useState } from "react";
import { connectWallet } from "../blockchain/provider";
import { Navigate } from "react-router-dom";
import ParticlesBackground from "../components/ParticlesBackground";
import HeroSection from "../components/LandingPage/Hero/HeroSection";

function LandingPage() {
  const [walletAddress, setWalletAddress] = useState(null);

  const handleConnect = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
    } catch (error) {
      console.error("Wallet connect error:", error);
    }
  };

  if (walletAddress) {
    return <Navigate to="/vault" />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden text-white font-sans bg-[#060010]">
      <ParticlesBackground />
      <HeroSection onConnect={handleConnect} />
    </div>
  );
}

export default LandingPage;