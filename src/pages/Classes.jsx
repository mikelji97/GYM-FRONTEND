import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import api from '../services/api';

const Classes = () => {
  const { isAdmin } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 60,
    max_capacity: 20,
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/gym-classes');
      setClasses(response.data.data || response.data);
    } catch (error) {
      console.error('Error al cargar clases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Enviando datos:', formData);
    setError('');
    setSaving(true);
    try {
      let response;
      if (editingClass) {
        response = await api.put(`/gym-classes/${editingClass.id}`, formData);
      } else {
        response = await api.post('/gym-classes', formData);
      }
      console.log('Respuesta:', response.data);
      fetchClasses();
      closeModal();
    } catch (err) {
      console.error('Error completo:', err);
      console.error('Response data:', err.response?.data);
      const errorMsg = err.response?.data?.message ||
                       err.response?.data?.error ||
                       JSON.stringify(err.response?.data) ||
                       'Error al guardar la clase. Verifica que el backend esté corriendo.';
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta clase?')) return;
    try {
      await api.delete(`/gym-classes/${id}`);
      fetchClasses();
    } catch (error) {
      console.error('Error al eliminar clase:', error);
    }
  };

  const openModal = (gymClass = null) => {
    if (gymClass) {
      setEditingClass(gymClass);
      setFormData({
        name: gymClass.name,
        description: gymClass.description || '',
        duration: gymClass.duration || 60,
        max_capacity: gymClass.max_capacity || 20,
      });
    } else {
      setEditingClass(null);
      setFormData({ name: '', description: '', duration: 60, max_capacity: 20 });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClass(null);
    setFormData({ name: '', description: '', duration: 60, max_capacity: 20 });
    setError('');
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-white">Clases de Gimnasio</h1>
          <p className="text-gray-400 mt-2">Explora nuestras clases disponibles</p>
        </div>
        {isAdmin() && (
          <button
            onClick={() => openModal()}
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition transform hover:scale-105"
          >
            + Nueva Clase
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando clases...</p>
      ) : classes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No hay clases disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((gymClass) => (
            <div key={gymClass.id} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition">
              <div className="flex items-center justify-between mb-3">
                <span className="text-red-500 text-3xl">💪</span>
                <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                  {gymClass.duration} min
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">{gymClass.name}</h3>
              <p className="text-gray-400 mt-2">{gymClass.description || 'Sin descripción'}</p>
              <p className="text-gray-500 text-sm mt-2">Capacidad: {gymClass.max_capacity} personas</p>

              {isAdmin() && (
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => openModal(gymClass)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(gymClass.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-gray-900 border border-white/20 p-8 rounded-2xl w-full max-w-md shadow-2xl mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingClass ? 'Editar Clase' : 'Nueva Clase'}
            </h2>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  placeholder="Nombre de la clase"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  placeholder="Descripción de la clase"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Duración (min)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    placeholder="60"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">
                    Capacidad máx.
                  </label>
                  <input
                    type="number"
                    value={formData.max_capacity}
                    onChange={(e) => setFormData({ ...formData, max_capacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    placeholder="20"
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

export default Classes;
