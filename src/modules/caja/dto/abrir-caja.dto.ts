import { IsNumber, IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { MetodoPago } from '../../../common/enums/sistema.enum';

export class AbrirCajaDto {
  @IsNumber()
  montoInicial: number;

  @IsNumber()
  empresaId: number;

  @IsNumber()
  sedeId: number;

  @IsNumber()
  usuarioId: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}