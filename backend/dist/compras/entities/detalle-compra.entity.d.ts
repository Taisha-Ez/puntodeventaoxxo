import { Producto } from '../../productos/entities/producto.entity';
import { Compra } from './compra.entity';
export declare class DetalleCompra {
    id: number;
    cantidad: number;
    costoUnitario: number;
    subtotal: number;
    compra: Compra;
    producto: Producto;
}
