import { TipoMovimiento } from '../entities/movimientos-inventario.entity';
export declare class CreateMovimientoInventarioDto {
    productoId: number;
    tipo: TipoMovimiento;
    cantidad: number;
    motivo: string;
}
