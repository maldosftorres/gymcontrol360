import React, { useState, useEffect } from 'react';
import { Building } from 'lucide-react';
import Swal from 'sweetalert2';
import SimpleCard from '../../components/SimpleCard';
import DataTable from '../../components/DataTable';
import MembresiaModal from '../../components/MembresiaModal';
import { useAuth } from '../../auth/useAuth';
import axios from '../../lib/axios';
import type { Membresia, CreateMembresiaDto } from '../../types';

export function MembresiasPage() {
    const { user } = useAuth();
    const [membresias, setMembresias] = useState<Membresia[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMembresia, setEditingMembresia] = useState<Membresia | null>(null);
    const [formData, setFormData] = useState<CreateMembresiaDto>({
        empresaId: user?.empresaId || 0,
        sedeId: undefined, // Inicialmente sin sede específica = todas las sedes
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
            setLoading(true);
            if (editingMembresia) {
                await axios.patch(`/membresias/${editingMembresia.id}`, formData);
            } else {
                await axios.post('/membresias', formData);
            }
            await loadMembresias();
            closeModal();
            
            Swal.fire({
                title: '¡Éxito!',
                text: `Membresía ${editingMembresia ? 'actualizada' : 'creada'} correctamente`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error saving membresia:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo guardar la membresía',
                icon: 'error'
            });
        } finally {
            setLoading(false);
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
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: '¿Eliminar membresía?',
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
            await axios.delete(`/membresias/${id}`);
            await loadMembresias();
            
            Swal.fire({
                title: '¡Eliminada!',
                text: 'Membresía eliminada correctamente',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error deleting membresia:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo eliminar la membresía',
                icon: 'error'
            });
        }
    };

    const resetForm = () => {
        setFormData({
            empresaId: user?.empresaId || 0,
            sedeId: undefined, // Sin sede específica = todas las sedes
            nombre: '',
            descripcion: '',
            precio: 0,
            duracionDias: 30,
            activa: true,
        });
        setEditingMembresia(null);
    };

    const closeModal = () => {
        resetForm();
        setShowModal(false);
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
            key: 'sede' as keyof Membresia, 
            header: 'Sede',
            render: (membresia: Membresia) => (
                <span className="flex items-center">
                    <Building className="w-4 h-4 mr-1 text-gray-500" />
                    {membresia.sede ? membresia.sede.nombre : 'Todas las sedes'}
                </span>
            )
        },
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
                    onClick={() => {
                        setEditingMembresia(null);
                        setFormData({
                            empresaId: user?.empresaId || 0,
                            sedeId: user?.sedeId,
                            nombre: '',
                            descripcion: '',
                            precio: 0,
                            duracionDias: 30,
                            activa: true,
                        });
                        setShowModal(true);
                    }}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Nueva Membresía
                </button>
            </div>

            <MembresiaModal
                isOpen={showModal}
                onClose={closeModal}
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                editingMembresia={editingMembresia}
                loading={loading}
                empresaId={user?.empresaId || 1}
            />

            <SimpleCard>
                <DataTable
                    data={membresias}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                    emptyMessage="No hay membresías registradas"
                />
            </SimpleCard>
        </div>
    );
}