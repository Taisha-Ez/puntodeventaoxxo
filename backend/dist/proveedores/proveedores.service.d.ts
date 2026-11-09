import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedoreDto } from './dto/update-proveedore.dto';
export declare class ProveedoresService {
    create(createProveedoreDto: CreateProveedoreDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateProveedoreDto: UpdateProveedoreDto): string;
    remove(id: number): string;
}
