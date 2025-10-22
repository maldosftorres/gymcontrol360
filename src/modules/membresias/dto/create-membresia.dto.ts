import { 
  IsNotEmpty, 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsPositive, 
  MaxLength,
  Min
} from 'class-validator';

export class CreateMembresiaDto {
  @IsNumber()
  @IsNotEmpty()
  empresaId: number;

  @IsNumber()
  @IsOptional()
  sedeId?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  descripcion?: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  duracionDias: number;

  @IsNumber()
  @IsPositive()
  precio: number;
}