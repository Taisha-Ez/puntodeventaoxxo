import { MetodosPagoService } from './metodos-pago.service';
import { CreateMetodoPagoDto } from './dto/create-metodos-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodos-pago.dto';
export declare class MetodosPagoController {
    private readonly metodosPagoService;
    constructor(metodosPagoService: MetodosPagoService);
    create(dto: CreateMetodoPagoDto): Promise<import("./entities/metodos-pago.entity").MetodoPago>;
    findAll(): Promise<import("./entities/metodos-pago.entity").MetodoPago[]>;
    findOne(id: number): Promise<import("./entities/metodos-pago.entity").MetodoPago>;
    update(id: number, dto: UpdateMetodoPagoDto): Promise<import("./entities/metodos-pago.entity").MetodoPago>;
    remove(id: number): Promise<{
        mensaje: string;
    }>;
}
