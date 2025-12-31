import React, { useState } from "react";
import { connectWallet } from "../blockchain/provider";
import { Navigate } from "react-router-dom";
import ParticlesBackground from "../components/ParticlesBackground";
import HeroSection from "../components/LandingPage/Hero/HeroSection";
import { handleError } from "../utils/vaultErrors";
import toast from "react-hot-toast";

/**
 * LandingPage Component
 * * The entry point of the application for unauthenticated users.
 * Its primary responsibilities are:
 * 1. Presenting the value proposition via the HeroSection.
 * 2. Handling the initial handshake with the Solana wallet provider.
 * 3. Redirecting the user to the /vault route upon successful connection.
 */
function LandingPage() {
  /** * Local state to store the connected wallet's public key.
   * If this is set, the component triggers a redirect.
   */
  const [walletAddress, setWalletAddress] = useState(null);

  /**
   * Invokes the Solana wallet connection logic.
   * Uses the connectWallet utility to request account access from the provider (e.g., Phantom).
   */
  const handleConnect = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
      
      // Clear any pending toasts and show success
      toast.dismiss();
      toast.success("Wallet connected!");
    } catch (error) {
      // Specialized error handling for blockchain-specific issues
      handleError(error, "Wallet connection error");
    }
  };

  /**
   * Redirect to the main dashboard if the wallet is already connected.
   * This effectively acts as a protected route logic for the landing page.
   */
  if (walletAddress) {
    return <Navigate to="/vault" />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden text-white font-sans bg-dark">
      {/* Visual Layer: Animated background particles for a high-tech feel */}
      <ParticlesBackground />
      
      {/* Functional Layer: The main Call to Action section */}
      <HeroSection onConnect={handleConnect} />
    </div>
  );
}

export default LandingPage;