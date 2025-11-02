export interface User {
    id: number;
    name: string;
    username: string;
    empresaId: number;
    sedeId?: number;
}

export interface LoginCredentials {
    documentoNumero: string;
    password: string;
}

export interface Usuario {
    id: number;
    empresaId: number;
    sedeId?: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    documentoTipo?: 'CI' | 'DNI' | 'RUC' | 'PASAPORTE';
    documentoNumero?: string;
    direccion?: string;
    fechaNacimiento?: string;
    genero?: 'MASCULINO' | 'FEMENINO' | 'OTRO';
    fotoUrl?: string;
    observaciones?: string;
    rol: 'ADMINISTRADOR' | 'ENTRENADOR' | 'SOCIO';
    estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
    fechaAlta: string;
    fechaBaja?: string;
    ultimoAcceso?: string;
    activo: boolean;
    creadoEn: string;
    actualizadoEn: string;
    empresa?: Empresa;
    sede?: Sede;
    socios?: Socio[];
}

export interface Socio {
    id: number;
    empresaId: number;
    sedeId?: number;
    usuarioId: number;
    codigo: string;
    estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
    fechaAlta: string;
    fechaBaja?: string;
    entrenadorId?: number;
    ultimoCheckinEn?: string;
    totalVisitas: number;
    rfidCodigo?: string;
    notas?: string;
    usuario?: Usuario;
    entrenador?: Usuario;
}

export interface Empresa {
    id: number;
    nombre: string;
    email?: string;
    telefono?: string;
    direccion?: string;
    activo: boolean;
}

export interface Sede {
    id: number;
    empresaId: number;
    nombre: string;
    direccion?: string;
    telefono?: string;
    activo: boolean;
}

export interface CreateUsuarioDto {
    empresaId: number;
    sedeId?: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    documentoTipo?: 'CI' | 'DNI' | 'RUC' | 'PASAPORTE';
    documentoNumero: string;
    direccion?: string;
    fechaNacimiento?: string;
    genero?: 'MASCULINO' | 'FEMENINO' | 'OTRO';
    fotoUrl?: string;
    observaciones?: string;
    password: string;
    rol?: 'ADMINISTRADOR' | 'ENTRENADOR' | 'SOCIO';
    entrenadorId?: number;
    rfidCodigo?: string;
    notas?: string;
}

export interface ChangeStatusUsuarioDto {
    estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
    motivo?: string;
}

// Tipos literales
export type MetodoPago = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'OTRO';
export type CajaEstado = 'ABIERTA' | 'CERRADA';
export type MovimientoTipo = 'INGRESO' | 'EGRESO' | 'AJUSTE';

// Interfaces para Membresías
export interface Membresia {
    id: number;
    empresaId: number;
    sedeId?: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    duracionDias: number;
    activa: boolean;
    creadoEn: string;
    actualizadoEn: string;
    empresa?: Empresa;
    sede?: Sede;
}

export interface SocioMembresia {
    id: number;
    socioId: number;
    membresiaId: number;
    fechaInicio: string;
    fechaVencimiento: string;
    precio: number;
    activa: boolean;
    creadoEn: string;
    socio?: Socio;
    membresia?: Membresia;
}

// Interfaces para Pagos
export interface Pago {
    id: number;
    socioId: number;
    membresiaId?: number;
    empresaId: number;
    sedeId?: number;
    monto: number;
    metodoPago: MetodoPago;
    concepto?: string;
    fechaPago: string;
    esParcial: boolean;
    observaciones?: string;
    creadoEn: string;
    actualizadoEn: string;
    socio?: Socio;
    membresia?: Membresia;
    empresa?: Empresa;
    sede?: Sede;
}

// Interfaces para Caja
export interface Caja {
    id: number;
    empresaId: number;
    sedeId: number;
    abiertoPor: number;
    cerradoPor?: number;
    fechaApertura: string;
    fechaCierre?: string;
    montoInicial: number;
    montoFinal: number;
    diferencia: number;
    estado: CajaEstado;
    creadoEn: string;
    actualizadoEn: string;
    usuarioAbierto?: Usuario;
    usuarioCerrado?: Usuario;
    empresa?: Empresa;
    sede?: Sede;
    movimientos?: MovimientoCaja[];
}

export interface MovimientoCaja {
    id: number;
    cajaId: number;
    pagoId?: number;
    tipo: MovimientoTipo;
    monto: number;
    descripcion: string;
    fecha: string;
    observaciones?: string;
    creadoEn: string;
    caja?: Caja;
    pago?: Pago;
}

// DTOs para crear/actualizar
export interface CreateMembresiaDto {
    empresaId: number;
    sedeId?: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    duracionDias: number;
    activa?: boolean;
}

export interface UpdateMembresiaDto extends Partial<CreateMembresiaDto> {}

export interface AsignarMembresiaDto {
    socioId: number;
    membresiaId: number;
    fechaInicio?: string;
    precio?: number;
}

export interface CreatePagoDto {
    monto: number;
    metodoPago?: MetodoPago;
    socioId: number;
    membresiaId?: number;
    empresaId: number;
    sedeId?: number;
    concepto?: string;
    fechaPago?: string;
    esParcial?: boolean;
    observaciones?: string;
}

export interface UpdatePagoDto extends Partial<CreatePagoDto> {}

export interface AbrirCajaDto {
    montoInicial: number;
    empresaId: number;
    sedeId: number;
    usuarioId: number;
    observaciones?: string;
}

export interface CerrarCajaDto {
    montoFinal: number;
    observaciones?: string;
}

export interface CreateMovimientoCajaDto {
    tipo: MovimientoTipo;
    monto: number;
    concepto: string;
    cajaId: number;
    pagoId?: number;
    observaciones?: string;
}