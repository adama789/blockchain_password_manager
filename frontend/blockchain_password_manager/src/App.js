import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Vault from "./pages/Vault";
import Settings from "./pages/Settings"
import { WalletProvider } from "./blockchain/walletContext";

function App() {
  return (
    <WalletProvider>
      <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#170d27",
          color: "#fff",
          border: "1px solid rgba(168, 85, 247, 0.3)",
          borderRadius: "12px",
          boxShadow: "0 0 15px rgba(168, 85, 247, 0.25)",        
          padding: "14px 16px",
          fontSize: "16px",
          marginBottom: "30px"
        },
        success: {
          iconTheme: {
            primary: "#a855f7",
            secondary: "#fff",
          },
          style: {
            border: "1px solid rgba(168, 85, 247, 0.5)",
          }
        },
        error: {
          iconTheme: {
            primary: "#ec4899",
            secondary: "#fff",
          },
          style: {
            border: "1px solid rgba(236, 72, 153, 0.5)",
          }
        },
      }}
    />
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/vault" element={<Vault />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
    </WalletProvider>
  );
}

export default App;