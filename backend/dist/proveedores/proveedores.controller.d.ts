import { ProveedoresService } from './proveedores.service';
import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedoreDto } from './dto/update-proveedore.dto';
export declare class ProveedoresController {
    private readonly proveedoresService;
    constructor(proveedoresService: ProveedoresService);
    create(createProveedoreDto: CreateProveedoreDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateProveedoreDto: UpdateProveedoreDto): string;
    remove(id: string): string;
}
