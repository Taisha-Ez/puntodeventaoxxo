import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';
 
export class CreateDevolucionDto {
  @IsInt()
  ventaId: number;
 
  @IsInt()
  productoId: number;
 
  @IsInt()
  @Min(1)
  cantidad: number;
 
  @IsString()
  @IsNotEmpty({ message: 'Indica el motivo de la devolución' })
  @MaxLength(200)
  motivo: string;
}
