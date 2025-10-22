import { IsString, IsEmail, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEmpresaDto {
  @ApiProperty({ description: 'Nombre de la empresa', maxLength: 150 })
  @IsString()
  @MaxLength(150)
  nombre: string;

  @ApiPropertyOptional({ description: 'Razón social de la empresa', maxLength: 200 })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  razonSocial?: string;

  @ApiPropertyOptional({ description: 'RUC de la empresa', maxLength: 30 })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  ruc?: string;

  @ApiPropertyOptional({ description: 'Email de la empresa' })
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @ApiPropertyOptional({ description: 'Teléfono de la empresa', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;

  @ApiPropertyOptional({ description: 'Dirección de la empresa', maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  direccion?: string;

  @ApiPropertyOptional({ description: 'URL del logo de la empresa' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Si la empresa está activa', default: true })
  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}