import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedore.entity';
import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedorDto } from './dto/update-proveedore.dto';
export declare class ProveedoresService {
    private readonly proveedorRepo;
    constructor(proveedorRepo: Repository<Proveedor>);
    create(dto: CreateProveedoreDto): Promise<Proveedor>;
    findAll(): Promise<Proveedor[]>;
    findOne(id: number): Promise<Proveedor>;
    update(id: number, dto: UpdateProveedorDto): Promise<Proveedor>;
    remove(id: number): Promise<{
        mensaje: string;
    }>;
}
