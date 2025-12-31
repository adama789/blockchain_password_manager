import React, { useState } from "react";
import { Menu, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Topbar Component
 * * The main header unit of the application. It provides:
 * 1. A toggle button for the mobile sidebar (Menu).
 * 2. Visual confirmation of the connected Solana wallet address.
 * 3. Utility to copy the full wallet address to the clipboard.
 */
function Topbar({ walletAddress, onMenuClick }) {
  /** Local state to track the "Copied" status for visual feedback */
  const [copied, setCopied] = useState(false);

  /**
   * Handles the logic for copying the wallet address.
   * Uses the Clipboard API and triggers a toast notification.
   */
  const handleCopy = () => {
    if (!walletAddress) return;

    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast.dismiss();
    toast.success("Wallet address copied to clipboard!");

    // Reset the icon back to 'Copy' after a delay
    setTimeout(() => {
      setCopied(false);
    }, 4000);
  };

  return (
    <header 
      className="fixed top-0 left-0 lg:left-64 right-0 h-16 flex items-center justify-between px-6 
                 bg-light/95 backdrop-blur-sm border-b border-primary/30 z-40 shadow-xl"
    >
      {/* Mobile Menu Button (Visible only below lg breakpoint) */}
      <button
        className="lg:hidden p-2 rounded-md hover:bg-primary/20 transition"
        onClick={onMenuClick}
      >
        <Menu className="w-6 h-6 text-primary" />
      </button>

      {/* Wallet Connection Display */}
      {walletAddress ? (
        <div className="flex items-center text-white ml-auto gap-1">
          <span className="hidden sm:inline">Connected to</span>{" "}
          
          <div className="flex items-center group relative">
            {/* Truncated Address (e.g., ABCD...WXYZ) */}
            <span 
              className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent cursor-default"
              title={walletAddress}
            >
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
            
            {/* Copy Utility Button */}
            <button
              onClick={handleCopy}
              className="ml-2 p-1 rounded-md transition hover:bg-primary/20 shrink-0"
              title={copied ? "Copied!" : "Copy address"}
            >
            {copied ? (
              <Check className="w-4 h-4 text-accent animate-in zoom-in" />
            ) : (
              <Copy className="w-4 h-4 text-accent/70 hover:text-accent" />
            )}
            </button>
          </div>

        </div>
      ) : (
        /* Fallback when no wallet is detected */
        <div className="ml-auto text-primary/50 font-medium">Not connected</div>
      )}
    </header>
  );
}

export default Topbar;