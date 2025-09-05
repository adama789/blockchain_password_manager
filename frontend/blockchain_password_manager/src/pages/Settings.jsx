import { useWallet } from "../blockchain/walletContext";
import { Navigate } from "react-router-dom";
import Layout from "./Layout";

function Settings() {
    const { walletAddress } = useWallet();

    if (!walletAddress) return <Navigate to="/" replace />;

    return (
        <Layout walletAddress={walletAddress}>
        <h1>Settings Page</h1>
        </Layout>
    );
}

export default Settings;