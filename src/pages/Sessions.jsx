import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import api from '../services/api';

const Sessions = () => {
  const { isAdmin } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [formData, setFormData] = useState({
    gym_class_id: '',
    date: '',
    start_time: '',
    end_time: '',
    capacity: '',
  });

  useEffect(() => {
    fetchSessions();
    fetchClasses();
  }, [showOnlyAvailable]);

  const fetchSessions = async () => {
    try {
      const endpoint = showOnlyAvailable ? '/sessions/available' : '/sessions';
      const response = await api.get(endpoint);
      setSessions(response.data.data || response.data);
    } catch (error) {
      console.error('Error al cargar sesiones:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get('/gym-classes');
      setClasses(response.data.data || response.data);
    } catch (error) {
      console.error('Error al cargar clases:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSession) {
        await api.put(`/sessions/${editingSession.id}`, formData);
      } else {
        await api.post('/sessions', formData);
      }
      fetchSessions();
      closeModal();
    } catch (error) {
      console.error('Error al guardar sesión:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta sesión?')) return;
    try {
      await api.delete(`/sessions/${id}`);
      fetchSessions();
    } catch (error) {
      console.error('Error al eliminar sesión:', error);
    }
  };

  const handleBook = async (sessionId) => {
    try {
      await api.post('/bookings', { session_id: sessionId });
      alert('Reserva realizada con éxito');
      fetchSessions();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al realizar la reserva');
    }
  };

  const openModal = (session = null) => {
    if (session) {
      setEditingSession(session);
      setFormData({
        gym_class_id: session.gym_class_id,
        date: session.date,
        start_time: session.start_time,
        end_time: session.end_time,
        capacity: session.capacity,
      });
    } else {
      setEditingSession(null);
      setFormData({
        gym_class_id: '',
        date: '',
        start_time: '',
        end_time: '',
        capacity: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSession(null);
  };

  const getAvailableSpots = (session) => {
    const booked = session.bookings_count || 0;
    return session.capacity - booked;
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sesiones</h1>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showOnlyAvailable}
              onChange={(e) => setShowOnlyAvailable(e.target.checked)}
              className="mr-2"
            />
            Solo con plazas
          </label>
          {isAdmin() && (
            <button
              onClick={() => openModal()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Nueva Sesión
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando sesiones...</p>
      ) : sessions.length === 0 ? (
        <p className="text-gray-600">No hay sesiones disponibles</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <div key={session.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800">
                {session.gym_class?.name || 'Clase'}
              </h3>
              <div className="mt-2 text-gray-600">
                <p>Fecha: {session.date}</p>
                <p>Hora: {session.start_time} - {session.end_time}</p>
                <p className={getAvailableSpots(session) > 0 ? 'text-green-600' : 'text-red-600'}>
                  Plazas: {getAvailableSpots(session)} / {session.capacity}
                </p>
              </div>

              <div className="mt-4 flex space-x-2">
                {!isAdmin() && getAvailableSpots(session) > 0 && (
                  <button
                    onClick={() => handleBook(session.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Reservar
                  </button>
                )}
                {isAdmin() && (
                  <>
                    <button
                      onClick={() => openModal(session)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(session.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingSession ? 'Editar Sesión' : 'Nueva Sesión'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Clase
                </label>
                <select
                  value={formData.gym_class_id}
                  onChange={(e) => setFormData({ ...formData, gym_class_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Seleccionar clase</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Hora inicio
                  </label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Hora fin
                  </label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Capacidad
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  min="1"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Sessions;
