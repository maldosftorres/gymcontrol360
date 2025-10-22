import { IsNumber, IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { MetodoPago } from '../../../common/enums/sistema.enum';

export class CreatePagoDto {
  @IsNumber()
  monto: number;

  @IsEnum(MetodoPago)
  @IsOptional()
  metodoPago?: MetodoPago;

  @IsNumber()
  socioId: number;

  @IsOptional()
  @IsNumber()
  membresiaId?: number;

  @IsNumber()
  empresaId: number;

  @IsOptional()
  @IsNumber()
  sedeId?: number;

  @IsOptional()
  @IsString()
  concepto?: string;

  @IsOptional()
  @IsDateString()
  fechaPago?: string;

  @IsOptional()
  esParcial?: boolean;

  @IsOptional()
  @IsString()
  observaciones?: string;
}