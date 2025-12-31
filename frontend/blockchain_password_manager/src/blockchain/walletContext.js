/**
 * React Context for managing Solana Wallet state and Vault derivation.
 * Provides a global state for the wallet address, PDA, and connection status.
 */
import { createContext, useState, useEffect, useContext } from "react";
import { getVaultPda, vaultExists } from "../blockchain/vault";

const WalletContext = createContext();

/**
 * Higher-order component that wraps the application to provide wallet access.
 */
export function WalletProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const [vaultPda, setVaultPda] = useState(null);
  const [vaultBump, setVaultBump] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Manually triggers wallet connection popup.
   */
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

  /**
   * Helper function to update state when a wallet is connected.
   * Also derives the Vault PDA and Bump seed for the current user.
   * @param {PublicKey} pubKey - The connected Solana public key.
   */
  const handleConnect = (pubKey) => {
    if (!pubKey) return;
    setWalletAddress(pubKey.toString());
    const [vault, bump] = getVaultPda(pubKey);
    setVaultPda(vault);
    setVaultBump(bump);
  };

  /**
   * Auto-connect logic on mount.
   * Attempts to silently reconnect to the wallet if the user has trusted the app before.
   */
  useEffect(() => {
    const init = async () => {
      if (window.solana?.isPhantom) {
        try {
          // 'onlyIfTrusted' allows connecting without a popup if previously approved
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
      // Brief delay to ensure state consistency before hiding loading spinner
      setTimeout(() => {
        setLoading(false);
      }, 400);
    };

    init();

    // Event listener for wallet account changes or manual connections
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

/**
 * Custom hook to easily access wallet data in any functional component.
 */
export const useWallet = () => useContext(WalletContext);