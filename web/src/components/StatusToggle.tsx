import React, { useState } from 'react';
import Swal from 'sweetalert2';
import type { Usuario, ChangeStatusUsuarioDto } from '../types';

interface StatusToggleProps {
    usuario: Usuario;
    onChangeStatus: (usuario: Usuario, data: ChangeStatusUsuarioDto) => Promise<void>;
    disabled?: boolean;
}

const StatusToggle: React.FC<StatusToggleProps> = ({ usuario, onChangeStatus, disabled = false }) => {
    const [isChanging, setIsChanging] = useState(false);

    const handleToggle = async () => {
        if (disabled || isChanging) return;

        const isActive = usuario.estado === 'ACTIVO';
        const newStatus = isActive ? 'INACTIVO' : 'ACTIVO';
        const action = isActive ? 'inactivar' : 'activar';

        const result = await Swal.fire({
            title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} usuario?`,
            text: `${usuario.nombre} ${usuario.apellido} será ${isActive ? 'inactivado' : 'activado'}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: isActive ? '#ef4444' : '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Sí, ${action}`,
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        let motivo = '';
        if (newStatus === 'INACTIVO') {
            const motivoResult = await Swal.fire({
                title: 'Motivo (opcional)',
                input: 'textarea',
                inputPlaceholder: 'Ej: Usuario solicitó cancelación...',
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Sin motivo'
            });

            if (motivoResult.isDismissed) return;
            motivo = motivoResult.value || '';
        }

        try {
            setIsChanging(true);
            await onChangeStatus(usuario, {
                estado: newStatus as 'ACTIVO' | 'INACTIVO',
                motivo: motivo || undefined
            });

            Swal.fire({
                title: '¡Éxito!',
                text: `Usuario ${isActive ? 'inactivado' : 'activado'} correctamente`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo cambiar el estado del usuario',
                icon: 'error'
            });
        } finally {
            setIsChanging(false);
        }
    };

    const isActive = usuario.estado === 'ACTIVO';

    return (
        <div className="flex items-center">
            {/* Toggle Switch */}
            <button
                onClick={handleToggle}
                disabled={disabled || isChanging}
                className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out
          ${isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}
          ${disabled || isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}
        `}
            >
                <span
                    className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out
            ${isActive ? 'translate-x-6' : 'translate-x-1'}
          `}
                />
                {isChanging && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    </div>
                )}
            </button>
        </div>
    );
};

export default StatusToggle;