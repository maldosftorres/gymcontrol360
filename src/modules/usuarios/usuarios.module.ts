import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../../database/entities/usuario.entity';
import { Socio } from '../../database/entities/socio.entity';
import { UsuariosService } from './usuarios.service';
import { AuthController } from './auth.controller';
import { UsuariosController } from './usuarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Socio])],
  providers: [UsuariosService],
  controllers: [AuthController, UsuariosController],
  exports: [UsuariosService],
})
export class UsuariosModule {}