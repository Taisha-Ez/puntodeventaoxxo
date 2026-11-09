import { Categoria } from '../../categorias/entities/categoria.entity';
import { Proveedor } from '../../proveedores/entities/proveedore.entity';
import { Promocion } from '../../promociones/entities/promocione.entity';
export declare class Producto {
    id: number;
    codigoBarras: string;
    nombre: string;
    precioCompra: number;
    precioVenta: number;
    stockActual: number;
    stockMinimo: number;
    activo: boolean;
    categoria: Categoria;
    proveedor: Proveedor;
    promociones: Promocion[];
}
