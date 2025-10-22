import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CerrarCajaDto {
  @IsNumber()
  montoFinal: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}