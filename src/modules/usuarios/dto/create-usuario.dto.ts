import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  IsOptional, 
  IsEnum, 
  IsDateString, 
  IsNumber,
  MinLength,
  MaxLength,
} from 'class-validator';
import { DocumentoTipo, Genero, UsuarioRol } from '../../../common/enums/usuario.enum';

export class CreateUsuarioDto {
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
  @IsNotEmpty()
  @MaxLength(100)
  apellido: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  telefono?: string;

  @IsEnum(DocumentoTipo)
  @IsOptional()
  documentoTipo?: DocumentoTipo;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  documentoNumero: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  direccion?: string;

  @IsDateString()
  @IsOptional()
  fechaNacimiento?: string;

  @IsEnum(Genero)
  @IsOptional()
  genero?: Genero;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  fotoUrl?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(UsuarioRol)
  @IsOptional()
  rol?: UsuarioRol;

  @IsNumber()
  @IsOptional()
  entrenadorId?: number;

  @IsString()
  @IsOptional()
  rfidCodigo?: string;

  @IsString()
  @IsOptional()
  notas?: string;
}