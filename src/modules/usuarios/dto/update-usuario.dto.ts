import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { UsuarioEstado } from '../../../common/enums/usuario.enum';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsEnum(UsuarioEstado)
  @IsOptional()
  estado?: UsuarioEstado;
}