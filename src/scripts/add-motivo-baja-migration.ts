import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function runMigration() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  console.log('🔄 Ejecutando migración para agregar campo motivo_baja...');

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    // Verificar si la columna ya existe
    const checkColumn = await queryRunner.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'usuarios' 
      AND COLUMN_NAME = 'motivo_baja'
    `);

    if (checkColumn.length > 0) {
      console.log('✅ La columna motivo_baja ya existe');
    } else {
      // Agregar la columna
      await queryRunner.query(`
        ALTER TABLE usuarios 
        ADD COLUMN motivo_baja TEXT NULL 
        AFTER fecha_baja
      `);
      console.log('✅ Columna motivo_baja agregada correctamente');
    }

  } catch (error) {
    console.error('❌ Error ejecutando migración:', error.message);
    throw error;
  } finally {
    await queryRunner.release();
    await app.close();
  }
}

runMigration()
  .then(() => {
    console.log('🎉 Migración completada exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error en migración:', error);
    process.exit(1);
  });