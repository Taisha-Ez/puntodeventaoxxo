import { Repository } from 'typeorm';
import { Promocion } from './entities/promocione.entity';
import { Producto } from '../productos/entities/producto.entity';
import { CreatePromocionDto } from './dto/create-promocione.dto';
import { UpdatePromocionDto } from './dto/update-promocione.dto';
export declare class PromocionesService {
    private readonly promocionRepo;
    private readonly productoRepo;
    constructor(promocionRepo: Repository<Promocion>, productoRepo: Repository<Producto>);
    create(dto: CreatePromocionDto): Promise<Promocion>;
    findAll(): Promise<Promocion[]>;
    findVigentes(): Promise<Promocion[]>;
    findOne(id: number): Promise<Promocion>;
    update(id: number, dto: UpdatePromocionDto): Promise<Promocion>;
    remove(id: number): Promise<{
        mensaje: string;
    }>;
    private validarReglas;
    private buscarProductos;
}
