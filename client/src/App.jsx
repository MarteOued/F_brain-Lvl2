import { Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Depenses from './pages/Depenses';
import Tags from './pages/Tags';
import Analytics from './pages/Analytics';

function App() {
  return (
    <div className="mflex flex-col min-h-screen">
      {/* Navbar améliorée */}
      <nav className="flex-grow py-8">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center">
            {/* Logo SVG ici */}
            BudgetZen
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Profil / Notifications */}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/depenses" element={<Depenses />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

const NavLink = ({ to, children }) => (
  <Link to={to} className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
    {children}
  </Link>
);

export default App;
