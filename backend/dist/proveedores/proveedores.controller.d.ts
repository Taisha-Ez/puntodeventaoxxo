import { ProveedoresService } from './proveedores.service';
import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedorDto } from './dto/update-proveedore.dto';
export declare class ProveedoresController {
    private readonly proveedoresService;
    constructor(proveedoresService: ProveedoresService);
    create(dto: CreateProveedoreDto): Promise<import("./entities/proveedore.entity").Proveedor>;
    findAll(): Promise<import("./entities/proveedore.entity").Proveedor[]>;
    findOne(id: number): Promise<import("./entities/proveedore.entity").Proveedor>;
    update(id: number, dto: UpdateProveedorDto): Promise<import("./entities/proveedore.entity").Proveedor>;
    remove(id: number): Promise<{
        mensaje: string;
    }>;
}
