import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import SimpleCard from '../../components/SimpleCard';
import DataTable from '../../components/DataTable';
import AbrirCajaModal from '../../components/AbrirCajaModal';
import CerrarCajaModal from '../../components/CerrarCajaModal';
import MovimientoCajaModal from '../../components/MovimientoCajaModal';
import { useAuth } from '../../auth/useAuth';
import { cajaApi } from '../../services/caja.api';
import type { Caja, MovimientoCaja, AbrirCajaDto, CerrarCajaDto, CreateMovimientoCajaDto, MovimientoTipo } from '../../types';

export function CajaPage() {
    const { user } = useAuth();
    const [cajaActiva, setCajaActiva] = useState<Caja | null>(null);
    const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAbrirModal, setShowAbrirModal] = useState(false);
    const [showCerrarModal, setShowCerrarModal] = useState(false);
    const [showMovimientoModal, setShowMovimientoModal] = useState(false);
    
    const [abrirData, setAbrirData] = useState<AbrirCajaDto>({
        montoInicial: 0,
        empresaId: user?.empresaId || 1,
        sedeId: user?.sedeId || 1,
        usuarioId: user?.id || 1,
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
            const caja = await cajaApi.getCajaActiva(user?.sedeId || 0);
            setCajaActiva(caja);
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
            const movimientos = await cajaApi.getMovimientos(cajaActiva.id);
            setMovimientos(movimientos);
        } catch (error) {
            console.error('Error loading movimientos:', error);
        }
    };

    const handleAbrirCaja = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const caja = await cajaApi.abrir(abrirData);
            setCajaActiva(caja);
            setShowAbrirModal(false);
            resetAbrirForm();
            
            Swal.fire({
                title: '¡Éxito!',
                text: 'Caja abierta correctamente',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error abriendo caja:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo abrir la caja',
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCerrarCaja = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cajaActiva) return;
        try {
            setLoading(true);
            await cajaApi.cerrar(cajaActiva.id, cerrarData);
            setCajaActiva(null);
            setMovimientos([]);
            setShowCerrarModal(false);
            resetCerrarForm();
            
            Swal.fire({
                title: '¡Éxito!',
                text: 'Caja cerrada correctamente',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error cerrando caja:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo cerrar la caja',
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCrearMovimiento = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await cajaApi.createMovimiento(movimientoData);
            await loadMovimientos();
            setShowMovimientoModal(false);
            resetMovimientoForm();
            
            Swal.fire({
                title: '¡Éxito!',
                text: 'Movimiento registrado correctamente',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error creando movimiento:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo registrar el movimiento',
                icon: 'error'
            });
        } finally {
            setLoading(false);
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
        { key: 'descripcion' as keyof MovimientoCaja, header: 'Concepto' },
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
                        onClick={() => setShowAbrirModal(true)}
                        disabled={loading}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Abrir Caja
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowMovimientoModal(true)}
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Nuevo Movimiento
                        </button>
                        <button
                            onClick={() => setShowCerrarModal(true)}
                            disabled={loading}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

            <AbrirCajaModal
                isOpen={showAbrirModal}
                onClose={() => setShowAbrirModal(false)}
                onSubmit={handleAbrirCaja}
                formData={abrirData}
                setFormData={setAbrirData}
                loading={loading}
            />

            <CerrarCajaModal
                isOpen={showCerrarModal}
                onClose={() => setShowCerrarModal(false)}
                onSubmit={handleCerrarCaja}
                formData={cerrarData}
                setFormData={setCerrarData}
                loading={loading}
                montoCalculado={calcularTotalCaja()}
            />

            <MovimientoCajaModal
                isOpen={showMovimientoModal}
                onClose={() => setShowMovimientoModal(false)}
                onSubmit={handleCrearMovimiento}
                formData={movimientoData}
                setFormData={setMovimientoData}
                loading={loading}
            />

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