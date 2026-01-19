import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.data || response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/stats`);
      setUserStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  const viewStats = async (user) => {
    setSelectedUser(user);
    await fetchUserStats(user.id);
  };

  const closeStats = () => {
    setSelectedUser(null);
    setUserStats(null);
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-white">Gestión de Usuarios</h1>
        <p className="text-gray-400 mt-2">Administra los usuarios del gimnasio</p>
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando usuarios...</p>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No hay usuarios</p>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {user.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => viewStats(user)}
                      className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600/30 transition"
                    >
                      Ver Stats
                    </button>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-600/20 text-red-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600/30 transition"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/20 p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              Estadísticas de <span className="text-red-500">{selectedUser.name}</span>
            </h2>
            {userStats ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <span className="text-green-400">Reservas Confirmadas</span>
                  <span className="font-bold text-green-400 text-2xl">{userStats.confirmed || 0}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <span className="text-red-400">Reservas Canceladas</span>
                  <span className="font-bold text-red-400 text-2xl">{userStats.cancelled || 0}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <span className="text-blue-400">Asistencias</span>
                  <span className="font-bold text-blue-400 text-2xl">{userStats.attended || 0}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Cargando estadísticas...</p>
            )}
            <button
              onClick={closeStats}
              className="mt-6 w-full px-4 py-3 bg-white/10 border border-white/20 text-gray-300 rounded-xl font-medium hover:bg-white/20 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Users;
