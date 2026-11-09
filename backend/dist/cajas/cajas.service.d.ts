import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';
export declare class CajasService {
    create(createCajaDto: CreateCajaDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCajaDto: UpdateCajaDto): string;
    remove(id: number): string;
}
