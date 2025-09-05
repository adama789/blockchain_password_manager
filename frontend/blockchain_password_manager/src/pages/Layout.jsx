import { useWallet } from "../blockchain/walletContext";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Loading from "../components/Loading";

export default function Layout({ children }) {
  const { walletAddress, loading } = useWallet();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark text-white">
        <Loading message="Connecting to wallet..." />
      </div>
    );
  }

  if (!walletAddress) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-dark via-dark/90 to-light text-white">
      <aside className="w-64 hidden lg:block">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col">
        <Topbar walletAddress={walletAddress} />

        <main className="flex-1 pt-24 px-6 lg:px-12 xl:px-20">
          {children}
        </main>
      </div>
    </div>
  );
}
