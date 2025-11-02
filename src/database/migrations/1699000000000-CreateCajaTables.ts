import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCajaTables1699000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla caja
    await queryRunner.query(`
      CREATE TABLE \`caja\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`empresa_id\` int NOT NULL,
        \`sede_id\` int NULL,
        \`abierto_por\` int NULL,
        \`cerrado_por\` int NULL,
        \`fecha_apertura\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`fecha_cierre\` datetime NULL,
        \`monto_inicial\` decimal(10,2) NOT NULL DEFAULT '0.00',
        \`monto_final\` decimal(10,2) NOT NULL DEFAULT '0.00',
        \`diferencia\` decimal(10,2) NOT NULL DEFAULT '0.00',
        \`estado\` enum('ABIERTA','CERRADA') NOT NULL DEFAULT 'ABIERTA',
        \`creado_en\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`actualizado_en\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_caja_estado\` (\`empresa_id\`, \`sede_id\`, \`estado\`),
        INDEX \`FK_caja_empresa\` (\`empresa_id\`),
        INDEX \`FK_caja_sede\` (\`sede_id\`),
        INDEX \`FK_caja_abierto_por\` (\`abierto_por\`),
        INDEX \`FK_caja_cerrado_por\` (\`cerrado_por\`),
        CONSTRAINT \`FK_caja_empresa\` FOREIGN KEY (\`empresa_id\`) REFERENCES \`empresas\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT \`FK_caja_sede\` FOREIGN KEY (\`sede_id\`) REFERENCES \`sedes\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT \`FK_caja_abierto_por\` FOREIGN KEY (\`abierto_por\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT \`FK_caja_cerrado_por\` FOREIGN KEY (\`cerrado_por\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Crear tabla movimientos_caja
    await queryRunner.query(`
      CREATE TABLE \`movimientos_caja\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`empresa_id\` int NOT NULL,
        \`sede_id\` int NULL,
        \`caja_id\` int NOT NULL,
        \`tipo\` enum('INGRESO','EGRESO','AJUSTE') NOT NULL DEFAULT 'INGRESO',
        \`categoria\` varchar(100) NULL,
        \`monto\` decimal(10,2) NOT NULL,
        \`descripcion\` text NULL,
        \`fecha\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`creado_en\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`actualizado_en\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_movcaja_fecha\` (\`fecha\`),
        INDEX \`idx_movcaja_tipo\` (\`tipo\`),
        INDEX \`FK_movimientos_caja_empresa\` (\`empresa_id\`),
        INDEX \`FK_movimientos_caja_sede\` (\`sede_id\`),
        INDEX \`FK_movimientos_caja_caja\` (\`caja_id\`),
        CONSTRAINT \`FK_movimientos_caja_empresa\` FOREIGN KEY (\`empresa_id\`) REFERENCES \`empresas\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT \`FK_movimientos_caja_sede\` FOREIGN KEY (\`sede_id\`) REFERENCES \`sedes\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT \`FK_movimientos_caja_caja\` FOREIGN KEY (\`caja_id\`) REFERENCES \`caja\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('✅ Tablas de caja creadas correctamente');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `movimientos_caja`');
    await queryRunner.query('DROP TABLE IF EXISTS `caja`');
    
    console.log('✅ Tablas de caja eliminadas correctamente');
  }
}