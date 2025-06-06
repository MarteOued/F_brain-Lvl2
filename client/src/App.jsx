import { Outlet, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Outlet /> {/* Ici s'affichent les routes enfants */}
      </main>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default App;
