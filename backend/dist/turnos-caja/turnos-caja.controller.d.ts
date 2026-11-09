import { TurnosCajaService } from './turnos-caja.service';
import { CreateTurnosCajaDto } from './dto/create-turnos-caja.dto';
import { UpdateTurnosCajaDto } from './dto/update-turnos-caja.dto';
export declare class TurnosCajaController {
    private readonly turnosCajaService;
    constructor(turnosCajaService: TurnosCajaService);
    create(createTurnosCajaDto: CreateTurnosCajaDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateTurnosCajaDto: UpdateTurnosCajaDto): string;
    remove(id: string): string;
}
