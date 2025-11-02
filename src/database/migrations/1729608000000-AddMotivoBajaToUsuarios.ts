import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMotivoBajaToUsuarios1729608000000 implements MigrationInterface {
  name = 'AddMotivoBajaToUsuarios1729608000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE usuarios 
      ADD COLUMN motivo_baja TEXT NULL 
      AFTER fecha_baja
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE usuarios 
      DROP COLUMN motivo_baja
    `);
  }
}