import { IsInt, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
 
export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;
 
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9._-]+$/, { message: 'El usuario solo puede tener letras, números, punto, guion y guion bajo' })
  usuario: string;
 
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(72)
  password: string;
 
  @IsInt()
  rolId: number;
}
