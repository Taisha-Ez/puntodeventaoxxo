import { Repository } from 'typeorm';
import { Caja } from './entities/caja.entity';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';
export declare class CajasService {
    private readonly cajaRepo;
    constructor(cajaRepo: Repository<Caja>);
    create(dto: CreateCajaDto): Promise<Caja>;
    findAll(): Promise<Caja[]>;
    findOne(id: number): Promise<Caja>;
    update(id: number, dto: UpdateCajaDto): Promise<Caja>;
    remove(id: number): Promise<{
        mensaje: string;
    }>;
}
