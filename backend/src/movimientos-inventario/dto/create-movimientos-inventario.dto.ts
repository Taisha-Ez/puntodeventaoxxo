import { IsIn, IsInt, IsNotEmpty, IsString, MaxLength, NotEquals } from 'class-validator';
import { TipoMovimiento } from '../entities/movimientos-inventario.entity';
 
// Movimientos MANUALES. Las entradas por compra y salidas por venta
// se registran solas desde esos módulos.
export class CreateMovimientoInventarioDto {
  @IsInt()
  productoId: number;
 
  @IsIn([TipoMovimiento.MERMA, TipoMovimiento.AJUSTE], {
    message: 'Solo se pueden registrar a mano movimientos de tipo MERMA o AJUSTE',
  })
  tipo: TipoMovimiento;
 
  // MERMA: cuántas piezas se perdieron (siempre resta).
  // AJUSTE: positivo suma, negativo resta (ej. tras un conteo físico).
  @IsInt()
  @NotEquals(0, { message: 'La cantidad no puede ser 0' })
  cantidad: number;
 
  @IsString()
  @IsNotEmpty({ message: 'Indica el motivo del movimiento' })
  @MaxLength(200)
  motivo: string;
}
