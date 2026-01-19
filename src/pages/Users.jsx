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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando usuarios...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-600">No hay usuarios</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-sm ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => viewStats(user)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Ver Stats
                    </button>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Estadísticas de {selectedUser.name}
            </h2>
            {userStats ? (
              <div className="space-y-4">
                <div className="flex justify-between p-3 bg-green-50 rounded">
                  <span className="text-green-700">Reservas Confirmadas</span>
                  <span className="font-bold text-green-700">{userStats.confirmed || 0}</span>
                </div>
                <div className="flex justify-between p-3 bg-red-50 rounded">
                  <span className="text-red-700">Reservas Canceladas</span>
                  <span className="font-bold text-red-700">{userStats.cancelled || 0}</span>
                </div>
                <div className="flex justify-between p-3 bg-blue-50 rounded">
                  <span className="text-blue-700">Asistencias</span>
                  <span className="font-bold text-blue-700">{userStats.attended || 0}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Cargando estadísticas...</p>
            )}
            <button
              onClick={closeStats}
              className="mt-4 w-full px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
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
