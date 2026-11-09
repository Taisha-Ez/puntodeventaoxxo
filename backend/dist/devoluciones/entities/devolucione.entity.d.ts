import { Venta } from '../../ventas/entities/venta.entity';
import { Producto } from '../../productos/entities/producto.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
export declare class Devolucion {
    id: number;
    cantidad: number;
    motivo: string;
    fecha: Date;
    venta: Venta;
    producto: Producto;
    usuario: Usuario;
    autorizadaPor: Usuario;
}
