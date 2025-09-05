import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function Layout({ children, walletAddress }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-dark via-dark/90 to-light text-white">
      {/* Sidebar desktop */}
      <aside className="hidden lg:block w-64">
        <Sidebar />
      </aside>

      {/* Overlay mobile */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />
      {/* Sidebar mobile */}
      <aside
        className={`fixed top-0 left-0 w-64 h-screen bg-light border-r border-white/10 shadow-xl z-50 transform transition-transform duration-300 lg:hidden
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Topbar
          walletAddress={walletAddress}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 pt-24 px-6 lg:px-12 xl:px-20">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
