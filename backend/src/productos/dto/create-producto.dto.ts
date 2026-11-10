import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';
 
export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codigoBarras: string;
 
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombre: string;
 
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioCompra: number;
 
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
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
