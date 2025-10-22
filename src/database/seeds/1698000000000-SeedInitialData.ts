import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export class SeedInitialData1698000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insertar empresa por defecto
    await queryRunner.query(`
      INSERT INTO empresas (nombre, razon_social, email, activa) 
      VALUES ('FÉNIX GYM', 'Fénix Gym', 'admin@gymdemo.com', 1)
    `);

    // Insertar sede por defecto
    await queryRunner.query(`
      INSERT INTO sedes (empresa_id, nombre, direccion, telefono, email, activa) 
      VALUES (1, 'Sede Principal', 'Av. Principal 123', '123456789', 'sede@gymdemo.com', 1)
    `);

    // Hash para password "admin123"
    const passwordHash = await bcrypt.hash('admin123', 10);

    // Insertar usuario administrador único
    await queryRunner.query(`
      INSERT INTO usuarios (
        empresa_id, sede_id, nombre, apellido, email, telefono,
        documento_tipo, documento_numero, password_hash, rol, estado, activo
      ) VALUES (
        1, 1, 'Administrador', 'Sistema', 'admin@gymdemo.com', '123456789',
        'CI', '12345678', '${passwordHash}', 'ADMINISTRADOR', 'ACTIVO', 1
      )
    `);

    // Insertar membresías de ejemplo
    await queryRunner.query(`
      INSERT INTO membresias (empresa_id, sede_id, nombre, descripcion, duracion_dias, precio, activa) 
      VALUES 
        (1, 1, 'Mensual Básica', 'Acceso completo al gimnasio por 30 días', 30, 50.00, 1),
        (1, 1, 'Trimestral', 'Acceso completo al gimnasio por 90 días', 90, 135.00, 1),
        (1, 1, 'Anual Premium', 'Acceso completo + clases grupales por 365 días', 365, 480.00, 1),
        (1, 1, 'Pase Diario', 'Acceso por un día', 1, 8.00, 1)
    `);

    // Insertar socio de ejemplo
    const socioPasswordHash = await bcrypt.hash('socio123', 10);
    await queryRunner.query(`
      INSERT INTO usuarios (
        empresa_id, sede_id, nombre, apellido, email, telefono,
        documento_tipo, documento_numero, fecha_nacimiento, genero,
        password_hash, rol, estado, activo
      ) VALUES (
        1, 1, 'Juan', 'Pérez', 'juan.perez@email.com', '123456792',
        'CI', '55667788', '1990-05-15', 'MASCULINO',
        '${socioPasswordHash}', 'SOCIO', 'ACTIVO', 1
      )
    `);

    // Insertar el socio en la tabla socios (sin entrenador asignado inicialmente)
    await queryRunner.query(`
      INSERT INTO socios (
        empresa_id, sede_id, usuario_id, codigo, estado, 
        entrenador_id, total_visitas
      ) VALUES (
        1, 1, 2, 'SOC001', 'ACTIVO', NULL, 0
      )
    `);

    // Asignar membresía al socio
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate() + 30); // 30 días

    await queryRunner.query(`
      INSERT INTO socios_membresias (
        empresa_id, sede_id, socio_id, membresia_id,
        fecha_inicio, fecha_fin, estado
      ) VALUES (
        1, 1, 1, 1, '${fechaInicio.toISOString().split('T')[0]}', 
        '${fechaFin.toISOString().split('T')[0]}', 'ACTIVA'
      )
    `);

    // Insertar dispositivos de ejemplo
    await queryRunner.query(`
      INSERT INTO dispositivos (empresa_id, sede_id, tipo, nombre, ubicacion, estado) 
      VALUES 
        (1, 1, 'PUERTA', 'Puerta Principal', 'Entrada principal', 'DESCONECTADO'),
        (1, 1, 'HUELLA', 'Lector Biométrico', 'Entrada principal', 'DESCONECTADO'),
        (1, 1, 'IMPRESORA', 'Impresora Tickets', 'Recepción', 'DESCONECTADO'),
        (1, 1, 'RFID', 'Lector RFID', 'Entrada principal', 'DESCONECTADO')
    `);

    console.log('✅ Datos iniciales insertados correctamente');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar en orden inverso por las FK
    await queryRunner.query('DELETE FROM dispositivos WHERE empresa_id = 1');
    await queryRunner.query('DELETE FROM socios_membresias WHERE empresa_id = 1');
    await queryRunner.query('DELETE FROM socios WHERE empresa_id = 1');
    await queryRunner.query('DELETE FROM membresias WHERE empresa_id = 1');
    await queryRunner.query('DELETE FROM usuarios WHERE empresa_id = 1');
    await queryRunner.query('DELETE FROM sedes WHERE empresa_id = 1');
    await queryRunner.query('DELETE FROM empresas WHERE id = 1');
    
    console.log('✅ Datos iniciales eliminados correctamente');
  }
}