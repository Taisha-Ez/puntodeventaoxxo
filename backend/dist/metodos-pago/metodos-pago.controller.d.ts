import { MetodosPagoService } from './metodos-pago.service';
import { CreateMetodosPagoDto } from './dto/create-metodos-pago.dto';
import { UpdateMetodosPagoDto } from './dto/update-metodos-pago.dto';
export declare class MetodosPagoController {
    private readonly metodosPagoService;
    constructor(metodosPagoService: MetodosPagoService);
    create(createMetodosPagoDto: CreateMetodosPagoDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateMetodosPagoDto: UpdateMetodosPagoDto): string;
    remove(id: string): string;
}
