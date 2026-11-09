import { CreateMetodosPagoDto } from './dto/create-metodos-pago.dto';
import { UpdateMetodosPagoDto } from './dto/update-metodos-pago.dto';
export declare class MetodosPagoService {
    create(createMetodosPagoDto: CreateMetodosPagoDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateMetodosPagoDto: UpdateMetodosPagoDto): string;
    remove(id: number): string;
}
