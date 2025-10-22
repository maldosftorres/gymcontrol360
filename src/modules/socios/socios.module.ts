import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Socio } from '../../database/entities/socio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Socio])],
  providers: [],
  controllers: [],
  exports: [],
})
export class SociosModule {}