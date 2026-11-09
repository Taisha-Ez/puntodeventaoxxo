import { PromocionesService } from './promociones.service';
import { CreatePromocioneDto } from './dto/create-promocione.dto';
import { UpdatePromocioneDto } from './dto/update-promocione.dto';
export declare class PromocionesController {
    private readonly promocionesService;
    constructor(promocionesService: PromocionesService);
    create(createPromocioneDto: CreatePromocioneDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updatePromocioneDto: UpdatePromocioneDto): string;
    remove(id: string): string;
}
