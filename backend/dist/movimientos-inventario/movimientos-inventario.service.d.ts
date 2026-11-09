import { CreateMovimientosInventarioDto } from './dto/create-movimientos-inventario.dto';
import { UpdateMovimientosInventarioDto } from './dto/update-movimientos-inventario.dto';
export declare class MovimientosInventarioService {
    create(createMovimientosInventarioDto: CreateMovimientosInventarioDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateMovimientosInventarioDto: UpdateMovimientosInventarioDto): string;
    remove(id: number): string;
}
