import { DataSource, Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
export declare class VentasService {
    private readonly ventaRepo;
    private readonly dataSource;
    constructor(ventaRepo: Repository<Venta>, dataSource: DataSource);
    create(dto: CreateVentaDto, usuarioId: number): Promise<Venta>;
    miTurno(usuarioId: number): Promise<Venta[]>;
    findAll(turnoId?: number, fecha?: string): Promise<Venta[]>;
    findOne(id: number): Promise<Venta>;
    cancelar(id: number, usuarioId: number): Promise<{
        mensaje: string;
    }>;
    private armarPagos;
    private mejorPromocion;
    private buscarCompleta;
}
