import { MetodoPago } from '../../metodos-pago/entities/metodos-pago.entity';
import { Venta } from './venta.entity';
export declare class PagoVenta {
    id: number;
    monto: number;
    cambio: number;
    venta: Venta;
    metodoPago: MetodoPago;
}
