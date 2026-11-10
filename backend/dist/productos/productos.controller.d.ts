import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
export declare class ProductosController {
    private readonly productosService;
    constructor(productosService: ProductosService);
    create(dto: CreateProductoDto): Promise<import("./entities/producto.entity").Producto>;
    findAll(buscar?: string): Promise<import("./entities/producto.entity").Producto[]>;
    findByCodigo(codigo: string): Promise<import("./entities/producto.entity").Producto>;
    findStockBajo(): Promise<import("./entities/producto.entity").Producto[]>;
    findOne(id: number): Promise<import("./entities/producto.entity").Producto>;
    update(id: number, dto: UpdateProductoDto): Promise<import("./entities/producto.entity").Producto>;
    remove(id: number): Promise<{
        mensaje: string;
    }>;
}
