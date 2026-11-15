import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsNumber, Min, ValidateNested } from 'class-validator';
 
export class DetalleCompraDto {
  @IsInt()
  productoId: number;
 
  @IsInt()
  @Min(1)
  cantidad: number;
 
  // Lo que cobra el proveedor por pieza
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costoUnitario: number;
}
 
export class CreateCompraDto {
  @IsInt()
  proveedorId: number;
 
  @IsArray()
  @ArrayNotEmpty({ message: 'La compra debe tener al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => DetalleCompraDto)
  detalles: DetalleCompraDto[];
}
