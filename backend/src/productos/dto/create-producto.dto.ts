import { Trim } from '../../common/decorators/trim.decorator';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min, Max } from 'class-validator';
 
export class CreateProductoDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codigoBarras: string;
 
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombre: string;
 
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999999.99, { message: 'El monto no puede ser mayor a 99,999,999.99' })
  precioCompra: number;
 
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(99999999.99, { message: 'El monto no puede ser mayor a 99,999,999.99' })
  precioVenta: number;
 
  @IsOptional()
  @IsInt()
  @Min(0)
  stockMinimo?: number;
 
  @IsInt()
  categoriaId: number;
 
  @IsOptional()
  @IsInt()
  proveedorId?: number;
 
  // stockActual NO va aquí: solo cambia con compras, ventas, devoluciones
  // y movimientos de inventario, para que siempre haya historial.
}
