import { useState, useEffect } from 'react';
import { Building, Plus, Eye, Edit, Power, Trash2, Filter } from 'lucide-react';
import { sedesApi, type Sede, type CreateSedeDto } from '../services/sedes.api';
import SedeModal from '../components/SedeModal';
import SedeDetallesModal from '../components/SedeDetallesModal';
import { useTheme } from '../contexts/ThemeContext';
import Swal from 'sweetalert2';

export default function SedesPage() {
  const { theme } = useTheme();
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSede, setEditingSede] = useState<Sede | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  // Estados para el modal de detalles
  const [isDetallesModalOpen, setIsDetallesModalOpen] = useState(false);
  const [selectedSede, setSelectedSede] = useState<Sede | null>(null);
  const [sedeStats, setSedeStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Por ahora usamos empresaId = 1 (será dinámico con auth)
  const empresaId = 1;

  // Cargar sedes
  const loadSedes = async () => {
    try {
      setIsLoading(true);
      const data = await sedesApi.getAll(empresaId);
      setSedes(data);
    } catch (error) {
      console.error('Error al cargar sedes:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar las sedes',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSedes();
  }, []);

  // Crear nueva sede
  const handleCreateSede = async (data: CreateSedeDto) => {
    await sedesApi.create(empresaId, data);
    await loadSedes();
    setIsModalOpen(false);
  };

  // Editar sede
  const handleEditSede = (sede: Sede) => {
    setEditingSede(sede);
    setIsModalOpen(true);
  };

  // Actualizar sede
  const handleUpdateSede = async (data: CreateSedeDto) => {
    if (editingSede) {
      await sedesApi.update(empresaId, editingSede.id, data);
      setEditingSede(null);
      setIsModalOpen(false);
      await loadSedes();
    }
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSede(null);
  };

  // Activar/Desactivar sede
  const handleToggleActiva = async (sede: Sede) => {
    try {
      const action = sede.activa ? 'desactivar' : 'activar';
      const result = await Swal.fire({
        title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} sede?`,
        text: `¿Estás seguro de que quieres ${action} la sede "${sede.nombre}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: sede.activa ? '#dc2626' : '#16a34a',
        cancelButtonColor: '#6b7280',
        confirmButtonText: `Sí, ${action}`,
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        await sedesApi.toggleActiva(empresaId, sede.id);
        await loadSedes();
        
        Swal.fire({
          icon: 'success',
          title: `¡Sede ${action}da!`,
          text: `La sede "${sede.nombre}" ha sido ${action}da exitosamente`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : `Error al ${sede.activa ? 'desactivar' : 'activar'} la sede`,
      });
    }
  };

  // Eliminar sede
  const handleDeleteSede = async (sede: Sede) => {
    try {
      const result = await Swal.fire({
        title: '¿Eliminar sede?',
        html: `
          <p>¿Estás seguro de que quieres eliminar la sede <strong>"${sede.nombre}"</strong>?</p>
          <p class="text-red-600 text-sm mt-2">Esta acción no se puede deshacer.</p>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (result.isConfirmed) {
        await sedesApi.delete(empresaId, sede.id);
        await loadSedes();
        
        Swal.fire({
          icon: 'success',
          title: '¡Sede eliminada!',
          text: `La sede "${sede.nombre}" ha sido eliminada exitosamente`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error al eliminar la sede',
      });
    }
  };

  // Ver detalles de sede
  const handleViewDetails = async (sede: Sede) => {
    try {
      setSelectedSede(sede);
      setLoadingStats(true);
      setIsDetallesModalOpen(true);
      
      // Cargar estadísticas de la sede
      const stats = await sedesApi.getStats(empresaId, sede.id);
      setSedeStats(stats);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar las estadísticas de la sede',
      });
    } finally {
      setLoadingStats(false);
    }
  };

  // Cerrar modal de detalles
  const handleCloseDetalles = () => {
    setIsDetallesModalOpen(false);
    setSelectedSede(null);
    setSedeStats(null);
    setLoadingStats(false);
  };

  // Filtrar sedes
  const filteredSedes = sedes.filter(sede => {
    if (filter === 'active') return sede.activa;
    if (filter === 'inactive') return !sede.activa;
    return true;
  });

  // Estadísticas rápidas
  const stats = {
    total: sedes.length,
    activas: sedes.filter(s => s.activa).length,
    inactivas: sedes.filter(s => !s.activa).length,
  };

  return (
    <div className={`p-6 space-y-6 min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3">
            <Building className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Gestión de Sedes
              </h1>
              <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                Administra las sedes de tu empresa
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`
            px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors
            ${theme === 'dark' 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Sede</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`rounded-lg shadow p-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'
            }`}>
              <Building className={`w-6 h-6 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Total Sedes
              </p>
              <p className={`text-2xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-lg shadow p-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-green-900/50' : 'bg-green-100'
            }`}>
              <svg className={`w-6 h-6 ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Sedes Activas
              </p>
              <p className={`text-2xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {stats.activas}
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-lg shadow p-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-red-900/50' : 'bg-red-100'
            }`}>
              <svg className={`w-6 h-6 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Sedes Inactivas
              </p>
              <p className={`text-2xl font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {stats.inactivas}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className={`rounded-lg shadow p-4 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center space-x-4">
          <Filter className={`w-5 h-5 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? (theme === 'dark' 
                    ? 'bg-blue-900/50 text-blue-300' 
                    : 'bg-blue-100 text-blue-700')
                  : (theme === 'dark' 
                    ? 'text-gray-400 hover:text-gray-200' 
                    : 'text-gray-500 hover:text-gray-700')
              }`}
            >
              Todas ({stats.total})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === 'active'
                  ? (theme === 'dark' 
                    ? 'bg-green-900/50 text-green-300' 
                    : 'bg-green-100 text-green-700')
                  : (theme === 'dark' 
                    ? 'text-gray-400 hover:text-gray-200' 
                    : 'text-gray-500 hover:text-gray-700')
              }`}
            >
              Activas ({stats.activas})
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === 'inactive'
                  ? (theme === 'dark' 
                    ? 'bg-red-900/50 text-red-300' 
                    : 'bg-red-100 text-red-700')
                  : (theme === 'dark' 
                    ? 'text-gray-400 hover:text-gray-200' 
                    : 'text-gray-500 hover:text-gray-700')
              }`}
            >
              Inactivas ({stats.inactivas})
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de sedes */}
      <div className={`rounded-lg shadow ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`px-6 py-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className={`text-lg font-medium ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Listado de Sedes
          </h3>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className={`inline-block animate-spin rounded-full h-8 w-8 border-b-2 ${
                theme === 'dark' ? 'border-blue-400' : 'border-blue-600'
              }`}></div>
              <p className={`mt-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Cargando sedes...
              </p>
            </div>
          ) : filteredSedes.length === 0 ? (
            <div className={`p-8 text-center ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              No hay sedes registradas
            </div>
          ) : (
            <table className={`min-w-full divide-y ${
              theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
            }`}>
              <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Nombre
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Contacto
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Estado
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Fecha Creación
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                theme === 'dark' 
                  ? 'bg-gray-800 divide-gray-700' 
                  : 'bg-white divide-gray-200'
              }`}>
                {filteredSedes.map((sede) => (
                  <tr key={sede.id} className={`transition-colors ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {sede.nombre}
                        </div>
                        {sede.direccion && (
                          <div className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {sede.direccion}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {sede.telefono && (
                        <div className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                          {sede.telefono}
                        </div>
                      )}
                      {sede.email && (
                        <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                          {sede.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sede.activa
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {sede.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {new Date(sede.creadoEn).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-1">
                        {/* Botón Ver detalles */}
                        <button
                          onClick={() => handleViewDetails(sede)}
                          className={`p-2 rounded-full transition-colors duration-200 ${
                            theme === 'dark' 
                              ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/50' 
                              : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                          }`}
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Botón Editar */}
                        <button
                          onClick={() => handleEditSede(sede)}
                          className={`p-2 rounded-full transition-colors duration-200 ${
                            theme === 'dark' 
                              ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/50' 
                              : 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50'
                          }`}
                          title="Editar sede"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Botón Activar/Desactivar */}
                        <button
                          onClick={() => handleToggleActiva(sede)}
                          className={`p-2 rounded-full transition-colors duration-200 ${
                            sede.activa
                              ? (theme === 'dark' 
                                ? 'text-red-400 hover:text-red-300 hover:bg-red-900/50' 
                                : 'text-red-600 hover:text-red-800 hover:bg-red-50')
                              : (theme === 'dark' 
                                ? 'text-green-400 hover:text-green-300 hover:bg-green-900/50' 
                                : 'text-green-600 hover:text-green-800 hover:bg-green-50')
                          }`}
                          title={sede.activa ? 'Desactivar sede' : 'Activar sede'}
                        >
                          <Power className="w-4 h-4" />
                        </button>

                        {/* Botón Eliminar */}
                        <button
                          onClick={() => handleDeleteSede(sede)}
                          className={`p-2 rounded-full transition-colors duration-200 ${
                            theme === 'dark' 
                              ? 'text-red-400 hover:text-red-300 hover:bg-red-900/50' 
                              : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                          }`}
                          title="Eliminar sede"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal de Sede */}
      <SedeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingSede ? handleUpdateSede : handleCreateSede}
        sede={editingSede}
        title={editingSede ? 'Editar Sede' : 'Nueva Sede'}
      />

      {/* Modal de Detalles */}
      <SedeDetallesModal
        sede={selectedSede}
        stats={sedeStats}
        isOpen={isDetallesModalOpen}
        onClose={handleCloseDetalles}
        loading={loadingStats}
      />
    </div>
  );
}