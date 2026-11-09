import { Producto } from '../../productos/entities/producto.entity';
export declare enum TipoPromocion {
    DOS_POR_UNO = "DOS_POR_UNO",
    PORCENTAJE = "PORCENTAJE",
    PRECIO_ESPECIAL = "PRECIO_ESPECIAL"
}
export declare class Promocion {
    id: number;
    nombre: string;
    tipo: TipoPromocion;
    valor: number;
    fechaInicio: string;
    fechaFin: string;
    activa: boolean;
    productos: Producto[];
}
