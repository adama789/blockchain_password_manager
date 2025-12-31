import Layout from "./Layout";
import VaultContainer from "../components/Vault/VaultContainer";
import { useWallet } from "../blockchain/walletContext";

/**
 * VaultPage Component
 * * This is the main route component for the '/vault' path.
 */
function VaultPage() {
  /** * Destructures the wallet address from the custom context hook.
   */
  const { walletAddress } = useWallet();

  return (
    /**
     * The Layout provides the Sidebar, Topbar, and responsive padding.
     * Everything inside <Layout> is injected into the 'children' prop of Layout.js.
     */
    <Layout walletAddress={walletAddress}>
      {/* VaultContainer is the "Controller" that 
          handles the heavy lifting: fetching from Solana, decryption, 
          and managing the list of entries.
      */}
      <VaultContainer />
    </Layout>
  );
}

export default VaultPage;