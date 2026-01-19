import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import api from '../services/api';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(`/users/${user.id}/stats`);
        setStats(response.data);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-white">
          Bienvenido, <span className="text-red-500">{user?.name}</span>
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Panel de {isAdmin() ? 'Administrador' : 'Usuario'}
        </p>
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando estadísticas...</p>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-300">Reservas Confirmadas</h3>
              <span className="text-green-400 text-2xl">✓</span>
            </div>
            <p className="text-5xl font-extrabold text-green-400 mt-4">
              {stats.confirmed || 0}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-300">Reservas Canceladas</h3>
              <span className="text-red-400 text-2xl">✕</span>
            </div>
            <p className="text-5xl font-extrabold text-red-400 mt-4">
              {stats.cancelled || 0}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-300">Asistencias</h3>
              <span className="text-blue-400 text-2xl">★</span>
            </div>
            <p className="text-5xl font-extrabold text-blue-400 mt-4">
              {stats.attended || 0}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-400">No se pudieron cargar las estadísticas</p>
      )}

      {isAdmin() && (
        <div className="mt-8 bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-sm border border-red-500/30 p-6 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">⚡</span> Panel de Administración
          </h2>
          <p className="text-gray-300">
            Como administrador puedes gestionar clases, sesiones y ver todas las reservas del gimnasio.
          </p>
          <div className="mt-4 flex space-x-4">
            <a href="/classes" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition">
              Gestionar Clases
            </a>
            <a href="/sessions" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition">
              Gestionar Sesiones
            </a>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
