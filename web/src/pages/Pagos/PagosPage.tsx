import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import SimpleCard from '../../components/SimpleCard';
import DataTable from '../../components/DataTable';
import PagoModal from '../../components/PagoModal';
import { useAuth } from '../../auth/useAuth';
import { pagosApi } from '../../services/pagos.api';
import axios from '../../lib/axios';
import type { Pago, CreatePagoDto, Socio, Membresia, MetodoPago } from '../../types';

export function PagosPage() {
    const { user } = useAuth();
    const [pagos, setPagos] = useState<Pago[]>([]);
    const [socios, setSocios] = useState<Socio[]>([]);
    const [membresias, setMembresias] = useState<Membresia[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPago, setEditingPago] = useState<Pago | null>(null);
    const [formData, setFormData] = useState<CreatePagoDto>({
        monto: 0,
        metodoPago: 'EFECTIVO',
        socioId: 0,
        membresiaId: undefined,
        empresaId: user?.empresaId || 0,
        sedeId: user?.sedeId,
        concepto: '',
        fechaPago: new Date().toISOString().split('T')[0],
        esParcial: false,
        observaciones: '',
    });

    useEffect(() => {
        loadPagos();
        loadSocios();
        loadMembresias();
    }, []);

    const loadPagos = async () => {
        try {
            setLoading(true);
            const data = await pagosApi.getAll(user?.empresaId || 0, user?.sedeId);
            setPagos(data);
        } catch (error) {
            console.error('Error loading pagos:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSocios = async () => {
        try {
            const response = await axios.get('/socios', {
                params: {
                    empresaId: user?.empresaId,
                    sedeId: user?.sedeId,
                }
            });
            setSocios(response.data);
        } catch (error) {
            console.error('Error loading socios:', error);
        }
    };

    const loadMembresias = async () => {
        try {
            const response = await axios.get('/membresias', {
                params: {
                    empresaId: user?.empresaId,
                    sedeId: user?.sedeId,
                }
            });
            setMembresias(response.data.filter((m: Membresia) => m.activa));
        } catch (error) {
            console.error('Error loading membresias:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (editingPago) {
                await pagosApi.update(editingPago.id, formData);
            } else {
                await pagosApi.create(formData);
            }
            await loadPagos();
            closeModal();
            
            Swal.fire({
                title: '¡Éxito!',
                text: `Pago ${editingPago ? 'actualizado' : 'registrado'} correctamente`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error saving pago:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo guardar el pago',
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            monto: 0,
            metodoPago: 'EFECTIVO',
            socioId: 0,
            membresiaId: undefined,
            empresaId: user?.empresaId || 0,
            sedeId: user?.sedeId,
            concepto: '',
            fechaPago: new Date().toISOString().split('T')[0],
            esParcial: false,
            observaciones: '',
        });
        setEditingPago(null);
    };

    const closeModal = () => {
        resetForm();
        setShowModal(false);
    };

    const handleEdit = (pago: Pago) => {
        setEditingPago(pago);
        setFormData({
            monto: pago.monto,
            metodoPago: pago.metodoPago,
            socioId: pago.socioId,
            membresiaId: pago.membresiaId,
            empresaId: pago.empresaId,
            sedeId: pago.sedeId,
            concepto: pago.concepto,
            fechaPago: pago.fechaPago.split('T')[0], // Convertir a formato YYYY-MM-DD para input date
            esParcial: pago.esParcial,
            observaciones: pago.observaciones || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: '¿Eliminar pago?',
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
            await pagosApi.delete(id);
            await loadPagos();
            
            Swal.fire({
                title: '¡Eliminado!',
                text: 'Pago eliminado correctamente',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error deleting pago:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo eliminar el pago',
                icon: 'error'
            });
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-PY', {
            style: 'currency',
            currency: 'PYG'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-PY');
    };

    const getMetodoPagoLabel = (metodo: MetodoPago) => {
        const labels = {
            'EFECTIVO': 'Efectivo',
            'TARJETA': 'Tarjeta',
            'TRANSFERENCIA': 'Transferencia',
            'OTRO': 'Otro'
        };
        return labels[metodo] || metodo;
    };

    const columns = [
        { 
            key: 'fechaPago' as keyof Pago, 
            header: 'Fecha',
            render: (pago: Pago) => formatDate(pago.fechaPago)
        },
        { 
            key: 'socio' as keyof Pago, 
            header: 'Socio',
            render: (pago: Pago) => 
                `${pago.socio?.usuario?.nombre} ${pago.socio?.usuario?.apellido}`
        },
        { 
            key: 'membresia' as keyof Pago, 
            header: 'Membresía',
            render: (pago: Pago) => pago.membresia?.nombre || 'N/A'
        },
        { 
            key: 'monto' as keyof Pago, 
            header: 'Monto',
            render: (pago: Pago) => formatCurrency(pago.monto)
        },
        { 
            key: 'metodoPago' as keyof Pago, 
            header: 'Método',
            render: (pago: Pago) => getMetodoPagoLabel(pago.metodoPago)
        },
        { 
            key: 'esParcial' as keyof Pago, 
            header: 'Tipo',
            render: (pago: Pago) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    pago.esParcial 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' 
                        : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                }`}>
                    {pago.esParcial ? 'Parcial' : 'Completo'}
                </span>
            )
        },
        { key: 'concepto' as keyof Pago, header: 'Concepto' }
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
                    Pagos
                </h1>
                <button
                    onClick={() => {
                        setEditingPago(null);
                        setFormData({
                            monto: 0,
                            metodoPago: 'EFECTIVO',
                            socioId: 0,
                            membresiaId: undefined,
                            empresaId: user?.empresaId || 0,
                            sedeId: user?.sedeId,
                            concepto: '',
                            fechaPago: new Date().toISOString().split('T')[0],
                            esParcial: false,
                            observaciones: '',
                        });
                        setShowModal(true);
                    }}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Nuevo Pago
                </button>
            </div>

            <PagoModal
                isOpen={showModal}
                onClose={closeModal}
                onSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}
                editingPago={editingPago}
                loading={loading}
                socios={socios}
                membresias={membresias}
            />

            <SimpleCard>
                <DataTable
                    data={pagos}
                    columns={columns}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    loading={loading}
                    emptyMessage="No hay pagos registrados"
                />
            </SimpleCard>
        </div>
    );
}