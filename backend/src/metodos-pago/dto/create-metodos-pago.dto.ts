import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
 
export class CreateMetodoPagoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  nombre: string;
}
