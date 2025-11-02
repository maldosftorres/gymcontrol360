/**
 * Ejemplo de uso del endpoint para cambiar estado de usuario
 * 
 * PATCH /usuarios/:id/status
 * 
 * Casos de uso:
 * 1. Suspender un usuario por falta de pago
 * 2. Reactivar un usuario suspendido
 * 3. Inactivar un usuario permanentemente
 */

// Ejemplo 1: Suspender usuario
const suspenderUsuario = {
  "estado": "SUSPENDIDO",
  "motivo": "Usuario suspendido por falta de pago de membresía"
};

// Ejemplo 2: Reactivar usuario
const reactivarUsuario = {
  "estado": "ACTIVO"
};

// Ejemplo 3: Inactivar usuario permanentemente
const inactivarUsuario = {
  "estado": "INACTIVO",
  "motivo": "Usuario solicitó cancelación de membresía"
};

/**
 * Comportamiento del endpoint:
 * 
 * 1. Si el usuario es SOCIO, también actualiza el estado en la tabla socios
 * 2. Si se cambia a INACTIVO o SUSPENDIDO:
 *    - Se establece fechaBaja = new Date()
 *    - Se marca activo = false
 *    - Se guarda el motivo si se proporciona
 * 3. Si se cambia a ACTIVO:
 *    - Se limpia fechaBaja = null
 *    - Se marca activo = true
 *    - Se limpia el motivoBaja = null
 * 
 * Estados disponibles:
 * - ACTIVO: Usuario puede usar el sistema normalmente
 * - INACTIVO: Usuario no puede acceder, considerado como "dado de baja"
 * - SUSPENDIDO: Usuario temporalmente bloqueado
 */

export const ejemplosUso = {
  suspenderUsuario,
  reactivarUsuario,
  inactivarUsuario
};