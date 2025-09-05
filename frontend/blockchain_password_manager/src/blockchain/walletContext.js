import { createContext, useState, useEffect, useContext } from "react";
import { getVaultPda, vaultExists } from "../blockchain/vault";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const [vaultPda, setVaultPda] = useState(null);
  const [vaultBump, setVaultBump] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkWallet = async () => {
      if (window.solana?.isPhantom) {
        try {
          const resp = await window.solana.connect({ onlyIfTrusted: true });
          setWalletAddress(resp.publicKey.toString());
          const [vault, bump] = getVaultPda(resp.publicKey);
          setVaultPda(vault);
          setVaultBump(bump);
          await vaultExists(vault);
        } catch {
          console.log("No wallet connected");
        }
      }
      setLoading(false);
    };
    checkWallet();
  }, []);

  return (
    <WalletContext.Provider value={{ walletAddress, vaultPda, vaultBump, loading }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
