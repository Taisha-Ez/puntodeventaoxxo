import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Rol } from '../roles/entities/role.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { MetodoPago } from '../metodos-pago/entities/metodos-pago.entity';
import { Caja } from '../cajas/entities/caja.entity';
export declare class SeedService implements OnModuleInit {
    private readonly rolRepo;
    private readonly usuarioRepo;
    private readonly metodoRepo;
    private readonly cajaRepo;
    private readonly logger;
    constructor(rolRepo: Repository<Rol>, usuarioRepo: Repository<Usuario>, metodoRepo: Repository<MetodoPago>, cajaRepo: Repository<Caja>);
    onModuleInit(): Promise<void>;
}
