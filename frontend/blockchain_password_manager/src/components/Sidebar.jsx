import React from "react";
import { Home, Lock, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Home", path: "/", icon: <Home size={20} /> },
  { name: "Vault", path: "/vault", icon: <Lock size={20} /> },
  { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#060010] border-r border-white/10 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-white/10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#14F195] via-[#00FFA3] to-[#9945FF] text-transparent bg-clip-text">
          SolanaVault
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition
                ${
                  isActive
                    ? "bg-gradient-to-r from-[#14F195] via-[#00FFA3] to-[#9945FF] text-black"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 text-xs text-gray-400">
        © {new Date().getFullYear()} SolanaVault
      </div>
    </aside>
  );
}

export default Sidebar;
