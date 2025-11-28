import React from "react";
import { Menu } from "lucide-react";

function Topbar({ walletAddress, onMenuClick }) {
  return (
    <header 
      className="fixed top-0 left-0 lg:left-64 right-0 h-16 flex items-center justify-between px-6 
                 bg-light/95 backdrop-blur-sm border-b border-primary/30 z-40 shadow-xl"
    >
      <button
        className="lg:hidden p-2 rounded-md hover:bg-primary/20 transition"
        onClick={onMenuClick}
      >
        <Menu className="w-6 h-6 text-primary" />
      </button>

      {walletAddress ? (
        <div className="flex items-center text-white ml-auto">
          Connected to{" "}
          <span className="ml-2 font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
        </div>
      ) : (
        <div className="ml-auto text-primary/90 font-medium">Not connected</div>
      )}
    </header>
  );
}

export default Topbar;