import { Producto } from '../../productos/entities/producto.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
export declare enum TipoMovimiento {
    ENTRADA = "ENTRADA",
    SALIDA = "SALIDA",
    MERMA = "MERMA",
    AJUSTE = "AJUSTE"
}
export declare class MovimientoInventario {
    id: number;
    tipo: TipoMovimiento;
    cantidad: number;
    motivo: string;
    fecha: Date;
    producto: Producto;
    usuario: Usuario;
}
