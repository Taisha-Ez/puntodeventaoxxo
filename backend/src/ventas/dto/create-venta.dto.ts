import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsNumber, IsPositive, Min, ValidateNested } from 'class-validator';
 
export class DetalleVentaDto {
  @IsInt()
  productoId: number;
 
  @IsInt()
  @Min(1)
  cantidad: number;
}
 
export class PagoVentaDto {
  @IsInt()
  metodoPagoId: number;
 
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  monto: number;
}
 
export class CreateVentaDto {
  // ValidateNested + Type hacen que se validen también los objetos dentro del arreglo
  @IsArray()
  @ArrayNotEmpty({ message: 'La venta debe tener al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => DetalleVentaDto)
  detalles: DetalleVentaDto[];
 
  @IsArray()
  @ArrayNotEmpty({ message: 'La venta debe tener al menos un pago' })
  @ValidateNested({ each: true })
  @Type(() => PagoVentaDto)
  pagos: PagoVentaDto[];
}
