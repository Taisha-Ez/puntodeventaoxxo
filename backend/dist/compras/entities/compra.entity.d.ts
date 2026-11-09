import { Proveedor } from '../../proveedores/entities/proveedore.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { DetalleCompra } from './detalle-compra.entity';
export declare enum EstadoCompra {
    PENDIENTE = "PENDIENTE",
    RECIBIDA = "RECIBIDA",
    CANCELADA = "CANCELADA"
}
export declare class Compra {
    id: number;
    fecha: Date;
    total: number;
    estado: EstadoCompra;
    proveedor: Proveedor;
    usuario: Usuario;
    detalles: DetalleCompra[];
}
