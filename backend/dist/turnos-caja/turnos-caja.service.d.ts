import { CreateTurnosCajaDto } from './dto/create-turnos-caja.dto';
import { UpdateTurnosCajaDto } from './dto/update-turnos-caja.dto';
export declare class TurnosCajaService {
    create(createTurnosCajaDto: CreateTurnosCajaDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateTurnosCajaDto: UpdateTurnosCajaDto): string;
    remove(id: number): string;
}
