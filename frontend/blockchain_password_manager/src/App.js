import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Vault from "./pages/Vault";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/vault">Vault</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vault" element={<Vault />} />
      </Routes>
    </Router>
  );
}

export default App;