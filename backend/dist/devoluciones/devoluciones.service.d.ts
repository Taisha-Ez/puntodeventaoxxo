import { CreateDevolucioneDto } from './dto/create-devolucione.dto';
import { UpdateDevolucioneDto } from './dto/update-devolucione.dto';
export declare class DevolucionesService {
    create(createDevolucioneDto: CreateDevolucioneDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateDevolucioneDto: UpdateDevolucioneDto): string;
    remove(id: number): string;
}
