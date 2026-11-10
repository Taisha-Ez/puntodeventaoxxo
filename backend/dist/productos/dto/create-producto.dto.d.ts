export declare class CreateProductoDto {
    codigoBarras: string;
    nombre: string;
    precioCompra: number;
    precioVenta: number;
    stockMinimo?: number;
    categoriaId: number;
    proveedorId?: number;
}
