import { Repository } from 'typeorm';
import { MetodoPago } from './entities/metodos-pago.entity';
import { CreateMetodoPagoDto } from './dto/create-metodos-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodos-pago.dto';
export declare class MetodosPagoService {
    private readonly metodoRepo;
    constructor(metodoRepo: Repository<MetodoPago>);
    create(dto: CreateMetodoPagoDto): Promise<MetodoPago>;
    findAll(): Promise<MetodoPago[]>;
    findOne(id: number): Promise<MetodoPago>;
    update(id: number, dto: UpdateMetodoPagoDto): Promise<MetodoPago>;
    remove(id: number): Promise<{
        mensaje: string;
    }>;
}
