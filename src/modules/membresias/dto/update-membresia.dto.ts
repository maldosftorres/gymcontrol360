import { PartialType } from '@nestjs/mapped-types';
import { CreateMembresiaDto } from './create-membresia.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateMembresiaDto extends PartialType(CreateMembresiaDto) {
  @IsBoolean()
  @IsOptional()
  activa?: boolean;
}