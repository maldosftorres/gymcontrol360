export enum MetodoPago {
  EFECTIVO = 'EFECTIVO',
  TARJETA = 'TARJETA',
  TRANSFERENCIA = 'TRANSFERENCIA',
  OTRO = 'OTRO',
}

export enum CajaEstado {
  ABIERTA = 'ABIERTA',
  CERRADA = 'CERRADA',
}

export enum MovimientoTipo {
  INGRESO = 'INGRESO',
  EGRESO = 'EGRESO',
  AJUSTE = 'AJUSTE',
}

export enum VisitaMetodo {
  MANUAL = 'MANUAL',
  RFID = 'RFID',
  HUELLA = 'HUELLA',
  QR = 'QR',
}

export enum VisitaResultado {
  PERMITIDO = 'PERMITIDO',
  DENEGADO = 'DENEGADO',
}

export enum DispositivoTipo {
  HUELLA = 'HUELLA',
  PUERTA = 'PUERTA',
  IMPRESORA = 'IMPRESORA',
  RFID = 'RFID',
}

export enum DispositivoEstado {
  CONECTADO = 'CONECTADO',
  DESCONECTADO = 'DESCONECTADO',
  ERROR = 'ERROR',
}