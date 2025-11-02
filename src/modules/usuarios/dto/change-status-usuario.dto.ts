import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UsuarioEstado } from '../../../common/enums/usuario.enum';

export class ChangeStatusUsuarioDto {
  @ApiProperty({
    enum: UsuarioEstado,
    description: 'Nuevo estado del usuario',
    example: UsuarioEstado.SUSPENDIDO
  })
  @IsEnum(UsuarioEstado, {
    message: 'El estado debe ser ACTIVO, INACTIVO o SUSPENDIDO'
  })
  estado: UsuarioEstado;

  @ApiProperty({
    description: 'Motivo del cambio de estado (opcional)',
    example: 'Usuario suspendido por falta de pago',
    required: false
  })
  @IsOptional()
  @IsString()
  motivo?: string;
}