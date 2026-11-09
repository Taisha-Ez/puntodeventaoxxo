import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
export declare class VentasController {
    private readonly ventasService;
    constructor(ventasService: VentasService);
    create(createVentaDto: CreateVentaDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateVentaDto: UpdateVentaDto): string;
    remove(id: string): string;
}
