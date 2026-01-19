import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="text-xl font-bold">
            GYM App
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/classes" className="hover:text-blue-200">
              Clases
            </Link>
            <Link to="/sessions" className="hover:text-blue-200">
              Sesiones
            </Link>
            <Link to="/bookings" className="hover:text-blue-200">
              Mis Reservas
            </Link>

            {isAdmin() && (
              <Link to="/users" className="hover:text-blue-200">
                Usuarios
              </Link>
            )}

            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-blue-400">
              <span className="text-sm">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
