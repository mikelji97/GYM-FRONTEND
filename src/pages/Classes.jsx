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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
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
    try {
      if (editingClass) {
        await api.put(`/gym-classes/${editingClass.id}`, formData);
      } else {
        await api.post('/gym-classes', formData);
      }
      fetchClasses();
      closeModal();
    } catch (error) {
      console.error('Error al guardar clase:', error);
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
      setFormData({ name: gymClass.name, description: gymClass.description || '' });
    } else {
      setEditingClass(null);
      setFormData({ name: '', description: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClass(null);
    setFormData({ name: '', description: '' });
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Clases de Gimnasio</h1>
        {isAdmin() && (
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Nueva Clase
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando clases...</p>
      ) : classes.length === 0 ? (
        <p className="text-gray-600">No hay clases disponibles</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((gymClass) => (
            <div key={gymClass.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-800">{gymClass.name}</h3>
              <p className="text-gray-600 mt-2">{gymClass.description || 'Sin descripción'}</p>

              {isAdmin() && (
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => openModal(gymClass)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(gymClass.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingClass ? 'Editar Clase' : 'Nueva Clase'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  rows="3"
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

export default Classes;
