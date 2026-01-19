import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import api from '../services/api';

const Bookings = () => {
  const { isAdmin } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const endpoint = isAdmin() ? '/bookings' : '/bookings/my-bookings';
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
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      attended: 'bg-blue-100 text-blue-800',
    };
    const labels = {
      confirmed: 'Confirmada',
      cancelled: 'Cancelada',
      attended: 'Asistió',
    };
    return (
      <span className={`px-2 py-1 rounded text-sm ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {isAdmin() ? 'Todas las Reservas' : 'Mis Reservas'}
        </h1>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando reservas...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-600">No hay reservas</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {isAdmin() && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Usuario
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Clase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  {isAdmin() && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.user?.name || 'Usuario'}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.session?.gym_class?.name || 'Clase'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.session?.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.session?.start_time} - {booking.session?.end_time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="text-red-600 hover:text-red-800"
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
