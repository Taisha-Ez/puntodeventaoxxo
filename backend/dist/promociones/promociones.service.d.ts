import { CreatePromocioneDto } from './dto/create-promocione.dto';
import { UpdatePromocioneDto } from './dto/update-promocione.dto';
export declare class PromocionesService {
    create(createPromocioneDto: CreatePromocioneDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updatePromocioneDto: UpdatePromocioneDto): string;
    remove(id: number): string;
}
