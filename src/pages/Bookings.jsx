import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import api from '../services/api';

const Bookings = () => {
  const { isAdmin } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mine');

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const endpoint = (isAdmin() && activeTab === 'all') ? '/bookings' : '/bookings/my-bookings';
      const response = await api.get(endpoint);
      setBookings(response.data.data || response.data);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('¿Estás seguro de cancelar esta reserva?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al cancelar la reserva');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400',
      attended: 'bg-blue-500/20 text-blue-400',
    };
    const labels = {
      confirmed: 'Confirmada',
      cancelled: 'Cancelada',
      attended: 'Asistió',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || 'bg-gray-500/20 text-gray-400'}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-white">Reservas</h1>
        <p className="text-gray-400 mt-2">
          {isAdmin() ? 'Gestiona las reservas del gimnasio' : 'Consulta y gestiona tus reservas'}
        </p>
      </div>

      {isAdmin() && (
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('mine')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'mine'
                ? 'bg-red-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Mis Reservas
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'all'
                ? 'bg-red-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Todas las Reservas
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Cargando reservas...</p>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No hay reservas</p>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-white/5">
              <tr>
                {isAdmin() && activeTab === 'all' && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Usuario
                  </th>
                )}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Clase
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Hora
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-white/5 transition">
                  {isAdmin() && activeTab === 'all' && (
                    <td className="px-6 py-4 whitespace-nowrap text-white">
                      {booking.user?.name || 'Usuario'}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                    {booking.session?.gym_class?.name || 'Clase'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {booking.session?.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {booking.session?.start_time} - {booking.session?.end_time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="bg-red-600/20 text-red-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600/30 transition"
                      >
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default Bookings;
