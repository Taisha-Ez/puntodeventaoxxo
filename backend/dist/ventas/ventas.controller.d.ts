import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import type { UsuarioToken } from '../auth/interfaces/usuario-token.interface';
export declare class VentasController {
    private readonly ventasService;
    constructor(ventasService: VentasService);
    create(dto: CreateVentaDto, usuario: UsuarioToken): Promise<import("./entities/venta.entity").Venta>;
    miTurno(usuario: UsuarioToken): Promise<import("./entities/venta.entity").Venta[]>;
    findAll(turnoId?: number, fecha?: string): Promise<import("./entities/venta.entity").Venta[]>;
    findOne(id: number): Promise<import("./entities/venta.entity").Venta>;
    cancelar(id: number, usuario: UsuarioToken): Promise<{
        mensaje: string;
    }>;
}
