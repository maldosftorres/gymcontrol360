import React, { useState, useEffect } from 'react';
import SimpleCard from '../../components/SimpleCard';
import DataTable from '../../components/DataTable';
import { useAuth } from '../../auth/useAuth';
import axios from '../../lib/axios';
import type { Membresia, CreateMembresiaDto } from '../../types';

export function MembresiasPage() {
    const { user } = useAuth();
    const [membresias, setMembresias] = useState<Membresia[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingMembresia, setEditingMembresia] = useState<Membresia | null>(null);
    const [formData, setFormData] = useState<CreateMembresiaDto>({
        empresaId: user?.empresaId || 0,
        sedeId: user?.sedeId,
        nombre: '',
        descripcion: '',
        precio: 0,
        duracionDias: 30,
        activa: true,
    });

    useEffect(() => {
        loadMembresias();
    }, []);

    const loadMembresias = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/membresias', {
                params: {
                    empresaId: user?.empresaId,
                    sedeId: user?.sedeId,
                }
            });
            setMembresias(response.data);
        } catch (error) {
            console.error('Error loading membresias:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingMembresia) {
                await axios.put(`/membresias/${editingMembresia.id}`, formData);
            } else {
                await axios.post('/membresias', formData);
            }
            loadMembresias();
            resetForm();
        } catch (error) {
            console.error('Error saving membresia:', error);
        }
    };

    const handleEdit = (membresia: Membresia) => {
        setEditingMembresia(membresia);
        setFormData({
            empresaId: membresia.empresaId,
            sedeId: membresia.sedeId,
            nombre: membresia.nombre,
            descripcion: membresia.descripcion || '',
            precio: membresia.precio,
            duracionDias: membresia.duracionDias,
            activa: membresia.activa,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('¿Está seguro de eliminar esta membresía?')) {
            try {
                await axios.delete(`/membresias/${id}`);
                loadMembresias();
            } catch (error) {
                console.error('Error deleting membresia:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            empresaId: user?.empresaId || 0,
            sedeId: user?.sedeId,
            nombre: '',
            descripcion: '',
            precio: 0,
            duracionDias: 30,
            activa: true,
        });
        setEditingMembresia(null);
        setShowForm(false);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-PY', {
            style: 'currency',
            currency: 'PYG'
        }).format(amount);
    };

    const columns = [
        { key: 'nombre' as keyof Membresia, header: 'Nombre' },
        { key: 'descripcion' as keyof Membresia, header: 'Descripción' },
        { 
            key: 'precio' as keyof Membresia, 
            header: 'Precio',
            render: (membresia: Membresia) => formatCurrency(membresia.precio)
        },
        { 
            key: 'duracionDias' as keyof Membresia, 
            header: 'Duración',
            render: (membresia: Membresia) => `${membresia.duracionDias} días`
        },
        { 
            key: 'activa' as keyof Membresia, 
            header: 'Estado',
            render: (membresia: Membresia) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    membresia.activa 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                }`}>
                    {membresia.activa ? 'Activa' : 'Inactiva'}
                </span>
            )
        }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-gray-100"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Membresías
                </h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Nueva Membresía
                </button>
            </div>

            {showForm && (
                <SimpleCard className="mb-6">
                    <h2 className="text-xl font-bold mb-4">
                        {editingMembresia ? 'Editar Membresía' : 'Nueva Membresía'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Nombre *
                                </label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Precio *
                                </label>
                                <input
                                    type="number"
                                    value={formData.precio}
                                    onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    required
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Duración (días) *
                                </label>
                                <input
                                    type="number"
                                    value={formData.duracionDias}
                                    onChange={(e) => setFormData({ ...formData, duracionDias: Number(e.target.value) })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    required
                                    min="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Estado
                                </label>
                                <select
                                    value={formData.activa ? 'true' : 'false'}
                                    onChange={(e) => setFormData({ ...formData, activa: e.target.value === 'true' })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                >
                                    <option value="true">Activa</option>
                                    <option value="false">Inactiva</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                rows={3}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {editingMembresia ? 'Actualizar' : 'Crear'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </SimpleCard>
            )}

            <SimpleCard>
                <DataTable
                    data={membresias}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </SimpleCard>
        </div>
    );
}