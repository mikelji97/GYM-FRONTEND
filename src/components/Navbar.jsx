import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `px-3 py-2 rounded-lg transition ${
      isActive(path)
        ? 'bg-red-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <nav className="bg-gray-900 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-extrabold">
              GYM <span className="text-red-500">MIKE</span>
            </span>
          </Link>

          <div className="flex items-center space-x-2">
            <Link to="/dashboard" className={navLinkClass('/dashboard')}>
              Dashboard
            </Link>
            <Link to="/classes" className={navLinkClass('/classes')}>
              Clases
            </Link>
            <Link to="/sessions" className={navLinkClass('/sessions')}>
              Sesiones
            </Link>
            <Link to="/bookings" className={navLinkClass('/bookings')}>
              Mis Reservas
            </Link>

            {isAdmin() && (
              <Link to="/users" className={navLinkClass('/users')}>
                Usuarios
              </Link>
            )}

            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-700">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition"
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
