import React, { useState } from "react";
import { connectWallet } from "../blockchain/provider";
import { Navigate, useNavigate } from "react-router-dom";
import Particles from "../components/ReactBits/Particles/Particles";

function LandingPage() {
  const [walletAddress, setWalletAddress] = useState(null);
  const navigate = useNavigate();

  const handleConnect = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
    } catch (error) {
      console.error("Wallet connect error:", error);
    }
  };

  if (walletAddress) {
    return <Navigate to="/vault" replace />;
  }

  return (
    <div
      className="relative w-full h-screen overflow-hidden text-white font-sans"
    >
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#14F195", "#9945FF", "#00FFA3"]}
          particleCount={120}
          particleSpread={10}
          speed={0.15}
          particleBaseSize={80}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <main className="flex-1 flex flex-col justify-center items-center text-center px-4">
          <span className="px-4 py-1 text-sm rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-sm">
            Solana Powered Security
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-snug mb-10 max-w-4xl">
            Decentralized Password Manager <br />
            <span className="bg-gradient-to-r from-[#14F195] via-[#00FFA3] to-[#9945FF] text-transparent bg-clip-text">
              on Solana Blockchain
            </span>
          </h1>

          <p className="text-gray-300 max-w-xl mb-12 text-lg">
            Store and encrypt your passwords securely with the speed and low fees of Solana. 
            Take full control of your data – no central servers, no compromises.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleConnect}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black font-semibold shadow-lg hover:scale-105 hover:opacity-90 transition-transform duration-200"
            >
              Connect Wallet
            </button>
            <button
              onClick={() => navigate("/about")}
              className="px-8 py-3 rounded-full bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/20 hover:scale-105 transition-transform duration-200"
            >
              Learn More
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default LandingPage;
