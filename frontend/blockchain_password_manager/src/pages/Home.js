import React, { useState } from "react";
import WalletConnect from "../components/WalletConnect";
import { connectWallet } from "../blockchain/provider";
import { Navigate } from "react-router-dom";
import Particles from '../components/ReactBits/Particles/Particles';

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
      <div style={{ width: '100%', height: '700px', position: 'relative', backgroundColor: '#060010' }}>
        <Particles
          particleColors={['#ffffffff', '#ffffffff']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      <WalletConnect onConnect={handleConnect} walletAddress={walletAddress} />
    </div>
  );
}

export default Home;
