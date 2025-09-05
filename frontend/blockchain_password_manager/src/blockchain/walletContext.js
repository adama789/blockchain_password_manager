import { createContext, useState, useEffect, useContext } from "react";
import { getVaultPda, vaultExists } from "../blockchain/vault";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const [vaultPda, setVaultPda] = useState(null);
  const [vaultBump, setVaultBump] = useState(null);
  const [loading, setLoading] = useState(true);

  const connectWallet = async () => {
    if (!window.solana) return;
    try {
      const resp = await window.solana.connect();
      const pubKey = resp.publicKey;
      handleConnect(pubKey);
    } catch (err) {
      console.error("User rejected connection", err);
    }
  };

  const handleConnect = (pubKey) => {
    if (!pubKey) return;
    setWalletAddress(pubKey.toString());
    const [vault, bump] = getVaultPda(pubKey);
    setVaultPda(vault);
    setVaultBump(bump);
  };

  useEffect(() => {
    const init = async () => {
      if (window.solana?.isPhantom) {
        try {
          const resp = await window.solana.connect({ onlyIfTrusted: true });
          const pubKey = resp?.publicKey || window.solana.publicKey;
          if (pubKey) {
            handleConnect(pubKey);
            await vaultExists(pubKey);
          }
        } catch {
          console.log("Wallet not connected yet");
        }
      }
      setTimeout(() => {
        setLoading(false);
      }, 400);
    };

    init();

    window.solana?.on("connect", (pubKey) => handleConnect(pubKey));
    return () => window.solana?.removeListener("connect", handleConnect);
  }, []);

  return (
    <WalletContext.Provider
      value={{ walletAddress, vaultPda, vaultBump, loading, connectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
