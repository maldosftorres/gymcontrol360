import React, { useState, useEffect } from 'react';
import { usuariosApi } from '../services/usuarios.api';
import type { Usuario, CreateUsuarioDto } from '../types';
import SimpleCard from '../components/SimpleCard';
import DataTable from '../components/DataTable';
import SpinnerCompleto from '../components/SpinnerCompleto';

export const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  
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
      
      if (editingUser) {
        await usuariosApi.update(editingUser.id, formData);
      } else {
        await usuariosApi.create(formData);
      }
      
      await loadUsuarios();
      resetForm();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
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
    if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
      try {
        setLoading(true);
        await usuariosApi.delete(id);
        await loadUsuarios();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      } finally {
        setLoading(false);
      }
    }
  };

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
        <span className={`px-2 py-1 rounded-full text-xs ${
          usuario.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' :
          usuario.estado === 'INACTIVO' ? 'bg-gray-100 text-gray-800' :
          'bg-red-100 text-red-800'
        }`}>
          {usuario.estado}
        </span>
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestión de Usuarios
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          Nuevo Usuario
        </button>
      </div>

      {showForm && (
        <SimpleCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  required
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono || ''}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contraseña *
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingUser ? 'Dejar vacío para mantener actual' : ''}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rol *
                </label>
                <select
                  required
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value as 'ADMINISTRADOR' | 'ENTRENADOR' | 'SOCIO' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="SOCIO">Socio</option>
                  <option value="ENTRENADOR">Entrenador</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Documento
                </label>
                <select
                  value={formData.documentoTipo || ''}
                  onChange={(e) => setFormData({ ...formData, documentoTipo: e.target.value as 'CI' | 'DNI' | 'RUC' | 'PASAPORTE' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Seleccionar...</option>
                  <option value="CI">Cédula de Identidad</option>
                  <option value="DNI">DNI</option>
                  <option value="RUC">RUC</option>
                  <option value="PASAPORTE">Pasaporte</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Número de Documento *
                </label>
                <input
                  type="text"
                  required
                  value={formData.documentoNumero}
                  onChange={(e) => setFormData({ ...formData, documentoNumero: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ingresa el número de documento"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dirección
              </label>
              <input
                type="text"
                value={formData.direccion || ''}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Observaciones
              </label>
              <textarea
                value={formData.observaciones || ''}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Guardando...' : editingUser ? 'Actualizar' : 'Crear Usuario'}
              </button>
            </div>
          </form>
        </SimpleCard>
      )}

      <SimpleCard>
        <DataTable
          data={usuarios}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          emptyMessage="No hay usuarios registrados"
        />
      </SimpleCard>
    </div>
  );
};