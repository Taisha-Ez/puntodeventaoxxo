import { MovimientosInventarioService } from './movimientos-inventario.service';
import { CreateMovimientosInventarioDto } from './dto/create-movimientos-inventario.dto';
import { UpdateMovimientosInventarioDto } from './dto/update-movimientos-inventario.dto';
export declare class MovimientosInventarioController {
    private readonly movimientosInventarioService;
    constructor(movimientosInventarioService: MovimientosInventarioService);
    create(createMovimientosInventarioDto: CreateMovimientosInventarioDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateMovimientosInventarioDto: UpdateMovimientosInventarioDto): string;
    remove(id: string): string;
}
