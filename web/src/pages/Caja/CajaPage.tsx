import React, { useState, useEffect } from 'react';
import SimpleCard from '../../components/SimpleCard';
import DataTable from '../../components/DataTable';
import { useAuth } from '../../auth/useAuth';
import axios from '../../lib/axios';
import type { Caja, MovimientoCaja, AbrirCajaDto, CerrarCajaDto, CreateMovimientoCajaDto, MovimientoTipo } from '../../types';

export function CajaPage() {
    const { user } = useAuth();
    const [cajaActiva, setCajaActiva] = useState<Caja | null>(null);
    const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAbrirForm, setShowAbrirForm] = useState(false);
    const [showCerrarForm, setShowCerrarForm] = useState(false);
    const [showMovimientoForm, setShowMovimientoForm] = useState(false);
    
    const [abrirData, setAbrirData] = useState<AbrirCajaDto>({
        montoInicial: 0,
        empresaId: user?.empresaId || 0,
        sedeId: user?.sedeId || 0,
        usuarioId: user?.id || 0,
        observaciones: '',
    });

    const [cerrarData, setCerrarData] = useState<CerrarCajaDto>({
        montoFinal: 0,
        observaciones: '',
    });

    const [movimientoData, setMovimientoData] = useState<CreateMovimientoCajaDto>({
        tipo: 'INGRESO',
        monto: 0,
        concepto: '',
        cajaId: 0,
        observaciones: '',
    });

    useEffect(() => {
        loadCajaActiva();
    }, []);

    useEffect(() => {
        if (cajaActiva) {
            loadMovimientos();
            setMovimientoData(prev => ({ ...prev, cajaId: cajaActiva.id }));
        }
    }, [cajaActiva]);

    const loadCajaActiva = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/caja/activa/${user?.sedeId}`);
            setCajaActiva(response.data);
        } catch (error) {
            console.error('Error loading caja activa:', error);
            setCajaActiva(null);
        } finally {
            setLoading(false);
        }
    };

    const loadMovimientos = async () => {
        if (!cajaActiva) return;
        try {
            const response = await axios.get(`/caja/${cajaActiva.id}/movimientos`);
            setMovimientos(response.data);
        } catch (error) {
            console.error('Error loading movimientos:', error);
        }
    };

    const handleAbrirCaja = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/caja/abrir', abrirData);
            setCajaActiva(response.data);
            setShowAbrirForm(false);
            resetAbrirForm();
        } catch (error) {
            console.error('Error abriendo caja:', error);
        }
    };

    const handleCerrarCaja = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cajaActiva) return;
        try {
            await axios.patch(`/caja/${cajaActiva.id}/cerrar`, cerrarData);
            setCajaActiva(null);
            setMovimientos([]);
            setShowCerrarForm(false);
            resetCerrarForm();
        } catch (error) {
            console.error('Error cerrando caja:', error);
        }
    };

    const handleCrearMovimiento = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/caja/movimiento', movimientoData);
            loadMovimientos();
            setShowMovimientoForm(false);
            resetMovimientoForm();
        } catch (error) {
            console.error('Error creando movimiento:', error);
        }
    };

    const resetAbrirForm = () => {
        setAbrirData({
            montoInicial: 0,
            empresaId: user?.empresaId || 0,
            sedeId: user?.sedeId || 0,
            usuarioId: user?.id || 0,
            observaciones: '',
        });
    };

    const resetCerrarForm = () => {
        setCerrarData({
            montoFinal: 0,
            observaciones: '',
        });
    };

    const resetMovimientoForm = () => {
        setMovimientoData({
            tipo: 'INGRESO',
            monto: 0,
            concepto: '',
            cajaId: cajaActiva?.id || 0,
            observaciones: '',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-PY', {
            style: 'currency',
            currency: 'PYG'
        }).format(amount);
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-PY');
    };

    const getTipoMovimientoLabel = (tipo: MovimientoTipo) => {
        const labels = {
            'INGRESO': 'Ingreso',
            'EGRESO': 'Egreso',
            'AJUSTE': 'Ajuste'
        };
        return labels[tipo] || tipo;
    };

    const calcularTotalCaja = () => {
        if (!cajaActiva) return 0;
        const totalMovimientos = movimientos.reduce((total, mov) => {
            return mov.tipo === 'INGRESO' 
                ? total + mov.monto 
                : total - mov.monto;
        }, 0);
        return cajaActiva.montoInicial + totalMovimientos;
    };

    const columns = [
        { 
            key: 'fecha' as keyof MovimientoCaja, 
            header: 'Fecha/Hora',
            render: (movimiento: MovimientoCaja) => formatDateTime(movimiento.fecha)
        },
        { 
            key: 'tipo' as keyof MovimientoCaja, 
            header: 'Tipo',
            render: (movimiento: MovimientoCaja) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    movimiento.tipo === 'INGRESO' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                        : movimiento.tipo === 'EGRESO'
                        ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                }`}>
                    {getTipoMovimientoLabel(movimiento.tipo)}
                </span>
            )
        },
        { key: 'concepto' as keyof MovimientoCaja, header: 'Concepto' },
        { 
            key: 'monto' as keyof MovimientoCaja, 
            header: 'Monto',
            render: (movimiento: MovimientoCaja) => (
                <span className={movimiento.tipo === 'INGRESO' ? 'text-green-600' : 'text-red-600'}>
                    {movimiento.tipo === 'INGRESO' ? '+' : '-'}{formatCurrency(Math.abs(movimiento.monto))}
                </span>
            )
        },
        { key: 'observaciones' as keyof MovimientoCaja, header: 'Observaciones' }
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
                    Gestión de Caja
                </h1>
                {!cajaActiva ? (
                    <button
                        onClick={() => setShowAbrirForm(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Abrir Caja
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowMovimientoForm(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Nuevo Movimiento
                        </button>
                        <button
                            onClick={() => setShowCerrarForm(true)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Cerrar Caja
                        </button>
                    </div>
                )}
            </div>

            {!cajaActiva ? (
                <SimpleCard>
                    <div className="text-center py-8">
                        <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                            No hay caja abierta
                        </h2>
                        <p className="text-gray-500 dark:text-gray-500 mb-4">
                            Para comenzar a registrar movimientos, primero debe abrir la caja.
                        </p>
                    </div>
                </SimpleCard>
            ) : (
                <>
                    {/* Resumen de Caja */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <SimpleCard>
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Monto Inicial
                            </h3>
                            <p className="text-2xl font-bold text-blue-600">
                                {formatCurrency(cajaActiva.montoInicial)}
                            </p>
                        </SimpleCard>
                        <SimpleCard>
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Ingresos
                            </h3>
                            <p className="text-2xl font-bold text-green-600">
                                {formatCurrency(movimientos
                                    .filter(m => m.tipo === 'INGRESO')
                                    .reduce((total, m) => total + m.monto, 0)
                                )}
                            </p>
                        </SimpleCard>
                        <SimpleCard>
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Egresos
                            </h3>
                            <p className="text-2xl font-bold text-red-600">
                                {formatCurrency(movimientos
                                    .filter(m => m.tipo === 'EGRESO')
                                    .reduce((total, m) => total + m.monto, 0)
                                )}
                            </p>
                        </SimpleCard>
                        <SimpleCard>
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total en Caja
                            </h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {formatCurrency(calcularTotalCaja())}
                            </p>
                        </SimpleCard>
                    </div>

                    {/* Información de la Caja */}
                    <SimpleCard className="mb-6">
                        <h3 className="text-lg font-bold mb-4">Información de la Caja</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="font-medium">Abierta por:</span>
                                <p>{cajaActiva.usuarioAbierto?.nombre} {cajaActiva.usuarioAbierto?.apellido}</p>
                            </div>
                            <div>
                                <span className="font-medium">Fecha de apertura:</span>
                                <p>{formatDateTime(cajaActiva.fechaApertura)}</p>
                            </div>
                            <div>
                                <span className="font-medium">Estado:</span>
                                <p className="text-green-600 font-medium">Abierta</p>
                            </div>
                        </div>
                    </SimpleCard>
                </>
            )}

            {/* Formulario Abrir Caja */}
            {showAbrirForm && (
                <SimpleCard className="mb-6">
                    <h2 className="text-xl font-bold mb-4">Abrir Caja</h2>
                    <form onSubmit={handleAbrirCaja} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Monto Inicial *
                            </label>
                            <input
                                type="number"
                                value={abrirData.montoInicial}
                                onChange={(e) => setAbrirData({ ...abrirData, montoInicial: Number(e.target.value) })}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                required
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Observaciones
                            </label>
                            <textarea
                                value={abrirData.observaciones}
                                onChange={(e) => setAbrirData({ ...abrirData, observaciones: e.target.value })}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                rows={3}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Abrir Caja
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAbrirForm(false)}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </SimpleCard>
            )}

            {/* Formulario Cerrar Caja */}
            {showCerrarForm && cajaActiva && (
                <SimpleCard className="mb-6">
                    <h2 className="text-xl font-bold mb-4">Cerrar Caja</h2>
                    <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg mb-4">
                        <p className="text-sm">
                            <strong>Monto calculado:</strong> {formatCurrency(calcularTotalCaja())}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Ingrese el monto real contado en caja para calcular la diferencia.
                        </p>
                    </div>
                    <form onSubmit={handleCerrarCaja} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Monto Final Contado *
                            </label>
                            <input
                                type="number"
                                value={cerrarData.montoFinal}
                                onChange={(e) => setCerrarData({ ...cerrarData, montoFinal: Number(e.target.value) })}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                required
                                min="0"
                            />
                            {cerrarData.montoFinal > 0 && (
                                <p className="text-sm mt-1">
                                    <strong>Diferencia:</strong> 
                                    <span className={cerrarData.montoFinal - calcularTotalCaja() >= 0 ? 'text-green-600' : 'text-red-600'}>
                                        {formatCurrency(cerrarData.montoFinal - calcularTotalCaja())}
                                    </span>
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Observaciones
                            </label>
                            <textarea
                                value={cerrarData.observaciones}
                                onChange={(e) => setCerrarData({ ...cerrarData, observaciones: e.target.value })}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                rows={3}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Cerrar Caja
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCerrarForm(false)}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </SimpleCard>
            )}

            {/* Formulario Nuevo Movimiento */}
            {showMovimientoForm && cajaActiva && (
                <SimpleCard className="mb-6">
                    <h2 className="text-xl font-bold mb-4">Nuevo Movimiento</h2>
                    <form onSubmit={handleCrearMovimiento} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Tipo *
                                </label>
                                <select
                                    value={movimientoData.tipo}
                                    onChange={(e) => setMovimientoData({ ...movimientoData, tipo: e.target.value as MovimientoTipo })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    required
                                >
                                    <option value="INGRESO">Ingreso</option>
                                    <option value="EGRESO">Egreso</option>
                                    <option value="AJUSTE">Ajuste</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Monto *
                                </label>
                                <input
                                    type="number"
                                    value={movimientoData.monto}
                                    onChange={(e) => setMovimientoData({ ...movimientoData, monto: Number(e.target.value) })}
                                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    required
                                    min="0"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Concepto *
                            </label>
                            <input
                                type="text"
                                value={movimientoData.concepto}
                                onChange={(e) => setMovimientoData({ ...movimientoData, concepto: e.target.value })}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                required
                                placeholder="Ej: Pago de servicios, Venta de producto, etc."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Observaciones
                            </label>
                            <textarea
                                value={movimientoData.observaciones}
                                onChange={(e) => setMovimientoData({ ...movimientoData, observaciones: e.target.value })}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                rows={3}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Crear Movimiento
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowMovimientoForm(false)}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </SimpleCard>
            )}

            {/* Tabla de Movimientos */}
            {cajaActiva && (
                <SimpleCard>
                    <h3 className="text-lg font-bold mb-4">Movimientos de Caja</h3>
                    <DataTable
                        data={movimientos}
                        columns={columns}
                    />
                </SimpleCard>
            )}
        </div>
    );
}