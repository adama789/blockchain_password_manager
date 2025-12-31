import { useState } from "react";
import { useWallet } from "../blockchain/walletContext";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Loading from "../components/Loading";

/**
 * Layout Component
 * * Serves as the primary structural wrapper 
 * for all protected routes. It enforces the following logic:
 * 1. Authentication Guard: Redirects to '/' if no wallet is connected.
 * 2. Loading State: Displays a global spinner while the wallet provider initializes.
 * 3. Responsive Navigation: Manages a sticky sidebar for desktop and an animated 
 * drawer with an overlay for mobile devices.
 */
export default function Layout({ children }) {
  // Access global wallet state from context
  const { walletAddress, loading } = useWallet();
  // Local state for mobile navigation drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * GLOBAL LOADING STATE
   * Prevents UI flickering or premature redirection while the wallet extension
   * (e.g., Phantom) is still establishing a connection.
   */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark text-white">
        <Loading message="Connecting to wallet..." />
      </div>
    );
  }

  /**
   * AUTHENTICATION GUARD
   * If the user is not connected, they are not allowed to see the dashboard.
   * 'replace' prevents the user from going back to a locked state in history.
   */
  if (!walletAddress) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-dark via-dark/90 to-light text-white">
      
      {/* SIDEBAR - DESKTOP
          Hidden on small screens, fixed width on lg screens. 
          'sticky' ensures it stays visible during vertical scroll.
      */}
      <aside className="w-64 hidden lg:block sticky top-0 h-screen">
        <Sidebar />
      </aside>

      {/* NAVIGATION - MOBILE
          Uses a Slide-in animation triggered by the 'mobileMenuOpen' state.
      */}
      <div className="lg:hidden">
        {/* Animated Drawer */}
        <div
          className={`fixed top-0 left-0 z-50 h-full w-64 bg-dark transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </div>

        {/* Backdrop Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        )}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar
          walletAddress={walletAddress}
          onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Page Content */}
        <main className="flex-1 pt-24 px-6 lg:px-12 xl:px-20">
          {children}
        </main>
      </div>
    </div>
  );
}