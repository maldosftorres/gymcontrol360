import { IsNotEmpty, IsString, IsEmail, IsOptional, Length, IsBoolean } from 'class-validator';

export class CreateSedeDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser texto' })
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser texto' })
  @Length(0, 255, { message: 'La dirección no puede exceder 255 caracteres' })
  direccion?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser texto' })
  @Length(0, 30, { message: 'El teléfono no puede exceder 30 caracteres' })
  telefono?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un email válido' })
  @Length(0, 150, { message: 'El email no puede exceder 150 caracteres' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser texto' })
  observaciones?: string;

  @IsOptional()
  @IsBoolean({ message: 'Activa debe ser verdadero o falso' })
  activa?: boolean;
}