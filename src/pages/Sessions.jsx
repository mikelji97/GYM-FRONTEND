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
    room: '',
    max_capacity: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

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
    setError('');
    setSaving(true);
    try {
      if (editingSession) {
        await api.put(`/sessions/${editingSession.id}`, formData);
      } else {
        await api.post('/sessions', formData);
      }
      fetchSessions();
      closeModal();
    } catch (err) {
      console.error('Error al guardar sesión:', err);
      const errorMsg = err.response?.data?.message ||
                       JSON.stringify(err.response?.data?.errors) ||
                       'Error al guardar la sesión';
      setError(errorMsg);
    } finally {
      setSaving(false);
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
        room: session.room || '',
        max_capacity: session.max_capacity,
      });
    } else {
      setEditingSession(null);
      setFormData({
        gym_class_id: '',
        date: '',
        start_time: '',
        end_time: '',
        room: '',
        max_capacity: '',
      });
    }
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSession(null);
  };

  const getAvailableSpots = (session) => {
    const booked = session.current_bookings || 0;
    return session.max_capacity - booked;
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white">Sesiones</h1>
          <p className="text-gray-400 mt-2">Reserva tu próxima clase</p>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyAvailable}
              onChange={(e) => setShowOnlyAvailable(e.target.checked)}
              className="mr-2 w-4 h-4 accent-red-600"
            />
            Solo con plazas
          </label>
          {isAdmin() && (
            <button
              onClick={() => openModal()}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition transform hover:scale-105"
            >
              + Nueva Sesión
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando sesiones...</p>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No hay sesiones disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <div key={session.id} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition">
              <div className="flex items-center justify-between mb-3">
                <span className="text-orange-500 text-2xl">📅</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  getAvailableSpots(session) > 0
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {getAvailableSpots(session)} / {session.max_capacity} plazas
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {session.gym_class?.name || 'Clase'}
              </h3>
              <div className="mt-3 text-gray-400 space-y-1">
                <p className="flex items-center">
                  <span className="mr-2">📆</span> {session.date}
                </p>
                <p className="flex items-center">
                  <span className="mr-2">🕐</span> {session.start_time} - {session.end_time}
                </p>
                <p className="flex items-center">
                  <span className="mr-2">🏠</span> {session.room}
                </p>
              </div>

              <div className="mt-4 flex space-x-2">
                {getAvailableSpots(session) > 0 && (
                  <button
                    onClick={() => handleBook(session.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition flex-1"
                  >
                    Reservar
                  </button>
                )}
                {isAdmin() && (
                  <>
                    <button
                      onClick={() => openModal(session)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(session.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/20 p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingSession ? 'Editar Sesión' : 'Nueva Sesión'}
            </h2>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Clase
                </label>
                <select
                  value={formData.gym_class_id}
                  onChange={(e) => setFormData({ ...formData, gym_class_id: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  required
                >
                  <option value="" className="bg-gray-900">Seleccionar clase</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id} className="bg-gray-900">{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Hora inicio
                  </label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Hora fin
                  </label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Sala
                  </label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    placeholder="Ej: Sala 1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Capacidad
                  </label>
                  <input
                    type="number"
                    value={formData.max_capacity}
                    onChange={(e) => setFormData({ ...formData, max_capacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    placeholder="Plazas"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 border border-white/20 text-gray-300 rounded-lg hover:bg-white/10 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition"
                >
                  {saving ? 'Guardando...' : 'Guardar'}
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
