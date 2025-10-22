import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  documentoNumero: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}