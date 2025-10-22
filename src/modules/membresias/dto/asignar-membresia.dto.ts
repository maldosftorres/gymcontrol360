import { 
  IsNotEmpty, 
  IsNumber, 
  IsDateString, 
  IsOptional, 
  IsString, 
  IsEnum 
} from 'class-validator';
import { MembresiaEstado } from '../../../common/enums/membresia.enum';

export class AsignarMembresiaDto {
  @IsNumber()
  @IsNotEmpty()
  socioId: number;

  @IsNumber()
  @IsNotEmpty()
  membresiaId: number;

  @IsDateString()
  @IsNotEmpty()
  fechaInicio: string;

  @IsString()
  @IsOptional()
  notas?: string;
}

export class UpdateSocioMembresiaDto {
  @IsDateString()
  @IsOptional()
  fechaInicio?: string;

  @IsDateString()
  @IsOptional()
  fechaFin?: string;

  @IsEnum(MembresiaEstado)
  @IsOptional()
  estado?: MembresiaEstado;

  @IsString()
  @IsOptional()
  notas?: string;
}