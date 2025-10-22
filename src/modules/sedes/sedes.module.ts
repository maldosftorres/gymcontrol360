import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sede } from '../../database/entities/sede.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sede])],
  providers: [],
  controllers: [],
  exports: [],
})
export class SedesModule {}