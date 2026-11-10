import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { Proveedor } from '../proveedores/entities/proveedore.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
export declare class ProductosService {
    private readonly productoRepo;
    private readonly categoriaRepo;
    private readonly proveedorRepo;
    constructor(productoRepo: Repository<Producto>, categoriaRepo: Repository<Categoria>, proveedorRepo: Repository<Proveedor>);
    create(dto: CreateProductoDto): Promise<Producto>;
    findAll(buscar?: string): Promise<Producto[]>;
    findByCodigo(codigoBarras: string): Promise<Producto>;
    findStockBajo(): Promise<Producto[]>;
    findOne(id: number): Promise<Producto>;
    update(id: number, dto: UpdateProductoDto): Promise<Producto>;
    remove(id: number): Promise<{
        mensaje: string;
    }>;
    private validarPrecios;
    private buscarCategoria;
    private buscarProveedor;
}
