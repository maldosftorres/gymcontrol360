import { IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { MovimientoTipo } from '../../../common/enums/sistema.enum';

export class CreateMovimientoCajaDto {
  @IsEnum(MovimientoTipo)
  tipo: MovimientoTipo;

  @IsNumber()
  monto: number;

  @IsString()
  concepto: string;

  @IsNumber()
  cajaId: number;

  @IsOptional()
  @IsNumber()
  pagoId?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}