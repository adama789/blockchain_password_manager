import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Vault from "./pages/Vault";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/vault" element={<Vault />} />
      </Routes>
    </Router>
  );
}

export default App;