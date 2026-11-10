import { PromocionesService } from './promociones.service';
import { CreatePromocionDto } from './dto/create-promocione.dto';
import { UpdatePromocionDto } from './dto/update-promocione.dto';
export declare class PromocionesController {
    private readonly promocionesService;
    constructor(promocionesService: PromocionesService);
    create(dto: CreatePromocionDto): Promise<import("./entities/promocione.entity").Promocion>;
    findAll(): Promise<import("./entities/promocione.entity").Promocion[]>;
    findVigentes(): Promise<import("./entities/promocione.entity").Promocion[]>;
    findOne(id: number): Promise<import("./entities/promocione.entity").Promocion>;
    update(id: number, dto: UpdatePromocionDto): Promise<import("./entities/promocione.entity").Promocion>;
    remove(id: number): Promise<{
        mensaje: string;
    }>;
}
