import Layout from "./Layout";
import VaultContainer from "../components/Vault/VaultContainer";
import { useWallet } from "../blockchain/walletContext";

function VaultPage() {
  const { walletAddress } = useWallet();

  return (
    <Layout walletAddress={walletAddress}>
      <VaultContainer />
    </Layout>
  );
}

export default VaultPage;
