import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caja } from '../../database/entities/caja.entity';
import { MovimientoCaja } from '../../database/entities/movimiento-caja.entity';
import { CajaService } from './caja.service';
import { CajaController } from './caja.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Caja, MovimientoCaja])],
  providers: [CajaService],
  controllers: [CajaController],
  exports: [CajaService],
})
export class CajaModule {}