import { DataSource, Repository } from 'typeorm';
import { MovimientoInventario } from './entities/movimientos-inventario.entity';
import { CreateMovimientoInventarioDto } from './dto/create-movimientos-inventario.dto';
export declare class MovimientosInventarioService {
    private readonly movimientoRepo;
    private readonly dataSource;
    constructor(movimientoRepo: Repository<MovimientoInventario>, dataSource: DataSource);
    create(dto: CreateMovimientoInventarioDto, usuarioId: number): Promise<MovimientoInventario>;
    findAll(productoId?: number): Promise<MovimientoInventario[]>;
    findOne(id: number): Promise<MovimientoInventario>;
}
