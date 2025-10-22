-- ============================================================
-- BASE DE DATOS: gymcontrol360
-- ============================================================
CREATE DATABASE IF NOT EXISTS gymcontrol360
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gymcontrol360;

SET NAMES utf8mb4;
SET sql_mode = 'STRICT_ALL_TABLES';

-- ============================================================
-- Helpers: default engine & charset por tabla (si tu cliente no los agrega)
-- ============================================================
-- En cada CREATE TABLE añado ENGINE y charset.

-- ============================================================
-- TABLAS BASE: Empresas y Sedes
-- ============================================================

CREATE TABLE empresas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  razon_social VARCHAR(200),
  ruc VARCHAR(30),
  email VARCHAR(150),
  telefono VARCHAR(50),
  direccion VARCHAR(255),
  logo_url VARCHAR(255),
  activa BOOLEAN DEFAULT TRUE,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_empresas_activa (activa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Catálogo maestro de empresas (tenants) del sistema.';

CREATE TABLE sedes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  direccion VARCHAR(255),
  telefono VARCHAR(50),
  email VARCHAR(150),
  activa BOOLEAN DEFAULT TRUE,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sedes_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_sedes_empresa (empresa_id),
  INDEX idx_sedes_empresa_activa (empresa_id, activa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Sucursales/locales por empresa; aislamiento por sede.';

-- ============================================================
-- TABLA: Usuarios (registro unificado)
-- ============================================================

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL COMMENT 'Empresa (tenant)',
  sede_id INT NULL COMMENT 'Sede por defecto',
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  telefono VARCHAR(30),
  documento_tipo ENUM('CI','DNI','RUC','PASAPORTE') DEFAULT 'CI',
  documento_numero VARCHAR(50),
  direccion VARCHAR(255),
  fecha_nacimiento DATE NULL,
  genero ENUM('MASCULINO','FEMENINO','OTRO') DEFAULT 'OTRO',
  foto_url VARCHAR(255),
  observaciones TEXT,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('SUPERADMIN','ADMIN','RECEPCION','ENTRENADOR','SOCIO') NOT NULL DEFAULT 'SOCIO',
  estado ENUM('ACTIVO','INACTIVO','SUSPENDIDO') DEFAULT 'ACTIVO',
  fecha_alta DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_baja DATETIME NULL,
  ultimo_acceso DATETIME NULL,
  activo BOOLEAN DEFAULT TRUE,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_usuarios_email UNIQUE (email),
  CONSTRAINT fk_usuarios_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_usuarios_sede
    FOREIGN KEY (sede_id) REFERENCES sedes(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_usuarios_empresa_sede (empresa_id, sede_id),
  INDEX idx_usuarios_rol (rol),
  INDEX idx_usuarios_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Usuarios del sistema (socios, entrenadores, recepción, admins).';

-- ============================================================
-- TABLA: Socios (afiliación operativa por empresa/sede)
-- ============================================================

CREATE TABLE socios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL COMMENT 'Tenant de la afiliación',
  sede_id INT NULL COMMENT 'Sede de afiliación',
  usuario_id INT NOT NULL COMMENT 'Ref a usuarios',
  codigo VARCHAR(20) NOT NULL COMMENT 'ID corto visible por empresa',
  estado ENUM('ACTIVO','INACTIVO','SUSPENDIDO') DEFAULT 'ACTIVO',
  fecha_alta DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_baja DATETIME NULL,
  entrenador_id INT NULL,
  ultimo_checkin_en DATETIME NULL,
  total_visitas INT DEFAULT 0,
  rfid_codigo VARCHAR(64) NULL,
  preferencia_horaria_json JSON NULL,
  notas TEXT NULL,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_socios_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_socios_sede
    FOREIGN KEY (sede_id) REFERENCES sedes(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_socios_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_socios_entrenador
    FOREIGN KEY (entrenador_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT uq_socios_codigo UNIQUE (empresa_id, codigo),
  CONSTRAINT uq_socios_afiliacion UNIQUE (empresa_id, sede_id, usuario_id),
  INDEX idx_socios_estado (estado),
  INDEX idx_socios_entrenador (entrenador_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Afiliación del usuario como socio en empresa/sede (datos operativos).';

-- ============================================================
-- TABLA: Membresías (catálogo por empresa/sede)
-- ============================================================

CREATE TABLE membresias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  sede_id INT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  duracion_dias INT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  activa BOOLEAN DEFAULT TRUE,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_membresias_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_membresias_sede
    FOREIGN KEY (sede_id) REFERENCES sedes(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_membresias_empresa_sede (empresa_id, sede_id),
  INDEX idx_membresias_activa (activa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Planes de suscripción (duración/precio) por empresa/sede.';

-- ============================================================
-- TABLA: Socios_Membresías (histórico de asignación)
-- ============================================================

CREATE TABLE socios_membresias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  sede_id INT NULL,
  socio_id INT NOT NULL,
  membresia_id INT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  estado ENUM('ACTIVA','VENCIDA','SUSPENDIDA') DEFAULT 'ACTIVA',
  notas TEXT,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sm_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_sm_sede
    FOREIGN KEY (sede_id) REFERENCES sedes(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_sm_socio
    FOREIGN KEY (socio_id) REFERENCES socios(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_sm_membresia
    FOREIGN KEY (membresia_id) REFERENCES membresias(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_sm_socio_fechas (socio_id, fecha_inicio, fecha_fin),
  INDEX idx_sm_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Histórico de membresías del socio (vigencias y estado).';

-- ============================================================
-- TABLA: Pagos
-- ============================================================

CREATE TABLE pagos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  sede_id INT NULL,
  socio_id INT NOT NULL,
  membresia_id INT NULL,
  monto DECIMAL(10,2) NOT NULL,
  metodo_pago ENUM('EFECTIVO','TARJETA','TRANSFERENCIA','OTRO') DEFAULT 'EFECTIVO',
  es_parcial BOOLEAN DEFAULT FALSE,
  referencia VARCHAR(100),
  observaciones TEXT,
  fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pagos_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_pagos_sede
    FOREIGN KEY (sede_id) REFERENCES sedes(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_pagos_socio
    FOREIGN KEY (socio_id) REFERENCES socios(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_pagos_membresia
    FOREIGN KEY (membresia_id) REFERENCES membresias(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_pagos_fecha (fecha_pago),
  INDEX idx_pagos_metodo (metodo_pago),
  INDEX idx_pagos_socio (socio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Cobros a socios (totales o parciales), con método y referencia.';

-- ============================================================
-- TABLA: Caja
-- ============================================================

CREATE TABLE caja (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  sede_id INT NULL,
  abierto_por INT,
  cerrado_por INT,
  fecha_apertura DATETIME DEFAULT CURRENT_TIMESTAMP,
  fecha_cierre DATETIME NULL,
  monto_inicial DECIMAL(10,2) DEFAULT 0,
  monto_final DECIMAL(10,2) DEFAULT 0,
  diferencia DECIMAL(10,2) DEFAULT 0,
  estado ENUM('ABIERTA','CERRADA') DEFAULT 'ABIERTA',
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_caja_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_caja_sede
    FOREIGN KEY (sede_id) REFERENCES sedes(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_caja_abierto_por
    FOREIGN KEY (abierto_por) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_caja_cerrado_por
    FOREIGN KEY (cerrado_por) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_caja_estado (empresa_id, sede_id, estado)
  -- Opcional: asegurar UNA caja abierta por sede:
  -- UNIQUE KEY uq_caja_abierta (empresa_id, sede_id, estado) WHERE (estado='ABIERTA')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Sesiones de caja (apertura/cierre) por sede.';

-- ============================================================
-- TABLA: Movimientos_Caja
-- ============================================================

CREATE TABLE movimientos_caja (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  sede_id INT NULL,
  caja_id INT NOT NULL,
  tipo ENUM('INGRESO','EGRESO','AJUSTE') DEFAULT 'INGRESO',
  categoria VARCHAR(100),
  monto DECIMAL(10,2) NOT NULL,
  descripcion TEXT,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_movcaja_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_movcaja_sede
    FOREIGN KEY (sede_id) REFERENCES sedes(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_movcaja_caja
    FOREIGN KEY (caja_id) REFERENCES caja(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_movcaja_fecha (fecha),
  INDEX idx_movcaja_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Detalle de movimientos vinculados a cada sesión de caja.';

-- ============================================================
-- TABLA: Dispositivos
-- ============================================================

CREATE TABLE dispositivos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  sede_id INT NULL,
  tipo ENUM('HUELLA','PUERTA','IMPRESORA','RFID') NOT NULL,
  nombre VARCHAR(100),
  ubicacion VARCHAR(100),
  configuracion_json JSON,
  estado ENUM('CONECTADO','DESCONECTADO','ERROR') DEFAULT 'DESCONECTADO',
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_dispositivos_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_dispositivos_sede
    FOREIGN KEY (sede_id) REFERENCES sedes(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_disp_empresa_sede (empresa_id, sede_id),
  INDEX idx_disp_tipo_estado (tipo, estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Inventario y configuración de hardware local por sede.';

-- ============================================================
-- TABLA: Visitas (check-ins)
-- ============================================================

CREATE TABLE visitas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  sede_id INT NULL,
  socio_id INT NOT NULL,
  metodo_acceso ENUM('MANUAL','RFID','HUELLA','QR') DEFAULT 'MANUAL',
  dispositivo_id INT NULL,
  resultado ENUM('PERMITIDO','DENEGADO') DEFAULT 'PERMITIDO',
  motivo_denegacion VARCHAR(255),
  fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_visitas_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_visitas_sede
    FOREIGN KEY (sede_id) REFERENCES sedes(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_visitas_socio
    FOREIGN KEY (socio_id) REFERENCES socios(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_visitas_dispositivo
    FOREIGN KEY (dispositivo_id) REFERENCES dispositivos(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_visitas_fecha (fecha_ingreso),
  INDEX idx_visitas_metodo (metodo_acceso),
  INDEX idx_visitas_resultado (resultado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Check-ins de socios con método, dispositivo y resultado.';

-- ============================================================
-- TABLA: Rutinas
-- ============================================================

CREATE TABLE rutinas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  sede_id INT NULL,
  socio_id INT NOT NULL,
  entrenador_id INT NULL,
  nombre VARCHAR(100),
  objetivo VARCHAR(255),
  notas TEXT,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_rutinas_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_rutinas_sede
    FOREIGN KEY (sede_id) REFERENCES sedes(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_rutinas_socio
    FOREIGN KEY (socio_id) REFERENCES socios(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_rutinas_entrenador
    FOREIGN KEY (entrenador_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_rutinas_socio (socio_id),
  INDEX idx_rutinas_entrenador (entrenador_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Rutinas asignadas al socio, con autoría del entrenador.';

-- ============================================================
-- TABLA: Ejercicios de Rutina
-- ============================================================

CREATE TABLE ejercicios_rutina (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  sede_id INT NULL,
  rutina_id INT NOT NULL,
  ejercicio VARCHAR(100) NOT NULL,
  series INT,
  repeticiones INT,
  peso DECIMAL(6,2),
  descanso_segundos INT,
  observaciones TEXT,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ejr_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_ejr_sede
    FOREIGN KEY (sede_id) REFERENCES sedes(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_ejr_rutina
    FOREIGN KEY (rutina_id) REFERENCES rutinas(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_ejr_rutina (rutina_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Ítems de una rutina (ejercicio, series, reps, carga, descansos).';

-- ============================================================
-- TABLA: Gastos
-- ============================================================

CREATE TABLE gastos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  sede_id INT NULL,
  categoria VARCHAR(100),
  monto DECIMAL(10,2),
  proveedor VARCHAR(150),
  documento VARCHAR(100),
  comprobante_url VARCHAR(255),
  descripcion TEXT,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_gastos_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_gastos_sede
    FOREIGN KEY (sede_id) REFERENCES sedes(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_gastos_fecha (fecha),
  INDEX idx_gastos_categoria (categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Gastos operativos por sede (control financiero).';

-- ============================================================
-- TABLA: Respaldos
-- ============================================================

CREATE TABLE respaldos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  sede_id INT NULL,
  tipo ENUM('MANUAL','NUBE') DEFAULT 'MANUAL',
  ubicacion_url VARCHAR(255),
  tamanio_mb DECIMAL(8,2),
  hash VARCHAR(255),
  correcto BOOLEAN DEFAULT TRUE,
  fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_resp_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_resp_sede
    FOREIGN KEY (sede_id) REFERENCES sedes(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_resp_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Trazabilidad de backups y verificación de integridad.';

-- ============================================================
-- TABLA: Auditoría
-- ============================================================

CREATE TABLE auditoria (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  sede_id INT NULL,
  usuario_id INT,
  accion VARCHAR(100),
  entidad VARCHAR(100),
  entidad_id INT,
  datos_json JSON,
  ip VARCHAR(45),
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_aud_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_aud_sede
    FOREIGN KEY (sede_id) REFERENCES sedes(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_aud_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_aud_fecha (fecha),
  INDEX idx_aud_entidad (entidad, entidad_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='Bitácora de acciones (cumplimiento y trazabilidad).';
