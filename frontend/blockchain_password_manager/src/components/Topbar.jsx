import React, { useState } from "react";
import { Menu, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";

function Topbar({ walletAddress, onMenuClick }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!walletAddress) return;

    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast.dismiss()
    toast.success("Wallet address copied to clipboard!");

    setTimeout(() => {
      setCopied(false);
    }, 4000);
  };

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
        <div className="flex items-center text-white ml-auto gap-1">
          Connected to{" "}
          
          <div className="flex items-center group relative">
            <span 
              className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent cursor-default"
              title={walletAddress}
            >
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
            
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
        <div className="ml-auto text-primary/50 font-medium">Not connected</div>
      )}
    </header>
  );
}

export default Topbar;