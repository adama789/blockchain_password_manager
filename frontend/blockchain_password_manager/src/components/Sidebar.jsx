import React from "react";
import { Home, Lock, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import LogoImage from "./logo.png";

const navItems = [
  { name: "Home", path: "/", icon: <Home size={20} /> },
  { name: "Vault", path: "/vault", icon: <Lock size={20} /> },
  { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside 
      className="top-0 left-0 h-full w-64 bg-light/95 backdrop-blur-sm border-r border-primary/30 flex flex-col z-50 shadow-2xl"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-primary/30">
        <img 
          src={LogoImage} 
          alt="Solana Vault" 
          className="h-12 w-auto"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition duration-200 transform
                ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-[0_0_20px_rgba(199,94,255,0.4)] hover:scale-[1.01]"
                    : "text-white hover:text-primary hover:bg-primary/10"
                }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div 
        className="p-4 border-t border-primary/30 text-center text-primary/70 text-sm font-mono"
      >
        Adam Cedro 318097
      </div>
    </aside>
  );
}

export default Sidebar;