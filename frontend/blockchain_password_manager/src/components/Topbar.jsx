import React from "react";
import { Menu } from "lucide-react";

function Topbar({ walletAddress, onMenuClick }) {
  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 flex items-center justify-between px-6 
                       bg-light border-b border-primary/30 z-40">
      <button
        className="lg:hidden p-2 rounded-md hover:bg-white/10 transition"
        onClick={onMenuClick}
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {walletAddress ? (
        <div className="flex items-center text-gray-400 ml-auto">
          Connected to{" "}
          <span className="ml-2 font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
        </div>
      ) : (
        <div className="ml-auto text-gray-500">Not connected</div>
      )}
    </header>
  );
}

export default Topbar;
