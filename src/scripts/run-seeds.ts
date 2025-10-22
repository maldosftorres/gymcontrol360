import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { SeedInitialData1698000000000 } from '../database/seeds/1698000000000-SeedInitialData';

async function runSeeds() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);

  console.log('🌱 Ejecutando seeds...');

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    const seed = new SeedInitialData1698000000000();
    await seed.up(queryRunner);
    console.log('✅ Seeds ejecutados correctamente');
  } catch (error) {
    console.error('❌ Error ejecutando seeds:', error);
  } finally {
    await queryRunner.release();
    await app.close();
  }
}

runSeeds();