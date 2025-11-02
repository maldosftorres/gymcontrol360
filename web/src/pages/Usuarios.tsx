import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { usuariosApi } from '../services/usuarios.api';
import type { Usuario, CreateUsuarioDto, ChangeStatusUsuarioDto } from '../types';
import SimpleCard from '../components/SimpleCard';
import DataTable from '../components/DataTable';
import SpinnerCompleto from '../components/SpinnerCompleto';
import StatusToggle from '../components/StatusToggle';
import UsuarioModal from '../components/UsuarioModal';

export const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState<string>('');
  const [filterEstado, setFilterEstado] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  const [formData, setFormData] = useState<CreateUsuarioDto>({
    empresaId: 1, // Por defecto, deberías obtener esto del contexto
    nombre: '',
    apellido: '',
    email: '',
    documentoNumero: '',
    password: '',
    rol: 'SOCIO',
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const response = await usuariosApi.getAll();
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      let submitData: any = { ...formData };
      
      // Si estamos editando y el password está vacío, no lo enviamos
      if (editingUser && !formData.password) {
        const { password, ...dataWithoutPassword } = submitData;
        submitData = dataWithoutPassword;
      }
      
      if (editingUser) {
        await usuariosApi.update(editingUser.id, submitData);
      } else {
        await usuariosApi.create(submitData);
      }
      
      await loadUsuarios();
      resetForm();
      
      Swal.fire({
        title: '¡Éxito!',
        text: `Usuario ${editingUser ? 'actualizado' : 'creado'} correctamente`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo guardar el usuario',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUser(usuario);
    setFormData({
      empresaId: usuario.empresaId,
      sedeId: usuario.sedeId,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono,
      documentoTipo: usuario.documentoTipo,
      documentoNumero: usuario.documentoNumero || '',
      direccion: usuario.direccion,
      fechaNacimiento: usuario.fechaNacimiento,
      genero: usuario.genero,
      observaciones: usuario.observaciones,
      password: '', // No mostramos la contraseña actual
      rol: usuario.rol,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await usuariosApi.delete(id);
      await loadUsuarios();
      
      Swal.fire({
        title: '¡Eliminado!',
        text: 'Usuario eliminado correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el usuario',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (usuario: Usuario, data: ChangeStatusUsuarioDto) => {
    try {
      await usuariosApi.changeStatus(usuario.id, data);
      await loadUsuarios();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      throw error; // Re-throw para que StatusToggle maneje el error
    }
  };

  // Usuarios filtrados
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(usuario => {
      // Filtro por término de búsqueda (nombre, apellido, email, documento)
      const searchMatch = searchTerm === '' || 
        usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (usuario.documentoNumero && usuario.documentoNumero.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (usuario.socios?.[0]?.codigo && usuario.socios[0].codigo.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filtro por rol
      const rolMatch = filterRol === '' || usuario.rol === filterRol;
      
      // Filtro por estado
      const estadoMatch = filterEstado === '' || usuario.estado === filterEstado;
      
      return searchMatch && rolMatch && estadoMatch;
    });
  }, [usuarios, searchTerm, filterRol, filterEstado]);

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setFilterRol('');
    setFilterEstado('');
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = searchTerm !== '' || filterRol !== '' || filterEstado !== '';

  const resetForm = () => {
    setFormData({
      empresaId: 1,
      nombre: '',
      apellido: '',
      email: '',
      documentoNumero: '',
      password: '',
      rol: 'SOCIO',
    });
    setEditingUser(null);
    setShowForm(false);
  };

  const columns = [
    {
      key: 'codigo' as keyof Usuario,
      header: 'Código',
      render: (usuario: Usuario) => usuario.socios?.[0]?.codigo || '-'
    },
    {
      key: 'nombre' as keyof Usuario,
      header: 'Nombre',
      render: (usuario: Usuario) => `${usuario.nombre} ${usuario.apellido}`
    },
    {
      key: 'email' as keyof Usuario,
      header: 'Email'
    },
    {
      key: 'rol' as keyof Usuario,
      header: 'Rol'
    },
    {
      key: 'estado' as keyof Usuario,
      header: 'Estado',
      render: (usuario: Usuario) => (
        <StatusToggle 
          usuario={usuario}
          onChangeStatus={handleChangeStatus}
          disabled={loading}
        />
      )
    },
    {
      key: 'telefono' as keyof Usuario,
      header: 'Teléfono',
      render: (usuario: Usuario) => usuario.telefono || '-'
    },
    {
      key: 'fechaAlta' as keyof Usuario,
      header: 'Fecha Alta',
      render: (usuario: Usuario) => new Date(usuario.fechaAlta).toLocaleDateString()
    }
  ];

  if (loading && usuarios.length === 0) {
    return <SpinnerCompleto />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestión de Usuarios
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Búsqueda rápida */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white w-full sm:w-64"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Botón de filtros */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${
              hasActiveFilters 
                ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Filter className="h-4 w-4" />
            Filtros {hasActiveFilters && `(${[searchTerm, filterRol, filterEstado].filter(Boolean).length})`}
          </button>
          
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Panel de filtros expandible */}
      {showFilters && (
        <SimpleCard>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filtros Avanzados</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro por Rol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rol
                </label>
                <select
                  value={filterRol}
                  onChange={(e) => setFilterRol(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Todos los roles</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                  <option value="ENTRENADOR">Entrenador</option>
                  <option value="SOCIO">Socio</option>
                </select>
              </div>
              
              {/* Filtro por Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado
                </label>
                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Todos los estados</option>
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                  <option value="SUSPENDIDO">Suspendido</option>
                </select>
              </div>
              
              {/* Estadísticas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resultados
                </label>
                <div className="text-sm text-gray-600 dark:text-gray-400 py-2">
                  Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios
                </div>
              </div>
            </div>
          </div>
        </SimpleCard>
      )}

      {showForm && (
        <UsuarioModal
          isOpen={showForm}
          onClose={resetForm}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          editingUser={editingUser}
          loading={loading}
        />
      )}

      <SimpleCard>
        <DataTable
          data={usuariosFiltrados}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          emptyMessage={hasActiveFilters ? "No se encontraron usuarios con los filtros aplicados" : "No hay usuarios registrados"}
        />
      </SimpleCard>
    </div>
  );
};