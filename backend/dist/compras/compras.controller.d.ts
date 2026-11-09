import { ComprasService } from './compras.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
export declare class ComprasController {
    private readonly comprasService;
    constructor(comprasService: ComprasService);
    create(createCompraDto: CreateCompraDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateCompraDto: UpdateCompraDto): string;
    remove(id: string): string;
}
