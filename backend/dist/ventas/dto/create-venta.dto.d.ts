export declare class DetalleVentaDto {
    productoId: number;
    cantidad: number;
}
export declare class PagoVentaDto {
    metodoPagoId: number;
    monto: number;
}
export declare class CreateVentaDto {
    detalles: DetalleVentaDto[];
    pagos: PagoVentaDto[];
}
