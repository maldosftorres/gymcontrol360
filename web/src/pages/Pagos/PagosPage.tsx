import React, { useState, useEffect } from 'react';
import SimpleCard from '../../components/SimpleCard';
import DataTable from '../../components/DataTable';
import { useAuth } from '../../auth/useAuth';
import axios from '../../lib/axios';
import type { Pago, CreatePagoDto, Socio, Membresia, MetodoPago } from '../../types';

export function PagosPage() {
    const { user } = useAuth();
    const [pagos, setPagos] = useState<Pago[]>([]);
    const [socios, setSocios] = useState<Socio[]>([]);
    const [membresias, setMembresias] = useState<Membresia[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
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
            const response = await axios.get('/pagos', {
                params: {
                    empresaId: user?.empresaId,
                    sedeId: user?.sedeId,
                }
            });
            setPagos(response.data);
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
            await axios.post('/pagos', formData);
            loadPagos();
            resetForm();
        } catch (error) {
            console.error('Error saving pago:', error);
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
        setShowForm(false);
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
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Nuevo Pago
                </button>
            </div>

            {showForm && (
                <SimpleCard className="mb-6">
                    <h2 className="text-xl font-bold mb-4">Registrar Pago</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Socio *
                                </label>
                                <select
                                    value={formData.socioId}
                                    onChange={(e) => setFormData({ ...formData, socioId: Number(e.target.value) })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    required
                                >
                                    <option value={0}>Seleccionar socio</option>
                                    {socios.map((socio) => (
                                        <option key={socio.id} value={socio.id}>
                                            {socio.usuario?.nombre} {socio.usuario?.apellido} - {socio.codigo}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Membresía
                                </label>
                                <select
                                    value={formData.membresiaId || ''}
                                    onChange={(e) => setFormData({ 
                                        ...formData, 
                                        membresiaId: e.target.value ? Number(e.target.value) : undefined 
                                    })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                >
                                    <option value="">Sin membresía</option>
                                    {membresias.map((membresia) => (
                                        <option key={membresia.id} value={membresia.id}>
                                            {membresia.nombre} - {formatCurrency(membresia.precio)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Monto *
                                </label>
                                <input
                                    type="number"
                                    value={formData.monto}
                                    onChange={(e) => setFormData({ ...formData, monto: Number(e.target.value) })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    required
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Método de Pago *
                                </label>
                                <select
                                    value={formData.metodoPago}
                                    onChange={(e) => setFormData({ ...formData, metodoPago: e.target.value as MetodoPago })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    required
                                >
                                    <option value="EFECTIVO">Efectivo</option>
                                    <option value="TARJETA">Tarjeta</option>
                                    <option value="TRANSFERENCIA">Transferencia</option>
                                    <option value="OTRO">Otro</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Fecha de Pago *
                                </label>
                                <input
                                    type="date"
                                    value={formData.fechaPago}
                                    onChange={(e) => setFormData({ ...formData, fechaPago: e.target.value })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    required
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="esParcial"
                                    checked={formData.esParcial}
                                    onChange={(e) => setFormData({ ...formData, esParcial: e.target.checked })}
                                    className="mr-2"
                                />
                                <label htmlFor="esParcial" className="text-sm font-medium">
                                    Es pago parcial
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Concepto
                            </label>
                            <input
                                type="text"
                                value={formData.concepto}
                                onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                placeholder="Ej: Pago mensualidad enero"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Observaciones
                            </label>
                            <textarea
                                value={formData.observaciones}
                                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                rows={3}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Registrar Pago
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
                    data={pagos}
                    columns={columns}
                />
            </SimpleCard>
        </div>
    );
}