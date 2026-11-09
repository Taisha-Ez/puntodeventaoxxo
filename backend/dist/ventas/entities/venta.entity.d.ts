import { TurnoCaja } from '../../turnos-caja/entities/turnos-caja.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { DetalleVenta } from './detalle-venta.entity';
import { PagoVenta } from './pago-venta.entity';
export declare enum EstadoVenta {
    PAGADA = "PAGADA",
    CANCELADA = "CANCELADA"
}
export declare class Venta {
    id: number;
    fecha: Date;
    subtotal: number;
    descuento: number;
    total: number;
    estado: EstadoVenta;
    turno: TurnoCaja;
    usuario: Usuario;
    detalles: DetalleVenta[];
    pagos: PagoVenta[];
}
