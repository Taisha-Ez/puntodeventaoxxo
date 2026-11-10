import { CajasService } from './cajas.service';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';
export declare class CajasController {
    private readonly cajasService;
    constructor(cajasService: CajasService);
    create(dto: CreateCajaDto): Promise<import("./entities/caja.entity").Caja>;
    findAll(): Promise<import("./entities/caja.entity").Caja[]>;
    findOne(id: number): Promise<import("./entities/caja.entity").Caja>;
    update(id: number, dto: UpdateCajaDto): Promise<import("./entities/caja.entity").Caja>;
    remove(id: number): Promise<{
        mensaje: string;
    }>;
}
