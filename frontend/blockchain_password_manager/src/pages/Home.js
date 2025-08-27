import React, { useState } from "react";
import WalletConnect from "../components/WalletConnect";
import { connectWallet } from "../blockchain/provider";
import { Navigate } from "react-router-dom";

function Home() {
  const [walletAddress, setWalletAddress] = useState(null);

  const handleConnect = async () => {
    const address = await connectWallet();
    setWalletAddress(address);
  };

  if (walletAddress) {
    return <Navigate to="/vault" replace />;
  }

  return (
    <div>
      <h1>Welcome to Password Manager</h1>
      <WalletConnect onConnect={handleConnect} walletAddress={walletAddress} />
    </div>
  );
}

export default Home;
