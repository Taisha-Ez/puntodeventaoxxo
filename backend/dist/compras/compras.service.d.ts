import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
export declare class ComprasService {
    create(createCompraDto: CreateCompraDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCompraDto: UpdateCompraDto): string;
    remove(id: number): string;
}
