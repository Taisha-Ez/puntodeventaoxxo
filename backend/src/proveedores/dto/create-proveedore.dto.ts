import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MaxLength } from 'class-validator';
 
export class CreateProveedoreDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;
 
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;
 
  @IsOptional()
  @IsEmail({}, { message: 'El email no es válido' })
  @MaxLength(100)
  email?: string;
 
  @IsOptional()
  @IsString()
  @Length(12, 13, { message: 'El RFC debe tener 12 o 13 caracteres' })
  rfc?: string;
}
