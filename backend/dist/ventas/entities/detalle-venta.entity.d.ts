import { Producto } from '../../productos/entities/producto.entity';
import { Promocion } from '../../promociones/entities/promocione.entity';
import { Venta } from './venta.entity';
export declare class DetalleVenta {
    id: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    venta: Venta;
    producto: Producto;
    promocion: Promocion;
}
