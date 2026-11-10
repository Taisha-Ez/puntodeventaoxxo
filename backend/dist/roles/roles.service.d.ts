import { Repository } from 'typeorm';
import { Rol } from './entities/role.entity';
export declare class RolesService {
    private readonly rolRepo;
    constructor(rolRepo: Repository<Rol>);
    findAll(): Promise<Rol[]>;
}
