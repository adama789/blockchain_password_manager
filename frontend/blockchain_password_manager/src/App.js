import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Vault from "./pages/Vault";
import Settings from "./pages/Settings"
import { WalletProvider } from "./blockchain/walletContext";

function App() {
  return (
    <WalletProvider>
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