import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  nombre: string;
}