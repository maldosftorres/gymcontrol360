import Swal from 'sweetalert2';

// Configuración global de SweetAlert2
const defaultConfig = {
    customClass: {
        popup: 'font-sans',
        title: 'text-lg font-semibold',
        htmlContainer: 'text-sm',
        confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors',
        cancelButton: 'bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors mr-2',
    },
    buttonsStyling: false,
};

export const useNotifications = () => {
    // Notificación de éxito
    const showSuccess = (title: string, text?: string) => {
        return Swal.fire({
            ...defaultConfig,
            icon: 'success',
            title,
            text,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
        });
    };

    // Notificación de error
    const showError = (title: string, text?: string) => {
        return Swal.fire({
            ...defaultConfig,
            icon: 'error',
            title,
            text,
            confirmButtonText: 'Entendido',
        });
    };

    // Notificación de advertencia
    const showWarning = (title: string, text?: string) => {
        return Swal.fire({
            ...defaultConfig,
            icon: 'warning',
            title,
            text,
            confirmButtonText: 'Entendido',
        });
    };

    // Notificación de información
    const showInfo = (title: string, text?: string) => {
        return Swal.fire({
            ...defaultConfig,
            icon: 'info',
            title,
            text,
            confirmButtonText: 'Entendido',
        });
    };

    // Confirmación
    const showConfirmation = (
        title: string,
        text?: string,
        confirmButtonText: string = 'Sí, confirmar',
        cancelButtonText: string = 'Cancelar'
    ) => {
        return Swal.fire({
            ...defaultConfig,
            icon: 'question',
            title,
            text,
            showCancelButton: true,
            confirmButtonText,
            cancelButtonText,
        });
    };

    // Toast de notificación rápida
    const showToast = (
        icon: 'success' | 'error' | 'warning' | 'info',
        title: string
    ) => {
        return Swal.fire({
            ...defaultConfig,
            icon,
            title,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
    };

    // Loading/Cargando
    const showLoading = (title: string = 'Cargando...', text?: string) => {
        return Swal.fire({
            ...defaultConfig,
            title,
            text,
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
    };

    // Cerrar cualquier notificación activa
    const close = () => {
        Swal.close();
    };

    return {
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showConfirmation,
        showToast,
        showLoading,
        close,
    };
};

export default useNotifications;