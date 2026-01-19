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
        <h1 className="text-3xl font-bold text-gray-800">
          Bienvenido, {user?.name}
        </h1>
        <p className="text-gray-600 mt-2">
          Panel de {isAdmin() ? 'Administrador' : 'Usuario'}
        </p>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando estadísticas...</p>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Reservas Confirmadas</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.confirmed || 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Reservas Canceladas</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {stats.cancelled || 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Asistencias</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {stats.attended || 0}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No se pudieron cargar las estadísticas</p>
      )}

      {isAdmin() && (
        <div className="mt-8 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-yellow-800 mb-4">
            Panel de Administración
          </h2>
          <p className="text-yellow-700">
            Como administrador puedes gestionar clases, sesiones y ver todas las reservas.
          </p>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
