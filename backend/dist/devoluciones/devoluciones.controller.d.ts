import { DevolucionesService } from './devoluciones.service';
import { CreateDevolucioneDto } from './dto/create-devolucione.dto';
import { UpdateDevolucioneDto } from './dto/update-devolucione.dto';
export declare class DevolucionesController {
    private readonly devolucionesService;
    constructor(devolucionesService: DevolucionesService);
    create(createDevolucioneDto: CreateDevolucioneDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateDevolucioneDto: UpdateDevolucioneDto): string;
    remove(id: string): string;
}
