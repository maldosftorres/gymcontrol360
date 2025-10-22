import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membresia } from '../../database/entities/membresia.entity';
import { SocioMembresia } from '../../database/entities/socio-membresia.entity';
import { Socio } from '../../database/entities/socio.entity';
import { MembresiasService } from './membresias.service';
import { MembresiasController } from './membresias.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Membresia, SocioMembresia, Socio])],
  providers: [MembresiasService],
  controllers: [MembresiasController],
  exports: [MembresiasService],
})
export class MembresiasModule {}