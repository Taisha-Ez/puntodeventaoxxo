import { MovimientosInventarioService } from './movimientos-inventario.service';
import { CreateMovimientoInventarioDto } from './dto/create-movimientos-inventario.dto';
import type { UsuarioToken } from '../auth/interfaces/usuario-token.interface';
export declare class MovimientosInventarioController {
    private readonly movimientosService;
    constructor(movimientosService: MovimientosInventarioService);
    create(dto: CreateMovimientoInventarioDto, usuario: UsuarioToken): Promise<import("./entities/movimientos-inventario.entity").MovimientoInventario>;
    findAll(productoId?: number): Promise<import("./entities/movimientos-inventario.entity").MovimientoInventario[]>;
    findOne(id: number): Promise<import("./entities/movimientos-inventario.entity").MovimientoInventario>;
}
