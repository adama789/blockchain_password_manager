import { useState } from "react";
import { useWallet } from "../blockchain/walletContext";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Loading from "../components/Loading";

export default function Layout({ children }) {
  const { walletAddress, loading } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      {/* Sidebar desktop */}
      <aside className="w-64 hidden lg:block sticky top-0 h-screen">
        <Sidebar />
      </aside>

      {/* Sidebar mobile */}
      <div className="lg:hidden">
        {/* Sidebar with animation */}
        <div
          className={`fixed top-0 left-0 z-50 h-full w-64 bg-dark transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </div>

        {/* Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Topbar
          walletAddress={walletAddress}
          onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <main className="flex-1 pt-24 px-6 lg:px-12 xl:px-20">
          {children}
        </main>
      </div>
    </div>
  );
}
