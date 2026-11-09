import { CajasService } from './cajas.service';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';
export declare class CajasController {
    private readonly cajasService;
    constructor(cajasService: CajasService);
    create(createCajaDto: CreateCajaDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateCajaDto: UpdateCajaDto): string;
    remove(id: string): string;
}
